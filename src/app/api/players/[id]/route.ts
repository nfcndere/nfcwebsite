import { NextRequest, NextResponse } from 'next/server';
import prisma from '@/lib/prisma';

// ===================================
// GET /api/players/[id] — Récupérer un joueur par ID
// ===================================
export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const player = await prisma.player.findUnique({
      where: { id: params.id },
      include: { media: true },
    });

    if (!player) {
      return NextResponse.json({ success: false, error: 'Joueur non trouvé' }, { status: 404 });
    }

    return NextResponse.json({ success: true, data: player });
  } catch (error: any) {
    return NextResponse.json(
      { success: false, error: 'Erreur lors de la récupération du joueur' },
      { status: 500 }
    );
  }
}

// ===================================
// PATCH /api/players/[id] — Modifier les informations d'un joueur
// ===================================
export async function PATCH(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const body = await request.json();

    const dataToUpdate: any = {};
    if (body.firstName !== undefined) dataToUpdate.firstName = body.firstName;
    if (body.lastName !== undefined) dataToUpdate.lastName = body.lastName;
    if (body.number !== undefined) dataToUpdate.number = parseInt(body.number);
    if (body.position !== undefined) dataToUpdate.position = body.position;
    if (body.nationality !== undefined) dataToUpdate.nationality = body.nationality;
    if (body.bio !== undefined) dataToUpdate.bio = body.bio;
    if (body.photoId !== undefined) dataToUpdate.photoId = body.photoId;
    if (body.isCaptain !== undefined) dataToUpdate.isCaptain = body.isCaptain;
    if (body.birthDate !== undefined) dataToUpdate.birthDate = body.birthDate;
    if (body.height !== undefined) dataToUpdate.height = parseInt(body.height);
    if (body.weight !== undefined) dataToUpdate.weight = parseInt(body.weight);
    if (body.joinedYear !== undefined) dataToUpdate.joinedYear = parseInt(body.joinedYear);

    const updated = await prisma.player.update({
      where: { id: params.id },
      data: dataToUpdate,
    });

    return NextResponse.json({ success: true, message: 'Joueur mis à jour', data: updated });
  } catch (error: any) {
    return NextResponse.json(
      { success: false, error: 'Erreur lors de la modification du joueur' },
      { status: 500 }
    );
  }
}

// ===================================
// DELETE /api/players/[id] — Supprimer un joueur de l'effectif
// ===================================
export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    await prisma.player.delete({
      where: { id: params.id },
    });

    return NextResponse.json({ success: true, message: 'Joueur retiré avec succès' });
  } catch (error: any) {
    return NextResponse.json(
      { success: false, error: 'Erreur lors de la suppression du joueur' },
      { status: 500 }
    );
  }
}
