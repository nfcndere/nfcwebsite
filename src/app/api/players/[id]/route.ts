import { NextRequest } from 'next/server';
import prisma from '@/lib/prisma';
import { z } from 'zod';
import { apiError, resourceResponse } from '@/lib/api-response';
import { DATA_FRESHNESS_MS } from '@/constants/data-freshness';
import { requireEditor } from '@/lib/server/auth';

export const dynamic = 'force-dynamic';

const playerPatchSchema = z.object({
  firstName: z.string().trim().min(1).optional(),
  lastName: z.string().trim().min(1).optional(),
  number: z.coerce.number().int().min(0).nullable().optional(),
  position: z.enum(['GARDIEN', 'DEFENSEUR', 'MILIEU', 'ATTAQUANT']).nullable().optional(),
  nationality: z.string().trim().nullable().optional(),
  bio: z.string().nullable().optional(),
  photoId: z.string().nullable().optional(),
  isCaptain: z.boolean().optional(),
  birthDate: z.string().nullable().optional(),
  height: z.coerce.number().int().positive().nullable().optional(),
  weight: z.coerce.number().int().positive().nullable().optional(),
  joinedYear: z.coerce.number().int().min(1900).max(2200).nullable().optional(),
});

// ===================================
// GET /api/players/[id] — Récupérer un joueur par ID
// ===================================
export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const player = await prisma.player.findUnique({
      where: { id: params.id },
      include: { media: true },
    });

    if (!player) {
      return apiError('Joueur non trouvé.', 404);
    }

    return resourceResponse(player, player.updatedAt, DATA_FRESHNESS_MS.players);
  } catch (error: any) {
    console.error('Failed to retrieve player:', error);
    return apiError('Impossible de récupérer le joueur.');
  }
}

// ===================================
// PATCH /api/players/[id] — Modifier les informations d'un joueur
// ===================================
export async function PATCH(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  const denied = await requireEditor(request);
  if (denied) return denied;
  try {
    const parsed = playerPatchSchema.safeParse(await request.json());
    if (!parsed.success) return apiError('Données de joueur invalides.', 400);
    const body = parsed.data;

    const dataToUpdate: any = {};
    if (body.firstName !== undefined) dataToUpdate.firstName = body.firstName;
    if (body.lastName !== undefined) dataToUpdate.lastName = body.lastName;
    if (body.number !== undefined) dataToUpdate.number = body.number;
    if (body.position !== undefined) dataToUpdate.position = body.position;
    if (body.nationality !== undefined) dataToUpdate.nationality = body.nationality;
    if (body.bio !== undefined) dataToUpdate.bio = body.bio;
    if (body.photoId !== undefined) dataToUpdate.photoId = body.photoId;
    if (body.isCaptain !== undefined) dataToUpdate.isCaptain = body.isCaptain;
    if (body.birthDate !== undefined) dataToUpdate.birthDate = body.birthDate;
    if (body.height !== undefined) dataToUpdate.height = body.height;
    if (body.weight !== undefined) dataToUpdate.weight = body.weight;
    if (body.joinedYear !== undefined) dataToUpdate.joinedYear = body.joinedYear;

    const updated = await prisma.player.update({
      where: { id: params.id },
      data: dataToUpdate,
    });

    return resourceResponse(updated, updated.updatedAt);
  } catch (error: any) {
    console.error('Failed to update player:', error);
    return apiError('Impossible de modifier le joueur.');
  }
}

// ===================================
// DELETE /api/players/[id] — Supprimer un joueur de l'effectif
// ===================================
export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  const denied = await requireEditor(request);
  if (denied) return denied;
  try {
    await prisma.player.delete({
      where: { id: params.id },
    });

    return resourceResponse({ id: params.id, deleted: true }, new Date());
  } catch (error: any) {
    console.error('Failed to delete player:', error);
    return apiError('Impossible de supprimer le joueur.');
  }
}
