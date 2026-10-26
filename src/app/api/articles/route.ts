import { NextRequest, NextResponse } from 'next/server';
import prisma from '@/lib/prisma';
import { z } from 'zod';
import { apiError, resourceResponse, latestDate } from '@/lib/api-response';
import { DATA_FRESHNESS_MS } from '@/constants/data-freshness';
import { authorize, getOptionalEditor } from '@/lib/server/auth';
import { recordAudit } from '@/lib/server/audit';
import { handleRouteError, parseJsonBody } from '@/lib/server/route-utils';
import { NOT_DELETED } from '@/lib/soft-delete';

export const dynamic = 'force-dynamic';

const articleSchema = z.object({
  slug: z.string().trim().min(1).max(180),
  title: z.string().trim().min(1).max(240),
  summary: z.string().max(1_000).nullable().optional(),
  content: z.string().min(1),
  category: z.string().trim().max(80).nullable().optional(),
  videoUrl: z.string().url().nullable().optional(),
  coverId: z.string().nullable().optional(),
  authorId: z.string().nullable().optional(),
  published: z.boolean().optional(),
});
const articlesQuerySchema = z.object({
  category: z.string().trim().max(80).optional(),
  slug: z.string().trim().max(180).optional(),
  limit: z.coerce.number().int().min(1).max(100).default(20),
  status: z.enum(['all', 'draft', 'published']).optional(),
});

// ===================================
// GET /api/articles — Récupérer les articles (public : publiés non supprimés ; éditeur : ?status=all|draft|published)
// ===================================
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const parsed = articlesQuerySchema.safeParse({
      category: searchParams.get('category') ?? undefined,
      slug: searchParams.get('slug') ?? undefined,
      limit: searchParams.get('limit') ?? undefined,
      status: searchParams.get('status') ?? undefined,
    });
    if (!parsed.success) return apiError('Paramètres de recherche invalides.', 400);
    const { category, slug, limit, status } = parsed.data;

    // Le filtre `status` n'est honoré que si un jeton d'éditeur/admin valide est fourni.
    const editor = status ? await getOptionalEditor(request) : null;
    const effectiveStatus = editor ? status ?? 'published' : 'published';

    const where: Record<string, unknown> = { ...NOT_DELETED };
    if (effectiveStatus === 'published') where.published = true;
    else if (effectiveStatus === 'draft') where.published = false;
    if (category && category !== 'TOUS') where.category = category;
    if (slug) where.slug = slug;

    const articles = await prisma.article.findMany({
      where,
      include: { cover: true, author: { select: { name: true } } },
      orderBy: effectiveStatus === 'published' ? { publishedAt: 'desc' } : { updatedAt: 'desc' },
      take: limit,
    });

    return resourceResponse(
      articles,
      latestDate(articles, (article) => article.publishedAt ?? article.updatedAt),
      DATA_FRESHNESS_MS.articles,
    );
  } catch (error: unknown) {
    return handleRouteError(error, 'Impossible de récupérer les articles.', 'articles:get');
  }
}

// ===================================
// POST /api/articles — Créer un article (admin / éditeur)
// ===================================
export async function POST(request: NextRequest) {
  const auth = await authorize(request);
  if (!auth.ok) return auth.response;
  try {
    const parsed = await parseJsonBody(request, articleSchema, 'Données d’article invalides.');
    if (!parsed.ok) return parsed.response;
    const body = parsed.data;
    const article = await prisma.article.create({
      data: {
        slug: body.slug,
        title: body.title,
        summary: body.summary,
        content: body.content,
        category: body.category,
        videoUrl: body.videoUrl,
        coverId: body.coverId,
        authorId: body.authorId ?? auth.user.id,
        published: body.published ?? false,
        publishedAt: body.published ? new Date() : null,
      },
    });
    await recordAudit({
      request,
      userId: auth.user.id,
      action: 'CREATE',
      entity: 'Article',
      entityId: article.id,
      after: article,
    });
    return NextResponse.json({ status: 'ok', data: article, updatedAt: article.updatedAt }, { status: 201 });
  } catch (error) {
    return handleRouteError(error, 'Impossible de créer l’article.', 'articles:post');
  }
}
