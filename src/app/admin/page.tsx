'use client';

import React, { useState, useEffect } from 'react';
import Image from 'next/image';
import { PageHeader } from '@/components/ui/PageHeader';
import { Newspaper, Users, Calendar, GraduationCap, Plus, Trash2, Edit, RefreshCw } from 'lucide-react';
import { NEWS_DATA, PLAYERS_DATA, MATCHES_DATA } from '@/lib/mock-data';

export default function AdminPage() {
  const [activeTab, setActiveTab] = useState<'NEWS' | 'PLAYERS' | 'ACADEMY' | 'MATCHES'>('NEWS');
  const [news, setNews] = useState<any[]>([]);
  const [players, setPlayers] = useState<any[]>([]);
  const [matches, setMatches] = useState<any[]>([]);
  const [academySubmissions, setAcademySubmissions] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);

  const loadAdminData = async () => {
    setLoading(true);
    try {
      const [resNews, resPlayers, resMatches, resAcademy] = await Promise.all([
        fetch('/api/articles').then(r => r.ok ? r.json() : []),
        fetch('/api/players').then(r => r.ok ? r.json() : []),
        fetch('/api/matches').then(r => r.ok ? r.json() : []),
        fetch('/api/academie').then(r => r.ok ? r.json() : []),
      ]);

      if (Array.isArray(resNews)) setNews(resNews);
      if (Array.isArray(resPlayers)) setPlayers(resPlayers);
      if (Array.isArray(resMatches)) setMatches(resMatches);
      if (Array.isArray(resAcademy)) setAcademySubmissions(resAcademy);
    } catch (err) {
      console.warn('Erreur lors du chargement des données API');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadAdminData();
  }, []);

  return (
    <div className="bg-[#f7f8f7] text-[#1f2937] font-sans min-h-screen pb-16 space-y-6 sm:space-y-8">

      {/* PAGE HERO HEADER */}
      <PageHeader
        tag="PORTAIL D'ADMINISTRATION NFC"
        title="PANNEAU DE"
        titleHighlight="GESTION DU CLUB"
        description="Gestion globale des contenus, dépêches d'actualités, effectif professionnel, candidatures de l'Académie et calendrier."
        backgroundImageUrl="https://images.unsplash.com/photo-1508098682722-e99c43a406b2?q=80&w=1600&auto=format&fit=crop"
        badgeContent={
          <div className="bg-[#0c130e]/90 backdrop-blur-md p-4 sm:p-6 rounded-2xl border border-white/10 text-center w-full lg:w-72 shadow-xl">
            <span className="badge-category badge-green text-[9px] mb-2 inline-block">SESSION CONNECTÉE</span>
            <h3 className="font-display text-sm sm:text-base font-bold text-white">ADMINISTRATEUR</h3>
            <p className="text-xs text-gray-400 mt-1">Données Synchro BD Supabase</p>
          </div>
        }
      />

      <div className="max-w-7xl mx-auto px-3 sm:px-6 lg:px-8 space-y-6 sm:space-y-8">

        {/* NAVIGATION TABS */}
        <div className="flex flex-wrap items-center justify-between gap-2 border-b border-gray-200 pb-3">
          <div className="flex flex-wrap gap-1.5">
            {[
              { id: 'NEWS', label: `Actualités (${news.length})`, icon: Newspaper },
              { id: 'PLAYERS', label: `Effectif (${players.length})`, icon: Users },
              { id: 'ACADEMY', label: `Candidatures (${academySubmissions.length})`, icon: GraduationCap },
              { id: 'MATCHES', label: `Matchs (${matches.length})`, icon: Calendar },
            ].map((tab) => {
              const Icon = tab.icon;
              return (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id as any)}
                  className={`px-3 py-2 sm:px-4 sm:py-2.5 rounded-xl text-[11px] sm:text-xs font-display font-bold uppercase transition-all duration-200 flex items-center gap-1.5 ${
                    activeTab === tab.id
                      ? 'bg-[#008751] text-white shadow-sm'
                      : 'bg-white text-gray-700 hover:bg-gray-50 border border-gray-200'
                  }`}
                >
                  <Icon className="w-3.5 h-3.5" /> {tab.label}
                </button>
              );
            })}
          </div>

          <button
            onClick={loadAdminData}
            disabled={loading}
            className="p-2 bg-white border border-gray-200 rounded-xl text-gray-600 hover:text-[#008751] transition-colors text-xs flex items-center gap-1"
          >
            <RefreshCw className={`w-3.5 h-3.5 ${loading ? 'animate-spin' : ''}`} />
            <span className="hidden sm:inline font-bold">Rafraîchir</span>
          </button>
        </div>

        {/* TAB CONTENT: NEWS */}
        {activeTab === 'NEWS' && (
          <div className="bg-white rounded-2xl border border-gray-100 p-4 sm:p-6 space-y-4 shadow-sm">
            <div className="flex justify-between items-center pb-3 border-b border-gray-100">
              <h3 className="font-display text-sm sm:text-lg font-bold text-gray-900 uppercase">ARTICLES & DÉPÊCHES</h3>
              <button className="btn-green text-[11px] sm:text-xs py-2 px-3 flex items-center gap-1.5">
                <Plus className="w-4 h-4" /> CRÉER UN ARTICLE
              </button>
            </div>

            <div className="divide-y divide-gray-100 text-xs">
              {news.map((article) => (
                <div key={article.id} className="py-3 flex items-center justify-between gap-3">
                  <div className="flex items-center gap-3">
                    <img src={article.coverImage || article.cover?.url || '/actu baneer.jpg'} className="w-12 h-12 sm:w-14 sm:h-14 rounded-xl object-cover" />
                    <div>
                      <h4 className="font-bold text-gray-900 text-xs sm:text-sm font-display line-clamp-1">{article.title}</h4>
                      <p className="text-gray-500 mt-0.5 text-[11px]">Catégorie: {article.category || 'ACTUALITE'} • Publié par {article.author?.name || article.author || 'Admin'}</p>
                    </div>
                  </div>
                  <div className="flex gap-1.5 shrink-0">
                    <button className="p-2 text-gray-600 hover:text-[#008751] bg-gray-100 rounded-lg transition-colors">
                      <Edit className="w-3.5 h-3.5" />
                    </button>
                    <button className="p-2 text-rose-600 hover:bg-rose-50 rounded-lg transition-colors">
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* TAB CONTENT: PLAYERS */}
        {activeTab === 'PLAYERS' && (
          <div className="bg-white rounded-2xl border border-gray-100 p-4 sm:p-6 space-y-4 shadow-sm">
            <div className="flex justify-between items-center pb-3 border-b border-gray-100">
              <h3 className="font-display text-sm sm:text-lg font-bold text-gray-900 uppercase">GESTION DE L'EFFECTIF</h3>
              <button className="btn-green text-[11px] sm:text-xs py-2 px-3 flex items-center gap-1.5">
                <Plus className="w-4 h-4" /> AJOUTER UN JOUEUR
              </button>
            </div>

            <div className="divide-y divide-gray-100 text-xs">
              {players.map((player) => (
                <div key={player.id} className="py-3 flex items-center justify-between gap-3">
                  <div className="flex items-center gap-3">
                    <span className="font-display font-extrabold text-sm sm:text-base bg-[#008751] text-white px-2 py-0.5 rounded-lg">#{player.number}</span>
                    <div>
                      <h4 className="font-bold text-gray-900 text-xs sm:text-sm font-display">{player.firstName} {player.lastName}</h4>
                      <p className="text-gray-500 mt-0.5 text-[11px]">Poste: {player.position} • Buts: {player.goalsScored || 0}</p>
                    </div>
                  </div>
                  <div className="flex gap-1.5 shrink-0">
                    <button className="p-2 text-gray-600 hover:text-[#008751] bg-gray-100 rounded-lg transition-colors">
                      <Edit className="w-3.5 h-3.5" />
                    </button>
                    <button className="p-2 text-rose-600 hover:bg-rose-50 rounded-lg transition-colors">
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* TAB CONTENT: ACADEMY */}
        {activeTab === 'ACADEMY' && (
          <div className="bg-white rounded-2xl border border-gray-100 p-4 sm:p-6 space-y-4 shadow-sm">
            <div className="pb-3 border-b border-gray-100">
              <h3 className="font-display text-sm sm:text-lg font-bold text-gray-900 uppercase">INSCRIPTIONS REÇUES AUX DÉTECTIONS</h3>
              <p className="text-xs text-gray-500">Validation et gestion des convocations pour l'Académie.</p>
            </div>

            <div className="space-y-2.5 text-xs">
              {academySubmissions.length > 0 ? (
                academySubmissions.map((sub: any) => (
                  <div key={sub.id} className="p-3.5 bg-[#f7f8f7] rounded-xl border border-gray-200 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                    <div>
                      <h4 className="font-bold text-gray-900 text-xs sm:text-sm font-display">{sub.payload?.nomJoueur} {sub.payload?.prenomJoueur} ({sub.payload?.categorie || 'U15'})</h4>
                      <p className="text-gray-500 mt-0.5 text-[11px]">Tuteur: {sub.payload?.nomTuteur} • Tél: {sub.payload?.telephone} • Poste: {sub.payload?.poste}</p>
                    </div>
                    <button className="btn-green text-[11px] py-1.5 px-3 self-start sm:self-auto shrink-0">
                      APPROUVER & CONVOQUER
                    </button>
                  </div>
                ))
              ) : (
                <div className="space-y-2.5">
                  <div className="p-3.5 bg-[#f7f8f7] rounded-xl border border-gray-200 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                    <div>
                      <h4 className="font-bold text-gray-900 text-xs sm:text-sm font-display">Bello Moussa (U15)</h4>
                      <p className="text-gray-500 mt-0.5 text-[11px]">Tuteur: Oumarou Bello • WhatsApp: +237 699112233 • Poste: Attaquant</p>
                    </div>
                    <button className="btn-green text-[11px] py-1.5 px-3 self-start sm:self-auto shrink-0">
                      APPROUVER & CONVOQUER
                    </button>
                  </div>

                  <div className="p-3.5 bg-[#f7f8f7] rounded-xl border border-gray-200 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                    <div>
                      <h4 className="font-bold text-gray-900 text-xs sm:text-sm font-display">Abdoulaye Hassan (U17)</h4>
                      <p className="text-gray-500 mt-0.5 text-[11px]">Tuteur: Hassan Ali • WhatsApp: +237 677445566 • Poste: Milieu</p>
                    </div>
                    <button className="btn-green text-[11px] py-1.5 px-3 self-start sm:self-auto shrink-0">
                      APPROUVER & CONVOQUER
                    </button>
                  </div>
                </div>
              )}
            </div>
          </div>
        )}

        {/* TAB CONTENT: MATCHES */}
        {activeTab === 'MATCHES' && (
          <div className="bg-white rounded-2xl border border-gray-100 p-4 sm:p-6 space-y-4 shadow-sm">
            <div className="flex justify-between items-center pb-3 border-b border-gray-100">
              <h3 className="font-display text-sm sm:text-lg font-bold text-gray-900 uppercase">CALENDRIER & RÉSULTATS</h3>
              <button className="btn-green text-[11px] sm:text-xs py-2 px-3 flex items-center gap-1.5">
                <Plus className="w-4 h-4" /> PROGRAMMER UN MATCH
              </button>
            </div>

            <div className="divide-y divide-gray-100 text-xs">
              {matches.map((m) => (
                <div key={m.id} className="py-3 flex justify-between items-center gap-3">
                  <div>
                    <h4 className="font-bold text-gray-900 text-xs sm:text-sm font-display">{m.homeTeam} vs {m.awayTeam}</h4>
                    <p className="text-gray-500 mt-0.5 text-[11px]">{m.competition} • {m.stadium}</p>
                  </div>
                  <span className="badge-category badge-green text-[9px] shrink-0">{m.status}</span>
                </div>
              ))}
            </div>
          </div>
        )}

      </div>
    </div>
  );
}
