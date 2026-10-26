import { NextRequest } from 'next/server';
import { z } from 'zod';
import prisma from '@/lib/prisma';
import { apiError, resourceResponse } from '@/lib/api-response';
import { requireAdmin, sanitizeUser } from '@/lib/server/auth';
import { generateTemporaryPassword, hashPassword, passwordSchema } from '@/lib/server/passwords';
import { recordAudit } from '@/lib/server/audit';
import { handleRouteError, parseJsonBody } from '@/lib/server/route-utils';

export const dynamic = 'force-dynamic';

const patchUserSchema = z
  .object({
    name: z.string().trim().min(1).max(120).optional(),
    role: z.enum(['ADMIN', 'EDITOR', 'USER']).optional(),
    active: z.boolean().optional(),
    temporaryPassword: passwordSchema.optional(),
    resetTemporaryPassword: z.boolean().optional(),
  })
  .strict();

// ===================================
// PATCH /api/users/[id] — Changement de rôle, activation/désactivation, réinitialisation du mot de passe (ADMIN)
// ===================================
export async function PATCH(request: NextRequest, { params }: { params: { id: string } }) {
  const auth = await requireAdmin(request);
  if (!auth.ok) return auth.response;
  try {
    const parsed = await parseJsonBody(request, patchUserSchema, 'Modifications utilisateur invalides.');
    if (!parsed.ok) return parsed.response;
    const body = parsed.data;

    const existing = await prisma.user.findUnique({ where: { id: params.id } });
    if (!existing) return apiError('Utilisateur introuvable.', 404);

    if (params.id === auth.user.id) {
      if (body.active === false) return apiError('Vous ne pouvez pas désactiver votre propre compte.', 400);
      if (body.role && body.role !== 'ADMIN') return apiError('Vous ne pouvez pas retirer vos propres droits administrateur.', 400);
    }

    let generatedTemporaryPassword: string | undefined;
    const data: Record<string, unknown> = {};
    if (body.name !== undefined) data.name = body.name;
    if (body.role !== undefined) data.role = body.role;
    if (body.active !== undefined) data.active = body.active;

    if (body.temporaryPassword || body.resetTemporaryPassword) {
      generatedTemporaryPassword = body.temporaryPassword ?? generateTemporaryPassword();
      data.passwordHash = await hashPassword(generatedTemporaryPassword);
      data.mustChangePassword = true;
    }

    // Tout changement de rôle, désactivation ou réinitialisation révoque les jetons existants.
    const shouldRevokeTokens =
      (body.role !== undefined && body.role !== existing.role) ||
      (body.active !== undefined && body.active !== existing.active) ||
      Boolean(generatedTemporaryPassword);
    if (shouldRevokeTokens) {
      data.tokenVersion = { increment: 1 };
    }

    const updated = await prisma.user.update({ where: { id: params.id }, data });
    const safeUser = sanitizeUser(updated);
    await recordAudit({
      request,
      userId: auth.user.id,
      action: 'UPDATE',
      entity: 'User',
      entityId: updated.id,
      before: sanitizeUser(existing),
      after: safeUser,
    });

    return resourceResponse(
      generatedTemporaryPassword ? { ...safeUser, temporaryPassword: generatedTemporaryPassword } : safeUser,
      updated.updatedAt,
    );
  } catch (error) {
    return handleRouteError(error, 'Impossible de modifier l’utilisateur.', 'users/[id]:patch');
  }
}

// ===================================
// DELETE /api/users/[id] — Désactivation du compte et révocation des jetons (ADMIN)
// Ne supprime pas la ligne afin de préserver les articles, médias et journaux d'audit associés.
// ===================================
export async function DELETE(request: NextRequest, { params }: { params: { id: string } }) {
  const auth = await requireAdmin(request);
  if (!auth.ok) return auth.response;
  try {
    if (params.id === auth.user.id) {
      return apiError('Vous ne pouvez pas désactiver votre propre compte.', 400);
    }
    const existing = await prisma.user.findUnique({ where: { id: params.id } });
    if (!existing) return apiError('Utilisateur introuvable.', 404);

    const updated = await prisma.user.update({
      where: { id: params.id },
      data: { active: false, tokenVersion: { increment: 1 } },
    });
    const safeUser = sanitizeUser(updated);
    await recordAudit({
      request,
      userId: auth.user.id,
      action: 'DELETE',
      entity: 'User',
      entityId: updated.id,
      before: sanitizeUser(existing),
      after: safeUser,
    });

    return resourceResponse({ id: updated.id, active: false, deactivated: true, user: safeUser }, updated.updatedAt);
  } catch (error) {
    return handleRouteError(error, 'Impossible de désactiver l’utilisateur.', 'users/[id]:delete');
  }
}
