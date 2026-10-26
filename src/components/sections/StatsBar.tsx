'use client';

import { useClubOverview } from '@/components/providers/ClubOverviewProvider';
import { DataState } from '@/components/ui/DataState';
import { getGoalDifferenceLabel, getOrdinalFr } from '@/lib/match-state';

export default function StatsBar() {
  const { data, status, error, retry, updatedAt } = useClubOverview();
  const nfc = data?.nfc;

  return (
    <section className="relative z-20 -mt-8 sm:-mt-12 lg:-mt-16">
      <div className="mx-auto max-w-7xl px-3 sm:px-4 md:px-6 lg:px-8">
        <div className="rounded-xl border border-gray-100 bg-white p-4 shadow-[0_18px_40px_rgba(15,23,42,0.08)] sm:rounded-2xl sm:p-6 lg:p-8">
          <DataState
            status={status}
            error={error}
            onRetry={retry}
            updatedAt={updatedAt}
            emptyMessage="Les statistiques du NFC pour cette saison seront publiées prochainement."
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
              <p role="status" className="text-center text-sm text-gray-600">Les statistiques du NFC pour cette saison seront publiées prochainement.</p>
            )}
            {nfc?.form && <p className="mt-3 text-center text-xs text-gray-600">Forme récente : {nfc.form}</p>}
          </DataState>
        </div>
      </div>
    </section>
  );
}
