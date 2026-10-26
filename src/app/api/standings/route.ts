import prisma from '@/lib/prisma';
import { DATA_FRESHNESS_MS } from '@/constants/data-freshness';
import { apiError, resourceResponse } from '@/lib/api-response';
import { isStandingConsistent } from '@/lib/match-state';

export const dynamic = 'force-dynamic';

export async function GET() {
  try {
    const season = await prisma.season.findFirst({
      where: { isCurrent: true },
      include: { clubStanding: true },
    });
    if (!season?.clubStanding) {
      return resourceResponse(
        { season: season ? { id: season.id, label: season.label } : null, nfc: null },
        season?.updatedAt ?? null,
        undefined,
        false,
        true,
      );
    }

    const row = season.clubStanding;
    const nfc = {
      id: row.id,
      seasonId: row.seasonId,
      rank: row.rank,
      position: row.rank,
      teamName: 'Ngaoundéré FC',
      played: row.played,
      won: row.won,
      drawn: row.drawn,
      lost: row.lost,
      goalsFor: row.goalsFor,
      goalsAgainst: row.goalsAgainst,
      goalDifference: row.goalsFor - row.goalsAgainst,
      points: row.won * 3 + row.drawn,
      form: row.form,
      updatedAt: row.updatedAt,
    };

    return resourceResponse(
      { season: { id: season.id, label: season.label }, nfc },
      row.updatedAt,
      DATA_FRESHNESS_MS.standings,
      !isStandingConsistent(nfc),
    );
  } catch (error) {
    console.error('Failed to retrieve NFC standing:', error);
    return apiError('Impossible de récupérer le classement du NFC.');
  }
}
