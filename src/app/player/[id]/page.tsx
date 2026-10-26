import { notFound } from 'next/navigation';
import prisma from '@/lib/prisma';
import { NOT_DELETED } from '@/lib/soft-delete';
import { PlayerDetail } from '@/components/player/PlayerDetail';
import type { Player } from '@/types';

export const dynamic = 'force-dynamic';

export default async function PlayerPage({ params }: { params: { id: string } }) {
  const playerRecord = await prisma.player.findFirst({ where: { id: params.id, ...NOT_DELETED } });
  if (!playerRecord) notFound();
  const stats = playerRecord.stats && typeof playerRecord.stats === 'object' && !Array.isArray(playerRecord.stats)
    ? playerRecord.stats as Record<string, unknown>
    : {};
  const numericStat = (key: string) => typeof stats[key] === 'number' ? stats[key] as number : undefined;
  const player: Player = {
    id: playerRecord.id,
    firstName: playerRecord.firstName,
    lastName: playerRecord.lastName,
    number: playerRecord.number,
    position: playerRecord.position as Player['position'],
    nationality: playerRecord.nationality,
    birthDate: playerRecord.birthDate,
    height: playerRecord.height ?? undefined,
    weight: playerRecord.weight ?? undefined,
    bio: playerRecord.bio ?? undefined,
    photoUrl: playerRecord.photoId,
    isCaptain: playerRecord.isCaptain,
    matchesPlayed: numericStat('matchesPlayed'),
    goalsScored: numericStat('goalsScored'),
    assists: numericStat('assists'),
    yellowCards: numericStat('yellowCards'),
    redCards: numericStat('redCards'),
    joinedYear: playerRecord.joinedYear ?? undefined,
  };

  return (
    <div className="py-8 sm:py-12">
      <div className="mx-auto max-w-7xl px-3 sm:px-6 lg:px-8">
        <PlayerDetail player={player} />
      </div>
    </div>
  );
}
