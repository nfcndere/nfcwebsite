import React from 'react';
import { notFound } from 'next/navigation';
import { PLAYERS_DATA } from '@/lib/mock-data';
import { PlayerDetail } from '@/components/player/PlayerDetail';

interface PageProps {
  params: { id: string };
}

export default function PlayerPage({ params }: PageProps) {
  const player = PLAYERS_DATA.find((p) => p.id === params.id);
  if (!player) return notFound();

  return (
    <div className="py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <PlayerDetail player={player} />
      </div>
    </div>
  );
}
