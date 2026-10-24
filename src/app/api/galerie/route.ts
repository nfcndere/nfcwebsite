import { NextRequest, NextResponse } from 'next/server';
import prisma from '@/lib/prisma';
import { z } from 'zod';
import { apiError, resourceResponse, latestDate } from '@/lib/api-response';
import { DATA_FRESHNESS_MS } from '@/constants/data-freshness';
import { requireEditor } from '@/lib/server/auth';

const mediaSchema = z.object({
  provider: z.string().optional(),
  publicId: z.string().min(1),
  url: z.string().url(),
  mimeType: z.string().min(1),
  width: z.number().int().positive().nullable().optional(),
  height: z.number().int().positive().nullable().optional(),
  size: z.number().int().nonnegative().nullable().optional(),
  altText: z.string().nullable().optional(),
  title: z.string().nullable().optional(),
  album: z.string().nullable().optional(),
  mediaType: z.enum(['IMAGE', 'VIDEO']).optional(),
  playerId: z.string().nullable().optional(),
  uploadedById: z.string().nullable().optional(),
});

// ===================================
// GET /api/galerie — Récupérer les médias de la galerie
// ===================================
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const album = searchParams.get('album');
    const playerId = searchParams.get('playerId');
    const type = searchParams.get('type'); // IMAGE ou VIDEO

    const where: any = {};
    if (album && album !== 'TOUS') where.album = album;
    if (playerId) where.playerId = playerId;
    if (type) where.mediaType = type;

    const medias = await prisma.media.findMany({
      where,
      orderBy: { createdAt: 'desc' },
      include: {
        player: { select: { id: true, firstName: true, lastName: true } },
      },
    });

    return resourceResponse(medias, latestDate(medias, (media) => media.createdAt), DATA_FRESHNESS_MS.media);
  } catch (error: any) {
    console.error('Failed to retrieve gallery media:', error);
    return apiError('Impossible de récupérer la galerie.');
  }
}

// ===================================
// POST /api/galerie — Uploader un asset avec association joueur optionnelle
// ===================================
export async function POST(request: NextRequest) {
  const denied = await requireEditor(request);
  if (denied) return denied;
  try {
    const parsed = mediaSchema.safeParse(await request.json());
    if (!parsed.success) return apiError('Données de média invalides.', 400);
    const body = parsed.data;

    const media = await prisma.media.create({
      data: {
        provider: body.provider || 'cloudinary',
        publicId: body.publicId,
        url: body.url,
        mimeType: body.mimeType,
        width: body.width,
        height: body.height,
        size: body.size,
        altText: body.altText || body.title,
        title: body.title,
        album: body.album,
        mediaType: body.mediaType || 'IMAGE',
        // Association joueur optionnelle
        playerId: body.playerId || null,
        uploadedById: body.uploadedById || null,
      },
    });

    return NextResponse.json({ status: 'ok', data: media, updatedAt: media.createdAt }, { status: 201 });
  } catch (error) {
    console.error('Failed to create gallery media:', error);
    return apiError('Impossible d’enregistrer le média.');
  }
}
