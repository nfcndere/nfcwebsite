"use client";

import React from 'react';
import { NewsItem } from '@/types';

interface Props {
  article: NewsItem;
}

export const NewsArticle: React.FC<Props> = ({ article }) => {
  return (
    <article className="max-w-3xl mx-auto bg-white rounded-2xl p-6 shadow-sm font-body">
      {article.coverImage && <div className="overflow-hidden rounded-xl"><img src={article.coverImage} alt={article.title} className="h-64 w-full rounded-xl object-cover" /></div>}
      <div className="mt-4">
        <h1 className="font-display text-2xl font-extrabold">{article.title}</h1>
        <div className="mt-2 text-xs text-gray-500">
          {article.author && <>Par {article.author} · </>}
          {new Date(article.createdAt).toLocaleDateString('fr-FR', { timeZone: 'Africa/Douala' })}
        </div>
        <p className="text-sm text-gray-700 mt-4">{article.content}</p>
      </div>
    </article>
  );
};
