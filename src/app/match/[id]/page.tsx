import React from 'react';
import { notFound } from 'next/navigation';
import { MATCHES_DATA } from '@/lib/mock-data';
import { MatchDetail } from '@/components/match/MatchDetail';

interface PageProps { params: { id: string } }

export async function generateStaticParams() {
  return MATCHES_DATA.map((match) => ({
    id: match.id,
  }));
}

export default function MatchPage({ params }: PageProps) {
  const match = MATCHES_DATA.find(m => m.id === params.id) || MATCHES_DATA[0];
  if (!match) return notFound();

  return (
    <div className="py-8 sm:py-12">
      <div className="max-w-7xl mx-auto px-3 sm:px-6 lg:px-8">
        <MatchDetail match={match} />
      </div>
    </div>
  );
}
