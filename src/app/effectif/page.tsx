"use client";

import React from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { PageHeader } from '@/components/ui/PageHeader';
import { SectionTag } from '@/components/ui/SectionTag';
import { PLAYERS_DATA, STAFF_DATA } from '@/lib/mock-data';
import { Player, StaffMember } from '@/types';
import { UserCheck, Dumbbell, Stethoscope, Video, ChevronRight } from 'lucide-react';

// ===================================
// Carte Joueur (carte verticale avec photo)
// ===================================
function PlayerCard({ player }: { player: Player }) {
  // Stats selon la position
  const stats =
    player.position === 'GARDIEN'
      ? [
          { label: 'Matchs', value: player.matchesPlayed },
          { label: 'Clean', value: 8 },
          { label: 'Arrêts', value: 42 },
        ]
      : [
          { label: 'Matchs', value: player.matchesPlayed },
          { label: 'Buts', value: player.goalsScored },
          { label: 'Passes', value: player.assists },
        ];

  return (
    <Link
      href={`/player/${player.id}`}
      className="bg-white border border-gray-100 overflow-hidden shadow-sm hover:shadow-lg hover:-translate-y-1 transition-all duration-300 cursor-pointer group block"
    >
      <div className="relative h-60 w-full bg-gray-100 overflow-hidden">
        <img
          src={player.photoUrl}
          alt={`${player.firstName} ${player.lastName}`}
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
        />
        {/* Numéro */}
        <div className="absolute top-3 left-3">
          <span className="bg-[color:var(--nfc-green)] text-[color:var(--nfc-white)] font-display font-extrabold text-base px-2.5 py-1 shadow-md">
            #{player.number}
          </span>
        </div>
        {/* Badge capitaine */}
        {player.isCaptain && (
          <div className="absolute top-3 right-3">
            <span className="badge-category badge-green text-[9px]">CAPITAINE</span>
          </div>
        )}
        {/* Dégradé bas */}
        <div className="absolute bottom-0 inset-x-0 h-20 bg-gradient-to-t from-[color:var(--nfc-dark)] to-transparent" />
        <div className="absolute bottom-0 inset-x-0 p-3">
          <p className="text-[10px] text-gray-300 font-mono">{player.nationality}</p>
        </div>
      </div>

      <div className="p-4 space-y-3">
        <h3 className="font-display text-base font-bold text-gray-900 group-hover:text-[color:var(--nfc-green)] transition-colors leading-tight">
          {player.firstName} <span className="uppercase">{player.lastName}</span>
        </h3>

        {/* Stats horizontales */}
        <div className="pt-2 border-t border-gray-100 grid grid-cols-3 text-center text-xs">
          {stats.map((stat) => (
            <div key={stat.label}>
              <span className="text-gray-400 text-[10px] block font-mono uppercase">{stat.label}</span>
              <span className="font-bold font-display text-[color:var(--nfc-green)]">{stat.value}</span>
            </div>
          ))}
        </div>
      </div>
    </Link>
  );
}

// ===================================
// Carte Staff (design premium horizontal)
// ===================================
function StaffCard({ member }: { member: StaffMember }) {
  // Icône selon le rôle
  const Icon =
    member.role.includes('MÉDECIN') || member.role.includes('KINÉ')
      ? Stethoscope
      : member.role.includes('ANALYSTE') || member.role.includes('VIDÉO')
      ? Video
      : member.role.includes('PRÉPARATEUR')
      ? Dumbbell
      : UserCheck;

  const bgMap = {
    green: 'bg-[color:var(--nfc-green)] text-white',
    dark: 'bg-[color:var(--nfc-dark)] text-white',
    gray: 'bg-gray-100 text-gray-700',
  };

  return (
    <div className="bg-white border border-gray-100 p-5 shadow-sm hover:shadow-md hover:-translate-y-0.5 transition-all duration-300 group">
      <div className="flex items-start gap-4">
        {/* Avatar initiales */}
        <div
          className={`w-14 h-14 font-display font-extrabold text-lg flex items-center justify-center shrink-0 ${bgMap[member.bgColor]}`}
        >
          {member.initials}
        </div>

        <div className="flex-grow min-w-0">
          {/* Badge rôle */}
          <span className="badge-category badge-green text-[9px] mb-1">{member.role}</span>
          <h4 className="font-display font-bold text-gray-900 text-sm group-hover:text-[color:var(--nfc-green)] transition-colors leading-tight">
            {member.fullName}
          </h4>
          <p className="text-[10px] text-gray-500 mt-0.5">{member.detail}</p>
        </div>

        {/* Icône décorative */}
        <div className="w-8 h-8 bg-[color:var(--nfc-green)]/10 flex items-center justify-center shrink-0">
          <Icon className="w-4 h-4 text-[color:var(--nfc-green)]" />
        </div>
      </div>
    </div>
  );
}

// ===================================
// Section joueurs par poste
// ===================================
function PlayerSection({
  title,
  players,
  cols = 4,
}: {
  title: string;
  players: Player[];
  cols?: 3 | 4;
}) {
  const colClass = cols === 3 ? 'grid-cols-1 sm:grid-cols-2 lg:grid-cols-3' : 'grid-cols-1 sm:grid-cols-2 lg:grid-cols-4';

  return (
    <section className="space-y-5">
      <SectionTag label={title} />
      <div className={`grid ${colClass} gap-6`}>
        {players.map((player) => (
          <PlayerCard key={player.id} player={player} />
        ))}
      </div>
    </section>
  );
}

// ===================================
// PAGE PRINCIPALE EFFECTIF
// ===================================
export default function EffectifPage() {
  const gardiens  = PLAYERS_DATA.filter((p) => p.position === 'GARDIEN');
  const defenseurs = PLAYERS_DATA.filter((p) => p.position === 'DEFENSEUR');
  const milieux   = PLAYERS_DATA.filter((p) => p.position === 'MILIEU');
  const attaquants = PLAYERS_DATA.filter((p) => p.position === 'ATTAQUANT');

  return (
    <div className="bg-[color:var(--nfc-bg)] text-[color:var(--nfc-text)] font-sans space-y-12 pb-20">

      {/* EN-TÊTE DE PAGE */}
      <PageHeader
        tag="ÉQUIPE PRO • SAISON 2026-2027"
        title="EFFECTIF"
        titleHighlight="PROFESSIONNEL"
        description="Retrouvez l'ensemble des joueurs sous contrat et l'encadrement technique du Ngaoundéré Football Club engagés en Ligue Régionale de l'Adamaoua."
        backgroundImageUrl="https://images.unsplash.com/photo-1574629810360-7efbbe195018?q=80&w=1600&auto=format&fit=crop"
        badgeContent={
          <div className="bg-[color:var(--nfc-dark)]/90 backdrop-blur-md p-6 border border-white/10 text-center w-full lg:w-72 shadow-xl">
            <div className="relative w-14 h-14 rounded-full overflow-hidden ring-2 ring-[color:var(--nfc-green)] shadow-md mx-auto mb-2">
              <Image src="/logo.png" alt="NFC Crest" fill className="object-contain" />
            </div>
            <span className="badge-category badge-green text-[9px] mb-2 inline-block font-bold">LIGUE RÉGIONALE</span>
            <h3 className="font-display text-lg font-extrabold text-[color:var(--nfc-white)]">{PLAYERS_DATA.length} JOUEURS PROS</h3>
            <p className="text-xs text-[color:var(--nfc-yellow)] mt-1">
              Capitaine : {PLAYERS_DATA.find(p => p.isCaptain) ? `${PLAYERS_DATA.find(p => p.isCaptain)?.firstName} ${PLAYERS_DATA.find(p => p.isCaptain)?.lastName}` : 'Emmanuel Ndjeng'}
            </p>
          </div>
        }
      />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12">

        {/* BANNIÈRE STATISTIQUES */}
        <section className="bg-white border border-gray-100 shadow-sm grid grid-cols-2 md:grid-cols-4 gap-0 divide-x divide-gray-100 text-center overflow-hidden">
          {[
            { value: PLAYERS_DATA.length, label: 'Joueurs Pros', highlight: true },
            { value: '23.8', label: 'Âge Moyen', highlight: false },
            { value: '12', label: 'Formés au Club', highlight: true },
            { value: "1 840'", label: 'Min. Jouées', highlight: false },
          ].map((stat) => (
            <div key={stat.label} className="p-6">
              <span className={`font-display text-2xl sm:text-3xl font-extrabold block ${stat.highlight ? 'text-[color:var(--nfc-green)]' : 'text-gray-900'}`}>
                {stat.value}
              </span>
              <span className="text-[11px] text-gray-500 uppercase font-display font-bold">{stat.label}</span>
            </div>
          ))}
        </section>

        {/* STAFF TECHNIQUE */}
        <section className="space-y-5">
          <SectionTag label="Encadrement Sportif & Staff Technique" />
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {STAFF_DATA.map((member) => (
              <StaffCard key={member.id} member={member} />
            ))}
          </div>
        </section>

        {/* GARDIENS DE BUT */}
        <PlayerSection title="Gardiens de But" players={gardiens} cols={3} />

        {/* DÉFENSEURS */}
        <PlayerSection title="Défenseurs" players={defenseurs} cols={4} />

        {/* MILIEUX DE TERRAIN */}
        <PlayerSection title="Milieux de Terrain" players={milieux} cols={4} />

        {/* ATTAQUANTS */}
        <PlayerSection title="Attaquants" players={attaquants} cols={4} />

        {/* LIEN VERS LES RÉSULTATS */}
        <div className="text-center pt-4">
          <Link href="/calendrier" className="btn-green text-xs inline-flex items-center gap-2">
            VOIR LE CALENDRIER & RÉSULTATS
            <ChevronRight className="w-4 h-4" />
          </Link>
        </div>

      </div>
    </div>
  );
}
