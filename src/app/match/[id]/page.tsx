import { notFound } from 'next/navigation';
import prisma from '@/lib/prisma';
import { MatchDetail } from '@/components/match/MatchDetail';
import type { MatchItem } from '@/types';

export const dynamic = 'force-dynamic';

export default async function MatchPage({ params }: { params: { id: string } }) {
  const record = await prisma.match.findUnique({ where: { id: params.id } });
  if (!record) notFound();
  const match: MatchItem = {
    id: record.id,
    homeTeam: record.homeTeam,
    awayTeam: record.awayTeam,
    homeScore: record.homeScore,
    awayScore: record.awayScore,
    date: record.date.toISOString(),
    stadium: record.stadium,
    competition: record.competition,
    status: record.status as MatchItem['status'],
    summary: record.summary ?? undefined,
  };

  return (
    <div className="py-8 sm:py-12">
      <div className="mx-auto max-w-7xl px-3 sm:px-6 lg:px-8">
        <MatchDetail match={match} />
      </div>
    </div>
  );
}
