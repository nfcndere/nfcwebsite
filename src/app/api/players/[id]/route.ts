import { NextRequest } from 'next/server';
import prisma from '@/lib/prisma';
import { z } from 'zod';
import { apiError, resourceResponse } from '@/lib/api-response';
import { DATA_FRESHNESS_MS } from '@/constants/data-freshness';
import { authorize } from '@/lib/server/auth';
import { recordAudit } from '@/lib/server/audit';
import { handleRouteError, parseJsonBody } from '@/lib/server/route-utils';
import { NOT_DELETED } from '@/lib/soft-delete';

export const dynamic = 'force-dynamic';

const playerPatchSchema = z.object({
  firstName: z.string().trim().min(1).max(100).optional(),
  lastName: z.string().trim().min(1).max(100).optional(),
  number: z.coerce.number().int().min(0).max(99).nullable().optional(),
  position: z.enum(['GARDIEN', 'DEFENSEUR', 'MILIEU', 'ATTAQUANT']).nullable().optional(),
  nationality: z.string().trim().max(80).nullable().optional(),
  bio: z.string().max(4_000).nullable().optional(),
  photoId: z.string().nullable().optional(),
  photoUrl: z.string().nullable().optional(),
  isCaptain: z.boolean().optional(),
  birthDate: z.string().max(30).nullable().optional(),
  height: z.coerce.number().int().positive().max(260).nullable().optional(),
  weight: z.coerce.number().int().positive().max(200).nullable().optional(),
  joinedYear: z.coerce.number().int().min(1900).max(2200).nullable().optional(),
  restore: z.boolean().optional(),
});

// ===================================
// GET /api/players/[id] — Récupérer un joueur par ID (non supprimé)
// ===================================
export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const player = await prisma.player.findFirst({
      where: { id: params.id, ...NOT_DELETED },
      include: { media: true },
    });

    if (!player) {
      return apiError('Joueur non trouvé.', 404);
    }

    return resourceResponse(player, player.updatedAt, DATA_FRESHNESS_MS.players);
  } catch (error: unknown) {
    return handleRouteError(error, 'Impossible de récupérer le joueur.', 'players/[id]:get');
  }
}

// ===================================
// PATCH /api/players/[id] — Modifier les informations d'un joueur
// ===================================
export async function PATCH(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  const auth = await authorize(request);
  if (!auth.ok) return auth.response;
  try {
    const parsed = await parseJsonBody(request, playerPatchSchema, 'Données de joueur invalides.');
    if (!parsed.ok) return parsed.response;
    const body = parsed.data;

    const existing = await prisma.player.findFirst({
      where: { id: params.id, ...(body.restore ? {} : NOT_DELETED) },
    });
    if (!existing) return apiError('Joueur non trouvé.', 404);

    const dataToUpdate: Record<string, unknown> = {};
    if (body.firstName !== undefined) dataToUpdate.firstName = body.firstName;
    if (body.lastName !== undefined) dataToUpdate.lastName = body.lastName;
    if (body.number !== undefined) dataToUpdate.number = body.number;
    if (body.position !== undefined) dataToUpdate.position = body.position;
    if (body.nationality !== undefined) dataToUpdate.nationality = body.nationality;
    if (body.bio !== undefined) dataToUpdate.bio = body.bio;
    if (body.photoId !== undefined || body.photoUrl !== undefined) dataToUpdate.photoId = body.photoId ?? body.photoUrl ?? null;
    if (body.isCaptain !== undefined) dataToUpdate.isCaptain = body.isCaptain;
    if (body.birthDate !== undefined) dataToUpdate.birthDate = body.birthDate;
    if (body.height !== undefined) dataToUpdate.height = body.height;
    if (body.weight !== undefined) dataToUpdate.weight = body.weight;
    if (body.joinedYear !== undefined) dataToUpdate.joinedYear = body.joinedYear;
    if (body.restore === true) dataToUpdate.deletedAt = null;

    const updated = await prisma.player.update({
      where: { id: params.id },
      data: dataToUpdate,
    });
    await recordAudit({
      request,
      userId: auth.user.id,
      action: body.restore ? 'RESTORE' : 'UPDATE',
      entity: 'Player',
      entityId: updated.id,
      before: existing,
      after: updated,
    });

    return resourceResponse(updated, updated.updatedAt);
  } catch (error: unknown) {
    return handleRouteError(error, 'Impossible de modifier le joueur.', 'players/[id]:patch');
  }
}

// ===================================
// DELETE /api/players/[id] — Suppression logique d'un joueur de l'effectif
// ===================================
export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  const auth = await authorize(request);
  if (!auth.ok) return auth.response;
  try {
    const existing = await prisma.player.findFirst({ where: { id: params.id, ...NOT_DELETED } });
    if (!existing) return apiError('Joueur non trouvé.', 404);

    const deletedAt = new Date();
    const updated = await prisma.player.update({
      where: { id: params.id },
      data: { deletedAt },
    });
    await recordAudit({
      request,
      userId: auth.user.id,
      action: 'SOFT_DELETE',
      entity: 'Player',
      entityId: updated.id,
      before: existing,
      after: updated,
    });

    return resourceResponse({ id: params.id, deleted: true, deletedAt: deletedAt.toISOString() }, deletedAt);
  } catch (error: unknown) {
    return handleRouteError(error, 'Impossible de supprimer le joueur.', 'players/[id]:delete');
  }
}
