import type { MatchItem } from '@/types';

export type MatchState = 'UPCOMING' | 'LIVE' | 'AWAITING_RESULT' | 'FINISHED' | 'POSTPONED' | 'CANCELLED';

const LIVE_WINDOW_MS = 2 * 60 * 60 * 1_000;

export function getMatchState(match: MatchItem | null, now: Date): MatchState | null {
  if (!match) return null;
  if (match.status === 'REPORTE') return 'POSTPONED';
  if (match.status === 'ANNULE') return 'CANCELLED';
  if (match.status === 'TERMINE') return 'FINISHED';
  if (match.status === 'EN_COURS') {
    const startsAt = new Date(match.date).getTime();
    return Number.isFinite(startsAt) && now.getTime() >= startsAt && now.getTime() <= startsAt + LIVE_WINDOW_MS
      ? 'LIVE'
      : 'AWAITING_RESULT';
  }
  if (match.status === 'PROGRAMME') {
    return new Date(match.date).getTime() > now.getTime() ? 'UPCOMING' : 'AWAITING_RESULT';
  }
  return 'AWAITING_RESULT';
}

export function getNextMatch(matches: MatchItem[], now: Date) {
  return matches
    .filter((match) => match.status === 'PROGRAMME' && new Date(match.date).getTime() > now.getTime())
    .sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime())[0] ?? null;
}

export function getOrdinalFr(value: number) {
  return value === 1 ? '1er' : `${value}e`;
}

export function getGoalDifferenceLabel(value: number) {
  return value > 0 ? `+${value}` : value < 0 ? `−${Math.abs(value)}` : '0';
}

export function isStandingConsistent(row: {
  played: number; won: number; drawn: number; lost: number;
  goalsFor: number; goalsAgainst: number; goalDifference: number; points: number;
}) {
  return row.played === row.won + row.drawn + row.lost &&
    row.points === row.won * 3 + row.drawn &&
    row.goalDifference === row.goalsFor - row.goalsAgainst;
}
