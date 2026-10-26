import { NextRequest } from 'next/server';
import { Prisma } from '@prisma/client';
import prisma from '@/lib/prisma';
import { DATA_FRESHNESS_MS } from '@/constants/data-freshness';
import { apiError, resourceResponse } from '@/lib/api-response';
import { isStandingConsistent } from '@/lib/match-state';
import { authorize } from '@/lib/server/auth';
import { recordAudit } from '@/lib/server/audit';
import { handleRouteError, parseJsonBody } from '@/lib/server/route-utils';
import { computeStandingTotals, standingInputSchema } from '@/lib/validation/standing';

export const dynamic = 'force-dynamic';

function formatNfcStanding(row: {
  id: string;
  seasonId: string;
  rank: number;
  played: number;
  won: number;
  drawn: number;
  lost: number;
  goalsFor: number;
  goalsAgainst: number;
  form: string | null;
  updatedAt: Date;
}) {
  const { points, goalDifference } = computeStandingTotals(row);
  return {
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
    goalDifference,
    points,
    form: row.form,
    updatedAt: row.updatedAt,
  };
}

function isMissingTableError(error: unknown) {
  return error instanceof Prisma.PrismaClientKnownRequestError && (error.code === 'P2021' || error.code === 'P2022');
}

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

    const nfc = formatNfcStanding(season.clubStanding);

    return resourceResponse(
      { season: { id: season.id, label: season.label }, nfc },
      season.clubStanding.updatedAt,
      DATA_FRESHNESS_MS.standings,
      !isStandingConsistent(nfc),
    );
  } catch (error) {
    if (isMissingTableError(error)) {
      console.warn('[standings] Tables Season/ClubStanding absentes : exécutez "npx prisma migrate deploy".');
      return resourceResponse({ season: null, nfc: null }, null, undefined, false, true);
    }
    console.error('Failed to retrieve NFC standing:', error);
    return apiError('Impossible de récupérer le classement du NFC.');
  }
}

// ===================================
// PUT /api/standings — Crée ou met à jour le classement du NFC et enregistre l'historique
// ===================================
export async function PUT(request: NextRequest) {
  const auth = await authorize(request);
  if (!auth.ok) return auth.response;
  try {
    const parsed = await parseJsonBody(request, standingInputSchema, 'Données de classement invalides.');
    if (!parsed.ok) return parsed.response;
    const body = parsed.data;

    const season = body.seasonId
      ? await prisma.season.findUnique({ where: { id: body.seasonId } })
      : await prisma.season.findFirst({ where: { isCurrent: true } });
    if (!season) {
      return apiError(
        body.seasonId ? 'Saison introuvable.' : 'Aucune saison courante définie. Créez ou activez une saison avant de publier le classement.',
        404,
      );
    }

    const values = {
      rank: body.rank,
      played: body.played,
      won: body.won,
      drawn: body.drawn,
      lost: body.lost,
      goalsFor: body.goalsFor,
      goalsAgainst: body.goalsAgainst,
      form: body.form ?? null,
    };

    const { before, row } = await prisma.$transaction(async (tx) => {
      const existing = await tx.clubStanding.findUnique({ where: { seasonId: season.id } });
      const updated = await tx.clubStanding.upsert({
        where: { seasonId: season.id },
        create: { seasonId: season.id, ...values, updatedById: auth.user.id },
        update: { ...values, updatedById: auth.user.id },
      });
      await tx.clubStandingHistory.create({
        data: { seasonId: season.id, ...values, changedById: auth.user.id },
      });
      return { before: existing, row: updated };
    });

    await recordAudit({
      request,
      userId: auth.user.id,
      action: before ? 'UPDATE' : 'CREATE',
      entity: 'ClubStanding',
      entityId: row.id,
      before,
      after: row,
    });

    const nfc = formatNfcStanding(row);
    return resourceResponse({ season: { id: season.id, label: season.label }, nfc }, row.updatedAt, DATA_FRESHNESS_MS.standings);
  } catch (error) {
    return handleRouteError(error, 'Impossible de mettre à jour le classement du NFC.', 'standings:put');
  }
}
