'use client';

import React from 'react';
import Link from 'next/link';
import { PageHeader } from '@/components/ui/PageHeader';
import { SectionTag } from '@/components/ui/SectionTag';
import { STANDINGS_DATA } from '@/lib/mock-data';
import { Shield, Trophy, TrendingUp, Info } from 'lucide-react';
import Image from 'next/image';

export default function ClassementPage() {
  const nfcStanding = STANDINGS_DATA.find((team) => team.teamName.includes('Ngaoundéré')) ?? STANDINGS_DATA[0];

  return (
    <div className="bg-[color:var(--nfc-bg)] text-[color:var(--nfc-text)] font-sans space-y-12 pb-20">

      {/* PAGE HERO HEADER WITH BACKGROUND IMAGE */}
      <PageHeader
        tag="LIGUE RÉGIONALE DE L'ADAMAOUA — SAISON 2025-2026"
        title="CLASSEMENT"
        titleHighlight="OFFICIEL"
        description="Suivez la position du Ngaoundéré Football Club au sein du championnat de la Ligue Régionale de l'Adamaoua."
        backgroundImageUrl="https://images.unsplash.com/photo-1517466787929-bc90951d0974?q=80&w=1600&auto=format&fit=crop"
        
        badgeContent={
          <div className="bg-[color:var(--nfc-dark)]/90 backdrop-blur-md p-6 rounded-2xl border border-white/10 text-center w-full lg:w-72 shadow-xl">
            <div className="relative w-14 h-14 rounded-full overflow-hidden ring-2 ring-[color:var(--nfc-green)] shadow-md mx-auto mb-2">
              <Image src="/logo.png" alt="NFC Crest" fill className="object-contain" />
            </div>
            <span className="badge-category badge-green text-[9px] mb-2 inline-block font-bold">
              {nfcStanding.position}{nfcStanding.position === 1 ? 'ÈRE' : 'ÈME'} POSITION
            </span>
            <h3 className="font-display text-2xl font-extrabold text-white">{nfcStanding.points} PTS</h3>
            <p className="text-xs text-gray-400 mt-1">Différence de buts : {nfcStanding.goalDifference > 0 ? `+${nfcStanding.goalDifference}` : nfcStanding.goalDifference}</p>
          </div>
        }
      />

      {/* STANDINGS TABLE */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <SectionTag label="Classement général" className="mb-8" />
        <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">

          {/* Table header row */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 px-6 py-5 border-b border-gray-100">
            <div>
                <h2 className="font-display text-xl font-bold text-gray-900 flex items-center gap-2">
                <Trophy className="w-5 h-5 text-[color:var(--nfc-green)]" />
                TABLEAU GÉNÉRAL — JOURNÉE 21
              </h2>
              <p className="text-xs text-gray-500 mt-0.5">Mise à jour automatique après chaque rencontre officielle.</p>
            </div>
              <div className="flex items-center gap-4 text-[11px] font-semibold">
              <span className="flex items-center gap-1.5 text-[color:var(--nfc-green)]">
                <span className="w-2.5 h-2.5 rounded-full bg-[color:var(--nfc-green)] inline-block" /> Accession playoffs
              </span>
              <span className="flex items-center gap-1.5 text-gray-500">
                <span className="w-2.5 h-2.5 rounded-full bg-gray-300 inline-block" /> Maintien
              </span>
            </div>
          </div>

          {/* Responsive Table */}
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead>
                <tr className="bg-[#f7f8f7] border-b border-gray-100 text-[11px] text-gray-500 uppercase font-display font-bold">
                  <th className="py-3.5 px-4 text-center">Pos</th>
                  <th className="py-3.5 px-4">Équipe</th>
                  <th className="py-3.5 px-3 text-center">J</th>
                  <th className="py-3.5 px-3 text-center">G</th>
                  <th className="py-3.5 px-3 text-center">N</th>
                  <th className="py-3.5 px-3 text-center">P</th>
                  <th className="py-3.5 px-3 text-center">BP</th>
                  <th className="py-3.5 px-3 text-center">BC</th>
                  <th className="py-3.5 px-3 text-center">Diff</th>
                  <th className="py-3.5 px-4 text-center">Forme</th>
                  <th className="py-3.5 px-4 text-center font-extrabold text-gray-900">Pts</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-50">
                {STANDINGS_DATA.map((item) => {
                  const isNFC = item.teamName.includes('Ngaoundéré');
                  const isTop2 = item.position <= 2;

                  return (
                    <tr
                      key={item.teamName}
                      className={`transition-colors duration-150 ${
                        isNFC
                          ? 'bg-[color:var(--nfc-green)]/10 border-l-4 border-[color:var(--nfc-green)]'
                          : 'hover:bg-[#f7f8f7]'
                      }`}
                    >
                      {/* Position */}
                      <td className="py-4 px-4 text-center">
                        <span className={`inline-flex items-center justify-center w-7 h-7 rounded-full text-xs font-bold font-display ${
                          isTop2
                            ? 'bg-[color:var(--nfc-green)] text-[color:var(--nfc-white)]'
                            : 'bg-gray-100 text-gray-600'
                        }`}>
                          {item.position}
                        </span>
                      </td>

                      {/* Team Name */}
                      <td className="py-4 px-4">
                        <div className="flex items-center gap-3">
                          <div className={`w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold shrink-0 ${
                            isNFC ? 'bg-[color:var(--nfc-green)] text-[color:var(--nfc-white)]' : 'bg-gray-100 text-gray-500'
                          }`}>
                            {isNFC ? <Shield className="w-4 h-4" /> : <Trophy className="w-3.5 h-3.5" />}
                          </div>
                          <span className={`text-sm font-display font-bold ${isNFC ? 'text-[color:var(--nfc-green)]' : 'text-gray-800'}`}>
                            {item.teamName}
                          </span>
                        </div>
                      </td>

                      {/* Stats */}
                      <td className="py-4 px-3 text-center font-mono text-gray-700">{item.played}</td>
                      <td className="py-4 px-3 text-center font-mono text-[color:var(--nfc-green)] font-semibold">{item.won}</td>
                      <td className="py-4 px-3 text-center font-mono text-gray-500">{item.drawn}</td>
                      <td className="py-4 px-3 text-center font-mono text-rose-500">{item.lost}</td>
                      <td className="py-4 px-3 text-center font-mono text-gray-700">{item.goalsFor}</td>
                      <td className="py-4 px-3 text-center font-mono text-gray-700">{item.goalsAgainst}</td>
                      <td className="py-4 px-3 text-center font-mono text-xs font-semibold text-gray-600">
                        {item.goalDifference > 0 ? `+${item.goalDifference}` : item.goalDifference}
                      </td>

                      {/* Form Pills */}
                      <td className="py-4 px-4 text-center">
                        <div className="flex items-center justify-center gap-1">
                          {item.form?.split('-').map((res, i) => {
                            const colors =
                              res === 'V' ? 'bg-[color:var(--nfc-green)] text-[color:var(--nfc-white)]' :
                              res === 'N' ? 'bg-[color:var(--nfc-yellow)] text-[color:var(--nfc-white)]' :
                              'bg-rose-500 text-white';
                            return (
                              <span key={i} className={`w-5 h-5 rounded-full flex items-center justify-center text-[9px] font-bold ${colors}`}>
                                {res}
                              </span>
                            );
                          })}
                        </div>
                      </td>

                      {/* Points */}
                      <td className={`py-4 px-4 text-center text-base font-extrabold font-display ${
                        isNFC ? 'text-[color:var(--nfc-green)]' : 'text-gray-900'
                      }`}>
                        {item.points}
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      </section>

      {/* STAT HIGHLIGHT CARDS */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">

          <div className="bg-white rounded-2xl border border-gray-100 p-6 shadow-sm flex items-center gap-4 transition-all duration-300 hover:shadow-md hover:-translate-y-1">
            <div className="w-12 h-12 rounded-xl bg-[#008751]/10 text-[#008751] flex items-center justify-center shrink-0">
              <TrendingUp className="w-6 h-6" />
            </div>
            <div>
              <h4 className="font-display font-bold text-gray-900 text-sm">2ÈME ATTAQUE DU CHAMPIONNAT</h4>
              <p className="text-xs text-gray-500 mt-1">34 buts inscrits en 13 rencontres de Ligue Régionale de l'Adamaoua.</p>
            </div>
          </div>

          <div className="bg-white rounded-2xl border border-gray-100 p-6 shadow-sm flex items-center gap-4 transition-all duration-300 hover:shadow-md hover:-translate-y-1">
            <div className="w-12 h-12 rounded-xl bg-[#008751]/10 text-[#008751] flex items-center justify-center shrink-0">
              <Trophy className="w-6 h-6" />
            </div>
            <div>
              <h4 className="font-display font-bold text-gray-900 text-sm">INVAINCU À DOMICILE</h4>
              <p className="text-xs text-gray-500 mt-1">10 victoires et 1 nul au Stade Municipal de Ngaoundéré.</p>
            </div>
          </div>

          <div className="bg-white rounded-2xl border border-gray-100 p-6 shadow-sm flex items-center gap-4 transition-all duration-300 hover:shadow-md hover:-translate-y-1">
            <div className="w-12 h-12 rounded-xl bg-gray-100 text-gray-500 flex items-center justify-center shrink-0">
              <Info className="w-6 h-6 text-[#008751]" />
            </div>
            <div>
              <h4 className="font-display font-bold text-gray-900 text-sm">PLAYOFFS D'ACCESSION</h4>
              <p className="text-xs text-gray-500 mt-1">Les 4 premiers se qualifient pour la phase finale du titre.</p>
            </div>
          </div>

        </div>
      </section>

    </div>
  );
}
