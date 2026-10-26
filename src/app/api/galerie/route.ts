import { NextRequest, NextResponse } from 'next/server';
import prisma from '@/lib/prisma';
import { z } from 'zod';
import { apiError, resourceResponse, latestDate } from '@/lib/api-response';
import { DATA_FRESHNESS_MS } from '@/constants/data-freshness';
import { authorize } from '@/lib/server/auth';
import {
  CLOUDINARY_FOLDER,
  isAccountCloudinaryUrl,
  isCloudinaryConfigured,
  UPLOAD_LIMITS,
} from '@/lib/server/cloudinary';
import { recordAudit } from '@/lib/server/audit';
import { handleRouteError, parseJsonBody } from '@/lib/server/route-utils';

export const dynamic = 'force-dynamic';

const PUBLIC_ID_PATTERN = new RegExp(`^${CLOUDINARY_FOLDER}/[A-Za-z0-9_\\-./]+$`);

const mediaSchema = z.object({
  provider: z.enum(['cloudinary']).default('cloudinary'),
  publicId: z
    .string()
    .trim()
    .min(1)
    .max(255)
    .refine((value) => !value.includes('..') && PUBLIC_ID_PATTERN.test(value), {
      message: `publicId invalide : doit commencer par "${CLOUDINARY_FOLDER}/".`,
    }),
  url: z.string().trim().url().max(1_000),
  mimeType: z.string().trim().min(1).max(100),
  width: z.number().int().positive().nullable().optional(),
  height: z.number().int().positive().nullable().optional(),
  size: z.number().int().positive().nullable().optional(),
  altText: z.string().max(300).nullable().optional(),
  title: z.string().max(160).nullable().optional(),
  album: z.string().max(100).nullable().optional(),
  mediaType: z.enum(['IMAGE', 'VIDEO']).optional(),
  playerId: z.string().nullable().optional(),
  uploadedById: z.string().nullable().optional(),
});
const galleryQuerySchema = z.object({
  album: z.string().trim().max(100).optional(),
  playerId: z.string().trim().max(100).optional(),
  type: z.enum(['IMAGE', 'VIDEO']).optional(),
  page: z.coerce.number().int().min(1).default(1),
  pageSize: z.coerce.number().int().min(1).max(100).default(50),
});

// ===================================
// GET /api/galerie — Récupérer les médias de la galerie
// ===================================
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const parsed = galleryQuerySchema.safeParse({
      album: searchParams.get('album') ?? undefined,
      playerId: searchParams.get('playerId') ?? undefined,
      type: searchParams.get('type') ?? undefined,
      page: searchParams.get('page') ?? undefined,
      pageSize: searchParams.get('pageSize') ?? undefined,
    });
    if (!parsed.success) return apiError('Paramètres de recherche invalides.', 400);
    const { album, playerId, type, page, pageSize } = parsed.data;

    const where: Record<string, unknown> = {};
    if (album && album !== 'TOUS') where.album = album;
    if (playerId) where.playerId = playerId;
    if (type) where.mediaType = type;

    const medias = await prisma.media.findMany({
      where,
      orderBy: { createdAt: 'desc' },
      skip: (page - 1) * pageSize,
      take: pageSize,
      include: {
        player: { select: { id: true, firstName: true, lastName: true } },
      },
    });

    return resourceResponse(medias, latestDate(medias, (media) => media.createdAt), DATA_FRESHNESS_MS.media);
  } catch (error: unknown) {
    return handleRouteError(error, 'Impossible de récupérer la galerie.', 'galerie:get');
  }
}

// ===================================
// POST /api/galerie — Enregistrer un média après envoi direct vers Cloudinary
// ===================================
export async function POST(request: NextRequest) {
  const auth = await authorize(request);
  if (!auth.ok) return auth.response;
  try {
    const parsed = await parseJsonBody(request, mediaSchema, 'Données de média invalides.');
    if (!parsed.ok) return parsed.response;
    const body = parsed.data;

    if (!isCloudinaryConfigured()) {
      return apiError('Cloudinary n’est pas configuré sur ce serveur.', 503);
    }
    if (!isAccountCloudinaryUrl(body.url, body.publicId)) {
      return apiError(
        'URL Cloudinary invalide : le domaine doit être res.cloudinary.com sur le compte du club et correspondre au publicId.',
        400,
      );
    }

    const mediaType = body.mediaType ?? (body.mimeType.startsWith('video/') ? 'VIDEO' : 'IMAGE');
    const maxBytes = mediaType === 'VIDEO' ? UPLOAD_LIMITS.video.maxBytes : UPLOAD_LIMITS.image.maxBytes;
    if (body.size && body.size > maxBytes) {
      return apiError('La taille du média dépasse la limite autorisée.', 400);
    }

    const media = await prisma.media.create({
      data: {
        provider: 'cloudinary',
        publicId: body.publicId,
        url: body.url,
        mimeType: body.mimeType,
        width: body.width,
        height: body.height,
        size: body.size,
        altText: body.altText || body.title,
        title: body.title,
        album: body.album,
        mediaType,
        playerId: body.playerId || null,
        uploadedById: auth.user.id,
      },
    });
    await recordAudit({
      request,
      userId: auth.user.id,
      action: 'CREATE',
      entity: 'Media',
      entityId: media.id,
      after: media,
    });

    return NextResponse.json({ status: 'ok', data: media, updatedAt: media.createdAt }, { status: 201 });
  } catch (error) {
    return handleRouteError(error, 'Impossible d’enregistrer le média.', 'galerie:post');
  }
}
