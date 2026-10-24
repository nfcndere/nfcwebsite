import prisma from '@/lib/prisma';
import { apiError, resourceResponse } from '@/lib/api-response';
import { DATA_FRESHNESS_MS } from '@/constants/data-freshness';

export async function GET() {
  try {
    const now = new Date();
    const [season, nextMatch, liveMatch] = await Promise.all([
      prisma.season.findFirst({
        where: { isCurrent: true },
        include: { standings: { include: { team: true } } },
      }),
      prisma.match.findFirst({
        where: { status: 'PROGRAMME', date: { gt: now } },
        orderBy: { date: 'asc' },
      }),
      prisma.match.findFirst({
        where: { status: 'EN_COURS' },
        orderBy: { date: 'desc' },
      }),
    ]);
    const standings = season?.standings
      .map((row) => ({
        ...row,
        teamName: row.team.name,
        logoUrl: row.team.logoUrl,
        goalDifference: row.goalsFor - row.goalsAgainst,
      }))
      .sort((a, b) => b.points - a.points || b.goalDifference - a.goalDifference)
      .map((row, index) => ({ ...row, rank: index + 1, position: index + 1 })) ?? [];
    const latestStanding = standings.length
      ? new Date(Math.max(...standings.map((row) => row.updatedAt.getTime())))
      : season?.updatedAt ?? null;
    const updatedAt = liveMatch?.updatedAt ?? [latestStanding, nextMatch?.updatedAt]
      .filter((value): value is Date => value instanceof Date)
      .sort((a, b) => b.getTime() - a.getTime())[0] ?? null;

    const inconsistent = standings.some((row) =>
      row.played !== row.won + row.drawn + row.lost ||
      row.points !== row.won * 3 + row.drawn ||
      row.goalDifference !== row.goalsFor - row.goalsAgainst
    );
    return resourceResponse(
      { season: season ? { id: season.id, label: season.label } : null, standings, nextMatch, liveMatch },
      updatedAt,
      liveMatch ? DATA_FRESHNESS_MS.liveMatch : DATA_FRESHNESS_MS.standings,
      inconsistent,
      standings.length === 0 && !nextMatch && !liveMatch,
    );
  } catch (error) {
    console.error('Failed to retrieve club overview:', error);
    return apiError('Impossible de récupérer les données du club.');
  }
}
