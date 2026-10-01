import { NextRequest, NextResponse } from 'next/server';
import prisma from '@/lib/prisma';
import { destroyFromCloudinary } from '@/lib/server/cloudinary';

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
      return NextResponse.json({ success: false, error: 'Média non trouvé' }, { status: 404 });
    }

    return NextResponse.json({ success: true, data: media });
  } catch (error: any) {
    return NextResponse.json(
      { success: false, error: 'Erreur lors de la récupération du média' },
      { status: 500 }
    );
  }
}

// ===================================
// PATCH /api/galerie/[id] — Modifier les informations d'un média
// ===================================
export async function PATCH(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const body = await request.json();

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

    return NextResponse.json({ success: true, message: 'Média mis à jour', data: updated });
  } catch (error: any) {
    return NextResponse.json(
      { success: false, error: 'Erreur lors de la modification du média' },
      { status: 500 }
    );
  }
}

// ===================================
// DELETE /api/galerie/[id] — Supprimer un média de la galerie
// ===================================
export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const media = await prisma.media.findUnique({ where: { id: params.id } });
    if (!media) {
      return NextResponse.json({ success: false, error: 'Média introuvable' }, { status: 404 });
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

    return NextResponse.json({ success: true, message: 'Média supprimé avec succès' });
  } catch (error: any) {
    return NextResponse.json(
      { success: false, error: 'Erreur lors de la suppression du média' },
      { status: 500 }
    );
  }
}
