import { NextRequest, NextResponse } from 'next/server';
import prisma from '@/lib/prisma';

// ===================================
// GET /api/matches/[id] — Récupérer un match par ID
// ===================================
export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const match = await prisma.match.findUnique({
      where: { id: params.id },
    });

    if (!match) {
      return NextResponse.json({ success: false, error: 'Match non trouvé' }, { status: 404 });
    }

    return NextResponse.json({ success: true, data: match });
  } catch (error: any) {
    return NextResponse.json(
      { success: false, error: 'Erreur lors de la récupération du match' },
      { status: 500 }
    );
  }
}

// ===================================
// PATCH /api/matches/[id] — Modifier un match (Score, Date, Statut)
// ===================================
export async function PATCH(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const body = await request.json();

    const dataToUpdate: any = {};
    if (body.homeTeam !== undefined) dataToUpdate.homeTeam = body.homeTeam;
    if (body.awayTeam !== undefined) dataToUpdate.awayTeam = body.awayTeam;
    if (body.homeScore !== undefined) dataToUpdate.homeScore = body.homeScore !== null ? Number(body.homeScore) : null;
    if (body.awayScore !== undefined) dataToUpdate.awayScore = body.awayScore !== null ? Number(body.awayScore) : null;
    if (body.date !== undefined) dataToUpdate.date = new Date(body.date);
    if (body.stadium !== undefined) dataToUpdate.stadium = body.stadium;
    if (body.competition !== undefined) dataToUpdate.competition = body.competition;
    if (body.status !== undefined) dataToUpdate.status = body.status;
    if (body.summary !== undefined) dataToUpdate.summary = body.summary;

    const updated = await prisma.match.update({
      where: { id: params.id },
      data: dataToUpdate,
    });

    return NextResponse.json({ success: true, message: 'Match mis à jour', data: updated });
  } catch (error: any) {
    return NextResponse.json(
      { success: false, error: 'Erreur lors de la modification du match' },
      { status: 500 }
    );
  }
}

// ===================================
// DELETE /api/matches/[id] — Supprimer un match
// ===================================
export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    await prisma.match.delete({
      where: { id: params.id },
    });

    return NextResponse.json({ success: true, message: 'Match supprimé avec succès' });
  } catch (error: any) {
    return NextResponse.json(
      { success: false, error: 'Erreur lors de la suppression du match' },
      { status: 500 }
    );
  }
}
