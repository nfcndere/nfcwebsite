export type PositionType = 'GARDIEN' | 'DEFENSEUR' | 'MILIEU' | 'ATTAQUANT';

export interface Player {
  id: string;
  number: number;
  firstName: string;
  lastName: string;
  position: PositionType;
  nationality: string;
  birthDate: string;
  height?: number;
  weight?: number;
  bio?: string;
  photoUrl: string;
  isCaptain?: boolean;
  matchesPlayed: number;
  goalsScored: number;
  assists: number;
  yellowCards: number;
  redCards: number;
  joinedYear: number;
}

export interface MatchItem {
  id: string;
  homeTeam: string;
  awayTeam: string;
  homeScore?: number | null;
  awayScore?: number | null;
  homeLogo?: string;
  awayLogo?: string;
  date: string;
  stadium: string;
  competition: string;
  status: 'PROGRAMME' | 'EN_COURS' | 'TERMINE' | 'REPORTE';
  matchDay?: number;
  summary?: string;
}

export interface StandingItem {
  position: number;
  teamName: string;
  logoUrl?: string;
  played: number;
  won: number;
  drawn: number;
  lost: number;
  goalsFor: number;
  goalsAgainst: number;
  goalDifference: number;
  points: number;
  form?: string;
}

export interface NewsItem {
  id: string;
  title: string;
  slug: string;
  summary: string;
  content: string;
  coverImage: string;
  category: string;
  createdAt: string;
  author: string;
}

export interface MediaItem {
  id: string;
  title: string;
  url: string;
  type: 'IMAGE' | 'VIDEO';
  album: string;
  createdAt: string;
}

export interface AcademyFormInput {
  childFullName: string;
  birthDate: string;
  category: 'U13' | 'U15' | 'U17' | 'U20';
  position: PositionType;
  parentName: string;
  parentEmail: string;
  parentPhone: string;
  address: string;
  notes?: string;
}
