'use client';

import Link from 'next/link';
import { useClubOverview } from '@/components/providers/ClubOverviewProvider';
import { DataState } from '@/components/ui/DataState';
import { getGoalDifferenceLabel, getOrdinalFr } from '@/lib/match-state';

export default function StatsBar() {
  const { data, status, error, retry, updatedAt } = useClubOverview();
  const nfc = data?.standings.find((standing) => standing.teamName === 'Ngaoundéré FC');

  return (
    <section className="relative z-20 -mt-8 sm:-mt-12 lg:-mt-16">
      <div className="mx-auto max-w-7xl px-3 sm:px-4 md:px-6 lg:px-8">
        <div className="rounded-xl border border-gray-100 bg-white p-4 shadow-[0_18px_40px_rgba(15,23,42,0.08)] sm:rounded-2xl sm:p-6 lg:p-8">
          <DataState
            status={status}
            error={error}
            onRetry={retry}
            updatedAt={updatedAt}
            emptyMessage="Le classement et les prochains matchs ne sont pas encore disponibles."
            skeleton={<div className="h-24 animate-pulse rounded-lg bg-gray-100" />}
          >
            {nfc ? (
              <div className="grid grid-cols-3 divide-x divide-[#008751]/20 text-center">
                <div>
                  <span className="block text-[10px] font-bold uppercase tracking-wider text-[#008751]">Classement</span>
                  <strong className="mt-2 block font-display text-3xl font-extrabold text-[#008751]">{getOrdinalFr(nfc.rank)}</strong>
                </div>
                <div>
                  <span className="block text-[10px] font-bold uppercase tracking-wider text-gray-500">Points</span>
                  <strong className="mt-2 block font-display text-3xl font-extrabold text-[#008751]">{nfc.points}</strong>
                </div>
                <div>
                  <span className="block text-[10px] font-bold uppercase tracking-wider text-gray-500">Différence</span>
                  <strong className="mt-2 block font-display text-3xl font-extrabold text-[#008751]">{getGoalDifferenceLabel(nfc.goalDifference)}</strong>
                </div>
              </div>
            ) : (
              <p className="text-center text-sm text-gray-600">Le classement du club n’est pas encore publié.</p>
            )}
            <div className="mt-5 border-t border-gray-100 pt-4 text-center">
              {data?.nextMatch ? (
                <p className="text-sm font-semibold text-gray-800">
                  Prochain match : {data.nextMatch.homeTeam} – {data.nextMatch.awayTeam}
                  {' · '}
                  {new Intl.DateTimeFormat('fr-FR', { dateStyle: 'medium', timeStyle: 'short', timeZone: 'Africa/Douala' }).format(new Date(data.nextMatch.date))}
                </p>
              ) : (
                <p className="text-sm text-gray-600">Aucun match programmé pour le moment.</p>
              )}
              <Link href="/calendrier" className="mt-2 inline-block text-xs font-bold text-[#008751] underline">
                Consulter le calendrier
              </Link>
            </div>
          </DataState>
        </div>
      </div>
    </section>
  );
}
