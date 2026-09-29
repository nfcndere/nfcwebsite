'use client';

import React, { useState } from 'react';
import Image from 'next/image';
import { PageHeader } from '@/components/ui/PageHeader';
import { Newspaper, Users, Calendar, GraduationCap, Plus, Trash2, Edit } from 'lucide-react';
import { NEWS_DATA, PLAYERS_DATA, MATCHES_DATA } from '@/lib/mock-data';

export default function AdminPage() {
  const [activeTab, setActiveTab] = useState<'NEWS' | 'PLAYERS' | 'ACADEMY' | 'MATCHES'>('NEWS');

  return (
    <div className="bg-[#f7f8f7] text-[#1f2937] font-sans min-h-screen pb-20 space-y-8">

      {/* PAGE HERO HEADER WITH BACKGROUND IMAGE */}
      <PageHeader
        tag="PORTAIL D'ADMINISTRATION NFC"
        title="PANNEAU DE"
        titleHighlight="GESTION DU CLUB"
        description="Gestion globale des contenus, dépêches d'actualités, effectif professionnel, candidatures de l'Académie et calendrier."
        backgroundImageUrl="https://images.unsplash.com/photo-1508098682722-e99c43a406b2?q=80&w=1600&auto=format&fit=crop"
        badgeContent={
          <div className="bg-[#0c130e]/90 backdrop-blur-md p-6 rounded-2xl border border-white/10 text-center w-full lg:w-72 shadow-xl">
            <span className="badge-category badge-green text-[9px] mb-2 inline-block">SESSION CONNECTÉE</span>
            <h3 className="font-display text-base font-bold text-white">ADMINISTRATEUR</h3>
            <p className="text-xs text-gray-400 mt-1">Clerk Auth Guard • Actif</p>
          </div>
        }
      />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">

        {/* NAVIGATION TABS */}
        <div className="flex flex-wrap gap-2 border-b border-gray-200 pb-4">
          {[
            { id: 'NEWS', label: `Actualités (${NEWS_DATA.length})`, icon: Newspaper },
            { id: 'PLAYERS', label: `Effectif (${PLAYERS_DATA.length})`, icon: Users },
            { id: 'ACADEMY', label: `Candidatures Académie (14)`, icon: GraduationCap },
            { id: 'MATCHES', label: `Matchs (${MATCHES_DATA.length})`, icon: Calendar },
          ].map((tab) => {
            const Icon = tab.icon;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id as any)}
                className={`px-4 py-2.5 rounded-xl text-xs font-display font-bold uppercase transition-all duration-200 flex items-center gap-2 ${
                  activeTab === tab.id
                    ? 'bg-[#008751] text-white shadow-sm'
                    : 'bg-white text-gray-700 hover:bg-gray-50 border border-gray-200'
                }`}
              >
                <Icon className="w-4 h-4" /> {tab.label}
              </button>
            );
          })}
        </div>

        {/* TAB CONTENT: NEWS */}
        {activeTab === 'NEWS' && (
          <div className="bg-white rounded-2xl border border-gray-100 p-6 space-y-4 shadow-sm">
            <div className="flex justify-between items-center pb-4 border-b border-gray-100">
              <h3 className="font-display text-lg font-bold text-gray-900 uppercase">ARTICLES & DÉPÊCHES PUBLIÉES</h3>
              <button className="btn-green text-xs flex items-center gap-1.5">
                <Plus className="w-4 h-4" /> CRÉER UN ARTICLE
              </button>
            </div>

            <div className="divide-y divide-gray-100 text-xs">
              {NEWS_DATA.map((article) => (
                <div key={article.id} className="py-4 flex items-center justify-between gap-4">
                  <div className="flex items-center gap-4">
                    <img src={article.coverImage} className="w-14 h-14 rounded-xl object-cover" />
                    <div>
                      <h4 className="font-bold text-gray-900 text-sm font-display">{article.title}</h4>
                      <p className="text-gray-500 mt-0.5">Catégorie: {article.category} • Publié par {article.author}</p>
                    </div>
                  </div>
                  <div className="flex gap-2">
                    <button className="p-2 text-gray-600 hover:text-[#008751] bg-gray-100 rounded-lg transition-colors">
                      <Edit className="w-4 h-4" />
                    </button>
                    <button className="p-2 text-rose-600 hover:bg-rose-50 rounded-lg transition-colors">
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* TAB CONTENT: PLAYERS */}
        {activeTab === 'PLAYERS' && (
          <div className="bg-white rounded-2xl border border-gray-100 p-6 space-y-4 shadow-sm">
            <div className="flex justify-between items-center pb-4 border-b border-gray-100">
              <h3 className="font-display text-lg font-bold text-gray-900 uppercase">GESTION DES JOUEURS PROS</h3>
              <button className="btn-green text-xs flex items-center gap-1.5">
                <Plus className="w-4 h-4" /> AJOUTER UN JOUEUR
              </button>
            </div>

            <div className="divide-y divide-gray-100 text-xs">
              {PLAYERS_DATA.map((player) => (
                <div key={player.id} className="py-4 flex items-center justify-between gap-4">
                  <div className="flex items-center gap-4">
                    <span className="font-display font-extrabold text-base bg-[#008751] text-white px-2.5 py-1 rounded-lg">#{player.number}</span>
                    <div>
                      <h4 className="font-bold text-gray-900 text-sm font-display">{player.firstName} {player.lastName}</h4>
                      <p className="text-gray-500 mt-0.5">Poste: {player.position} • Buts: {player.goalsScored}</p>
                    </div>
                  </div>
                  <div className="flex gap-2">
                    <button className="p-2 text-gray-600 hover:text-[#008751] bg-gray-100 rounded-lg transition-colors">
                      <Edit className="w-4 h-4" />
                    </button>
                    <button className="p-2 text-rose-600 hover:bg-rose-50 rounded-lg transition-colors">
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* TAB CONTENT: ACADEMY */}
        {activeTab === 'ACADEMY' && (
          <div className="bg-white rounded-2xl border border-gray-100 p-6 space-y-4 shadow-sm">
            <div className="pb-4 border-b border-gray-100">
              <h3 className="font-display text-lg font-bold text-gray-900 uppercase">INSCRIPTIONS REÇUES AUX DÉTECTIONS</h3>
              <p className="text-xs text-gray-500">Validation et génération des convocations pour l'Académie.</p>
            </div>

            <div className="space-y-3 text-xs">
              <div className="p-4 bg-[#f7f8f7] rounded-xl border border-gray-200/60 flex justify-between items-center">
                <div>
                  <h4 className="font-bold text-gray-900 text-sm font-display">Bello Moussa (U15)</h4>
                  <p className="text-gray-500 mt-0.5">Parent: Oumarou Bello • WhatsApp: +237 699112233 • Poste: Attaquant</p>
                </div>
                <button className="btn-green text-xs py-2 px-4">
                  APPROUVER & CONVOQUER
                </button>
              </div>

              <div className="p-4 bg-[#f7f8f7] rounded-xl border border-gray-200/60 flex justify-between items-center">
                <div>
                  <h4 className="font-bold text-gray-900 text-sm font-display">Abdoulaye Hassan (U17)</h4>
                  <p className="text-gray-500 mt-0.5">Parent: Hassan Ali • WhatsApp: +237 677445566 • Poste: Milieu</p>
                </div>
                <button className="btn-green text-xs py-2 px-4">
                  APPROUVER & CONVOQUER
                </button>
              </div>
            </div>
          </div>
        )}

        {/* TAB CONTENT: MATCHES */}
        {activeTab === 'MATCHES' && (
          <div className="bg-white rounded-2xl border border-gray-100 p-6 space-y-4 shadow-sm">
            <div className="flex justify-between items-center pb-4 border-b border-gray-100">
              <h3 className="font-display text-lg font-bold text-gray-900 uppercase">CALENDRIER & RÉSULTATS</h3>
              <button className="btn-green text-xs flex items-center gap-1.5">
                <Plus className="w-4 h-4" /> PROGRAMMER UN MATCH
              </button>
            </div>

            <div className="divide-y divide-gray-100 text-xs">
              {MATCHES_DATA.map((m) => (
                <div key={m.id} className="py-4 flex justify-between items-center">
                  <div>
                    <h4 className="font-bold text-gray-900 text-sm font-display">{m.homeTeam} vs {m.awayTeam}</h4>
                    <p className="text-gray-500 mt-0.5">{m.competition} • {m.stadium}</p>
                  </div>
                  <span className="badge-category badge-green">{m.status}</span>
                </div>
              ))}
            </div>
          </div>
        )}

      </div>
    </div>
  );
}
