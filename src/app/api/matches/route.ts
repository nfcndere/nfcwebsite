import { NextRequest, NextResponse } from 'next/server';
import prisma from '@/lib/prisma';
import { z } from 'zod';
import { apiError, resourceResponse, latestDate } from '@/lib/api-response';
import { DATA_FRESHNESS_MS } from '@/constants/data-freshness';
import { requireEditor } from '@/lib/server/auth';

const matchSchema = z.object({
  homeTeam: z.string().trim().min(1),
  awayTeam: z.string().trim().min(1),
  date: z.string().datetime({ offset: true }),
  stadium: z.string().trim().optional(),
  competition: z.string().trim().optional(),
  status: z.enum(['PROGRAMME', 'EN_COURS', 'TERMINE', 'REPORTE', 'ANNULE']).optional(),
  summary: z.string().optional(),
  homeScore: z.number().int().min(0).nullable().optional(),
  awayScore: z.number().int().min(0).nullable().optional(),
});

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

    const activeLive = matches.some((match) => match.status === 'EN_COURS');
    return resourceResponse(matches, latestDate(matches, (match) => match.updatedAt), activeLive ? DATA_FRESHNESS_MS.liveMatch : DATA_FRESHNESS_MS.matches);
  } catch (error: any) {
    console.error('Failed to retrieve matches:', error);
    return apiError('Impossible de récupérer les matchs.');
  }
}

// ===================================
// POST /api/matches — Créer un match (admin)
// ===================================
export async function POST(request: NextRequest) {
  const denied = await requireEditor(request);
  if (denied) return denied;
  try {
    const parsed = matchSchema.safeParse(await request.json());
    if (!parsed.success) return apiError('Données de match invalides.', 400);
    const body = parsed.data;
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
    return NextResponse.json({ status: 'ok', data: match, updatedAt: match.updatedAt }, { status: 201 });
  } catch (error) {
    console.error('Failed to create match:', error);
    return apiError('Impossible de créer le match.');
  }
}
