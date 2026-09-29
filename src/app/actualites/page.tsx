'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { PageHeader } from '@/components/ui/PageHeader';
import { SectionTag } from '@/components/ui/SectionTag';
import { NEWS_DATA } from '@/lib/mock-data';
import { Search, Play, Download, FileText, Newspaper } from 'lucide-react';

export default function ActualitesPage() {
  const [filterCategory, setFilterCategory] = useState<string>('TOUS');
  const [searchQuery, setSearchQuery] = useState('');

  const categories = [
    { key: 'TOUS', label: 'TOUTES LES ACTUALITÉS' },
    { key: 'MATCH', label: 'ÉQUIPE PRO' },
    { key: 'ACADEMIE', label: 'ACADÉMIE & JEUNES' },
    { key: 'ACTUALITE', label: 'CLUB & DÉPÊCHES' },
  ];

  const featuredArticle = NEWS_DATA[0];
  const filteredNews = NEWS_DATA.filter((news) => {
    const matchesCategory = filterCategory === 'TOUS' || news.category === filterCategory;
    const matchesSearch = news.title.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  return (
    <div className="bg-[color:var(--nfc-bg)] text-[color:var(--nfc-text)] font-sans space-y-12 pb-20">

      {/* PAGE HERO HEADER WITH BACKGROUND IMAGE */}
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
            <span className="badge-category badge-green text-[9px] mb-2 inline-block">NFC TV</span>
            <h3 className="font-display text-base font-bold text-white">PORTAIL MÉDIA</h3>
            <p className="text-xs text-gray-400 mt-1">Vidéos, Interviews & Communiqués</p>
          </div>
        }
      />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12">

        {/* FILTER BAR & SEARCH */}
        <div className="flex flex-col md:flex-row items-center justify-between gap-4 pb-4 border-b border-gray-200">
          <div className="flex flex-wrap items-center gap-2">
            {categories.map((cat) => (
              <button
                key={cat.key}
                onClick={() => setFilterCategory(cat.key)}
                className={`px-4 py-2 text-xs font-bold font-display uppercase rounded-xl transition-all duration-200 ${
                  filterCategory === cat.key
                    ? 'bg-[color:var(--nfc-green)] text-[color:var(--nfc-white)] shadow-sm'
                    : 'bg-[color:var(--nfc-white)] text-gray-700 hover:bg-gray-50 border border-gray-200'
                }`}
              >
                {cat.label}
              </button>
            ))}
          </div>

          {/* Search Input */}
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

        {/* FEATURED SPOTLIGHT CARD */}
        <section className="bg-white rounded-2xl border border-gray-100 overflow-hidden shadow-sm hover:shadow-md transition-shadow duration-300 grid grid-cols-1 lg:grid-cols-12">
          <div className="lg:col-span-7 relative h-72 lg:h-auto bg-gray-900">
            <img
              src={featuredArticle.coverImage}
              alt={featuredArticle.title}
              className="w-full h-full object-cover"
            />
            <div className="absolute top-4 left-4">
              <span className="badge-category badge-green">{featuredArticle.category}</span>
            </div>
          </div>

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
              <button className="btn-green text-xs">
                VOIR LE RÉSUMÉ VIDÉO
              </button>
              <Link href={`/actualites/${featuredArticle.slug}`} className="btn-dark text-xs">
                LIRE L'ARTICLE COMPLET
              </Link>
            </div>
          </div>
        </section>

        {/* NEWS GRID */}
        <section className="space-y-6">
          <div className="border-b border-gray-200 pb-3 flex items-center justify-between">
            <h2 className="font-display text-2xl font-extrabold text-gray-900 uppercase">DERNIÈRES DÉPÊCHES VERT & JAUNE</h2>
            <span className="text-xs text-gray-500 font-mono">{filteredNews.length} Articles trouvés</span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {filteredNews.map((news) => (
              <Link key={news.id} href={`/actualites/${news.slug}`} className="bg-white rounded-2xl border border-gray-100 overflow-hidden shadow-sm hover:shadow-lg transition-all duration-300 hover:-translate-y-1 group flex flex-col">
                <div className="relative h-48 w-full bg-gray-100 overflow-hidden">
                  <img
                    src={news.coverImage}
                    alt={news.title}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                  />
                  <div className="absolute top-3 left-3">
                    <span className="badge-category badge-green">{news.category}</span>
                  </div>
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

        {/* NFC TV SECTION */}
        <section className="bg-[color:var(--nfc-dark)] text-[color:var(--nfc-white)] rounded-2xl p-8 shadow-xl space-y-6">
          <div className="border-b border-gray-800 pb-4">
            <span className="text-xs font-bold text-gray-400 uppercase font-display block">PORTAIL VIDÉO OFFICIEL</span>
            <h2 className="font-display text-3xl font-extrabold uppercase">IMMERSION VESTIAIRE & VIDÉOS</h2>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
            <div className="lg:col-span-7 relative group rounded-xl overflow-hidden bg-black border border-gray-800">
              <img
                src="https://images.unsplash.com/photo-1543326727-cf6c39e8f84c?q=80&w=1200&auto=format&fit=crop"
                alt="Video player"
                className="w-full h-80 object-cover opacity-80"
              />
              <div className="absolute inset-0 flex items-center justify-center">
                <div className="w-16 h-16 rounded-full bg-[color:var(--nfc-green)] text-[color:var(--nfc-white)] flex items-center justify-center shadow-2xl group-hover:scale-110 transition-transform">
                  <Play className="w-8 h-8 fill-current ml-1" />
                </div>
              </div>
              <div className="absolute bottom-0 inset-x-0 p-5 bg-gradient-to-t from-black via-black/80 to-transparent">
                <span className="badge-category badge-green text-[9px] mb-1">GRAND FORMAT</span>
                <h3 className="font-display text-base font-bold text-white">
                  VESTIAIRE : LES MOTS FORTS DE COACH SIMPLICE MBARGA AVANT LE DERBY
                </h3>
              </div>
            </div>

            <div className="lg:col-span-5 space-y-3">
              <div className="bg-gray-900 p-4 rounded-xl border border-gray-800 flex items-center justify-between hover:border-[color:var(--nfc-green)] hover:bg-[color:var(--nfc-green)]/10 transition-all duration-200 cursor-pointer">
                <div>
                  <h4 className="font-display font-bold text-white text-sm">Conférence de Presse d'avant-match</h4>
                  <span className="text-[10px] text-gray-400 font-mono">Publié hier • 12:45</span>
                </div>
                <Play className="w-5 h-5 text-[color:var(--nfc-green)]" />
              </div>

              <div className="bg-gray-900 p-4 rounded-xl border border-gray-800 flex items-center justify-between hover:border-[#008751] hover:bg-[#008751]/10 transition-all duration-200 cursor-pointer">
                <div>
                  <h4 className="font-display font-bold text-white text-sm">Les coulisses du déplacement à Yaoundé</h4>
                  <span className="text-[10px] text-gray-400 font-mono">18 Sept • 08:30</span>
                </div>
                <Play className="w-5 h-5 text-[color:var(--nfc-green)]" />
              </div>

              <div className="bg-gray-900 p-4 rounded-xl border border-gray-800 flex items-center justify-between hover:border-[#008751] hover:bg-[#008751]/10 transition-all duration-200 cursor-pointer">
                <div>
                  <h4 className="font-display font-bold text-white text-sm">Le top 5 des plus beaux buts du mois</h4>
                  <span className="text-[10px] text-gray-400 font-mono">12 Sept • 04:15</span>
                </div>
                <Play className="w-5 h-5 text-[color:var(--nfc-green)]" />
              </div>
            </div>
          </div>
        </section>

      </div>

    </div>
  );
}
