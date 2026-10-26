import { NextRequest, NextResponse } from 'next/server';
import { z } from 'zod';
import prisma from '@/lib/prisma';
import { latestDate, resourceResponse } from '@/lib/api-response';
import { requireAdmin, sanitizeUser } from '@/lib/server/auth';
import { enforceRateLimit } from '@/lib/server/rate-limit';
import { generateTemporaryPassword, hashPassword, passwordSchema } from '@/lib/server/passwords';
import { escapeHtml, sendAndLogEmail } from '@/lib/server/resend';
import { recordAudit } from '@/lib/server/audit';
import { handleRouteError, parseJsonBody } from '@/lib/server/route-utils';

export const dynamic = 'force-dynamic';

const createUserSchema = z
  .object({
    name: z.string().trim().min(1).max(120),
    email: z.string().trim().email().max(254).transform((email) => email.toLowerCase()),
    role: z.enum(['ADMIN', 'EDITOR', 'USER']).default('EDITOR'),
    temporaryPassword: passwordSchema.optional(),
    sendInviteEmail: z.boolean().default(true),
  })
  .strict();

// ===================================
// GET /api/users — Liste des utilisateurs (ADMIN, sans passwordHash)
// ===================================
export async function GET(request: NextRequest) {
  const auth = await requireAdmin(request);
  if (!auth.ok) return auth.response;
  try {
    const users = await prisma.user.findMany({
      orderBy: [{ active: 'desc' }, { createdAt: 'desc' }],
    });
    const safe = users.map((user) => sanitizeUser(user));
    return resourceResponse(safe, latestDate(users, (user) => user.updatedAt));
  } catch (error) {
    return handleRouteError(error, 'Impossible de récupérer les utilisateurs.', 'users:get');
  }
}

// ===================================
// POST /api/users — Création d'un compte avec mot de passe temporaire (ADMIN)
// ===================================
export async function POST(request: NextRequest) {
  const auth = await requireAdmin(request);
  if (!auth.ok) return auth.response;
  try {
    const limited = await enforceRateLimit(request, 'users-create', 20, 60 * 60 * 1_000, { identifier: auth.user.id });
    if (limited) return limited;

    const parsed = await parseJsonBody(request, createUserSchema, 'Données utilisateur invalides.');
    if (!parsed.ok) return parsed.response;
    const body = parsed.data;

    const temporaryPassword = body.temporaryPassword ?? generateTemporaryPassword();
    const passwordHash = await hashPassword(temporaryPassword);

    const created = await prisma.user.create({
      data: {
        name: body.name,
        email: body.email,
        passwordHash,
        role: body.role,
        active: true,
        mustChangePassword: true,
      },
    });

    const safeUser = sanitizeUser(created);
    await recordAudit({
      request,
      userId: auth.user.id,
      action: 'CREATE',
      entity: 'User',
      entityId: created.id,
      after: safeUser,
    });

    if (body.sendInviteEmail) {
      const html = `<div style="font-family:Arial,sans-serif;font-size:15px;line-height:1.5">
<p>Bonjour ${escapeHtml(created.name)},</p>
<p>Un compte (${escapeHtml(created.role)}) a été créé pour vous sur l’administration du Ngaoundéré FC.</p>
<p>Mot de passe temporaire : <code>${escapeHtml(temporaryPassword)}</code></p>
<p>Merci de le modifier dès votre première connexion.</p>
</div>`;
      await sendAndLogEmail({
        to: created.email,
        subject: 'Votre compte d’administration Ngaoundéré FC',
        html,
        text: `Bonjour ${created.name}, votre mot de passe temporaire est : ${temporaryPassword}`,
        logBody: 'Invitation avec mot de passe temporaire (contenu masqué).',
      });
    }

    return NextResponse.json(
      {
        status: 'ok',
        data: { user: safeUser, temporaryPassword },
        updatedAt: created.updatedAt.toISOString(),
      },
      { status: 201 },
    );
  } catch (error) {
    return handleRouteError(error, 'Impossible de créer l’utilisateur.', 'users:post');
  }
}
