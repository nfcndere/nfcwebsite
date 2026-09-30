import { NextRequest, NextResponse } from 'next/server';
import prisma from '@/lib/prisma';

// ===================================
// GET /api/players — Récupérer l'effectif des joueurs (Mobile & Web)
// ===================================
export async function GET(request: NextRequest) {
  try {
    const players = await prisma.player.findMany({
      orderBy: { number: 'asc' },
    });
    return NextResponse.json(players);
  } catch (error) {
    const { PLAYERS_DATA } = await import('@/lib/mock-data');
    return NextResponse.json(PLAYERS_DATA);
  }
}

// ===================================
// POST /api/players — Ajouter un joueur (Admin Mobile)
// ===================================
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const player = await prisma.player.create({
      data: {
        firstName: body.firstName,
        lastName: body.lastName,
        number: parseInt(body.number),
        position: body.position,
        nationality: body.nationality || 'Camerounaise',
        bio: body.bio || '',
        photoId: body.photoId || body.photoUrl,
        isCaptain: body.isCaptain ?? false,
      },
    });
    return NextResponse.json(player, { status: 201 });
  } catch (error) {
    return NextResponse.json({ error: 'Erreur lors de la création du joueur' }, { status: 500 });
  }
}
