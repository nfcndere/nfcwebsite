"use client";

import React from 'react';
import Image from 'next/image';
import { NewsItem } from '@/types';

interface Props {
  article: NewsItem;
}

export const NewsArticle: React.FC<Props> = ({ article }) => {
  return (
    <article className="max-w-3xl mx-auto bg-white rounded-2xl p-6 shadow-sm font-body">
      <div className="rounded-xl overflow-hidden">
        <img src={article.coverImage} alt={article.title} className="w-full h-64 object-cover rounded-xl" />
      </div>
      <div className="mt-4">
        <h1 className="font-display text-2xl font-extrabold">{article.title}</h1>
        <div className="text-xs text-gray-500 mt-2">Par {article.author} • {new Date(article.createdAt).toLocaleDateString('fr-FR')}</div>
        <p className="text-sm text-gray-700 mt-4">{article.content}</p>
      </div>
    </article>
  );
};
