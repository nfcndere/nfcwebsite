import React from 'react';
import { notFound } from 'next/navigation';
import { NEWS_DATA } from '@/lib/mock-data';
import { NewsArticle } from '@/components/news/NewsArticle';

interface PageProps {
  params: { slug: string };
}

export async function generateStaticParams() {
  return NEWS_DATA.map((article) => ({
    slug: article.slug,
  }));
}

export default function ArticlePage({ params }: PageProps) {
  const article = NEWS_DATA.find((a) => a.slug === params.slug) || NEWS_DATA[0];
  if (!article) return notFound();

  return (
    <div className="py-8 sm:py-12">
      <div className="max-w-7xl mx-auto px-3 sm:px-6 lg:px-8">
        <NewsArticle article={article} />
      </div>
    </div>
  );
}
