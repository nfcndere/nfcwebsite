import { NextRequest, NextResponse } from 'next/server';
import prisma from '@/lib/prisma';

// ===================================
// PATCH /api/forms/[id] — Marquer un formulaire comme traité (admin mobile)
// ===================================
export async function PATCH(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const body = await request.json();
    const updated = await prisma.formSubmission.update({
      where: { id: params.id },
      data: { processed: body.processed ?? true },
    });
    return NextResponse.json({ success: true, data: updated });
  } catch (error) {
    return NextResponse.json({ error: 'Erreur lors de la mise à jour' }, { status: 500 });
  }
}

// ===================================
// GET /api/forms/[id] — Récupérer un formulaire spécifique
// ===================================
export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const form = await prisma.formSubmission.findUnique({
      where: { id: params.id },
    });
    if (!form) {
      return NextResponse.json({ error: 'Formulaire non trouvé' }, { status: 404 });
    }
    return NextResponse.json({ success: true, data: form });
  } catch (error) {
    return NextResponse.json({ error: 'Erreur lors de la récupération' }, { status: 500 });
  }
}

// ===================================
// DELETE /api/forms/[id] — Supprimer une candidature / formulaire
// ===================================
export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    await prisma.formSubmission.delete({
      where: { id: params.id },
    });
    return NextResponse.json({ success: true, message: 'Formulaire supprimé avec succès' });
  } catch (error) {
    return NextResponse.json({ error: 'Erreur lors de la suppression' }, { status: 500 });
  }
}
