import React from 'react';
import { notFound } from 'next/navigation';
import { MATCHES_DATA } from '@/lib/mock-data';
import { MatchDetail } from '@/components/match/MatchDetail';

interface PageProps { params: { id: string } }

export default function MatchPage({ params }: PageProps) {
  const match = MATCHES_DATA.find(m => m.id === params.id);
  if (!match) return notFound();

  return (
    <div className="py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <MatchDetail match={match} />
      </div>
    </div>
  );
}
