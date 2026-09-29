"use client";

import React from 'react';
import { MatchItem } from '@/types';

interface Props { match: MatchItem }

export const MatchDetail: React.FC<Props> = ({ match }) => {
  return (
    <div className="max-w-4xl mx-auto bg-white rounded-2xl p-6 shadow-sm font-body">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="font-display text-2xl font-bold">{match.homeTeam} vs {match.awayTeam}</h2>
          <div className="text-sm text-gray-500">{new Date(match.date).toLocaleString('fr-FR')} — {match.stadium}</div>
        </div>
        <div className="text-right">
          <div className="text-xs text-gray-500">Competition</div>
          <div className="font-bold text-lg">{match.competition}</div>
        </div>
      </div>

      <div className="mt-6">
        <h3 className="font-display text-lg font-bold">Résumé</h3>
        <p className="text-sm text-gray-700 mt-2">{match.summary}</p>
      </div>
    </div>
  );
};
