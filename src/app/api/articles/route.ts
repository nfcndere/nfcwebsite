import { NextRequest, NextResponse } from 'next/server';
import prisma from '@/lib/prisma';

// ===================================
// GET /api/articles — Récupérer les articles publiés
// ===================================
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const category = searchParams.get('category');
    const slug = searchParams.get('slug');
    const limit = parseInt(searchParams.get('limit') || '20');

    const where: any = { published: true };
    if (category && category !== 'TOUS') where.category = category;
    if (slug) where.slug = slug;

    const articles = await prisma.article.findMany({
      where,
      include: { cover: true, author: { select: { name: true } } },
      orderBy: { publishedAt: 'desc' },
      take: limit,
    });

    return NextResponse.json(articles);
  } catch (error) {
    // Fallback sur le mock en cas d'erreur DB
    const { NEWS_DATA } = await import('@/lib/mock-data');
    return NextResponse.json(NEWS_DATA);
  }
}

// ===================================
// POST /api/articles — Créer un article (admin)
// ===================================
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
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
    return NextResponse.json(article, { status: 201 });
  } catch (error) {
    return NextResponse.json({ error: 'Erreur lors de la création de l\'article' }, { status: 500 });
  }
}
