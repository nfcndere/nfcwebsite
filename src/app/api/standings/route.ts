import { NextRequest, NextResponse } from 'next/server';

// ===================================
// GET /api/standings — Récupérer le classement officiel (Ligue Régionale de l'Adamaoua)
// ===================================
export async function GET(request: NextRequest) {
  const REGIONAL_STANDINGS = [
    { id: 'st-1', teamName: 'Ngaoundéré FC', rank: 1, points: 28, played: 12, won: 9, drawn: 1, lost: 2, goalsFor: 24, goalsAgainst: 10, goalDifference: 14, logo: '/logo.png' },
    { id: 'st-2', teamName: 'Ngaoundéré University FC', rank: 2, points: 25, played: 12, won: 8, drawn: 1, lost: 3, goalsFor: 20, goalsAgainst: 11, goalDifference: 9, logo: null },
    { id: 'st-3', teamName: 'Renaissance de Meiganga', rank: 3, points: 22, played: 12, won: 6, drawn: 4, lost: 2, goalsFor: 18, goalsAgainst: 12, goalDifference: 6, logo: null },
    { id: 'st-4', teamName: 'FC Vina de Ngaoundéré', rank: 4, points: 18, played: 12, won: 5, drawn: 3, lost: 4, goalsFor: 15, goalsAgainst: 14, goalDifference: 1, logo: null },
    { id: 'st-5', teamName: 'AS Bini FC', rank: 5, points: 14, played: 12, won: 4, drawn: 2, lost: 6, goalsFor: 12, goalsAgainst: 17, goalDifference: -5, logo: null },
    { id: 'st-6', teamName: 'Mayo-Banyo FC', rank: 6, points: 9, played: 12, won: 2, drawn: 3, lost: 7, goalsFor: 9, goalsAgainst: 21, goalDifference: -12, logo: null },
  ];

  return NextResponse.json(REGIONAL_STANDINGS);
}
