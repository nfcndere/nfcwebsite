import prisma from '@/lib/prisma';
import { apiError, resourceResponse, latestDate } from '@/lib/api-response';
import { DATA_FRESHNESS_MS } from '@/constants/data-freshness';

export const dynamic = 'force-dynamic';

export async function GET() {
  try {
    const sponsors = await prisma.sponsor.findMany({ orderBy: [{ priority: 'asc' }, { name: 'asc' }] });
    const logoIds = sponsors.flatMap((sponsor) => sponsor.logoId ? [sponsor.logoId] : []);
    const mediaById = new Map(
      (await prisma.media.findMany({
        where: { OR: [{ id: { in: logoIds } }, { publicId: { in: logoIds } }] },
        select: { id: true, publicId: true, url: true },
      })).flatMap((media) => [[media.id, media.url], [media.publicId, media.url]]),
    );
    const data = sponsors.map((sponsor) => ({
      id: sponsor.id,
      name: sponsor.name,
      link: sponsor.link,
      logoUrl: sponsor.logoId ? mediaById.get(sponsor.logoId) ?? null : null,
    }));

    return resourceResponse(data, latestDate(sponsors, (sponsor) => sponsor.updatedAt), DATA_FRESHNESS_MS.partners);
  } catch (error) {
    console.error('Failed to retrieve club partners:', error);
    return apiError('Impossible de récupérer les partenaires du club.');
  }
}
