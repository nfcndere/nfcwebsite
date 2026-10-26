import { NextRequest } from 'next/server';
import prisma from '@/lib/prisma';
import { z } from 'zod';
import { apiError, resourceResponse } from '@/lib/api-response';
import { DATA_FRESHNESS_MS } from '@/constants/data-freshness';
import { requireEditor } from '@/lib/server/auth';

export const dynamic = 'force-dynamic';

const articlePatchSchema = z.object({
  title: z.string().trim().min(1).optional(),
  slug: z.string().trim().min(1).optional(),
  summary: z.string().nullable().optional(),
  content: z.string().min(1).optional(),
  category: z.string().nullable().optional(),
  videoUrl: z.string().url().nullable().optional(),
  coverId: z.string().nullable().optional(),
  published: z.boolean().optional(),
});

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
        published: true,
      },
      include: { cover: true, author: { select: { name: true } } },
    });

    if (!article) {
      return apiError('Article non trouvé.', 404);
    }

    return resourceResponse(article, article.publishedAt ?? article.updatedAt, DATA_FRESHNESS_MS.articles);
  } catch (error: any) {
    console.error('Failed to retrieve article:', error);
    return apiError('Impossible de récupérer l’article.');
  }
}

// ===================================
// PATCH /api/articles/[id] — Modifier un article (Admin / Éditeur)
// ===================================
export async function PATCH(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  const denied = await requireEditor(request);
  if (denied) return denied;
  try {
    const parsed = articlePatchSchema.safeParse(await request.json());
    if (!parsed.success) return apiError('Données d’article invalides.', 400);
    const body = parsed.data;

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

    return resourceResponse(updated, updated.updatedAt);
  } catch (error: any) {
    console.error('Failed to update article:', error);
    return apiError('Impossible de modifier l’article.');
  }
}

// ===================================
// DELETE /api/articles/[id] — Supprimer un article (Admin)
// ===================================
export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  const denied = await requireEditor(request);
  if (denied) return denied;
  try {
    await prisma.article.delete({
      where: { id: params.id },
    });

    return resourceResponse({ id: params.id, deleted: true }, new Date());
  } catch (error: any) {
    console.error('Failed to delete article:', error);
    return apiError('Impossible de supprimer l’article.');
  }
}
