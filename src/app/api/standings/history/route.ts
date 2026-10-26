import { NextRequest } from 'next/server';
import { z } from 'zod';
import prisma from '@/lib/prisma';
import { apiError, latestDate, resourceResponse } from '@/lib/api-response';
import { authorize } from '@/lib/server/auth';
import { handleRouteError } from '@/lib/server/route-utils';
import { computeStandingTotals } from '@/lib/validation/standing';

export const dynamic = 'force-dynamic';

const querySchema = z.object({
  seasonId: z.string().trim().min(1).max(100).optional(),
  limit: z.coerce.number().int().min(1).max(100).default(50),
});

// ===================================
// GET /api/standings/history — Historique des mises à jour du classement
// ===================================
export async function GET(request: NextRequest) {
  const auth = await authorize(request);
  if (!auth.ok) return auth.response;
  try {
    const { searchParams } = new URL(request.url);
    const parsed = querySchema.safeParse({
      seasonId: searchParams.get('seasonId') ?? undefined,
      limit: searchParams.get('limit') ?? undefined,
    });
    if (!parsed.success) return apiError('Paramètres de recherche invalides.', 400);
    const { seasonId, limit } = parsed.data;

    let targetSeasonId = seasonId;
    if (!targetSeasonId) {
      const current = await prisma.season.findFirst({ where: { isCurrent: true }, select: { id: true } });
      targetSeasonId = current?.id;
    }

    const rows = await prisma.clubStandingHistory.findMany({
      where: targetSeasonId ? { seasonId: targetSeasonId } : {},
      orderBy: { createdAt: 'desc' },
      take: limit,
      include: {
        season: { select: { id: true, label: true } },
        changedBy: { select: { id: true, name: true, email: true } },
      },
    });

    const data = rows.map((row) => ({
      ...row,
      ...computeStandingTotals(row),
    }));

    return resourceResponse(data, latestDate(rows, (row) => row.createdAt));
  } catch (error) {
    return handleRouteError(error, 'Impossible de récupérer l’historique du classement.', 'standings/history');
  }
}
