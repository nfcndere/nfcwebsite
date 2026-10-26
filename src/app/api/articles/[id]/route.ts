import { NextRequest } from 'next/server';
import prisma from '@/lib/prisma';
import { z } from 'zod';
import { apiError, resourceResponse } from '@/lib/api-response';
import { DATA_FRESHNESS_MS } from '@/constants/data-freshness';
import { authorize, getOptionalEditor } from '@/lib/server/auth';
import { recordAudit } from '@/lib/server/audit';
import { handleRouteError, parseJsonBody } from '@/lib/server/route-utils';
import { NOT_DELETED } from '@/lib/soft-delete';

export const dynamic = 'force-dynamic';

const articlePatchSchema = z.object({
  title: z.string().trim().min(1).max(240).optional(),
  slug: z.string().trim().min(1).max(180).optional(),
  summary: z.string().max(1_000).nullable().optional(),
  content: z.string().min(1).optional(),
  category: z.string().trim().max(80).nullable().optional(),
  videoUrl: z.string().url().nullable().optional(),
  coverId: z.string().nullable().optional(),
  published: z.boolean().optional(),
  restore: z.boolean().optional(),
});

// ===================================
// GET /api/articles/[id] — Récupérer un article par ID ou Slug (brouillons visibles uniquement par un éditeur)
// ===================================
export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const editor = await getOptionalEditor(request);
    const article = await prisma.article.findFirst({
      where: {
        OR: [{ id: params.id }, { slug: params.id }],
        ...NOT_DELETED,
        ...(editor ? {} : { published: true }),
      },
      include: { cover: true, author: { select: { name: true } } },
    });

    if (!article) {
      return apiError('Article non trouvé.', 404);
    }

    return resourceResponse(article, article.publishedAt ?? article.updatedAt, DATA_FRESHNESS_MS.articles);
  } catch (error: unknown) {
    return handleRouteError(error, 'Impossible de récupérer l’article.', 'articles/[id]:get');
  }
}

// ===================================
// PATCH /api/articles/[id] — Modifier un article (Admin / Éditeur)
// ===================================
export async function PATCH(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  const auth = await authorize(request);
  if (!auth.ok) return auth.response;
  try {
    const parsed = await parseJsonBody(request, articlePatchSchema, 'Données d’article invalides.');
    if (!parsed.ok) return parsed.response;
    const body = parsed.data;

    const existing = await prisma.article.findFirst({
      where: { id: params.id, ...(body.restore ? {} : NOT_DELETED) },
    });
    if (!existing) return apiError('Article non trouvé.', 404);

    const dataToUpdate: Record<string, unknown> = {};
    if (body.title !== undefined) dataToUpdate.title = body.title;
    if (body.slug !== undefined) dataToUpdate.slug = body.slug;
    if (body.summary !== undefined) dataToUpdate.summary = body.summary;
    if (body.content !== undefined) dataToUpdate.content = body.content;
    if (body.category !== undefined) dataToUpdate.category = body.category;
    if (body.videoUrl !== undefined) dataToUpdate.videoUrl = body.videoUrl;
    if (body.coverId !== undefined) dataToUpdate.coverId = body.coverId;
    if (body.published !== undefined) {
      dataToUpdate.published = body.published;
      if (body.published && !existing.publishedAt) dataToUpdate.publishedAt = new Date();
    }
    if (body.restore === true) dataToUpdate.deletedAt = null;

    const updated = await prisma.article.update({
      where: { id: params.id },
      data: dataToUpdate,
    });
    await recordAudit({
      request,
      userId: auth.user.id,
      action: body.restore ? 'RESTORE' : 'UPDATE',
      entity: 'Article',
      entityId: updated.id,
      before: existing,
      after: updated,
    });

    return resourceResponse(updated, updated.updatedAt);
  } catch (error: unknown) {
    return handleRouteError(error, 'Impossible de modifier l’article.', 'articles/[id]:patch');
  }
}

// ===================================
// DELETE /api/articles/[id] — Suppression logique d'un article (Admin / Éditeur)
// ===================================
export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  const auth = await authorize(request);
  if (!auth.ok) return auth.response;
  try {
    const existing = await prisma.article.findFirst({ where: { id: params.id, ...NOT_DELETED } });
    if (!existing) return apiError('Article non trouvé.', 404);

    const deletedAt = new Date();
    const updated = await prisma.article.update({
      where: { id: params.id },
      data: { deletedAt },
    });
    await recordAudit({
      request,
      userId: auth.user.id,
      action: 'SOFT_DELETE',
      entity: 'Article',
      entityId: updated.id,
      before: existing,
      after: updated,
    });

    return resourceResponse({ id: params.id, deleted: true, deletedAt: deletedAt.toISOString() }, deletedAt);
  } catch (error: unknown) {
    return handleRouteError(error, 'Impossible de supprimer l’article.', 'articles/[id]:delete');
  }
}
