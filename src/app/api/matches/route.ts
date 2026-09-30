import { NextRequest, NextResponse } from 'next/server';
import prisma from '@/lib/prisma';

// ===================================
// GET /api/matches — Récupérer tous les matchs
// ===================================
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const status = searchParams.get('status');

    const where = status ? { status } : {};

    const matches = await prisma.match.findMany({
      where,
      orderBy: { date: 'asc' },
    });

    return NextResponse.json(matches);
  } catch (error) {
    // En cas d'erreur DB, renvoyer les données mock
    const { MATCHES_DATA } = await import('@/lib/mock-data');
    return NextResponse.json(MATCHES_DATA);
  }
}

// ===================================
// POST /api/matches — Créer un match (admin)
// ===================================
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const match = await prisma.match.create({
      data: {
        homeTeam: body.homeTeam,
        awayTeam: body.awayTeam,
        date: new Date(body.date),
        stadium: body.stadium,
        competition: body.competition,
        status: body.status || 'PROGRAMME',
        summary: body.summary,
        homeScore: body.homeScore ?? null,
        awayScore: body.awayScore ?? null,
      },
    });
    return NextResponse.json(match, { status: 201 });
  } catch (error) {
    return NextResponse.json({ error: 'Erreur lors de la création du match' }, { status: 500 });
  }
}
