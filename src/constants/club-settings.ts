import prisma from '@/lib/prisma';

export const PUBLIC_SETTING_KEYS = [
  'facebookUrl',
  'whatsappPartenaire',
  'whatsappBilletterie',
  'homeIntroText',
  'academyCompletionRate',
  'academyGraduates',
  'academyLabel',
] as const;

export type PublicSettingKey = (typeof PUBLIC_SETTING_KEYS)[number];

export const ACADEMY_FOLLOW_UP_STATUSES = ['NOUVEAU', 'CONTACTE', 'CONVOQUE', 'ADMIS', 'REFUSE'] as const;
export type AcademyFollowUpStatus = (typeof ACADEMY_FOLLOW_UP_STATUSES)[number];

export async function resolvePartnerLogos(logoIds: string[]) {
  if (!logoIds.length) return new Map<string, string>();
  const medias = await prisma.media.findMany({
    where: { OR: [{ id: { in: logoIds } }, { publicId: { in: logoIds } }] },
    select: { id: true, publicId: true, url: true },
  });
  return new Map(medias.flatMap((media) => [[media.id, media.url], [media.publicId, media.url]]));
}
