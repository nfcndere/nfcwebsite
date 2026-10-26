import prisma from '@/lib/prisma';
import { apiError, resourceResponse } from '@/lib/api-response';
import { DATA_FRESHNESS_MS } from '@/constants/data-freshness';
import { PUBLIC_SETTING_KEYS } from '@/constants/club-settings';
import { NOT_DELETED } from '@/lib/soft-delete';
import { Prisma } from '@prisma/client';

export const dynamic = 'force-dynamic';

function isMissingTableError(error: unknown) {
  return error instanceof Prisma.PrismaClientKnownRequestError && (error.code === 'P2021' || error.code === 'P2022');
}

export async function GET() {
  try {
    const now = new Date();
    const [nextMatch, liveMatch, settingsResult] = await Promise.all([
      prisma.match.findFirst({
        where: { status: 'PROGRAMME', date: { gt: now }, ...NOT_DELETED },
        orderBy: { date: 'asc' },
      }),
      prisma.match.findFirst({
        where: { status: 'EN_COURS', ...NOT_DELETED },
        orderBy: { date: 'desc' },
      }),
      prisma.clubSetting
        .findMany({ where: { key: { in: [...PUBLIC_SETTING_KEYS] } } })
        .then((rows) => ({ rows, degraded: false }))
        .catch((error) => {
          if (isMissingTableError(error)) {
            console.warn('[club-overview] Table ClubSetting absente : exécutez "npx prisma migrate deploy".');
            return { rows: [] as { key: string; value: string; updatedAt: Date }[], degraded: true };
          }
          throw error;
        }),
    ]);
    const settings = settingsResult.rows;
    const updatedAt = [liveMatch?.updatedAt, nextMatch?.updatedAt, ...settings.map((setting) => setting.updatedAt)]
      .filter((value): value is Date => value instanceof Date)
      .sort((a, b) => b.getTime() - a.getTime())[0] ?? null;

    return resourceResponse(
      {
        nextMatch,
        liveMatch,
        settings: Object.fromEntries(settings.map((setting) => [setting.key, setting.value])),
      },
      updatedAt,
      liveMatch ? DATA_FRESHNESS_MS.liveMatch : DATA_FRESHNESS_MS.matches,
      settingsResult.degraded,
      !nextMatch && !liveMatch,
    );
  } catch (error) {
    console.error('Failed to retrieve club overview:', error);
    return apiError('Impossible de récupérer les données du club.');
  }
}
