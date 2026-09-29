"use client";

import React from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { PageHeader } from '@/components/ui/PageHeader';
import { SectionTag } from '@/components/ui/SectionTag';
import { PLAYERS_DATA } from '@/lib/mock-data';
import { Player } from '@/types';
import { Shield, Award, Users, X } from 'lucide-react';

export default function EffectifPage() {
  const gardiens = PLAYERS_DATA.filter((p) => p.position === 'GARDIEN');
  const defenseurs = PLAYERS_DATA.filter((p) => p.position === 'DEFENSEUR');
  const milieux = PLAYERS_DATA.filter((p) => p.position === 'MILIEU');
  const attaquants = PLAYERS_DATA.filter((p) => p.position === 'ATTAQUANT');

  return (
    <div className="bg-[color:var(--nfc-bg)] text-[color:var(--nfc-text)] font-sans space-y-12 pb-20">
      <PageHeader
        tag="ÉQUIPE PRO • SAISON 2025-2026"
        title="EFFECTIF"
        titleHighlight="PROFESSIONNEL"
        description="Retrouvez l'ensemble des joueurs sous contrat et l'encadrement technique du Ngaoundéré Football Club engagés en MTN Elite One."
        backgroundImageUrl="https://images.unsplash.com/photo-1574629810360-7efbbe195018?q=80&w=1600&auto=format&fit=crop"
        badgeContent={
          <div className="bg-[color:var(--nfc-dark)]/90 backdrop-blur-md p-6 rounded-2xl border border-white/10 text-center w-full lg:w-72 shadow-xl">
            <div className="relative w-14 h-14 rounded-full overflow-hidden ring-2 ring-[color:var(--nfc-green)] shadow-md mx-auto mb-2">
              <Image src="/logo.png" alt="NFC Crest" fill className="object-contain" />
            </div>
            <h3 className="font-display text-base font-bold text-[color:var(--nfc-white)]">MTN ELITE ONE</h3>
            <p className="text-xs text-gray-400">Effectif de Première Division</p>
          </div>
        }
      />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12">
        <SectionTag label="Effectif professionnel" className="mb-8" />
        
        <section className="bg-white rounded-2xl p-6 border border-gray-100 shadow-sm grid grid-cols-2 md:grid-cols-4 gap-4 text-center">
          <div>
            <span className="font-display text-2xl sm:text-3xl font-extrabold text-[color:var(--nfc-green)] block">24</span>
            <span className="text-[11px] text-gray-500 uppercase font-display font-bold">Joueurs Pros</span>
          </div>
          <div>
            <span className="font-display text-2xl sm:text-3xl font-extrabold text-gray-900 block">23,8</span>
            <span className="text-[11px] text-gray-500 uppercase font-display font-bold">Âge moyen</span>
          </div>
          <div>
            <span className="font-display text-2xl sm:text-3xl font-extrabold text-[color:var(--nfc-green)] block">12</span>
            <span className="text-[11px] text-gray-500 uppercase font-display font-bold">Formés au club</span>
          </div>
          <div>
            <span className="font-display text-2xl sm:text-3xl font-extrabold text-gray-900 block">1 840'</span>
            <span className="text-[11px] text-gray-500 uppercase font-display font-bold">Minutes jouées</span>
          </div>
        </section>

        <section className="space-y-6">
          <div className="border-b border-gray-200 pb-3">
            <span className="section-tag">ENCADREMENT SPORTIF</span>
            <h2 className="font-display text-2xl font-extrabold text-gray-900 uppercase">STAFF TECHNIQUE PROFESSIONNEL</h2>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            <div className="bg-white rounded-2xl border border-gray-100 p-5 flex items-center gap-4 shadow-sm hover:shadow-md transition-shadow">
              <div className="w-14 h-14 rounded-xl bg-[color:var(--nfc-green)] text-[color:var(--nfc-white)] font-display font-bold text-xl flex items-center justify-center shrink-0">SM</div>
              <div>
                <span className="badge-category badge-green text-[9px] mb-1">ENTRAÎNEUR CHEF</span>
                <h4 className="font-display font-bold text-gray-900 text-sm">Coach Simplice Mbarga</h4>
                <p className="text-[10px] text-gray-500">Licence A CAF • Au club depuis 2022</p>
              </div>
            </div>

            <div className="bg-white rounded-2xl border border-gray-100 p-5 flex items-center gap-4 shadow-sm hover:shadow-md transition-shadow">
              <div className="w-14 h-14 rounded-xl bg-[color:var(--nfc-dark)] text-[color:var(--nfc-white)] font-display font-bold text-xl flex items-center justify-center shrink-0">HA</div>
              <div>
                <span className="badge-category badge-green text-[9px] mb-1">ADJOINT</span>
                <h4 className="font-display font-bold text-gray-900 text-sm">Hamidou Aliou</h4>
                <p className="text-[10px] text-gray-500">Ancien Capitaine NFC</p>
              </div>
            </div>

            <div className="bg-white rounded-2xl border border-gray-100 p-5 flex items-center gap-4 shadow-sm hover:shadow-md transition-shadow">
              <div className="w-14 h-14 rounded-xl bg-gray-100 text-gray-800 font-display font-bold text-xl flex items-center justify-center shrink-0">BM</div>
              <div>
                <span className="badge-category badge-outline text-[9px] mb-1">MÉDECIN</span>
                <h4 className="font-display font-bold text-gray-900 text-sm">Dr. Bello Mohamadou</h4>
                <p className="text-[10px] text-gray-500">Médecine du Sport</p>
              </div>
            </div>

            <div className="bg-white rounded-2xl border border-gray-100 p-5 flex items-center gap-4 shadow-sm hover:shadow-md transition-shadow">
              <div className="w-14 h-14 rounded-xl bg-[color:var(--nfc-green)] text-[color:var(--nfc-white)] font-display font-bold text-xl flex items-center justify-center shrink-0">OK</div>
              <div>
                <span className="badge-category badge-green text-[9px] mb-1">PRÉPARATEUR</span>
                <h4 className="font-display font-bold text-gray-900 text-sm">Ousmanou Kobo</h4>
                <p className="text-[10px] text-gray-500">Prépa Athlétique</p>
              </div>
            </div>
          </div>
        </section>

        <section className="space-y-6">
          <div className="border-b border-gray-200 pb-3 flex items-center justify-between">
            <h2 className="font-display text-2xl font-extrabold text-gray-900 uppercase">GARDIENS DE BUT</h2>
            <span className="text-xs text-gray-500 font-mono">{gardiens.length} Joueurs</span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {gardiens.map((player) => (
              <Link key={player.id} href={`/player/${player.id}`} className="bg-white rounded-2xl border border-gray-100 overflow-hidden shadow-sm hover:shadow-lg hover:-translate-y-1 transition-all duration-300 cursor-pointer group block">
                <div className="relative h-64 w-full bg-gray-100 overflow-hidden">
                  <img src={player.photoUrl} alt={player.lastName} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300" />
                  <div className="absolute top-3 left-3">
                    <span className="bg-[color:var(--nfc-green)] text-[color:var(--nfc-white)] font-display font-extrabold text-base px-3 py-1 rounded-lg shadow-md">#{player.number}</span>
                  </div>
                </div>
                <div className="p-5 space-y-3">
                  <h3 className="font-display text-lg font-bold text-gray-900 group-hover:text-[color:var(--nfc-green)] transition-colors">{player.firstName} <span className="uppercase">{player.lastName}</span></h3>
                  <p className="text-xs text-gray-500">{player.nationality} • Formé au club</p>
                  <div className="pt-3 border-t border-gray-100 grid grid-cols-3 text-center text-xs">
                    <div>
                      <span className="text-gray-400 text-[10px] block font-mono uppercase">MATCHS</span>
                      <span className="font-bold font-display text-gray-900">{player.matchesPlayed}</span>
                    </div>
                    <div>
                      <span className="text-gray-400 text-[10px] block font-mono uppercase">CLEAN</span>
                      <span className="font-bold font-display text-[color:var(--nfc-green)]">8</span>
                    </div>
                    <div>
                      <span className="text-gray-400 text-[10px] block font-mono uppercase">ARRÊTS</span>
                      <span className="font-bold font-display text-gray-900">42</span>
                    </div>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        </section>

        <section className="space-y-6">
          <div className="border-b border-gray-200 pb-3 flex items-center justify-between">
            <h2 className="font-display text-2xl font-extrabold text-gray-900 uppercase">DÉFENSEURS & MILIEUX</h2>
            <span className="text-xs text-gray-500 font-mono">{[...defenseurs, ...milieux, ...attaquants].length} Joueurs</span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {[...defenseurs, ...milieux, ...attaquants].map((player) => (
              <Link key={player.id} href={`/player/${player.id}`} className="bg-white rounded-2xl border border-gray-100 overflow-hidden shadow-sm hover:shadow-lg hover:-translate-y-1 transition-all duration-300 cursor-pointer group block">
                <div className="relative h-60 w-full bg-gray-100 overflow-hidden">
                  <img src={player.photoUrl} alt={player.lastName} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300" />
                  <div className="absolute top-3 left-3">
                    <span className="bg-[color:var(--nfc-green)] text-[color:var(--nfc-white)] font-display font-extrabold text-base px-2.5 py-1 rounded-lg shadow-md">#{player.number}</span>
                  </div>
                  {player.isCaptain && (
                    <div className="absolute top-3 right-3">
                      <span className="badge-category badge-green text-[9px]">CAPITAINE</span>
                    </div>
                  )}
                </div>
                <div className="p-4 space-y-2">
                  <h3 className="font-display text-base font-bold text-gray-900 group-hover:text-[color:var(--nfc-green)] transition-colors">{player.firstName} <span className="uppercase">{player.lastName}</span></h3>
                  <p className="text-xs text-gray-500">{player.nationality} • {player.position}</p>
                  <div className="pt-2 border-t border-gray-100 grid grid-cols-3 text-center text-xs">
                    <div>
                      <span className="text-gray-400 text-[10px] block font-mono">MATCHS</span>
                      <span className="font-bold font-display text-gray-900">{player.matchesPlayed}</span>
                    </div>
                    <div>
                      <span className="text-gray-400 text-[10px] block font-mono">BUTS</span>
                      <span className="font-bold font-display text-[color:var(--nfc-green)]">{player.goalsScored}</span>
                    </div>
                    <div>
                      <span className="text-gray-400 text-[10px] block font-mono">PASSES</span>
                      <span className="font-bold font-display text-[color:var(--nfc-green)]">{player.assists}</span>
                    </div>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        </section>
      </div>
    </div>
  );
}
