import { NextRequest } from 'next/server';
import prisma from '@/lib/prisma';
import { destroyFromCloudinary } from '@/lib/server/cloudinary';
import { z } from 'zod';
import { apiError, resourceResponse } from '@/lib/api-response';
import { DATA_FRESHNESS_MS } from '@/constants/data-freshness';
import { authorize } from '@/lib/server/auth';
import { recordAudit } from '@/lib/server/audit';
import { handleRouteError, parseJsonBody } from '@/lib/server/route-utils';

export const dynamic = 'force-dynamic';

const mediaPatchSchema = z.object({
  title: z.string().max(160).nullable().optional(),
  altText: z.string().max(300).nullable().optional(),
  album: z.string().max(100).nullable().optional(),
  mediaType: z.enum(['IMAGE', 'VIDEO']).nullable().optional(),
  playerId: z.string().nullable().optional(),
});

// ===================================
// GET /api/galerie/[id] — Récupérer un média spécifique
// ===================================
export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const media = await prisma.media.findUnique({
      where: { id: params.id },
      include: { player: { select: { firstName: true, lastName: true } } },
    });

    if (!media) {
      return apiError('Média non trouvé.', 404);
    }

    return resourceResponse(media, media.createdAt, DATA_FRESHNESS_MS.media);
  } catch (error: unknown) {
    return handleRouteError(error, 'Impossible de récupérer le média.', 'galerie/[id]:get');
  }
}

// ===================================
// PATCH /api/galerie/[id] — Modifier les informations d'un média
// ===================================
export async function PATCH(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  const auth = await authorize(request);
  if (!auth.ok) return auth.response;
  try {
    const parsed = await parseJsonBody(request, mediaPatchSchema, 'Données de média invalides.');
    if (!parsed.ok) return parsed.response;
    const body = parsed.data;

    const existing = await prisma.media.findUnique({ where: { id: params.id } });
    if (!existing) return apiError('Média non trouvé.', 404);

    const dataToUpdate: Record<string, unknown> = {};
    if (body.title !== undefined) dataToUpdate.title = body.title;
    if (body.altText !== undefined) dataToUpdate.altText = body.altText;
    if (body.album !== undefined) dataToUpdate.album = body.album;
    if (body.mediaType !== undefined) dataToUpdate.mediaType = body.mediaType;
    if (body.playerId !== undefined) dataToUpdate.playerId = body.playerId;

    const updated = await prisma.media.update({
      where: { id: params.id },
      data: dataToUpdate,
    });
    await recordAudit({
      request,
      userId: auth.user.id,
      action: 'UPDATE',
      entity: 'Media',
      entityId: updated.id,
      before: existing,
      after: updated,
    });

    return resourceResponse(updated, updated.createdAt);
  } catch (error: unknown) {
    return handleRouteError(error, 'Impossible de modifier le média.', 'galerie/[id]:patch');
  }
}

// ===================================
// DELETE /api/galerie/[id] — Supprimer un média de la galerie et l'asset Cloudinary (best effort)
// ===================================
export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  const auth = await authorize(request);
  if (!auth.ok) return auth.response;
  try {
    const media = await prisma.media.findUnique({ where: { id: params.id } });
    if (!media) {
      return apiError('Média introuvable.', 404);
    }

    let cloudinaryResult: string | null = null;
    if (media.provider === 'cloudinary' && media.publicId) {
      const resourceType = media.mediaType === 'VIDEO' || media.mimeType?.startsWith('video/') ? 'video' : 'image';
      try {
        const res = await destroyFromCloudinary(media.publicId, resourceType);
        cloudinaryResult = res?.result ?? 'ok';
      } catch (err) {
        cloudinaryResult = 'failed';
        console.warn(`[galerie/delete] Suppression Cloudinary best-effort échouée pour ${media.publicId} :`, err);
      }
    }

    await prisma.media.delete({ where: { id: params.id } });
    await recordAudit({
      request,
      userId: auth.user.id,
      action: 'DELETE',
      entity: 'Media',
      entityId: media.id,
      before: media,
      after: { cloudinaryResult },
    });

    return resourceResponse({ id: params.id, deleted: true, cloudinaryResult }, new Date());
  } catch (error: unknown) {
    return handleRouteError(error, 'Impossible de supprimer le média.', 'galerie/[id]:delete');
  }
}
