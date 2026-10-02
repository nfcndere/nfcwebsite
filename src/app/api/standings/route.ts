import { NextRequest, NextResponse } from 'next/server';

// Données par défaut du classement régional (Adamaoua)
let STANDINGS_STORE = [
  {
    id: 'st-nfc-1',
    teamName: 'Ngaoundéré FC',
    rank: 1,
    position: 1,
    points: 31,
    played: 13,
    won: 10,
    drawn: 1,
    lost: 2,
    goalsFor: 34,
    goalsAgainst: 12,
    goalDifference: 22,
    form: 'V-V-N-V-V',
    logo: '/logo.png',
    updatedAt: new Date().toISOString(),
  },
  {
    id: 'st-univ-2',
    teamName: 'Ngaoundéré University FC',
    rank: 2,
    position: 2,
    points: 29,
    played: 13,
    won: 9,
    drawn: 2,
    lost: 2,
    goalsFor: 28,
    goalsAgainst: 14,
    goalDifference: 14,
    form: 'V-V-V-N-V',
    logo: null,
    updatedAt: new Date().toISOString(),
  },
  {
    id: 'st-meig-3',
    teamName: 'Renaissance de Meiganga',
    rank: 3,
    position: 3,
    points: 24,
    played: 13,
    won: 7,
    drawn: 3,
    lost: 3,
    goalsFor: 22,
    goalsAgainst: 16,
    goalDifference: 6,
    form: 'D-V-V-N-D',
    logo: null,
    updatedAt: new Date().toISOString(),
  },
  {
    id: 'st-vina-4',
    teamName: 'FC Vina de Ngaoundéré',
    rank: 4,
    position: 4,
    points: 21,
    played: 13,
    won: 6,
    drawn: 3,
    lost: 4,
    goalsFor: 19,
    goalsAgainst: 18,
    goalDifference: 1,
    form: 'V-N-D-V-V',
    logo: null,
    updatedAt: new Date().toISOString(),
  },
  {
    id: 'st-bini-5',
    teamName: 'AS Bini FC de Ngaoundéré',
    rank: 5,
    position: 5,
    points: 17,
    played: 13,
    won: 4,
    drawn: 5,
    lost: 4,
    goalsFor: 16,
    goalsAgainst: 17,
    goalDifference: -1,
    form: 'D-N-V-D-N',
    logo: null,
    updatedAt: new Date().toISOString(),
  },
  {
    id: 'st-mayo-6',
    teamName: 'Mayo-Banyo FC',
    rank: 6,
    position: 6,
    points: 12,
    played: 13,
    won: 3,
    drawn: 3,
    lost: 7,
    goalsFor: 14,
    goalsAgainst: 23,
    goalDifference: -9,
    form: 'N-V-N-N-D',
    logo: null,
    updatedAt: new Date().toISOString(),
  },
];

// ===================================
// GET /api/standings — Récupérer le classement officiel complet
// ===================================
export async function GET(request: NextRequest) {
  // Trier par points puis différence de buts
  const sortedStandings = [...STANDINGS_STORE].sort((a, b) => {
    if (b.points !== a.points) return b.points - a.points;
    return b.goalDifference - a.goalDifference;
  });

  // Mettre à jour le rang calculé
  sortedStandings.forEach((team, index) => {
    team.rank = index + 1;
    team.position = index + 1;
  });

  const nfcStanding = sortedStandings.find((s) => s.teamName.includes('Ngaoundéré FC')) || sortedStandings[0];

  return NextResponse.json({
    success: true,
    season: '2025-2026',
    competition: "Ligue Régionale de l'Adamaoua",
    nfc: nfcStanding,
    totalTeams: sortedStandings.length,
    data: sortedStandings,
    standings: sortedStandings,
  });
}

// ===================================
// POST /api/standings — Ajouter ou mettre à jour une équipe au classement (Admin)
// ===================================
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { id, teamName, points, played, won, drawn, lost, goalsFor, goalsAgainst, form } = body;

    if (!teamName) {
      return NextResponse.json({ success: false, error: 'Nom de l\'équipe obligatoire' }, { status: 400 });
    }

    const gf = Number(goalsFor || 0);
    const ga = Number(goalsAgainst || 0);
    const diff = gf - ga;

    const existingIndex = id ? STANDINGS_STORE.findIndex((s) => s.id === id) : -1;

    if (existingIndex >= 0) {
      // Mise à jour de l'entrée existante
      STANDINGS_STORE[existingIndex] = {
        ...STANDINGS_STORE[existingIndex],
        teamName,
        points: Number(points || 0),
        played: Number(played || 0),
        won: Number(won || 0),
        drawn: Number(drawn || 0),
        lost: Number(lost || 0),
        goalsFor: gf,
        goalsAgainst: ga,
        goalDifference: diff,
        form: form || 'V-V-V',
        updatedAt: new Date().toISOString(),
      };
    } else {
      // Nouvelle équipe
      const newEntry = {
        id: `st-${Date.now()}`,
        teamName,
        rank: STANDINGS_STORE.length + 1,
        position: STANDINGS_STORE.length + 1,
        points: Number(points || 0),
        played: Number(played || 0),
        won: Number(won || 0),
        drawn: Number(drawn || 0),
        lost: Number(lost || 0),
        goalsFor: gf,
        goalsAgainst: ga,
        goalDifference: diff,
        form: form || 'V-V-V',
        logo: null,
        updatedAt: new Date().toISOString(),
      };
      STANDINGS_STORE.push(newEntry);
    }

    return NextResponse.json({
      success: true,
      message: 'Classement mis à jour avec succès',
      data: STANDINGS_STORE,
    });
  } catch (error: any) {
    return NextResponse.json({ success: false, error: 'Erreur lors de la mise à jour du classement' }, { status: 500 });
  }
}

// ===================================
// PATCH /api/standings — Mettre à jour l'entrée NFC rapidement
// ===================================
export async function PATCH(request: NextRequest) {
  try {
    const body = await request.json();
    const nfcIndex = STANDINGS_STORE.findIndex((s) => s.teamName.includes('Ngaoundéré FC'));

    if (nfcIndex >= 0) {
      if (body.points !== undefined) STANDINGS_STORE[nfcIndex].points = Number(body.points);
      if (body.played !== undefined) STANDINGS_STORE[nfcIndex].played = Number(body.played);
      if (body.won !== undefined) STANDINGS_STORE[nfcIndex].won = Number(body.won);
      if (body.drawn !== undefined) STANDINGS_STORE[nfcIndex].drawn = Number(body.drawn);
      if (body.lost !== undefined) STANDINGS_STORE[nfcIndex].lost = Number(body.lost);
      if (body.goalsFor !== undefined) STANDINGS_STORE[nfcIndex].goalsFor = Number(body.goalsFor);
      if (body.goalsAgainst !== undefined) STANDINGS_STORE[nfcIndex].goalsAgainst = Number(body.goalsAgainst);
      if (body.form !== undefined) STANDINGS_STORE[nfcIndex].form = body.form;
      STANDINGS_STORE[nfcIndex].goalDifference = STANDINGS_STORE[nfcIndex].goalsFor - STANDINGS_STORE[nfcIndex].goalsAgainst;
      STANDINGS_STORE[nfcIndex].updatedAt = new Date().toISOString();
    }

    return NextResponse.json({
      success: true,
      message: 'Position du NFC mise à jour',
      data: STANDINGS_STORE[nfcIndex],
    });
  } catch (error: any) {
    return NextResponse.json({ success: false, error: 'Erreur lors de la mise à jour' }, { status: 500 });
  }
}

// ===================================
// DELETE /api/standings — Supprimer une équipe du classement (Admin)
// ===================================
export async function DELETE(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const id = searchParams.get('id');

    if (!id) {
      return NextResponse.json({ success: false, error: 'ID de l\'équipe requis' }, { status: 400 });
    }

    STANDINGS_STORE = STANDINGS_STORE.filter((s) => s.id !== id);

    return NextResponse.json({
      success: true,
      message: 'Équipe supprimée du classement',
      data: STANDINGS_STORE,
    });
  } catch (error: any) {
    return NextResponse.json({ success: false, error: 'Erreur lors de la suppression' }, { status: 500 });
  }
}

