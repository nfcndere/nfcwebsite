"use client";

import React from 'react';
import Link from 'next/link';
import { PageHeader } from '@/components/ui/PageHeader';
import { SectionTag } from '@/components/ui/SectionTag';
import { Player } from '@/types';
import { ChevronRight } from 'lucide-react';
import { useApiResource } from '@/lib/use-api-resource';
import { DataState } from '@/components/ui/DataState';
import { DATA_FRESHNESS_MS } from '@/constants/data-freshness';
import { useClubOverview } from '@/components/providers/ClubOverviewProvider';

function PlayerCard({ player }: { player: Player }) {
  const stats = [
    ['Matchs', player.matchesPlayed],
    ['Buts', player.goalsScored],
    ['Passes', player.assists],
  ].filter((entry): entry is [string, number] => typeof entry[1] === 'number');

  return (
    <Link
      href={`/player/${player.id}`}
      className="bg-white border border-gray-100 overflow-hidden shadow-sm hover:shadow-lg hover:-translate-y-1 transition-all duration-300 cursor-pointer group block rounded-xl"
    >
      <div className="relative h-48 sm:h-60 w-full bg-gray-100 overflow-hidden">
        {player.photoUrl && <img src={player.photoUrl} alt={`${player.firstName} ${player.lastName}`} className="h-full w-full object-cover group-hover:scale-105 transition-transform duration-300" />}
        {player.number !== null && player.number !== undefined && <div className="absolute top-2.5 left-2.5">
          <span className="bg-[#008751] text-white font-display font-extrabold text-sm sm:text-base px-2 py-0.5 shadow-md rounded-md">
            #{player.number}
          </span>
        </div>}
        {player.isCaptain && (
          <div className="absolute top-2.5 right-2.5">
            <span className="badge-category badge-green text-[8px] sm:text-[9px]">CAPITAINE</span>
          </div>
        )}
        <div className="absolute bottom-0 inset-x-0 h-16 bg-gradient-to-t from-[#0c130e] to-transparent" />
        <div className="absolute bottom-0 inset-x-0 p-2.5 sm:p-3">
          {player.nationality && <p className="text-[10px] text-gray-300 font-mono">{player.nationality}</p>}
        </div>
      </div>

      <div className="p-3 sm:p-4 space-y-2 sm:space-y-3">
        <h3 className="font-display text-sm sm:text-base font-bold text-gray-900 group-hover:text-[#008751] transition-colors leading-tight">
          {player.firstName} <span className="uppercase">{player.lastName}</span>
        </h3>

        {stats.length > 0 && <div className="pt-2 border-t border-gray-100 grid grid-cols-3 text-center text-xs">
          {stats.map(([label, value]) => (
            <div key={label}>
              <span className="text-gray-400 text-[9px] sm:text-[10px] block font-mono uppercase">{label}</span>
              <span className="font-bold font-display text-[#008751]">{value}</span>
            </div>
          ))}
        </div>}
      </div>
    </Link>
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
  const resource = useApiResource<(Player & { photoId?: string | null; stats?: Record<string, unknown> | null })[]>('/api/players', {
    staleAfterMs: DATA_FRESHNESS_MS.players,
  });
  const { data: overview } = useClubOverview();
  const players = (resource.data ?? []).map((player) => ({
    ...player,
    photoUrl: player.photoId,
    matchesPlayed: typeof player.stats?.matchesPlayed === 'number' ? player.stats.matchesPlayed : undefined,
    goalsScored: typeof player.stats?.goalsScored === 'number' ? player.stats.goalsScored : undefined,
    assists: typeof player.stats?.assists === 'number' ? player.stats.assists : undefined,
  }));

  const gardiens = players.filter((p) => p.position === 'GARDIEN');
  const defenseurs = players.filter((p) => p.position === 'DEFENSEUR');
  const milieux = players.filter((p) => p.position === 'MILIEU');
  const attaquants = players.filter((p) => p.position === 'ATTAQUANT');
  return (
    <div className="bg-[color:var(--nfc-bg)] text-[color:var(--nfc-text)] font-sans space-y-6 sm:space-y-12 pb-16">

      <PageHeader
        tag={`ÉQUIPE PRO • ${overview?.season?.label ? `SAISON ${overview.season.label}` : 'SAISON NON COMMUNIQUÉE'}`}
        title="EFFECTIF"
        titleHighlight="PROFESSIONNEL"
        description="Retrouvez l'ensemble des joueurs sous contrat et l'encadrement technique du Ngaoundéré Football Club engagés en Ligue Régionale de l'Adamaoua."
        backgroundImageUrl="https://images.unsplash.com/photo-1574629810360-7efbbe195018?q=80&w=1600&auto=format&fit=crop"
        
      />

      <div className="max-w-7xl mx-auto px-3 sm:px-6 lg:px-8 space-y-6 sm:space-y-10 pt-6 sm:pt-8">

        <DataState status={resource.status} error={resource.error} onRetry={resource.retry} updatedAt={resource.updatedAt} emptyMessage="L'effectif de la saison sera bientôt publié." skeleton={<div className="h-60 animate-pulse rounded-xl bg-white" />}>
          {players.length > 0 ? (
            <section className="space-y-6">
              {gardiens.length > 0 && <PlayerSection title="Gardiens de but" players={gardiens} cols={3} />}
              {defenseurs.length > 0 && <PlayerSection title="Défenseurs" players={defenseurs} />}
              {milieux.length > 0 && <PlayerSection title="Milieux de terrain" players={milieux} />}
              {attaquants.length > 0 && <PlayerSection title="Attaquants" players={attaquants} />}
              {players.some((player) => !player.position) && <PlayerSection title="Poste non communiqué" players={players.filter((player) => !player.position)} />}
            </section>
          ) : <p role="status" className="py-6 text-center text-sm text-gray-600">L'effectif de la saison sera bientôt publié.</p>}
        </DataState>

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
