import prisma from '@/lib/prisma';
import { apiError, resourceResponse } from '@/lib/api-response';
import { DATA_FRESHNESS_MS } from '@/constants/data-freshness';

export const dynamic = 'force-dynamic';

const publicSettingKeys = [
  'facebookUrl',
  'whatsappPartenaire',
  'whatsappBilletterie',
  'homeIntroText',
  'academyCompletionRate',
  'academyGraduates',
  'academyLabel',
];

export async function GET() {
  try {
    const now = new Date();
    const [nextMatch, liveMatch, settings] = await Promise.all([
      prisma.match.findFirst({
        where: { status: 'PROGRAMME', date: { gt: now } },
        orderBy: { date: 'asc' },
      }),
      prisma.match.findFirst({
        where: { status: 'EN_COURS' },
        orderBy: { date: 'desc' },
      }),
      prisma.clubSetting.findMany({ where: { key: { in: publicSettingKeys } } }),
    ]);
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
      false,
      !nextMatch && !liveMatch,
    );
  } catch (error) {
    console.error('Failed to retrieve club overview:', error);
    return apiError('Impossible de récupérer les données du club.');
  }
}
