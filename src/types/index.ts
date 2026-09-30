// ===================================
// Types de position
// ===================================
export type PositionType = 'GARDIEN' | 'DEFENSEUR' | 'MILIEU' | 'ATTAQUANT';

// ===================================
// Joueur
// ===================================
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

// ===================================
// Membre du staff technique
// ===================================
export interface StaffMember {
  id: string;
  initials: string;
  fullName: string;
  role: string;
  detail: string;
  bgColor: 'green' | 'dark' | 'gray';
}

// ===================================
// Match
// ===================================
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

// ===================================
// Classement
// ===================================
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

// ===================================
// Article / Actualité
// ===================================
export interface NewsItem {
  id: string;
  title: string;
  slug: string;
  summary: string;
  content: string;
  coverImage: string;
  videoUrl?: string; // URL vidéo (YouTube embed, etc.)
  category: string;
  createdAt: string;
  author: string;
}

// ===================================
// Média galerie
// ===================================
export interface MediaItem {
  id: string;
  title: string;
  url: string;
  type: 'IMAGE' | 'VIDEO';
  album: string;
  createdAt: string;
  // Joueur associé optionnel (pour la page détail joueur)
  playerId?: string;
  playerName?: string;
}

// ===================================
// Formulaire académie
// ===================================
export interface AcademyFormInput {
  childFullName: string;
  birthDate: string;
  category: 'U13' | 'U15' | 'U17' | 'U20';
  position: PositionType;
  parentName: string;
  parentEmail: string;
  parentPhone: string;
  address: string;
  description?: string; // Besoins / description de la candidature
  notes?: string;
}

// ===================================
// Trophée / Palmarès
// ===================================
export interface TropheeItem {
  id: string;
  title: string;
  competition: string;
  year: number;
  description: string;
  imageUrl?: string;
  type: 'TITRE' | 'COUPE' | 'DISTINCTION';
}

// ===================================
// Légende du club
// ===================================
export interface LegendeItem {
  id: string;
  fullName: string;
  period: string; // ex: "2010-2018"
  position: string;
  imageUrl: string;
  story: string; // Courte histoire / palmarès personnel
  caps?: number; // Nombre de matchs
  goals?: number;
}
