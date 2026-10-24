'use client';

import { SectionTag } from '@/components/ui/SectionTag';
import { DataState } from '@/components/ui/DataState';
import { useClubOverview } from '@/components/providers/ClubOverviewProvider';
import { getGoalDifferenceLabel } from '@/lib/match-state';

export default function ClassementPage() {
  const { data, status, error, retry, updatedAt } = useClubOverview();
  const standings = data?.standings ?? [];

  return (
    <div className="space-y-8 bg-[color:var(--nfc-bg)] pb-16 pt-8 text-[color:var(--nfc-text)]">
      <section className="mx-auto max-w-7xl space-y-5 px-3 sm:px-6 lg:px-8">
        <SectionTag label={`Classement général${data?.season ? ` · Saison ${data.season.label}` : ''}`} />
        <DataState status={status} error={error} onRetry={retry} updatedAt={updatedAt} emptyMessage="Le classement n'est pas encore disponible." skeleton={<div className="h-72 animate-pulse rounded-xl bg-white" />}>
          {standings.length > 0 ? (
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
                  {standings.map((row) => (
                    <tr key={row.teamId} className={row.teamName === 'Ngaoundéré FC' ? 'border-l-4 border-[#008751] bg-[#008751]/10 font-bold' : ''}>
                      <td className="p-3 text-center">{row.rank}</td>
                      <td className="p-3">{row.teamName}</td>
                      <td className="p-3 text-center">{row.played}</td><td className="p-3 text-center">{row.won}</td>
                      <td className="p-3 text-center">{row.drawn}</td><td className="p-3 text-center">{row.lost}</td>
                      <td className="hidden p-3 text-center sm:table-cell">{row.goalsFor}</td><td className="hidden p-3 text-center sm:table-cell">{row.goalsAgainst}</td>
                      <td className="p-3 text-center">{getGoalDifferenceLabel(row.goalDifference)}</td><td className="p-3 text-center">{row.points}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          ) : <p role="status" className="rounded-xl bg-white p-6 text-center text-sm text-gray-600">Le classement n'est pas encore disponible.</p>}
        </DataState>
      </section>
    </div>
  );
}
