import { NextRequest, NextResponse } from 'next/server';
import prisma from '@/lib/prisma';
import { z } from 'zod';
import { apiError, resourceResponse, latestDate } from '@/lib/api-response';
import { DATA_FRESHNESS_MS } from '@/constants/data-freshness';
import { authorize } from '@/lib/server/auth';
import { recordAudit } from '@/lib/server/audit';
import { handleRouteError, parseJsonBody } from '@/lib/server/route-utils';
import { NOT_DELETED } from '@/lib/soft-delete';

export const dynamic = 'force-dynamic';

const playerSchema = z.object({
  firstName: z.string().trim().min(1).max(100),
  lastName: z.string().trim().min(1).max(100),
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
});

// ===================================
// GET /api/players — Récupérer l'effectif des joueurs (non supprimés)
// ===================================
export async function GET() {
  try {
    const players = await prisma.player.findMany({
      where: NOT_DELETED,
      orderBy: { number: 'asc' },
    });
    return resourceResponse(players, latestDate(players, (player) => player.updatedAt), DATA_FRESHNESS_MS.players);
  } catch (error: unknown) {
    return handleRouteError(error, 'Impossible de récupérer les joueurs.', 'players:get');
  }
}

// ===================================
// POST /api/players — Ajouter un joueur (Admin / Éditeur)
// ===================================
export async function POST(request: NextRequest) {
  const auth = await authorize(request);
  if (!auth.ok) return auth.response;
  try {
    const parsed = await parseJsonBody(request, playerSchema, 'Données de joueur invalides.');
    if (!parsed.ok) return parsed.response;
    const body = parsed.data;
    const player = await prisma.player.create({
      data: {
        firstName: body.firstName,
        lastName: body.lastName,
        number: body.number ?? null,
        position: body.position ?? null,
        nationality: body.nationality ?? null,
        bio: body.bio ?? null,
        photoId: body.photoId ?? body.photoUrl ?? null,
        isCaptain: body.isCaptain ?? false,
        birthDate: body.birthDate ?? null,
        height: body.height ?? null,
        weight: body.weight ?? null,
        joinedYear: body.joinedYear ?? null,
      },
    });
    await recordAudit({
      request,
      userId: auth.user.id,
      action: 'CREATE',
      entity: 'Player',
      entityId: player.id,
      after: player,
    });
    return NextResponse.json({ status: 'ok', data: player, updatedAt: player.updatedAt }, { status: 201 });
  } catch (error) {
    return handleRouteError(error, 'Impossible de créer le joueur.', 'players:post');
  }
}
