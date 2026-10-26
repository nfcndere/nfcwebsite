import React from 'react';
import { notFound } from 'next/navigation';
import prisma from '@/lib/prisma';
import { NOT_DELETED } from '@/lib/soft-delete';
import { NewsArticle } from '@/components/news/NewsArticle';

interface PageProps {
  params: { slug: string };
}

export default async function ArticlePage({ params }: PageProps) {
  const found = await prisma.article.findFirst({
    where: { OR: [{ slug: params.slug }, { id: params.slug }], published: true, ...NOT_DELETED },
    include: { cover: true, author: { select: { name: true } } },
  });
  if (!found) notFound();
  const article = {
    id: found.id,
    slug: found.slug,
    title: found.title,
    summary: found.summary ?? '',
    content: found.content,
    category: found.category ?? '',
    coverImage: found.cover?.url ?? '',
    author: found.author?.name ?? '',
    videoUrl: found.videoUrl ?? undefined,
    createdAt: (found.publishedAt ?? found.createdAt).toISOString(),
  };

  return (
    <div className="py-8 sm:py-12">
      <div className="max-w-7xl mx-auto px-3 sm:px-6 lg:px-8">
        <NewsArticle article={article} />
      </div>
    </div>
  );
}
