import React from 'react';
import { notFound } from 'next/navigation';
import prisma from '@/lib/prisma';
import { NewsArticle } from '@/components/news/NewsArticle';

interface PageProps {
  params: { slug: string };
}

export default async function ArticlePage({ params }: PageProps) {
  let article: any = null;

  try {
    const found = await prisma.article.findFirst({
      where: { OR: [{ slug: params.slug }, { id: params.slug }] },
      include: { cover: true, author: { select: { name: true } } },
    });

    if (found) {
      article = {
        id: found.id,
        slug: found.slug,
        title: found.title,
        summary: found.summary || '',
        content: found.content,
        category: found.category || 'ACTUALITE',
        coverImage: found.cover?.url || '/actu baneer.jpg',
        author: found.author?.name || 'Rédaction NFC',
        videoUrl: found.videoUrl || null,
        createdAt: found.createdAt ? new Date(found.createdAt).toISOString() : new Date().toISOString(),
      };
    }
  } catch (err) {
    console.warn('Erreur lors de la récupération de l’article:', err);
  }

  if (!article) {
    return notFound();
  }

  return (
    <div className="py-8 sm:py-12">
      <div className="max-w-7xl mx-auto px-3 sm:px-6 lg:px-8">
        <NewsArticle article={article} />
      </div>
    </div>
  );
}
