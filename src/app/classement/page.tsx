'use client';

import React, { useState, useEffect } from 'react';
import { PageHeader } from '@/components/ui/PageHeader';
import { SectionTag } from '@/components/ui/SectionTag';
import { STANDINGS_DATA } from '@/lib/mock-data';
import { Shield, Trophy, TrendingUp, Info } from 'lucide-react';
import Image from 'next/image';

export default function ClassementPage() {
  const [standings, setStandings] = useState<any[]>(STANDINGS_DATA);

  useEffect(() => {
    async function fetchStandings() {
      try {
        const res = await fetch('/api/standings');
        if (res.ok) {
          const data = await res.json();
          if (Array.isArray(data) && data.length > 0) {
            const formatted = data.map((item: any, idx: number) => ({
              teamName: item.teamName,
              position: item.rank || idx + 1,
              points: item.points || 0,
              played: item.played || 0,
              won: item.won || 0,
              drawn: item.drawn || 0,
              lost: item.lost || 0,
              goalsFor: item.goalsFor || 0,
              goalsAgainst: item.goalsAgainst || 0,
              goalDifference: item.goalDifference || 0,
              form: item.form || 'V-V-N-V-V',
            }));
            setStandings(formatted);
          }
        }
      } catch (error) {
        console.warn('Utilisation du fallback local pour le classement');
      }
    }
    fetchStandings();
  }, []);

  const nfcStanding = standings.find((team) => team.teamName.includes('Ngaoundéré')) ?? standings[0];

  return (
    <div className="bg-[color:var(--nfc-bg)] text-[color:var(--nfc-text)] font-sans space-y-6 sm:space-y-12 pb-16">

      <PageHeader
        tag="LIGUE RÉGIONALE DE L'ADAMAOUA — SAISON 2025-2026"
        title="CLASSEMENT"
        titleHighlight="OFFICIEL"
        description="Suivez la position du Ngaoundéré Football Club au sein du championnat de la Ligue Régionale de l'Adamaoua."
        backgroundImageUrl="https://images.unsplash.com/photo-1517466787929-bc90951d0974?q=80&w=1600&auto=format&fit=crop"
        badgeContent={
          <div className="bg-[#0c130e]/90 backdrop-blur-md p-4 sm:p-6 rounded-2xl border border-white/10 text-center w-full lg:w-72 shadow-xl">
            <div className="relative w-12 h-12 sm:w-14 sm:h-14 rounded-full overflow-hidden ring-2 ring-[#008751] shadow-md mx-auto mb-2">
              <Image src="/logo.png" alt="NFC Crest" fill className="object-contain" />
            </div>
            <span className="badge-category badge-green text-[9px] mb-2 inline-block font-bold">
              {nfcStanding.position}{nfcStanding.position === 1 ? 'ÈRE' : 'ÈME'} POSITION
            </span>
            <h3 className="font-display text-xl sm:text-2xl font-extrabold text-white">{nfcStanding.points} PTS</h3>
            <p className="text-xs text-gray-400 mt-1">Différence de buts : {nfcStanding.goalDifference > 0 ? `+${nfcStanding.goalDifference}` : nfcStanding.goalDifference}</p>
          </div>
        }
      />

      <section className="max-w-7xl mx-auto px-3 sm:px-6 lg:px-8 space-y-4 sm:space-y-6">
        <SectionTag label="Classement général" />
        <div className="bg-white rounded-xl border border-gray-100 shadow-sm overflow-hidden">

          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 p-4 sm:p-5 border-b border-gray-100">
            <div>
              <h2 className="font-display text-base sm:text-xl font-bold text-gray-900 flex items-center gap-2">
                <Trophy className="w-5 h-5 text-[#008751]" />
                TABLEAU GÉNÉRAL LIGUE RÉGIONALE
              </h2>
              <p className="text-xs text-gray-500 mt-0.5">Mise à jour automatique après chaque rencontre officielle.</p>
            </div>
            <div className="flex items-center gap-3 text-[10px] sm:text-[11px] font-semibold">
              <span className="flex items-center gap-1.5 text-[#008751]">
                <span className="w-2.5 h-2.5 rounded-full bg-[#008751] inline-block" /> Accession playoffs
              </span>
              <span className="flex items-center gap-1.5 text-gray-500">
                <span className="w-2.5 h-2.5 rounded-full bg-gray-300 inline-block" /> Maintien
              </span>
            </div>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead>
                <tr className="bg-[#f7f8f7] border-b border-gray-100 text-[10px] sm:text-[11px] text-gray-500 uppercase font-display font-bold">
                  <th className="py-3 px-3 text-center">Pos</th>
                  <th className="py-3 px-3">Équipe</th>
                  <th className="py-3 px-2 text-center">J</th>
                  <th className="py-3 px-2 text-center">G</th>
                  <th className="py-3 px-2 text-center">N</th>
                  <th className="py-3 px-2 text-center">P</th>
                  <th className="py-3 px-2 text-center hidden sm:table-cell">BP</th>
                  <th className="py-3 px-2 text-center hidden sm:table-cell">BC</th>
                  <th className="py-3 px-2 text-center">Diff</th>
                  <th className="py-3 px-3 text-center hidden md:table-cell">Forme</th>
                  <th className="py-3 px-3 text-center font-extrabold text-gray-900">Pts</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-50">
                {standings.map((item) => {
                  const isNFC = item.teamName.includes('Ngaoundéré FC');
                  const isTop2 = item.position <= 2;

                  return (
                    <tr
                      key={item.teamName}
                      className={`transition-colors duration-150 ${
                        isNFC
                          ? 'bg-[#008751]/10 border-l-4 border-[#008751]'
                          : 'hover:bg-[#f7f8f7]'
                      }`}
                    >
                      <td className="py-3 px-3 text-center">
                        <span className={`inline-flex items-center justify-center w-6 h-6 sm:w-7 sm:h-7 rounded-full text-xs font-bold font-display ${
                          isTop2
                            ? 'bg-[#008751] text-white'
                            : 'bg-gray-100 text-gray-600'
                        }`}>
                          {item.position}
                        </span>
                      </td>

                      <td className="py-3 px-3">
                        <div className="flex items-center gap-2.5">
                          <div className={`w-7 h-7 sm:w-8 sm:h-8 rounded-full flex items-center justify-center text-xs font-bold shrink-0 ${
                            isNFC ? 'bg-[#008751] text-white' : 'bg-gray-100 text-gray-500'
                          }`}>
                            {isNFC ? <Shield className="w-4 h-4" /> : <Trophy className="w-3.5 h-3.5" />}
                          </div>
                          <span className={`text-xs sm:text-sm font-display font-bold ${isNFC ? 'text-[#008751]' : 'text-gray-800'}`}>
                            {item.teamName}
                          </span>
                        </div>
                      </td>

                      <td className="py-3 px-2 text-center font-mono text-gray-700">{item.played}</td>
                      <td className="py-3 px-2 text-center font-mono text-[#008751] font-semibold">{item.won}</td>
                      <td className="py-3 px-2 text-center font-mono text-gray-500">{item.drawn}</td>
                      <td className="py-3 px-2 text-center font-mono text-rose-500">{item.lost}</td>
                      <td className="py-3 px-2 text-center font-mono text-gray-700 hidden sm:table-cell">{item.goalsFor}</td>
                      <td className="py-3 px-2 text-center font-mono text-gray-700 hidden sm:table-cell">{item.goalsAgainst}</td>
                      <td className="py-3 px-2 text-center font-mono text-xs font-semibold text-gray-600">
                        {item.goalDifference > 0 ? `+${item.goalDifference}` : item.goalDifference}
                      </td>

                      <td className="py-3 px-3 text-center hidden md:table-cell">
                        <div className="flex items-center justify-center gap-1">
                          {item.form?.split('-').map((res: string, i: number) => {
                            const colors =
                              res === 'V' ? 'bg-[#008751] text-white' :
                              res === 'N' ? 'bg-[color:var(--nfc-yellow)] text-white' :
                              'bg-rose-500 text-white';
                            return (
                              <span key={i} className={`w-5 h-5 rounded-full flex items-center justify-center text-[9px] font-bold ${colors}`}>
                                {res}
                              </span>
                            );
                          })}
                        </div>
                      </td>

                      <td className={`py-3 px-3 text-center text-sm sm:text-base font-extrabold font-display ${
                        isNFC ? 'text-[#008751]' : 'text-gray-900'
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

      <section className="max-w-7xl mx-auto px-3 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4 sm:gap-6">
          <div className="bg-white rounded-xl border border-gray-100 p-4 sm:p-6 shadow-sm flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-[#008751]/10 text-[#008751] flex items-center justify-center shrink-0">
              <TrendingUp className="w-5 h-5" />
            </div>
            <div>
              <h4 className="font-display font-bold text-gray-900 text-xs sm:text-sm">MEILLEURE ATTAQUE</h4>
              <p className="text-[11px] text-gray-500 mt-0.5">24 buts inscrits en 12 rencontres régionales.</p>
            </div>
          </div>

          <div className="bg-white rounded-xl border border-gray-100 p-4 sm:p-6 shadow-sm flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-[#008751]/10 text-[#008751] flex items-center justify-center shrink-0">
              <Trophy className="w-5 h-5" />
            </div>
            <div>
              <h4 className="font-display font-bold text-gray-900 text-xs sm:text-sm">INVAINCU À DOMICILE</h4>
              <p className="text-[11px] text-gray-500 mt-0.5">Solide au Stade Municipal de Ngaoundéré.</p>
            </div>
          </div>

          <div className="bg-white rounded-xl border border-gray-100 p-4 sm:p-6 shadow-sm flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-gray-100 text-gray-500 flex items-center justify-center shrink-0">
              <Info className="w-5 h-5 text-[#008751]" />
            </div>
            <div>
              <h4 className="font-display font-bold text-gray-900 text-xs sm:text-sm">PLAYOFFS D'ACCESSION</h4>
              <p className="text-[11px] text-gray-500 mt-0.5">Les 2 premiers se qualifient pour les barrages.</p>
            </div>
          </div>
        </div>
      </section>

    </div>
  );
}
