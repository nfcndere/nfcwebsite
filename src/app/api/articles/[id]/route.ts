import { NextRequest, NextResponse } from 'next/server';
import prisma from '@/lib/prisma';

// ===================================
// GET /api/articles/[id] — Récupérer un article par ID ou Slug
// ===================================
export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const article = await prisma.article.findFirst({
      where: {
        OR: [{ id: params.id }, { slug: params.id }],
      },
      include: { cover: true, author: { select: { name: true } } },
    });

    if (!article) {
      return NextResponse.json({ success: false, error: 'Article non trouvé' }, { status: 404 });
    }

    return NextResponse.json({ success: true, data: article });
  } catch (error: any) {
    return NextResponse.json(
      { success: false, error: 'Erreur lors de la récupération de l\'article' },
      { status: 500 }
    );
  }
}

// ===================================
// PATCH /api/articles/[id] — Modifier un article (Admin / Éditeur)
// ===================================
export async function PATCH(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const body = await request.json();

    const dataToUpdate: any = {};
    if (body.title !== undefined) dataToUpdate.title = body.title;
    if (body.slug !== undefined) dataToUpdate.slug = body.slug;
    if (body.summary !== undefined) dataToUpdate.summary = body.summary;
    if (body.content !== undefined) dataToUpdate.content = body.content;
    if (body.category !== undefined) dataToUpdate.category = body.category;
    if (body.videoUrl !== undefined) dataToUpdate.videoUrl = body.videoUrl;
    if (body.coverId !== undefined) dataToUpdate.coverId = body.coverId;
    if (body.published !== undefined) {
      dataToUpdate.published = body.published;
      if (body.published) dataToUpdate.publishedAt = new Date();
    }

    const updated = await prisma.article.update({
      where: { id: params.id },
      data: dataToUpdate,
    });

    return NextResponse.json({ success: true, message: 'Article mis à jour', data: updated });
  } catch (error: any) {
    return NextResponse.json(
      { success: false, error: 'Erreur lors de la modification de l\'article' },
      { status: 500 }
    );
  }
}

// ===================================
// DELETE /api/articles/[id] — Supprimer un article (Admin)
// ===================================
export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    await prisma.article.delete({
      where: { id: params.id },
    });

    return NextResponse.json({ success: true, message: 'Article supprimé avec succès' });
  } catch (error: any) {
    return NextResponse.json(
      { success: false, error: 'Erreur lors de la suppression de l\'article' },
      { status: 500 }
    );
  }
}
