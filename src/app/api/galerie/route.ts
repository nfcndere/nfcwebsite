import { NextRequest, NextResponse } from 'next/server';
import prisma from '@/lib/prisma';

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

    return NextResponse.json(medias);
  } catch (error) {
    // Fallback mock
    const { GALLERY_DATA } = await import('@/lib/mock-data');
    return NextResponse.json(GALLERY_DATA);
  }
}

// ===================================
// POST /api/galerie — Uploader un asset avec association joueur optionnelle
// ===================================
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();

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

    return NextResponse.json(media, { status: 201 });
  } catch (error) {
    return NextResponse.json({ error: 'Erreur lors de l\'upload du média' }, { status: 500 });
  }
}
