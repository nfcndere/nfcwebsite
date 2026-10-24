"use client";

import React from 'react';
import Image from 'next/image';
import { Player } from '@/types';

interface Props {
  player: Player;
}

export const PlayerDetail: React.FC<Props> = ({ player }) => {
  const photoUrl = player.photoUrl ?? '/logo.png';

  return (
    <div className="max-w-4xl mx-auto bg-white rounded-2xl p-6 shadow-sm font-body">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 items-start">
        <div className="col-span-1">
          <div className="rounded-2xl overflow-hidden w-full h-80 bg-gray-100">
            <img src={photoUrl} alt={`${player.firstName} ${player.lastName}`} className="w-full h-full object-cover" />
          </div>
          <div className="mt-4 text-center">
            <div className="text-2xl font-display font-extrabold">#{player.number} {player.firstName} {player.lastName}</div>
            {player.position && <div className="text-sm text-gray-500 uppercase mt-1">{player.position}</div>}
          </div>
        </div>

        <div className="md:col-span-2 space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="font-display text-xl font-bold">Profil</h2>
              {(player.nationality || player.birthDate) && <p className="text-sm text-gray-600 mt-1">
                {player.nationality}
                {player.nationality && player.birthDate ? ' · ' : ''}
                {player.birthDate && `Né le ${new Date(`${player.birthDate}T00:00:00+01:00`).toLocaleDateString('fr-FR', { timeZone: 'Africa/Douala' })}`}
              </p>}
            </div>
            <div className="text-right">
              {player.height != null && <><div className="text-sm text-gray-500">Taille</div><div className="font-bold">{player.height} cm</div></>}
              {player.weight != null && <><div className="mt-2 text-sm text-gray-500">Poids</div><div className="font-bold">{player.weight} kg</div></>}
            </div>
          </div>

          <div>
            {player.bio && <><h3 className="font-display font-bold text-lg">Biographie</h3><p className="text-sm text-gray-700 mt-2">{player.bio}</p></>}
          </div>

          <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
            {[
              ['Matchs', player.matchesPlayed], ['Buts', player.goalsScored],
              ['Passes', player.assists], ['Cartons jaunes', player.yellowCards],
              ['Cartons rouges', player.redCards],
            ].filter((entry): entry is [string, number] => typeof entry[1] === 'number').map(([label, value]) => (
              <div key={label} className="rounded bg-gray-50 p-3">
                <div className="text-xs text-gray-500">{label}</div><div className="text-lg font-bold">{value}</div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};
