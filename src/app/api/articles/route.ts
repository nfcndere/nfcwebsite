import { NextRequest, NextResponse } from 'next/server';
import prisma from '@/lib/prisma';
import { z } from 'zod';
import { apiError, resourceResponse, latestDate } from '@/lib/api-response';
import { DATA_FRESHNESS_MS } from '@/constants/data-freshness';
import { requireEditor } from '@/lib/server/auth';

export const dynamic = 'force-dynamic';

const articleSchema = z.object({
  slug: z.string().trim().min(1),
  title: z.string().trim().min(1),
  summary: z.string().nullable().optional(),
  content: z.string().min(1),
  category: z.string().nullable().optional(),
  videoUrl: z.string().url().nullable().optional(),
  coverId: z.string().nullable().optional(),
  authorId: z.string().nullable().optional(),
  published: z.boolean().optional(),
});
const articlesQuerySchema = z.object({
  category: z.string().trim().max(80).optional(),
  slug: z.string().trim().max(180).optional(),
  limit: z.coerce.number().int().min(1).max(100).default(20),
});

// ===================================
// GET /api/articles — Récupérer les articles publiés
// ===================================
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const parsed = articlesQuerySchema.safeParse({
      category: searchParams.get('category') ?? undefined,
      slug: searchParams.get('slug') ?? undefined,
      limit: searchParams.get('limit') ?? undefined,
    });
    if (!parsed.success) return apiError('Paramètres de recherche invalides.', 400);
    const { category, slug, limit } = parsed.data;

    const where: any = { published: true };
    if (category && category !== 'TOUS') where.category = category;
    if (slug) where.slug = slug;

    const articles = await prisma.article.findMany({
      where,
      include: { cover: true, author: { select: { name: true } } },
      orderBy: { publishedAt: 'desc' },
      take: limit,
    });

    return resourceResponse(articles, latestDate(articles, (article) => article.publishedAt ?? article.updatedAt), DATA_FRESHNESS_MS.articles);
  } catch (error: any) {
    console.error('Failed to retrieve articles:', error);
    return apiError('Impossible de récupérer les articles.');
  }
}

// ===================================
// POST /api/articles — Créer un article (admin)
// ===================================
export async function POST(request: NextRequest) {
  const denied = await requireEditor(request);
  if (denied) return denied;
  try {
    const parsed = articleSchema.safeParse(await request.json());
    if (!parsed.success) return apiError('Données d’article invalides.', 400);
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
        authorId: body.authorId,
        published: body.published ?? false,
        publishedAt: body.published ? new Date() : null,
      },
    });
    return NextResponse.json({ status: 'ok', data: article, updatedAt: article.updatedAt }, { status: 201 });
  } catch (error) {
    console.error('Failed to create article:', error);
    return apiError('Impossible de créer l’article.');
  }
}
