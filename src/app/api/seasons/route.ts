import { NextRequest } from 'next/server';
import { z } from 'zod';
import prisma from '@/lib/prisma';
import { apiError, resourceResponse, latestDate } from '@/lib/api-response';
import { requireEditor } from '@/lib/server/auth';

export const dynamic = 'force-dynamic';

const seasonSchema = z.object({
  label: z.string().trim().min(1).max(30),
  startsAt: z.string().datetime({ offset: true }),
  endsAt: z.string().datetime({ offset: true }),
  isCurrent: z.boolean().default(false),
}).refine((season) => new Date(season.endsAt) > new Date(season.startsAt), {
  message: 'La fin de saison doit suivre son début.',
});

export async function GET() {
  try {
    const seasons = await prisma.season.findMany({
      orderBy: { startsAt: 'desc' },
      select: { id: true, label: true, startsAt: true, endsAt: true, isCurrent: true, updatedAt: true },
    });
    return resourceResponse(seasons, latestDate(seasons, (season) => season.updatedAt));
  } catch (error) {
    console.error('Failed to retrieve seasons:', error);
    return apiError('Impossible de récupérer les saisons.');
  }
}

export async function POST(request: NextRequest) {
  const denied = await requireEditor(request);
  if (denied) return denied;
  try {
    const parsed = seasonSchema.safeParse(await request.json());
    if (!parsed.success) return apiError('Données de saison invalides.', 400);
    const season = await prisma.$transaction(async (tx) => {
      if (parsed.data.isCurrent) {
        await tx.season.updateMany({ where: { isCurrent: true }, data: { isCurrent: false } });
      }
      return tx.season.create({
        data: {
          ...parsed.data,
          startsAt: new Date(parsed.data.startsAt),
          endsAt: new Date(parsed.data.endsAt),
        },
      });
    });
    return resourceResponse(season, season.updatedAt);
  } catch (error) {
    console.error('Failed to create season:', error);
    return apiError('Impossible de créer la saison. Vérifiez qu’une saison portant ce libellé n’existe pas déjà.');
  }
}
