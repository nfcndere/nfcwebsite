'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { PageHeader } from '@/components/ui/PageHeader';
import { Search, Play } from 'lucide-react';
import VideoPlayer from '@/components/ui/VideoPlayer';
import { useApiResource } from '@/lib/use-api-resource';
import { DataState } from '@/components/ui/DataState';
import { DATA_FRESHNESS_MS } from '@/constants/data-freshness';

export default function ActualitesPage() {
  const [filterCategory, setFilterCategory] = useState<string>('TOUS');
  const [searchQuery, setSearchQuery] = useState('');
  const resource = useApiResource<any[]>('/api/articles', { staleAfterMs: DATA_FRESHNESS_MS.articles });
  const articles = (resource.data ?? []).map((item) => ({
    ...item,
    summary: item.summary || (item.content ? `${item.content.substring(0, 150)}…` : ''),
    coverImage: item.cover?.url ?? null,
    author: item.author?.name ?? null,
    createdAt: item.publishedAt ?? item.createdAt,
  }));

  const categories = [
    { key: 'TOUS', label: 'TOUTES LES ACTUALITÉS' },
    { key: 'MATCH', label: 'ÉQUIPE PRO' },
    { key: 'ACADEMIE', label: 'ACADÉMIE & JEUNES' },
    { key: 'ACTUALITE', label: 'CLUB & DÉPÊCHES' },
  ];

  const featuredArticle = articles[0] || null;

  const filteredNews = articles.filter((news) => {
    const matchesCategory = filterCategory === 'TOUS' || news.category === filterCategory;
    const matchesSearch = news.title.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  return (
    <div className="bg-[color:var(--nfc-bg)] text-[color:var(--nfc-text)] font-sans space-y-6 sm:space-y-12 pb-16">

      {/* EN-TÊTE DE PAGE */}
      <PageHeader
        tag="MÉDIAS ET DÉPÊCHES"
        title="ACTUALITÉS OFFICIELLES"
        titleHighlight="& MÉDIAS"
        description="Toutes les informations officielles, comptes-rendus de matchs, conférences de presse et reportages vidéo du Ngaoundéré FC."
        backgroundImageUrl="/actu baneer.jpg"
        
      />

      <div className="max-w-7xl mx-auto px-3 sm:px-6 lg:px-8 space-y-6 sm:space-y-12">

        {/* BARRE DE FILTRE & RECHERCHE */}
        <div className="flex flex-col md:flex-row items-center justify-between gap-3 pb-4 border-b border-gray-200">
          <div className="flex flex-wrap items-center gap-1.5 w-full md:w-auto">
            {categories.map((cat) => (
              <button
                key={cat.key}
                onClick={() => setFilterCategory(cat.key)}
                className={`px-3 py-1.5 sm:px-4 sm:py-2 text-[11px] sm:text-xs font-bold font-display uppercase transition-all duration-200 ${
                  filterCategory === cat.key
                    ? 'bg-[color:var(--nfc-green)] text-white shadow-sm'
                    : 'bg-white text-gray-700 hover:bg-gray-50 border border-gray-200'
                }`}
              >
                {cat.label}
              </button>
            ))}
          </div>

          <div className="relative w-full md:w-72">
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Rechercher un article..."
              className="form-input pl-10 text-xs py-2 w-full"
            />
            <Search className="w-4 h-4 text-gray-400 absolute left-3.5 top-2.5" />
          </div>
        </div>

        {/* CARTE ARTICLE À LA UNE */}
        {featuredArticle && (
          <section className="bg-white border border-gray-100 overflow-hidden shadow-sm hover:shadow-md transition-shadow duration-300 grid grid-cols-1 lg:grid-cols-12 rounded-xl">
            <div className="lg:col-span-7 relative h-60 sm:h-72 lg:h-auto bg-gray-900">
              {featuredArticle.videoUrl ? (
                <VideoPlayer
                  videoUrl={featuredArticle.videoUrl}
                  thumbnailUrl={featuredArticle.coverImage}
                  title={featuredArticle.title}
                  badge={featuredArticle.category}
                  context={featuredArticle.summary}
                  className="h-full w-full"
                />
              ) : (
                featuredArticle.coverImage ? <img src={featuredArticle.coverImage} alt={featuredArticle.title} className="w-full h-full object-cover" /> : null
              )}
              {!featuredArticle.videoUrl && (
                <div className="absolute top-3 left-3">
                  <span className="badge-category badge-green">{featuredArticle.category}</span>
                </div>
              )}
            </div>

            <div className="lg:col-span-5 p-4 sm:p-8 flex flex-col justify-between space-y-4">
              <div className="space-y-2 sm:space-y-3">
                <span className="text-[10px] sm:text-[11px] text-gray-400 font-mono">
                  {new Date(featuredArticle.createdAt).toLocaleDateString('fr-FR', { day: 'numeric', month: 'long', year: 'numeric', timeZone: 'Africa/Douala' })}
                </span>
                <h3 className="font-display text-lg sm:text-2xl font-extrabold text-gray-900 uppercase leading-snug">
                  {featuredArticle.title}
                </h3>
                <p className="text-xs text-gray-500 leading-relaxed line-clamp-3">
                  {featuredArticle.summary}
                </p>
              </div>

              <div className="flex flex-wrap gap-2.5 pt-3 border-t border-gray-100">
                {featuredArticle.videoUrl && (
                  <a
                    href={featuredArticle.videoUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="btn-green text-[11px] py-2 px-3 flex items-center gap-1"
                  >
                    <Play className="w-3 h-3" />
                    VOIR VIDÉO
                  </a>
                )}
                <Link href={`/actualites/${featuredArticle.slug}`} className="btn-dark text-[11px] py-2 px-3">
                  LIRE ARTICLE
                </Link>
              </div>
            </div>
          </section>
        )}

        {/* GRILLE DES DERNIÈRES ACTUALITÉS */}
        <section className="space-y-4 sm:space-y-6">
          <div className="border-b border-gray-200 pb-3 flex items-center justify-between">
            <h2 className="font-display text-lg sm:text-2xl font-extrabold text-gray-900 uppercase">DERNIÈRES DÉPÊCHES VERT & JAUNE</h2>
            <span className="text-xs text-gray-500 font-mono">{filteredNews.length} Dépêches</span>
          </div>

          <DataState status={resource.status} error={resource.error} onRetry={resource.retry} updatedAt={resource.updatedAt} emptyMessage="Aucune actualité pour le moment. Revenez bientôt." skeleton={<div className="h-48 animate-pulse rounded-xl bg-white" />}>
          {filteredNews.length > 0 ? <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4 sm:gap-6">
            {filteredNews.map((news) => (
              <Link key={news.id} href={`/actualites/${news.slug}`} className="bg-white border border-gray-100 overflow-hidden shadow-sm hover:shadow-lg hover:-translate-y-1 transition-all duration-300 group flex flex-col rounded-xl">
                <div className="relative h-44 sm:h-48 w-full bg-gray-100 overflow-hidden">
                  {news.coverImage && <img src={news.coverImage} alt={news.title} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300" />}
                  <div className="absolute top-2.5 left-2.5">
                    <span className="badge-category badge-green text-[9px]">{news.category}</span>
                  </div>
                  {news.videoUrl && (
                    <div className="absolute top-2.5 right-2.5 w-6 h-6 rounded-full bg-[#008751] flex items-center justify-center">
                      <Play className="w-3 h-3 text-white fill-current ml-0.5" />
                    </div>
                  )}
                </div>
                <div className="p-3.5 sm:p-5 flex flex-col flex-grow space-y-2 sm:space-y-3">
                  <span className="text-[10px] text-gray-400 font-mono">
                    {news.createdAt && new Date(news.createdAt).toLocaleDateString('fr-FR', { day: 'numeric', month: 'long', year: 'numeric', timeZone: 'Africa/Douala' })}
                  </span>
                  <h3 className="font-display text-sm sm:text-base font-bold text-gray-900 group-hover:text-[#008751] transition-colors line-clamp-2">
                    {news.title}
                  </h3>
                  <p className="text-xs text-gray-500 line-clamp-2 leading-relaxed flex-grow">
                    {news.summary}
                  </p>
                  <div className="pt-2 border-t border-gray-100 flex items-center justify-between text-[11px] text-[#008751] font-bold font-display">
                    {news.author && <span>Par {news.author}</span>}
                    <span className="group-hover:translate-x-1 transition-transform">LIRE &rarr;</span>
                  </div>
                </div>
              </Link>
            ))}
          </div> : <p role="status" className="py-6 text-center text-sm text-gray-600">Aucun article ne correspond à cette recherche.</p>}
          </DataState>
        </section>

      </div>
    </div>
  );
}
