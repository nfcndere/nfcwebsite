'use client';

import Image from 'next/image';
import Link from 'next/link';
import { useEffect, useState } from 'react';
import { ArrowRight, Clock, Shield } from 'lucide-react';
import { useClubOverview } from '@/components/providers/ClubOverviewProvider';
import { DataState } from '@/components/ui/DataState';
import { getMatchState } from '@/lib/match-state';

export default function NextMatchBanner() {
  const { data, status, error, retry, updatedAt } = useClubOverview();
  const [now, setNow] = useState(() => new Date());

  useEffect(() => {
    const id = window.setInterval(() => setNow(new Date()), 1000);
    return () => window.clearInterval(id);
  }, []);

  const match = data?.liveMatch ?? data?.nextMatch ?? null;
  const matchState = getMatchState(match, now);
  const matchDate = match ? new Date(match.date) : null;
  const diff = matchDate && matchState === 'UPCOMING' ? matchDate.getTime() - now.getTime() : 0;
  const days = Math.floor(diff / (1000 * 60 * 60 * 24));
  const hours = Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
  const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
  const seconds = Math.floor((diff % (1000 * 60)) / 1000);

  const hh = String(hours).padStart(2, '0');
  const mm = String(minutes).padStart(2, '0');
  const ss = String(seconds).padStart(2, '0');

  if (status === 'loading' || status === 'error' || status === 'stale' || status === 'partial') {
    return (
      <section className="mx-auto max-w-7xl px-3 sm:px-4 md:px-6 lg:px-8">
        <DataState status={status} error={error} onRetry={retry} updatedAt={updatedAt} skeleton={<div className="h-28 animate-pulse rounded-lg bg-white shadow" />} />
      </section>
    );
  }
  if (!match || !matchDate) {
    return (
      <section className="mx-auto max-w-7xl px-3 sm:px-4 md:px-6 lg:px-8">
        <DataState status="empty" emptyMessage="Aucun match programmé pour le moment. Le calendrier sera publié prochainement." />
      </section>
    );
  }
  const dateLabel = new Intl.DateTimeFormat('fr-FR', {
    dateStyle: 'full',
    timeStyle: 'short',
    timeZone: 'Africa/Douala',
  }).format(matchDate);

  return (
    <section className="mx-auto max-w-7xl px-3 sm:px-4 md:px-6 lg:px-8">
      <div className="flex flex-col overflow-hidden border-t-4 border-[#008751] bg-white shadow-xl rounded-lg lg:flex-row">
        {/* Block 1: club crests */}
        <div className="flex items-center justify-center gap-2 border-b border-gray-100 p-3 sm:p-4 lg:w-40 lg:shrink-0 lg:border-b-0 lg:border-r">
          <div className="relative h-14 w-12 shrink-0 sm:h-18 sm:w-14 lg:h-20 lg:w-16" aria-label={match.homeTeam}>
            <Image
              src="/logo.png"
              alt={match.homeTeam}
              fill
              className="object-contain"
            />
          </div>

          <div className="relative flex h-14 w-12 items-center justify-center shrink-0 rounded-sm bg-[#008751]/5 sm:h-18 sm:w-14 lg:h-20 lg:w-16" aria-label={match.awayTeam}>
            <Shield className="h-6 w-6 text-[color:var(--nfc-green)] sm:h-7 sm:w-7" />
          </div>
        </div>

        {/* Block 2: match info + countdown */}
        <div className="flex flex-1 flex-col items-center justify-between gap-3 border-b border-gray-100 p-3 sm:p-4 lg:flex-row lg:border-b-0">
          <div className="space-y-1 text-center sm:text-left min-w-0">
            <div className="flex items-center justify-center gap-1.5 sm:justify-start">
              <Clock className="h-3.5 w-3.5 text-[#008751] shrink-0" />
              <span className="font-display text-xs sm:text-sm font-extrabold uppercase tracking-wide text-[#0c130e] line-clamp-2">
                {dateLabel}
              </span>
            </div>
            <span className="block text-[10px] font-display uppercase tracking-wider text-gray-500">
              {match.competition || 'Compétition non communiquée'}
            </span>
            <span className="block text-[10px] font-display uppercase tracking-wider text-gray-500">
              {match.stadium || 'Stade non communiqué'}
            </span>
            <span className="block text-xs font-bold text-gray-800">{match.homeTeam} — {match.awayTeam}</span>
          </div>

          <div className="flex flex-col items-center gap-2 sm:items-end">
            <div aria-live="polite" aria-atomic="false" className="flex items-baseline gap-1 font-display font-extrabold text-[#0c130e] text-sm sm:text-base">
              {matchState === 'LIVE' ? (
                <>
                  <span className="mr-1 inline-block h-2 w-2 rounded-full bg-red-600 animate-pulse" />
                  <span className="text-sm font-extrabold uppercase text-[#008751]">EN DIRECT</span>
                  {match.homeScore != null && match.awayScore != null
                    ? <span className="ml-2 text-xl">{match.homeScore} – {match.awayScore}</span>
                    : <span className="text-xs font-semibold text-gray-700">Score indisponible, mise à jour en cours</span>}
                </>
              ) : matchState === 'UPCOMING' ? (
                <>
                  <span className="text-xl sm:text-2xl">{days}</span>
                  <span className="text-[9px] font-medium uppercase text-gray-500 ml-0.5">j</span>

                  <span className="text-xl sm:text-2xl ml-1">{hh}</span>
                  <span className="text-[9px] font-medium uppercase text-gray-500 ml-0.5">h</span>

                  <span className="text-xl sm:text-2xl ml-1">{mm}</span>
                  <span className="text-[9px] font-medium uppercase text-gray-500 ml-0.5">m</span>

                  <span className="text-xl text-[#008751] sm:text-2xl ml-1">{ss}</span>
                  <span className="text-[9px] font-medium uppercase text-gray-500 ml-0.5">s</span>
                </>
              ) : <span className="text-xs font-bold uppercase text-gray-600">Résultat en attente</span>}
            </div>
          </div>
        </div>

        {/* Block 3: ticket CTA */}
        <div className="flex items-center justify-center p-2.5 sm:p-4 lg:w-48 lg:shrink-0">
          <Link
            href="/calendrier"
            className="flex w-full items-center justify-center gap-1.5 whitespace-nowrap bg-[#008751] px-3 sm:px-6 py-3 sm:py-4 text-center text-[10px] sm:text-xs font-display font-extrabold uppercase tracking-wider text-white transition-colors hover:bg-[#0c130e]"
          >
            Voir le calendrier
            <ArrowRight className="h-3 w-3 sm:h-4 sm:w-4" />
          </Link>
        </div>
      </div>
    </section>
  );
}
