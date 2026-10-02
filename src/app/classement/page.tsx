'use client';

import React, { useState, useEffect } from 'react';
import Image from 'next/image';
import { SectionTag } from '@/components/ui/SectionTag';
import { Shield, Trophy, TrendingUp, Info } from 'lucide-react';

interface NFCStanding {
  teamName: string;
  rank: number;
  position?: number;
  played: number;
  won: number;
  drawn: number;
  lost: number;
  goalsFor: number;
  goalsAgainst: number;
  goalDifference: number;
  points: number;
  form: string;
}

const DEFAULT_NFC: NFCStanding = {
  teamName: 'Ngaoundéré FC',
  rank: 1,
  played: 13,
  won: 10,
  drawn: 1,
  lost: 2,
  goalsFor: 34,
  goalsAgainst: 12,
  goalDifference: 22,
  points: 31,
  form: 'V-V-N-V-V',
};

// Modèles d'accronymes ou longueurs de squelette pour simuler des noms d'équipes réalistes
const SKELETON_WIDTHS = ['w-36', 'w-44', 'w-32', 'w-40', 'w-28', 'w-36', 'w-48'];

export default function ClassementPage() {
  const [nfcData, setNfcData] = useState<NFCStanding>(DEFAULT_NFC);
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    async function fetchStandings() {
      try {
        const res = await fetch('/api/standings');
        if (res.ok) {
          const json = await res.json();
          if (json.nfc) {
            setNfcData({
              teamName: json.nfc.teamName || 'Ngaoundéré FC',
              rank: json.nfc.rank || json.nfc.position || 1,
              played: json.nfc.played || 0,
              won: json.nfc.won || 0,
              drawn: json.nfc.drawn || 0,
              lost: json.nfc.lost || 0,
              goalsFor: json.nfc.goalsFor || 0,
              goalsAgainst: json.nfc.goalsAgainst || 0,
              goalDifference: json.nfc.goalDifference || 0,
              points: json.nfc.points || 0,
              form: json.nfc.form || 'V-V-N-V-V',
            });
          } else if (Array.isArray(json) && json.length > 0) {
            const found = json.find((t: any) => t.teamName?.includes('Ngaoundéré'));
            if (found) {
              setNfcData({
                teamName: found.teamName,
                rank: found.rank || found.position || 1,
                played: found.played || 0,
                won: found.won || 0,
                drawn: found.drawn || 0,
                lost: found.lost || 0,
                goalsFor: found.goalsFor || 0,
                goalsAgainst: found.goalsAgainst || 0,
                goalDifference: found.goalDifference || 0,
                points: found.points || 0,
                form: found.form || 'V-V-N-V-V',
              });
            }
          }
        }
      } catch (error) {
        console.warn('Utilisation du fallback local pour les données de classement');
      } finally {
        setLoading(false);
      }
    }
    fetchStandings();
  }, []);

  const totalRows = 8;
  const nfcRank = nfcData.rank || 1;
  const rows = Array.from({ length: totalRows }, (_, i) => i + 1);

  return (
    <div className="bg-[color:var(--nfc-bg)] text-[color:var(--nfc-text)] font-sans space-y-6 sm:space-y-12 pb-16">
      <section className="max-w-7xl mx-auto px-3 sm:px-6 lg:px-8 space-y-4 sm:space-y-6">
        <SectionTag label="Classement général" />
        <div className="bg-white rounded-xl border border-gray-100 shadow-sm overflow-hidden">
          
          {/* Header section */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 p-4 sm:p-5 border-b border-gray-100">
            <div>
              <h2 className="font-display text-base sm:text-xl font-bold text-gray-900 flex items-center gap-2">
                <Trophy className="w-5 h-5 text-[#008751]" />
                TABLEAU GÉNÉRAL LIGUE RÉGIONALE
              </h2>
              <p className="text-xs text-gray-500 mt-0.5">
                Seules les statistiques officielles du <strong className="text-[#008751]">Ngaoundéré FC</strong> sont synchronisées en direct via l'API. Les 7 autres équipes affichent un chargement temporaire.
              </p>
            </div>
            <div className="flex items-center gap-3 text-[10px] sm:text-[11px] font-semibold shrink-0">
              <span className="flex items-center gap-1.5 text-[#008751]">
                <span className="w-2.5 h-2.5 rounded-full bg-[#008751] inline-block" /> NFC (Données en direct)
              </span>
              <span className="flex items-center gap-1.5 text-gray-400">
                <span className="w-2.5 h-2.5 rounded-full bg-gray-200 inline-block" /> En attente de la Ligue
              </span>
            </div>
          </div>

          {/* Table */}
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
                {rows.map((pos, idx) => {
                  const isNFC = pos === nfcRank;

                  if (isNFC) {
                    return (
                      <tr
                        key={`nfc-row-${pos}`}
                        className="bg-[#008751]/10 border-l-4 border-[#008751] font-semibold transition-colors duration-150"
                      >
                        <td className="py-3.5 px-3 text-center">
                          <span className="inline-flex items-center justify-center w-6 h-6 sm:w-7 sm:h-7 rounded-full text-xs font-bold font-display bg-[#008751] text-white shadow-sm">
                            {pos}
                          </span>
                        </td>

                        <td className="py-3.5 px-3">
                          <div className="flex items-center gap-2.5">
                            <div className="w-7 h-7 sm:w-8 sm:h-8 relative shrink-0">
                              <Image
                                src="/logo.png"
                                alt="Ngaoundéré FC Logo"
                                width={32}
                                height={32}
                                className="w-full h-full object-contain"
                              />
                            </div>
                            <span className="text-xs sm:text-sm font-display font-bold text-[#008751]">
                              {nfcData.teamName}
                            </span>
                          </div>
                        </td>

                        <td className="py-3.5 px-2 text-center font-mono text-gray-800 font-bold">{nfcData.played}</td>
                        <td className="py-3.5 px-2 text-center font-mono text-[#008751] font-extrabold">{nfcData.won}</td>
                        <td className="py-3.5 px-2 text-center font-mono text-gray-600">{nfcData.drawn}</td>
                        <td className="py-3.5 px-2 text-center font-mono text-rose-600">{nfcData.lost}</td>
                        <td className="py-3.5 px-2 text-center font-mono text-gray-800 hidden sm:table-cell">{nfcData.goalsFor}</td>
                        <td className="py-3.5 px-2 text-center font-mono text-gray-800 hidden sm:table-cell">{nfcData.goalsAgainst}</td>
                        <td className="py-3.5 px-2 text-center font-mono text-xs font-bold text-gray-700">
                          {nfcData.goalDifference > 0 ? `+${nfcData.goalDifference}` : nfcData.goalDifference}
                        </td>

                        <td className="py-3.5 px-3 text-center hidden md:table-cell">
                          <div className="flex items-center justify-center gap-1">
                            {nfcData.form?.split('-').map((res: string, i: number) => {
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

                        <td className="py-3.5 px-3 text-center text-sm sm:text-base font-extrabold font-display text-[#008751]">
                          {nfcData.points}
                        </td>
                      </tr>
                    );
                  }

                  // SKELETON ROW
                  const skeletonWidth = SKELETON_WIDTHS[idx % SKELETON_WIDTHS.length];

                  return (
                    <tr key={`skeleton-row-${pos}`} className="bg-gray-50/40 hover:bg-gray-100/30 transition-colors">
                      <td className="py-3 px-3 text-center">
                        <span className="inline-flex items-center justify-center w-6 h-6 rounded-full text-xs font-medium text-gray-400 bg-gray-100/80">
                          {pos}
                        </span>
                      </td>

                      <td className="py-3 px-3">
                        <div className="flex items-center gap-2.5">
                          <div className="w-7 h-7 sm:w-8 sm:h-8 rounded-full bg-gray-200 animate-pulse shrink-0" />
                          <div className={`h-3.5 ${skeletonWidth} bg-gray-200 rounded animate-pulse`} />
                        </div>
                      </td>

                      <td className="py-3 px-2 text-center">
                        <div className="h-3.5 w-5 mx-auto bg-gray-200 rounded animate-pulse" />
                      </td>
                      <td className="py-3 px-2 text-center">
                        <div className="h-3.5 w-5 mx-auto bg-gray-200 rounded animate-pulse" />
                      </td>
                      <td className="py-3 px-2 text-center">
                        <div className="h-3.5 w-5 mx-auto bg-gray-200 rounded animate-pulse" />
                      </td>
                      <td className="py-3 px-2 text-center">
                        <div className="h-3.5 w-5 mx-auto bg-gray-200 rounded animate-pulse" />
                      </td>
                      <td className="py-3 px-2 text-center hidden sm:table-cell">
                        <div className="h-3.5 w-6 mx-auto bg-gray-200 rounded animate-pulse" />
                      </td>
                      <td className="py-3 px-2 text-center hidden sm:table-cell">
                        <div className="h-3.5 w-6 mx-auto bg-gray-200 rounded animate-pulse" />
                      </td>
                      <td className="py-3 px-2 text-center">
                        <div className="h-3.5 w-7 mx-auto bg-gray-200 rounded animate-pulse" />
                      </td>

                      <td className="py-3 px-3 text-center hidden md:table-cell">
                        <div className="flex items-center justify-center gap-1">
                          <div className="w-4 h-4 rounded-full bg-gray-200 animate-pulse" />
                          <div className="w-4 h-4 rounded-full bg-gray-200 animate-pulse" />
                          <div className="w-4 h-4 rounded-full bg-gray-200 animate-pulse" />
                        </div>
                      </td>

                      <td className="py-3 px-3 text-center">
                        <div className="h-4 w-7 mx-auto bg-gray-200 rounded animate-pulse" />
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      </section>

      {/* Stats Highlights */}
      <section className="max-w-7xl mx-auto px-3 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4 sm:gap-6">
          <div className="bg-white rounded-xl border border-gray-100 p-4 sm:p-6 shadow-sm flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-[#008751]/10 text-[#008751] flex items-center justify-center shrink-0">
              <TrendingUp className="w-5 h-5" />
            </div>
            <div>
              <h4 className="font-display font-bold text-gray-900 text-xs sm:text-sm">MEILLEURE ATTAQUE</h4>
              <p className="text-[11px] text-gray-500 mt-0.5">{nfcData.goalsFor} buts inscrits en {nfcData.played} rencontres régionales.</p>
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
              <p className="text-[11px] text-gray-500 mt-0.5">Les 2 premiers se qualifient pour les barrages d'accession.</p>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
