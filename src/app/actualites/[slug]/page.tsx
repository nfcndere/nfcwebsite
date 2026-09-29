import React from 'react';
import { notFound } from 'next/navigation';
import { NEWS_DATA } from '@/lib/mock-data';
import { NewsArticle } from '@/components/news/NewsArticle';

interface PageProps {
  params: { slug: string };
}

export default function ArticlePage({ params }: PageProps) {
  const article = NEWS_DATA.find((a) => a.slug === params.slug);
  if (!article) return notFound();

  return (
    <div className="py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <NewsArticle article={article} />
      </div>
    </div>
  );
}
