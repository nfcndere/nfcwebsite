"use client";

import React from 'react';
import Image from 'next/image';
import { Player } from '@/types';

interface Props {
  player: Player;
}

export const PlayerDetail: React.FC<Props> = ({ player }) => {
  return (
    <div className="max-w-4xl mx-auto bg-white rounded-2xl p-6 shadow-sm font-body">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 items-start">
        <div className="col-span-1">
          <div className="rounded-2xl overflow-hidden w-full h-80 bg-gray-100">
            <img src={player.photoUrl} alt={`${player.firstName} ${player.lastName}`} className="w-full h-full object-cover" />
          </div>
          <div className="mt-4 text-center">
            <div className="text-2xl font-display font-extrabold">#{player.number} {player.firstName} {player.lastName}</div>
            <div className="text-sm text-gray-500 uppercase mt-1">{player.position}</div>
          </div>
        </div>

        <div className="md:col-span-2 space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="font-display text-xl font-bold">Profil</h2>
              <p className="text-sm text-gray-600 mt-1">{player.nationality} • Né le {new Date(player.birthDate).toLocaleDateString('fr-FR')}</p>
            </div>
            <div className="text-right">
              <div className="text-sm text-gray-500">Taille</div>
              <div className="font-bold">{player.height} cm</div>
              <div className="text-sm text-gray-500 mt-2">Poids</div>
              <div className="font-bold">{player.weight} kg</div>
            </div>
          </div>

          <div>
            <h3 className="font-display font-bold text-lg">Biographie</h3>
            <p className="text-sm text-gray-700 mt-2">{player.bio}</p>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
            <div className="bg-gray-50 p-3 rounded">
              <div className="text-xs text-gray-500">Matches</div>
              <div className="font-bold text-lg">{player.matchesPlayed}</div>
            </div>
            <div className="bg-gray-50 p-3 rounded">
              <div className="text-xs text-gray-500">Buts</div>
              <div className="font-bold text-lg">{player.goalsScored}</div>
            </div>
            <div className="bg-gray-50 p-3 rounded">
              <div className="text-xs text-gray-500">Passes</div>
              <div className="font-bold text-lg">{player.assists}</div>
            </div>
            <div className="bg-gray-50 p-3 rounded">
              <div className="text-xs text-gray-500">Cartons</div>
              <div className="font-bold text-lg">{player.yellowCards}</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
