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

const matchSchema = z.object({
  homeTeam: z.string().trim().min(1).max(120),
  awayTeam: z.string().trim().min(1).max(120),
  date: z.string().datetime({ offset: true }),
  stadium: z.string().trim().max(160).nullable().optional(),
  competition: z.string().trim().max(120).nullable().optional(),
  status: z.enum(['PROGRAMME', 'EN_COURS', 'TERMINE', 'REPORTE', 'ANNULE']).optional(),
  summary: z.string().max(4_000).nullable().optional(),
  homeScore: z.number().int().min(0).nullable().optional(),
  awayScore: z.number().int().min(0).nullable().optional(),
});
const matchesQuerySchema = z.object({
  status: z.enum(['PROGRAMME', 'EN_COURS', 'TERMINE', 'REPORTE', 'ANNULE']).optional(),
  page: z.coerce.number().int().min(1).default(1),
  pageSize: z.coerce.number().int().min(1).max(100).default(50),
});

// ===================================
// GET /api/matches — Récupérer tous les matchs (non supprimés)
// ===================================
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const parsed = matchesQuerySchema.safeParse({
      status: searchParams.get('status') ?? undefined,
      page: searchParams.get('page') ?? undefined,
      pageSize: searchParams.get('pageSize') ?? undefined,
    });
    if (!parsed.success) return apiError('Paramètres de recherche invalides.', 400);
    const { status, page, pageSize } = parsed.data;

    const where = status ? { status, ...NOT_DELETED } : { ...NOT_DELETED };

    const matches = await prisma.match.findMany({
      where,
      orderBy: { date: 'asc' },
      skip: (page - 1) * pageSize,
      take: pageSize,
    });

    const activeLive = matches.some((match) => match.status === 'EN_COURS');
    return resourceResponse(matches, latestDate(matches, (match) => match.updatedAt), activeLive ? DATA_FRESHNESS_MS.liveMatch : DATA_FRESHNESS_MS.matches);
  } catch (error: unknown) {
    return handleRouteError(error, 'Impossible de récupérer les matchs.', 'matches:get');
  }
}

// ===================================
// POST /api/matches — Créer un match (admin / éditeur)
// ===================================
export async function POST(request: NextRequest) {
  const auth = await authorize(request);
  if (!auth.ok) return auth.response;
  try {
    const parsed = await parseJsonBody(request, matchSchema, 'Données de match invalides.');
    if (!parsed.ok) return parsed.response;
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
    await recordAudit({
      request,
      userId: auth.user.id,
      action: 'CREATE',
      entity: 'Match',
      entityId: match.id,
      after: match,
    });
    return NextResponse.json({ status: 'ok', data: match, updatedAt: match.updatedAt }, { status: 201 });
  } catch (error) {
    return handleRouteError(error, 'Impossible de créer le match.', 'matches:post');
  }
}
