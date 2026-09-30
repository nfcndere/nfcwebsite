'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { PageHeader } from '@/components/ui/PageHeader';
import { SectionTag } from '@/components/ui/SectionTag';
import VideoPlayer from '@/components/ui/VideoPlayer';
import { NEWS_DATA } from '@/lib/mock-data';
import { Search, Play } from 'lucide-react';

// Vidéo principale de la section NFC TV — immersion session d'entraînement
const NFC_TV_VIDEO = {
  videoUrl: 'https://res.cloudinary.com/u9588m3i/video/upload/v1790743140/video5895481472965419044.mp4',
  thumbnailUrl: 'https://res.cloudinary.com/u9588m3i/image/upload/v1790743348/galerie_baneer_2.jpg',
  title: 'ENTRAINEMENT : La prise de temperature pour la nouvelle saison',
  badge: 'GRAND FORMAT',
  context: "Immersion session d'entraînement",
};

export default function ActualitesPage() {
  const [filterCategory, setFilterCategory] = useState<string>('TOUS');
  const [searchQuery, setSearchQuery] = useState('');

  const categories = [
    { key: 'TOUS', label: 'TOUTES LES ACTUALITÉS' },
    { key: 'MATCH', label: 'ÉQUIPE PRO' },
    { key: 'ACADEMIE', label: 'ACADÉMIE & JEUNES' },
    { key: 'ACTUALITE', label: 'CLUB & DÉPÊCHES' },
  ];

  // L'article mis en avant est le premier de NEWS_DATA (dynamique via API en production)
  const featuredArticle = NEWS_DATA[0];

  // Les autres actualités sont filtrées dynamiquement
  const filteredNews = NEWS_DATA.filter((news) => {
    const matchesCategory = filterCategory === 'TOUS' || news.category === filterCategory;
    const matchesSearch = news.title.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  return (
    <div className="bg-[color:var(--nfc-bg)] text-[color:var(--nfc-text)] font-sans space-y-12 pb-20">

      {/* EN-TÊTE DE PAGE */}
      <PageHeader
        tag="MÉDIAS ET DÉPÊCHES"
        title="ACTUALITÉS OFFICIELLES"
        titleHighlight="& MÉDIAS"
        description="Toutes les informations officielles, comptes-rendus de matchs, conférences de presse et reportages vidéo du Ngaoundéré FC."
        backgroundImageUrl="/actu baneer.jpg"
        badgeContent={
          <div className="bg-[color:var(--nfc-dark)]/90 backdrop-blur-md p-6 rounded-2xl border border-white/10 text-center w-full lg:w-72 shadow-xl">
            <div className="relative w-14 h-14 rounded-full overflow-hidden ring-2 ring-[color:var(--nfc-green)] shadow-md mx-auto mb-2">
              <Image src="/logo.png" alt="NFC Crest" fill className="object-contain" />
            </div>
            <span className="badge-category badge-green text-[9px] mb-2 inline-block font-bold">PORTAIL MÉDIA</span>
            <h3 className="font-display text-lg font-extrabold text-white"> DÉPÊCHES</h3>
            <p className="text-xs text-[color:var(--nfc-yellow)] mt-1 font-mono">Actualités, Vidéos & NFC TV</p>
          </div>
        }
      />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12">

        {/* BARRE DE FILTRE & RECHERCHE */}
        <div className="flex flex-col md:flex-row items-center justify-between gap-4 pb-4 border-b border-gray-200">
          <div className="flex flex-wrap items-center gap-2">
            {categories.map((cat) => (
              <button
                key={cat.key}
                onClick={() => setFilterCategory(cat.key)}
                className={`px-4 py-2 text-xs font-bold font-display uppercase transition-all duration-200 ${
                  filterCategory === cat.key
                    ? 'bg-[color:var(--nfc-green)] text-[color:var(--nfc-white)] shadow-sm'
                    : 'bg-[color:var(--nfc-white)] text-gray-700 hover:bg-gray-50 border border-gray-200'
                }`}
              >
                {cat.label}
              </button>
            ))}
          </div>

          {/* Champ de recherche */}
          <div className="relative w-full md:w-72">
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Rechercher un article..."
              className="form-input pl-10 text-xs"
            />
            <Search className="w-4 h-4 text-gray-400 absolute left-3.5 top-3" />
          </div>
        </div>

        {/* CARTE ARTICLE À LA UNE */}
        <section className="bg-white border border-gray-100 overflow-hidden shadow-sm hover:shadow-md transition-shadow duration-300 grid grid-cols-1 lg:grid-cols-12">
          {/* Vignette  */}
          <div className="lg:col-span-7 relative h-72 lg:h-auto bg-gray-900">
            {featuredArticle.videoUrl ? (
              <VideoPlayer
                videoUrl={featuredArticle.videoUrl}
                thumbnailUrl={featuredArticle.coverImage}
                title={featuredArticle.title}
                badge={featuredArticle.category}
                context="Lancement officiel de la nouvelle saison 2026-2027"
                className="h-full w-full"
              />
            ) : (
              <img
                src={featuredArticle.coverImage}
                alt={featuredArticle.title}
                className="w-full h-full object-cover"
              />
            )}
            {!featuredArticle.videoUrl && (
              <div className="absolute top-4 left-4">
                <span className="badge-category badge-green">{featuredArticle.category}</span>
              </div>
            )}
          </div>

          {/* Contenu texte de l'article à la une */}
          <div className="lg:col-span-5 p-8 flex flex-col justify-between space-y-4">
            <div className="space-y-3">
              <span className="text-[11px] text-gray-400 font-mono">
                {new Date(featuredArticle.createdAt).toLocaleDateString('fr-FR', { day: 'numeric', month: 'long', year: 'numeric' })} • 5 MIN DE LECTURE
              </span>
              <h3 className="font-display text-2xl font-extrabold text-gray-900 uppercase leading-snug">
                {featuredArticle.title}
              </h3>
              <p className="text-xs text-gray-500 leading-relaxed">
                {featuredArticle.summary}
              </p>
            </div>

            <div className="flex flex-wrap gap-3 pt-4 border-t border-gray-100">
              {featuredArticle.videoUrl && (
                <a
                  href={featuredArticle.videoUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="btn-green text-xs flex items-center gap-1"
                >
                  <Play className="w-3 h-3" />
                  VOIR LE RÉSUMÉ VIDÉO
                </a>
              )}
              <Link href={`/actualites/${featuredArticle.slug}`} className="btn-dark text-xs">
                LIRE L'ARTICLE COMPLET
              </Link>
            </div>
          </div>
        </section>

        {/* GRILLE DES DERNIÈRES ACTUALITÉS — Données dynamiques via API en production */}
        <section className="space-y-6">
          <div className="border-b border-gray-200 pb-3 flex items-center justify-between">
            <h2 className="font-display text-2xl font-extrabold text-gray-900 uppercase">DERNIÈRES DÉPÊCHES VERT & JAUNE</h2>
            <span className="text-xs text-gray-500 font-mono">{filteredNews.length} Articles trouvés</span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {filteredNews.map((news) => (
              <Link key={news.id} href={`/actualites/${news.slug}`} className="bg-white border border-gray-100 overflow-hidden shadow-sm hover:shadow-lg hover:-translate-y-1 transition-all duration-300 group flex flex-col">
                <div className="relative h-48 w-full bg-gray-100 overflow-hidden">
                  <img
                    src={news.coverImage}
                    alt={news.title}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                  />
                  <div className="absolute top-3 left-3">
                    <span className="badge-category badge-green">{news.category}</span>
                  </div>
                  {/* Indicateur vidéo si disponible */}
                  {news.videoUrl && (
                    <div className="absolute top-3 right-3 w-7 h-7 rounded-full bg-[color:var(--nfc-green)] flex items-center justify-center">
                      <Play className="w-3.5 h-3.5 text-white fill-current ml-0.5" />
                    </div>
                  )}
                </div>
                <div className="p-6 flex flex-col flex-grow space-y-3">
                  <span className="text-[11px] text-gray-400 font-mono">
                    {new Date(news.createdAt).toLocaleDateString('fr-FR', { day: 'numeric', month: 'long', year: 'numeric' })}
                  </span>
                  <h3 className="font-display text-lg font-bold text-gray-900 group-hover:text-[color:var(--nfc-green)] transition-colors line-clamp-2">
                    {news.title}
                  </h3>
                  <p className="text-xs text-gray-500 line-clamp-3 leading-relaxed flex-grow">
                    {news.summary}
                  </p>
                  <div className="pt-3 border-t border-gray-100 flex items-center justify-between text-xs text-[color:var(--nfc-green)] font-bold font-display">
                    <span>Par {news.author}</span>
                    <span className="group-hover:translate-x-1 transition-transform">LIRE &rarr;</span>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        </section>

        {/* SECTION NFC TV — Portail Vidéo */}
        <section className="bg-[color:var(--nfc-dark)] text-[color:var(--nfc-white)] p-8 shadow-xl space-y-6">
          <div className="border-b border-gray-800 pb-4">
            <span className="text-xs font-bold text-gray-400 uppercase font-display block">PORTAIL VIDÉO OFFICIEL</span>
            <h2 className="font-display text-3xl font-extrabold uppercase">IMMERSION VESTIAIRE & VIDÉOS</h2>
          </div>

          <div className="gap-8 items-center">

            {/* Lecteur vidéo principal */}
            <div className="lg:col-span-7">
              <VideoPlayer
                videoUrl={NFC_TV_VIDEO.videoUrl}
                thumbnailUrl={NFC_TV_VIDEO.thumbnailUrl}
                title={NFC_TV_VIDEO.title}
                badge={NFC_TV_VIDEO.badge}
                context={NFC_TV_VIDEO.context}
              />
            </div>
          </div>
        </section>

      </div>
    </div>
  );
}
