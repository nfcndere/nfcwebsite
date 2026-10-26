import { NextRequest, NextResponse } from 'next/server';
import prisma from '@/lib/prisma';
import { z } from 'zod';
import { apiError, resourceResponse, latestDate } from '@/lib/api-response';
import { DATA_FRESHNESS_MS } from '@/constants/data-freshness';
import { requireEditor } from '@/lib/server/auth';

export const dynamic = 'force-dynamic';

const playerSchema = z.object({
  firstName: z.string().trim().min(1),
  lastName: z.string().trim().min(1),
  number: z.coerce.number().int().min(0).nullable().optional(),
  position: z.enum(['GARDIEN', 'DEFENSEUR', 'MILIEU', 'ATTAQUANT']).nullable().optional(),
  nationality: z.string().trim().nullable().optional(),
  bio: z.string().nullable().optional(),
  photoId: z.string().nullable().optional(),
  photoUrl: z.string().nullable().optional(),
  isCaptain: z.boolean().optional(),
});

// ===================================
// GET /api/players — Récupérer l'effectif des joueurs (Mobile & Web)
// ===================================
export async function GET(request: NextRequest) {
  try {
    const players = await prisma.player.findMany({
      orderBy: { number: 'asc' },
    });
    return resourceResponse(players, latestDate(players, (player) => player.updatedAt), DATA_FRESHNESS_MS.players);
  } catch (error: any) {
    console.error('Failed to retrieve players:', error);
    return apiError('Impossible de récupérer les joueurs.');
  }
}

// ===================================
// POST /api/players — Ajouter un joueur (Admin Mobile)
// ===================================
export async function POST(request: NextRequest) {
  const denied = await requireEditor(request);
  if (denied) return denied;
  try {
    const parsed = playerSchema.safeParse(await request.json());
    if (!parsed.success) return apiError('Données de joueur invalides.', 400);
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
      },
    });
    return NextResponse.json({ status: 'ok', data: player, updatedAt: player.updatedAt }, { status: 201 });
  } catch (error) {
    console.error('Failed to create player:', error);
    return apiError('Impossible de créer le joueur.');
  }
}
