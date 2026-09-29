import { Player, MatchItem, StandingItem, NewsItem, MediaItem } from '@/types';

export const CLUB_INFO = {
  name: 'Ngaoundéré Football Club',
  shortName: 'NFC',
  nickname: 'Les Galactiques de l\'Adamaoua',
  founded: 2008,
  stadium: 'Stade Municipal de Ngaoundéré (Cote 1392)',
  capacity: '10,000 places',
  president: 'El Hadj Mohamadou Bello',
  headCoach: 'Coach Simplice Mbarga',
  city: 'Ngaoundéré, Adamaoua, Cameroun',
  colors: {
    primary: '#059669', // Vert Emeraude
    secondary: '#ffffff', // Blanc Pure
    accent: '#fbbf24', // Or Adamaoua
  }
};

export const PLAYERS_DATA: Player[] = [
  {
    id: 'p1',
    number: 1,
    firstName: 'Ibrahim',
    lastName: 'Ousmanou',
    position: 'GARDIEN',
    nationality: 'Camerounaise',
    birthDate: '1998-05-14',
    height: 188,
    weight: 82,
    bio: 'Dernier rempart infranchissable, formé à l\'académie NFC. Capitaine adjoint de l\'équipe fanion.',
    photoUrl: 'https://images.unsplash.com/photo-1543326727-cf6c39e8f84c?q=80&w=800&auto=format&fit=crop',
    isCaptain: false,
    matchesPlayed: 18,
    goalsScored: 0,
    assists: 0,
    yellowCards: 1,
    redCards: 0,
    joinedYear: 2021,
  },
  {
    id: 'p2',
    number: 4,
    firstName: 'Emmanuel',
    lastName: 'Ndjeng',
    position: 'DEFENSEUR',
    nationality: 'Camerounaise',
    birthDate: '1997-11-20',
    height: 186,
    weight: 80,
    bio: 'Patron de la défense centrale. Puissant dans le jeu aérien et le marquage individuel.',
    photoUrl: 'https://images.unsplash.com/photo-1508098682722-e99c43a406b2?q=80&w=800&auto=format&fit=crop',
    isCaptain: true,
    matchesPlayed: 20,
    goalsScored: 3,
    assists: 1,
    yellowCards: 4,
    redCards: 0,
    joinedYear: 2020,
  },
  {
    id: 'p3',
    number: 6,
    firstName: 'Oumarou',
    lastName: 'Aboubakar',
    position: 'MILIEU',
    nationality: 'Camerounaise',
    birthDate: '2001-03-08',
    height: 178,
    weight: 73,
    bio: 'Métronome du milieu de terrain. Excellente vision du jeu et distribue des caviars.',
    photoUrl: 'https://images.unsplash.com/photo-1517466787929-bc90951d0974?q=80&w=800&auto=format&fit=crop',
    isCaptain: false,
    matchesPlayed: 19,
    goalsScored: 5,
    assists: 8,
    yellowCards: 2,
    redCards: 0,
    joinedYear: 2022,
  },
  {
    id: 'p4',
    number: 9,
    firstName: 'Samuel',
    lastName: 'Bassi',
    position: 'ATTAQUANT',
    nationality: 'Camerounaise',
    birthDate: '2002-09-12',
    height: 183,
    weight: 76,
    bio: 'Meilleur buteur du club cette saison avec 14 réalisations. Vitesse explosive et finition clinique.',
    photoUrl: 'https://images.unsplash.com/photo-1508098682722-e99c43a406b2?q=80&w=800&auto=format&fit=crop',
    isCaptain: false,
    matchesPlayed: 22,
    goalsScored: 14,
    assists: 4,
    yellowCards: 3,
    redCards: 0,
    joinedYear: 2023,
  },
  {
    id: 'p5',
    number: 10,
    firstName: 'Abdoulaye',
    lastName: 'Hamadou',
    position: 'MILIEU',
    nationality: 'Camerounaise',
    birthDate: '2000-01-25',
    height: 175,
    weight: 70,
    bio: 'Meneur de jeu virevoltant. Dribbleur hors pair adore déstabiliser les défenses adverse.',
    photoUrl: 'https://images.unsplash.com/photo-1517466787929-bc90951d0974?q=80&w=800&auto=format&fit=crop',
    isCaptain: false,
    matchesPlayed: 21,
    goalsScored: 7,
    assists: 10,
    yellowCards: 2,
    redCards: 0,
    joinedYear: 2021,
  },
  {
    id: 'p6',
    number: 7,
    firstName: 'Patrick',
    lastName: 'Eto\'o',
    position: 'ATTAQUANT',
    nationality: 'Camerounaise',
    birthDate: '2003-04-18',
    height: 180,
    weight: 74,
    bio: 'Ailier percutant et rapide sur le flanc droit, produit purement formé à l\'Académie NFC.',
    photoUrl: 'https://images.unsplash.com/photo-1543326727-cf6c39e8f84c?q=80&w=800&auto=format&fit=crop',
    isCaptain: false,
    matchesPlayed: 16,
    goalsScored: 6,
    assists: 5,
    yellowCards: 1,
    redCards: 0,
    joinedYear: 2024,
  }
];

// Helper: lookup by id (for convenience in pages)
export const getPlayerById = (id: string) => PLAYERS_DATA.find((p) => p.id === id);

export const MATCHES_DATA: MatchItem[] = [
  {
    id: 'm1',
    homeTeam: 'Ngaoundéré FC',
    awayTeam: 'Cotonsport de Garoua',
    homeScore: null,
    awayScore: null,
    date: '2026-10-04T15:30:00Z',
    stadium: 'Stade Municipal de Ngaoundéré',
    competition: 'MTN Elite One - Journée 22',
    status: 'PROGRAMME',
    summary: 'Le grand derby du Grand Nord opposant Ngaoundéré FC au champion en titre.'
  },
  {
    id: 'm2',
    homeTeam: 'Canon de Yaoundé',
    awayTeam: 'Ngaoundéré FC',
    homeScore: 1,
    awayScore: 2,
    date: '2026-09-20T16:00:00Z',
    stadium: 'Stade Ahmadou Ahidjo, Yaoundé',
    competition: 'MTN Elite One - Journée 21',
    status: 'TERMINE',
    summary: 'Superbe victoire à l\'extérieur grâce à un doublé de Samuel Bassi à la 88ème minute !'
  },
  {
    id: 'm3',
    homeTeam: 'Ngaoundéré FC',
    awayTeam: 'Union de Douala',
    homeScore: 3,
    awayScore: 0,
    date: '2026-09-13T15:00:00Z',
    stadium: 'Stade Municipal de Ngaoundéré',
    competition: 'MTN Elite One - Journée 20',
    status: 'TERMINE',
    summary: 'Démonstration collective devant 8 000 supporters survoltés au stade municipal.'
  },
  {
    id: 'm4',
    homeTeam: 'Gazelle FA de Garoua',
    awayTeam: 'Ngaoundéré FC',
    homeScore: 1,
    awayScore: 1,
    date: '2026-09-06T15:30:00Z',
    stadium: 'Stade Roumdé Adjia, Garoua',
    competition: 'MTN Elite One - Journée 19',
    status: 'TERMINE',
    summary: 'Un point précieux arraché dans le temps additionnel.'
  }
];

export const STANDINGS_DATA: StandingItem[] = [
  { position: 1, teamName: 'Cotonsport de Garoua', played: 21, won: 14, drawn: 4, lost: 3, goalsFor: 38, goalsAgainst: 16, goalDifference: 22, points: 46, form: 'V-V-V-N-V' },
  { position: 2, teamName: 'Ngaoundéré FC', played: 21, won: 13, drawn: 5, lost: 3, goalsFor: 34, goalsAgainst: 15, goalDifference: 19, points: 44, form: 'V-V-N-V-V' },
  { position: 3, teamName: 'Canon de Yaoundé', played: 21, won: 12, drawn: 4, lost: 5, goalsFor: 30, goalsAgainst: 18, goalDifference: 12, points: 40, form: 'D-V-V-N-D' },
  { position: 4, teamName: 'Bamboutos de Mbouda', played: 21, won: 11, drawn: 5, lost: 5, goalsFor: 29, goalsAgainst: 20, goalDifference: 9, points: 38, form: 'V-N-D-V-V' },
  { position: 5, teamName: 'Union de Douala', played: 21, won: 9, drawn: 6, lost: 6, goalsFor: 24, goalsAgainst: 22, goalDifference: 2, points: 33, form: 'D-N-V-D-N' },
  { position: 6, teamName: 'Stade Renard de Melong', played: 21, won: 8, drawn: 7, lost: 6, goalsFor: 22, goalsAgainst: 21, goalDifference: 1, points: 31, form: 'N-V-N-N-D' }
];

export const NEWS_DATA: NewsItem[] = [
  {
    id: 'n1',
    title: 'Victoire éclatante de Ngaoundéré FC face au Canon de Yaoundé (2-1)',
    slug: 'victoire-eclatante-face-au-canon-yaounde',
    summary: 'Les Vert et Blanc de Ngaoundéré s\'imposent dans les dernières minutes de jeu grâce à un doublé magistral de Samuel Bassi.',
    content: 'Dans un Stade Ahmadou Ahidjo en ébullition, Ngaoundéré FC a prouvé la force de son mental et la virtuosité tactique du coach Simplice Mbarga. Après l\'ouverture du score des hôtes à la 35ème minute, notre buteur maison Samuel Bassi a égalisé de la tête à la 62ème avant d\'offrir la victoire à la 88ème minute.',
    coverImage: 'https://images.unsplash.com/photo-1508098682722-e99c43a406b2?q=80&w=1200&auto=format&fit=crop',
    category: 'MATCH',
    createdAt: '2026-09-21T10:00:00Z',
    author: 'NFC Communication'
  },
  {
    id: 'n2',
    title: 'Ouverture des Inscriptions pour l\'Académie NFC Saison 2026-2027',
    slug: 'ouverture-inscriptions-academie-nfc-2026-2027',
    summary: 'Le Ngaoundéré Football Club lance sa campagne annuelle de détection et de recrutement pour ses équipes U13, U15, U17 et U20.',
    content: 'Fidèle à sa vocation de pépinière de talents du football camerounais et d\'Afrique Centrale, le NFC ouvre les candidatures pour intégrer le centre de formation de Ngaoundéré. Infrastructures modernes, suivi scolaire rigoureux et encadrement professionnel.',
    coverImage: 'https://images.unsplash.com/photo-1517466787929-bc90951d0974?q=80&w=1200&auto=format&fit=crop',
    category: 'ACADEMIE',
    createdAt: '2026-09-18T14:30:00Z',
    author: 'Direction Technique'
  },
  {
    id: 'n3',
    title: 'Aménagement du Stade Municipal de Ngaoundéré : De nouveaux équipements certifiés',
    slug: 'amenagement-stade-municipal-ngaoundere',
    summary: 'Le club s\'équipe d\'une nouvelle pelouse hybride et d\'éclairages nocturnes aux normes de la FECAFOOT.',
    content: 'Afin d\'offrir aux supporters et aux joueurs un spectacle de premier choix, d\'importants travaux de modernisation ont été menés sur le terrain du Stade Municipal de Ngaoundéré.',
    coverImage: 'https://images.unsplash.com/photo-1543326727-cf6c39e8f84c?q=80&w=1200&auto=format&fit=crop',
    category: 'ACTUALITE',
    createdAt: '2026-09-10T09:15:00Z',
    author: 'Bureau Exécutif'
  },
  {
    id: 'n4',
    title: 'Les Galactiques préparent le derby du Grand Nord face à Cotonsport',
    slug: 'les-galactiques-preparent-le-derby-du-grand-nord',
    summary: 'Le staff technique met l\'accent sur le pressing haut et la qualité du jeu de transition avant la réception du rival historique.',
    content: 'À l\'approche du derby du Grand Nord, l\'encadrement du NFC a insisté sur le travail de répétition dans les phases de récupération et les contres rapides. L\'objectif est clair : dominer le duel du milieu et limiter les espaces derrière la défense.',
    coverImage: 'https://images.unsplash.com/photo-1517649763962-0c623066013b?q=80&w=1200&auto=format&fit=crop',
    category: 'MATCH',
    createdAt: '2026-09-08T08:30:00Z',
    author: 'Staff Technique'
  },
  {
    id: 'n5',
    title: 'L\'Académie NFC dévoile ses 3 meilleures recrues de la saison',
    slug: 'academie-nfc-meilleures-recrues-saison',
    summary: 'Le centre de formation de Ngaoundéré met en avant trois jeunes talents déjà intégrés au groupe professionnel.',
    content: 'Le projet de développement de la jeunesse prend vie dans les sélections U17 et U20. Trois joueurs ont notamment attiré l\'attention du staff par leur maturité, leur technique et leur leadership sur le terrain.',
    coverImage: 'https://images.unsplash.com/photo-1522778119026-d647f0596c20?q=80&w=1200&auto=format&fit=crop',
    category: 'ACADEMIE',
    createdAt: '2026-09-02T12:00:00Z',
    author: 'Département Formation'
  },
  {
    id: 'n6',
    title: 'Le club renforce son dispositif de santé et de récupération',
    slug: 'club-renforce-dispositif-sante-et-recuperation',
    summary: 'NFC inaugure un programme de suivi médical plus strict pour protéger ses joueurs durant la seconde partie de saison.',
    content: 'Le club a mis en place un cadre plus structuré autour des soins, de la prévention et de la récupération. L\'objectif est de protéger les performances tout en limitant les risques physiques liés à un calendrier dense.',
    coverImage: 'https://images.unsplash.com/photo-1574629810360-7efbbe195018?q=80&w=1200&auto=format&fit=crop',
    category: 'ACTUALITE',
    createdAt: '2026-08-28T09:45:00Z',
    author: 'Service Médical'
  }
];

export const GALLERY_DATA: MediaItem[] = [
  {
    id: 'g1',
    title: 'Célébration des joueurs après la victoire derby',
    url: 'https://images.unsplash.com/photo-1508098682722-e99c43a406b2?q=80&w=1200&auto=format&fit=crop',
    type: 'IMAGE',
    album: 'Saison 2025-2026',
    createdAt: '2026-09-20'
  },
  {
    id: 'g2',
    title: 'Entraînement de l\'équipe première à Cote 1392',
    url: 'https://images.unsplash.com/photo-1517466787929-bc90951d0974?q=80&w=1200&auto=format&fit=crop',
    type: 'IMAGE',
    album: 'Entraînements',
    createdAt: '2026-09-15'
  },
  {
    id: 'g3',
    title: 'Académie NFC - Match amical U17',
    url: 'https://images.unsplash.com/photo-1543326727-cf6c39e8f84c?q=80&w=1200&auto=format&fit=crop',
    type: 'IMAGE',
    album: 'Académie',
    createdAt: '2026-09-12'
  },
  {
    id: 'g4',
    title: 'Supporters du NFC au Stade Municipal',
    url: 'https://images.unsplash.com/photo-1489944440615-453fc2b6a9a9?q=80&w=1200&auto=format&fit=crop',
    type: 'IMAGE',
    album: 'Ferveur Supporters',
    createdAt: '2026-09-05'
  }
];
