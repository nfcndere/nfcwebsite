"use client";

import React, { useState, useEffect } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { PageHeader } from '@/components/ui/PageHeader';
import { SectionTag } from '@/components/ui/SectionTag';
import { PLAYERS_DATA, STAFF_DATA } from '@/lib/mock-data';
import { Player, StaffMember } from '@/types';
import { UserCheck, Dumbbell, Stethoscope, Video, ChevronRight } from 'lucide-react';

function PlayerCard({ player }: { player: Player }) {
  const stats =
    player.position === 'GARDIEN'
      ? [
          { label: 'Matchs', value: player.matchesPlayed || 12 },
          { label: 'Clean', value: 5 },
          { label: 'Arrêts', value: 34 },
        ]
      : [
          { label: 'Matchs', value: player.matchesPlayed || 12 },
          { label: 'Buts', value: player.goalsScored || 0 },
          { label: 'Passes', value: player.assists || 0 },
        ];

  return (
    <Link
      href={`/player/${player.id}`}
      className="bg-white border border-gray-100 overflow-hidden shadow-sm hover:shadow-lg hover:-translate-y-1 transition-all duration-300 cursor-pointer group block rounded-xl"
    >
      <div className="relative h-48 sm:h-60 w-full bg-gray-100 overflow-hidden">
        <img
          src={player.photoUrl || '/players/default.jpg'}
          alt={`${player.firstName} ${player.lastName}`}
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
        />
        <div className="absolute top-2.5 left-2.5">
          <span className="bg-[#008751] text-white font-display font-extrabold text-sm sm:text-base px-2 py-0.5 shadow-md rounded-md">
            #{player.number}
          </span>
        </div>
        {player.isCaptain && (
          <div className="absolute top-2.5 right-2.5">
            <span className="badge-category badge-green text-[8px] sm:text-[9px]">CAPITAINE</span>
          </div>
        )}
        <div className="absolute bottom-0 inset-x-0 h-16 bg-gradient-to-t from-[#0c130e] to-transparent" />
        <div className="absolute bottom-0 inset-x-0 p-2.5 sm:p-3">
          <p className="text-[10px] text-gray-300 font-mono">{player.nationality || 'Camerounaise'}</p>
        </div>
      </div>

      <div className="p-3 sm:p-4 space-y-2 sm:space-y-3">
        <h3 className="font-display text-sm sm:text-base font-bold text-gray-900 group-hover:text-[#008751] transition-colors leading-tight">
          {player.firstName} <span className="uppercase">{player.lastName}</span>
        </h3>

        <div className="pt-2 border-t border-gray-100 grid grid-cols-3 text-center text-xs">
          {stats.map((stat) => (
            <div key={stat.label}>
              <span className="text-gray-400 text-[9px] sm:text-[10px] block font-mono uppercase">{stat.label}</span>
              <span className="font-bold font-display text-[#008751]">{stat.value}</span>
            </div>
          ))}
        </div>
      </div>
    </Link>
  );
}

function StaffCard({ member }: { member: StaffMember }) {
  const Icon =
    member.role.includes('MÉDECIN') || member.role.includes('KINÉ')
      ? Stethoscope
      : member.role.includes('ANALYSTE') || member.role.includes('VIDÉO')
      ? Video
      : member.role.includes('PRÉPARATEUR')
      ? Dumbbell
      : UserCheck;

  const bgMap = {
    green: 'bg-[#008751] text-white',
    dark: 'bg-[#0c130e] text-white',
    gray: 'bg-gray-100 text-gray-700',
  };

  return (
    <div className="bg-white border border-gray-100 p-3.5 sm:p-5 rounded-xl shadow-sm hover:shadow-md hover:-translate-y-0.5 transition-all duration-300 group">
      <div className="flex items-start gap-3 sm:gap-4">
        <div
          className={`w-11 h-11 sm:w-14 sm:h-14 font-display font-extrabold text-sm sm:text-lg flex items-center justify-center shrink-0 rounded-xl ${bgMap[member.bgColor]}`}
        >
          {member.initials}
        </div>

        <div className="flex-grow min-w-0">
          <span className="badge-category badge-green text-[9px] mb-1">{member.role}</span>
          <h4 className="font-display font-bold text-gray-900 text-xs sm:text-sm group-hover:text-[#008751] transition-colors leading-tight">
            {member.fullName}
          </h4>
          <p className="text-[10px] text-gray-500 mt-0.5">{member.detail}</p>
        </div>

        <div className="w-7 h-7 sm:w-8 sm:h-8 bg-[#008751]/10 flex items-center justify-center rounded-lg shrink-0">
          <Icon className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-[#008751]" />
        </div>
      </div>
    </div>
  );
}

function PlayerSection({
  title,
  players,
  cols = 4,
}: {
  title: string;
  players: Player[];
  cols?: 3 | 4;
}) {
  const colClass = cols === 3 ? 'grid-cols-2 lg:grid-cols-3' : 'grid-cols-2 lg:grid-cols-4';

  return (
    <section className="space-y-3 sm:space-y-5">
      <SectionTag label={title} />
      <div className={`grid ${colClass} gap-3 sm:gap-6`}>
        {players.map((player) => (
          <PlayerCard key={player.id} player={player} />
        ))}
      </div>
    </section>
  );
}

export default function EffectifPage() {
  const [players, setPlayers] = useState<any[]>(PLAYERS_DATA);

  useEffect(() => {
    async function fetchPlayers() {
      try {
        const res = await fetch('/api/players');
        if (res.ok) {
          const data = await res.json();
          if (Array.isArray(data) && data.length > 0) {
            const formatted = data.map((item: any) => ({
              id: item.id,
              firstName: item.firstName,
              lastName: item.lastName,
              number: item.number || 0,
              position: item.position || 'MILIEU',
              nationality: item.nationality || 'Camerounaise',
              photoUrl: item.photoUrl || '/players/default.jpg',
              matchesPlayed: item.matchesPlayed || 12,
              goalsScored: item.goalsScored || 0,
              assists: item.assists || 0,
              isCaptain: item.isCaptain || false,
            }));
            setPlayers(formatted);
          }
        }
      } catch (error) {
        console.warn('Utilisation du fallback local pour l\'effectif');
      }
    }
    fetchPlayers();
  }, []);

  const gardiens = players.filter((p) => p.position === 'GARDIEN');
  const defenseurs = players.filter((p) => p.position === 'DEFENSEUR');
  const milieux = players.filter((p) => p.position === 'MILIEU');
  const attaquants = players.filter((p) => p.position === 'ATTAQUANT');
  const captain = players.find(p => p.isCaptain);

  return (
    <div className="bg-[color:var(--nfc-bg)] text-[color:var(--nfc-text)] font-sans space-y-6 sm:space-y-12 pb-16">

      <PageHeader
        tag="ÉQUIPE PRO • SAISON 2026-2027"
        title="EFFECTIF"
        titleHighlight="PROFESSIONNEL"
        description="Retrouvez l'ensemble des joueurs sous contrat et l'encadrement technique du Ngaoundéré Football Club engagés en Ligue Régionale de l'Adamaoua."
        backgroundImageUrl="https://images.unsplash.com/photo-1574629810360-7efbbe195018?q=80&w=1600&auto=format&fit=crop"
        badgeContent={
          <div className="bg-[#0c130e]/90 backdrop-blur-md p-4 sm:p-6 rounded-2xl border border-white/10 text-center w-full lg:w-72 shadow-xl">
            <div className="relative w-12 h-12 sm:w-14 sm:h-14 rounded-full overflow-hidden ring-2 ring-[#008751] shadow-md mx-auto mb-2">
              <Image src="/logo.png" alt="NFC Crest" fill className="object-contain" />
            </div>
            <span className="badge-category badge-green text-[9px] mb-2 inline-block font-bold">LIGUE RÉGIONALE</span>
            <h3 className="font-display text-base sm:text-lg font-extrabold text-white">{players.length} JOUEURS PROS</h3>
            <p className="text-xs text-[color:var(--nfc-yellow)] mt-1">
              Capitaine : {captain ? `${captain.firstName} ${captain.lastName}` : 'Emmanuel Ndjeng'}
            </p>
          </div>
        }
      />

      <div className="max-w-7xl mx-auto px-3 sm:px-6 lg:px-8 space-y-6 sm:space-y-12">

        <section className="bg-white border border-gray-100 shadow-sm grid grid-cols-2 md:grid-cols-4 gap-0 divide-x divide-y md:divide-y-0 divide-gray-100 text-center overflow-hidden rounded-xl">
          {[
            { value: players.length, label: 'Joueurs Pros', highlight: true },
            { value: '23.8', label: 'Âge Moyen', highlight: false },
            { value: '12', label: 'Formés au Club', highlight: true },
            { value: "1 840'", label: 'Min. Jouées', highlight: false },
          ].map((stat) => (
            <div key={stat.label} className="p-3.5 sm:p-6">
              <span className={`font-display text-xl sm:text-3xl font-extrabold block ${stat.highlight ? 'text-[#008751]' : 'text-gray-900'}`}>
                {stat.value}
              </span>
              <span className="text-[10px] sm:text-[11px] text-gray-500 uppercase font-display font-bold">{stat.label}</span>
            </div>
          ))}
        </section>

        <section className="space-y-3 sm:space-y-5">
          <SectionTag label="Encadrement Sportif & Staff Technique" />
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 sm:gap-4">
            {STAFF_DATA.map((member) => (
              <StaffCard key={member.id} member={member} />
            ))}
          </div>
        </section>

        <PlayerSection title="Gardiens de But" players={gardiens} cols={3} />
        <PlayerSection title="Défenseurs" players={defenseurs} cols={4} />
        <PlayerSection title="Milieux de Terrain" players={milieux} cols={4} />
        <PlayerSection title="Attaquants" players={attaquants} cols={4} />

        <div className="text-center pt-2">
          <Link href="/calendrier" className="btn-green text-xs inline-flex items-center gap-2 py-2.5 px-5">
            VOIR LE CALENDRIER & RÉSULTATS
            <ChevronRight className="w-4 h-4" />
          </Link>
        </div>

      </div>
    </div>
  );
}
