'use client';

import { SectionTag } from '@/components/ui/SectionTag';
import { DataState } from '@/components/ui/DataState';
import { useClubOverview } from '@/components/providers/ClubOverviewProvider';
import { getGoalDifferenceLabel, getOrdinalFr } from '@/lib/match-state';

function EmptyPlaceholders({ animated = false }: { animated?: boolean }) {
  return Array.from({ length: 7 }, (_, index) => (
    <tr key={`placeholder-${index}`} aria-hidden="true" className="text-gray-300">
      <td className="p-3"><span className={`block h-3 w-5 rounded bg-gray-100 ${animated ? 'animate-pulse' : ''}`} /></td>
      <td className="p-3"><span className={`block h-3 w-28 rounded bg-gray-100 ${animated ? 'animate-pulse' : ''}`} /></td>
      {Array.from({ length: 8 }, (_, cell) => (
        <td key={cell} className={`p-3 ${cell > 4 ? 'hidden sm:table-cell' : ''}`}>
          <span className={`mx-auto block h-3 w-7 rounded bg-gray-100 ${animated ? 'animate-pulse' : ''}`} />
        </td>
      ))}
    </tr>
  ));
}

function StandingsSkeleton() {
  return (
    <div className="overflow-x-auto rounded-xl border border-gray-100 bg-white shadow-sm">
      <table aria-hidden="true" className="w-full text-left text-xs">
        <thead><tr className="bg-[#f7f8f7]"><th colSpan={10} className="p-3"><span className="block h-3 w-full animate-pulse rounded bg-gray-100" /></th></tr></thead>
        <tbody>
          <tr>
            {Array.from({ length: 10 }, (_, index) => (
              <td key={index} className={`p-3 ${index > 5 && index < 8 ? 'hidden sm:table-cell' : ''}`}>
                <span className="mx-auto block h-3 w-7 animate-pulse rounded bg-gray-100" />
              </td>
            ))}
          </tr>
          <EmptyPlaceholders animated />
        </tbody>
      </table>
    </div>
  );
}

export default function ClassementPage() {
  const { data, status, error, retry, updatedAt } = useClubOverview();
  const nfc = data?.nfc;

  return (
    <div className="space-y-8 bg-[color:var(--nfc-bg)] pb-16 pt-8 text-[color:var(--nfc-text)]">
      <section className="mx-auto max-w-7xl space-y-5 px-3 sm:px-6 lg:px-8">
        <SectionTag label={`Classement général${data?.season ? ` · Saison ${data.season.label}` : ''}`} />
        <DataState
          status={status}
          error={error}
          onRetry={retry}
          updatedAt={updatedAt}
          emptyMessage="Les statistiques du NFC pour cette saison seront publiées prochainement."
          skeleton={<StandingsSkeleton />}
        >
          {nfc ? (
            <>
              <div className="overflow-x-auto rounded-xl border border-gray-100 bg-white shadow-sm">
                <table className="w-full text-left text-xs">
                  <thead>
                    <tr className="border-b border-gray-100 bg-[#f7f8f7] font-display text-[10px] uppercase text-gray-500">
                      <th className="p-3 text-center">Pos</th><th className="p-3">Équipe</th><th className="p-3 text-center">J</th>
                      <th className="p-3 text-center">G</th><th className="p-3 text-center">N</th><th className="p-3 text-center">P</th>
                      <th className="hidden p-3 text-center sm:table-cell">BP</th><th className="hidden p-3 text-center sm:table-cell">BC</th>
                      <th className="p-3 text-center">Diff.</th><th className="p-3 text-center">Pts</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-50">
                    <tr className="border-l-4 border-[#008751] bg-[#008751]/10 font-bold">
                      <td className="p-3 text-center">{getOrdinalFr(nfc.rank)}</td>
                      <td className="p-3">{nfc.teamName}</td>
                      <td className="p-3 text-center">{nfc.played}</td><td className="p-3 text-center">{nfc.won}</td>
                      <td className="p-3 text-center">{nfc.drawn}</td><td className="p-3 text-center">{nfc.lost}</td>
                      <td className="hidden p-3 text-center sm:table-cell">{nfc.goalsFor}</td><td className="hidden p-3 text-center sm:table-cell">{nfc.goalsAgainst}</td>
                      <td className="p-3 text-center">{getGoalDifferenceLabel(nfc.goalDifference)}</td><td className="p-3 text-center">{nfc.points}</td>
                    </tr>
                    <EmptyPlaceholders />
                  </tbody>
                </table>
              </div>
              <p className="text-sm text-gray-600">
                Statistiques du NFC mises à jour par le club. Le classement complet de la ligue sera bientôt disponible.
              </p>
            </>
          ) : (
            <p role="status" className="rounded-xl bg-white p-6 text-center text-sm text-gray-600">
              Les statistiques du NFC pour cette saison seront publiées prochainement.
            </p>
          )}
        </DataState>
      </section>
    </div>
  );
}
