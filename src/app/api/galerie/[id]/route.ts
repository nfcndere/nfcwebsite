import { NextRequest } from 'next/server';
import prisma from '@/lib/prisma';
import { destroyFromCloudinary } from '@/lib/server/cloudinary';
import { z } from 'zod';
import { apiError, resourceResponse } from '@/lib/api-response';
import { DATA_FRESHNESS_MS } from '@/constants/data-freshness';
import { requireEditor } from '@/lib/server/auth';

const mediaPatchSchema = z.object({
  title: z.string().nullable().optional(),
  altText: z.string().nullable().optional(),
  album: z.string().nullable().optional(),
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
  } catch (error: any) {
    console.error('Failed to retrieve gallery media:', error);
    return apiError('Impossible de récupérer le média.');
  }
}

// ===================================
// PATCH /api/galerie/[id] — Modifier les informations d'un média
// ===================================
export async function PATCH(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  const denied = await requireEditor(request);
  if (denied) return denied;
  try {
    const parsed = mediaPatchSchema.safeParse(await request.json());
    if (!parsed.success) return apiError('Données de média invalides.', 400);
    const body = parsed.data;

    const dataToUpdate: any = {};
    if (body.title !== undefined) dataToUpdate.title = body.title;
    if (body.altText !== undefined) dataToUpdate.altText = body.altText;
    if (body.album !== undefined) dataToUpdate.album = body.album;
    if (body.mediaType !== undefined) dataToUpdate.mediaType = body.mediaType;
    if (body.playerId !== undefined) dataToUpdate.playerId = body.playerId;

    const updated = await prisma.media.update({
      where: { id: params.id },
      data: dataToUpdate,
    });

    return resourceResponse(updated, updated.createdAt);
  } catch (error: any) {
    console.error('Failed to update gallery media:', error);
    return apiError('Impossible de modifier le média.');
  }
}

// ===================================
// DELETE /api/galerie/[id] — Supprimer un média de la galerie
// ===================================
export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  const denied = await requireEditor(request);
  if (denied) return denied;
  try {
    const media = await prisma.media.findUnique({ where: { id: params.id } });
    if (!media) {
      return apiError('Média introuvable.', 404);
    }

    // Si hébergé sur Cloudinary, détruire l'asset distant
    if (media.provider === 'cloudinary' && media.publicId) {
      try {
        await destroyFromCloudinary(media.publicId);
      } catch (err) {
        console.warn('Erreur lors de la suppression Cloudinary:', err);
      }
    }

    await prisma.media.delete({ where: { id: params.id } });

    return resourceResponse({ id: params.id, deleted: true }, new Date());
  } catch (error: any) {
    console.error('Failed to delete gallery media:', error);
    return apiError('Impossible de supprimer le média.');
  }
}
