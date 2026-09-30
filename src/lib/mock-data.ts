import { Player, StaffMember, MatchItem, StandingItem, NewsItem, MediaItem, TropheeItem, LegendeItem } from '@/types';

// ===================================
// INFOS GÉNÉRALES DU CLUB
// ===================================
export const CLUB_INFO = {
  name: 'Ngaoundéré Football Club',
  shortName: 'NFC',
  nickname: 'L\'Étoile de l\'Adamaoua',
  founded: 2008,
  stadium: 'Stade Municipal de Ngaoundéré (Cote 1392)',
  capacity: '10 000 places',
  president: 'El Hadj Mohamadou Bello',
  headCoach: 'Coach Simplice Mbarga',
  city: 'Ngaoundéré, Adamaoua, Cameroun',
  colors: {
    primary: '#1f5f3d', // Vert NFC
    secondary: '#ffffff', // Blanc Pur
    accent: '#8cea5a', // Vert Clair NFC
  }
};

// ===================================
// JOUEURS
// ===================================
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
    number: 5,
    firstName: 'Moussa',
    lastName: 'Adamou',
    position: 'DEFENSEUR',
    nationality: 'Camerounaise',
    birthDate: '1999-07-10',
    height: 184,
    weight: 79,
    bio: 'Latéral gauche combatif et très offensif. Sa vitesse et ses montées régulières en font un atout précieux.',
    photoUrl: 'https://images.unsplash.com/photo-1517466787929-bc90951d0974?q=80&w=800&auto=format&fit=crop',
    isCaptain: false,
    matchesPlayed: 17,
    goalsScored: 1,
    assists: 3,
    yellowCards: 2,
    redCards: 0,
    joinedYear: 2022,
  },
  {
    id: 'p4',
    number: 6,
    firstName: 'Oumarou',
    lastName: 'Aboubakar',
    position: 'MILIEU',
    nationality: 'Camerounaise',
    birthDate: '2001-03-08',
    height: 178,
    weight: 73,
    bio: 'Métronome du milieu de terrain. Excellente vision du jeu et distribue des caviars.',
    photoUrl: 'https://images.unsplash.com/photo-1517649763962-0c623066013b?q=80&w=800&auto=format&fit=crop',
    isCaptain: false,
    matchesPlayed: 19,
    goalsScored: 5,
    assists: 8,
    yellowCards: 2,
    redCards: 0,
    joinedYear: 2022,
  },
  {
    id: 'p5',
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
    id: 'p6',
    number: 10,
    firstName: 'Abdoulaye',
    lastName: 'Hamadou',
    position: 'MILIEU',
    nationality: 'Camerounaise',
    birthDate: '2000-01-25',
    height: 175,
    weight: 70,
    bio: 'Meneur de jeu virevoltant. Dribbleur hors pair adore déstabiliser les défenses adverses.',
    photoUrl: 'https://images.unsplash.com/photo-1522778119026-d647f0596c20?q=80&w=800&auto=format&fit=crop',
    isCaptain: false,
    matchesPlayed: 21,
    goalsScored: 7,
    assists: 10,
    yellowCards: 2,
    redCards: 0,
    joinedYear: 2021,
  },
  {
    id: 'p7',
    number: 7,
    firstName: 'Patrick',
    lastName: 'Ngoya',
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
  },
  {
    id: 'p8',
    number: 3,
    firstName: 'Alioum',
    lastName: 'Bouba',
    position: 'DEFENSEUR',
    nationality: 'Camerounaise',
    birthDate: '2000-06-22',
    height: 182,
    weight: 77,
    bio: 'Défenseur central solide, excellent dans les duels aériens. Meneur naturel de la défense.',
    photoUrl: 'https://images.unsplash.com/photo-1489944440615-453fc2b6a9a9?q=80&w=800&auto=format&fit=crop',
    isCaptain: false,
    matchesPlayed: 18,
    goalsScored: 2,
    assists: 0,
    yellowCards: 3,
    redCards: 1,
    joinedYear: 2021,
  },
];

// ===================================
// STAFF TECHNIQUE
// ===================================
export const STAFF_DATA: StaffMember[] = [
  {
    id: 's1',
    initials: 'SM',
    fullName: 'Coach Simplice Mbarga',
    role: 'ENTRAÎNEUR CHEF',
    detail: 'Licence A CAF • Au club depuis 2022',
    bgColor: 'green',
  },
  {
    id: 's2',
    initials: 'HA',
    fullName: 'Hamidou Aliou',
    role: 'ADJOINT',
    detail: 'Ancien Capitaine NFC',
    bgColor: 'dark',
  },
  {
    id: 's3',
    initials: 'BM',
    fullName: 'Dr. Bello Mohamadou',
    role: 'MÉDECIN',
    detail: 'Médecine du Sport',
    bgColor: 'gray',
  },
  {
    id: 's4',
    initials: 'OK',
    fullName: 'Ousmanou Kobo',
    role: 'PRÉPARATEUR ATHLÉTIQUE',
    detail: 'Spécialiste Haute Performance',
    bgColor: 'green',
  },
  {
    id: 's5',
    initials: 'NA',
    fullName: 'Njoya Arouna',
    role: 'ENTRAÎNEUR DES GARDIENS',
    detail: 'Ex-international U23 Cameroun',
    bgColor: 'dark',
  },
  {
    id: 's6',
    initials: 'DM',
    fullName: 'Diouf Malick',
    role: 'ANALYSTE VIDÉO',
    detail: 'Analyse tactique & Data',
    bgColor: 'gray',
  },
];

// ===================================
// MATCHS
// ===================================
export const MATCHES_DATA: MatchItem[] = [
  {
    id: 'm1',
    homeTeam: 'Ngaoundéré FC',
    awayTeam: 'Ngaoundéré University FC',
    homeScore: null,
    awayScore: null,
    date: '2026-10-04T15:30:00Z',
    stadium: 'Stade Municipal de Ngaoundéré',
    competition: 'Ligue Régionale de l\'Adamaoua - Journée 14',
    status: 'PROGRAMME',
    summary: 'Le derby local très attendu de Ngaoundéré opposant le NFC aux universitaires.',
  },
  {
    id: 'm2',
    homeTeam: 'Renaissance de Meiganga',
    awayTeam: 'Ngaoundéré FC',
    homeScore: 1,
    awayScore: 2,
    date: '2026-09-20T16:00:00Z',
    stadium: 'Stade Municipal de Meiganga',
    competition: 'Ligue Régionale de l\'Adamaoua - Journée 13',
    status: 'TERMINE',
    summary: 'Victoire capitale à l\'extérieur grâce à un doublé de Samuel Bassi à la 88ème minute !',
  },
  {
    id: 'm3',
    homeTeam: 'Ngaoundéré FC',
    awayTeam: 'FC Vina de Ngaoundéré',
    homeScore: 3,
    awayScore: 0,
    date: '2026-09-13T15:00:00Z',
    stadium: 'Stade Municipal de Ngaoundéré',
    competition: 'Ligue Régionale de l\'Adamaoua - Journée 12',
    status: 'TERMINE',
    summary: 'Démonstration collective devant 5 000 supporters survoltés au stade municipal.',
  },
  {
    id: 'm4',
    homeTeam: 'AS Bini FC de Ngaoundéré',
    awayTeam: 'Ngaoundéré FC',
    homeScore: 1,
    awayScore: 1,
    date: '2026-09-06T15:30:00Z',
    stadium: 'Stade de la Vina',
    competition: 'Ligue Régionale de l\'Adamaoua - Journée 11',
    status: 'TERMINE',
    summary: 'Un point précieux arraché dans le temps additionnel.',
  },
  {
    id: 'm5',
    homeTeam: 'Ngaoundéré FC',
    awayTeam: 'Mayo-Banyo FC',
    homeScore: null,
    awayScore: null,
    date: '2026-10-18T15:00:00Z',
    stadium: 'Stade Municipal de Ngaoundéré',
    competition: 'Ligue Régionale de l\'Adamaoua - Journée 15',
    status: 'PROGRAMME',
    summary: 'Prochain match à domicile face au Mayo-Banyo FC.',
  },
];

// ===================================
// CLASSEMENT
// ===================================
export const STANDINGS_DATA: StandingItem[] = [
  { position: 1, teamName: 'Ngaoundéré FC', played: 13, won: 10, drawn: 1, lost: 2, goalsFor: 34, goalsAgainst: 12, goalDifference: 22, points: 31, form: 'V-V-N-V-V' },
  { position: 2, teamName: 'Ngaoundéré University FC', played: 13, won: 9, drawn: 2, lost: 2, goalsFor: 28, goalsAgainst: 14, goalDifference: 14, points: 29, form: 'V-V-V-N-V' },
  { position: 3, teamName: 'Renaissance de Meiganga', played: 13, won: 7, drawn: 3, lost: 3, goalsFor: 22, goalsAgainst: 16, goalDifference: 6, points: 24, form: 'D-V-V-N-D' },
  { position: 4, teamName: 'FC Vina de Ngaoundéré', played: 13, won: 6, drawn: 3, lost: 4, goalsFor: 19, goalsAgainst: 18, goalDifference: 1, points: 21, form: 'V-N-D-V-V' },
  { position: 5, teamName: 'AS Bini FC de Ngaoundéré', played: 13, won: 4, drawn: 5, lost: 4, goalsFor: 16, goalsAgainst: 17, goalDifference: -1, points: 17, form: 'D-N-V-D-N' },
  { position: 6, teamName: 'Mayo-Banyo FC', played: 13, won: 3, drawn: 3, lost: 7, goalsFor: 14, goalsAgainst: 23, goalDifference: -9, points: 12, form: 'N-V-N-N-D' },
];

// ===================================
// ACTUALITÉS / ARTICLES
// ===================================
export const NEWS_DATA: NewsItem[] = [
  {
    id: 'n1',
    title: 'LANCEMENT OFFICIEL DE LA SAISON 2026-2027 : LES VERT ET BLANC SONT DE RETOUR !',
    slug: 'lancement-officiel-saison-2026-2027',
    summary: 'Le Ngaoundéré Football Club dévoile ses ambitions pour la nouvelle saison avec une cérémonie grandiose au Stade Municipal. Découvrez les nouvelles recrues, les objectifs du staff et la présentation du maillot officiel.',
    content: 'Le coup d\'envoi de la saison 2026-2027 a été officiellement donné au Stade Municipal de Ngaoundéré dans une atmosphère électrique. Plus de 8 000 supporters ont répondu présents pour accueillir les nouvelles têtes du groupe, découvrir le nouveau maillot vert et blanc et entendre le discours de vision du président El Hadj Mohamadou Bello. Le coach Simplice Mbarga a présenté le projet sportif ambitieux : une qualification en phase de groupes de la CAF Champions League. La saison promet d\'être historique pour l\'Étoile de l\'Adamaoua.',
    coverImage: 'https://images.unsplash.com/photo-1574629810360-7efbbe195018?q=80&w=1200&auto=format&fit=crop',
    // Vidéo de lancement de la nouvelle saison — entrée dans le mock
    videoUrl: 'https://www.youtube.com/embed/dQw4w9WgXcQ',
    category: 'ACTUALITE',
    createdAt: '2026-09-25T10:00:00Z',
    author: 'NFC Communication',
  },
  {
    id: 'n2',
    title: 'Victoire éclatante de Ngaoundéré FC face à Renaissance de Meiganga (2-1)',
    slug: 'victoire-eclatante-face-a-renaissance-meiganga',
    summary: 'Les Vert et Blanc de Ngaoundéré s\'imposent dans les dernières minutes de jeu grâce à un doublé magistral de Samuel Bassi.',
    content: 'Dans un Stade Municipal de Meiganga en ébullition, Ngaoundéré FC a prouvé la force de son mental et la virtuosité tactique du coach Simplice Mbarga.',
    coverImage: 'https://images.unsplash.com/photo-1508098682722-e99c43a406b2?q=80&w=1200&auto=format&fit=crop',
    category: 'MATCH',
    createdAt: '2026-09-21T10:00:00Z',
    author: 'NFC Communication',
  },
  {
    id: 'n3',
    title: 'Ouverture des Inscriptions pour l\'Académie NFC Saison 2026-2027',
    slug: 'ouverture-inscriptions-academie-nfc-2026-2027',
    summary: 'Le Ngaoundéré Football Club lance sa campagne annuelle de détection et de recrutement pour ses équipes U13, U15, U17 et U20.',
    content: 'Fidèle à sa vocation de pépinière de talents, le NFC ouvre les candidatures pour intégrer le centre de formation.',
    coverImage: 'https://images.unsplash.com/photo-1517466787929-bc90951d0974?q=80&w=1200&auto=format&fit=crop',
    category: 'ACADEMIE',
    createdAt: '2026-09-18T14:30:00Z',
    author: 'Direction Technique',
  },
  {
    id: 'n4',
    title: 'Aménagement du Stade Municipal de Ngaoundéré : De nouveaux équipements certifiés',
    slug: 'amenagement-stade-municipal-ngaoundere',
    summary: 'Le club s\'équipe d\'une nouvelle pelouse hybride et d\'éclairages nocturnes aux normes de la FECAFOOT.',
    content: 'D\'importants travaux de modernisation ont été menés sur le Stade Municipal de Ngaoundéré.',
    coverImage: 'https://images.unsplash.com/photo-1543326727-cf6c39e8f84c?q=80&w=1200&auto=format&fit=crop',
    category: 'ACTUALITE',
    createdAt: '2026-09-10T09:15:00Z',
    author: 'Bureau Exécutif',
  },
  {
    id: 'n5',
    title: 'Les Vert et Blanc préparent le derby local face à Ngaoundéré University FC',
    slug: 'les-vert-et-blanc-preparent-le-derby-local',
    summary: 'Le staff technique met l\'accent sur le pressing haut et la qualité du jeu de transition avant le choc de la Ligue Régionale.',
    content: 'À l\'approche du derby de Ngaoundéré, l\'encadrement du NFC a insisté sur le travail de répétition.',
    coverImage: 'https://images.unsplash.com/photo-1517649763962-0c623066013b?q=80&w=1200&auto=format&fit=crop',
    category: 'MATCH',
    createdAt: '2026-09-08T08:30:00Z',
    author: 'Staff Technique',
  },
  {
    id: 'n6',
    title: 'L\'Académie NFC dévoile ses 3 meilleures recrues de la saison',
    slug: 'academie-nfc-meilleures-recrues-saison',
    summary: 'Le centre de formation de Ngaoundéré met en avant trois jeunes talents déjà intégrés au groupe professionnel.',
    content: 'Le projet de développement de la jeunesse prend vie dans les sélections U17 et U20.',
    coverImage: 'https://images.unsplash.com/photo-1522778119026-d647f0596c20?q=80&w=1200&auto=format&fit=crop',
    category: 'ACADEMIE',
    createdAt: '2026-09-02T12:00:00Z',
    author: 'Département Formation',
  },
];

// ===================================
// GALERIE MÉDIAS
// ===================================
export const GALLERY_DATA: MediaItem[] = [
  {
    id: 'g1',
    title: 'Célébration des joueurs après la victoire derby',
    url: 'https://images.unsplash.com/photo-1508098682722-e99c43a406b2?q=80&w=1200&auto=format&fit=crop',
    type: 'IMAGE',
    album: 'Saison 2025-2026',
    createdAt: '2026-09-20',
  },
  {
    id: 'g2',
    title: 'Session d\'entraînement intense à Cote 1392',
    url: 'https://images.unsplash.com/photo-1517466787929-bc90951d0974?q=80&w=1200&auto=format&fit=crop',
    type: 'IMAGE',
    album: 'Entraînements',
    createdAt: '2026-09-15',
    playerId: 'p4',
    playerName: 'Oumarou Aboubakar',
  },
  {
    id: 'g3',
    title: 'Académie NFC - Match amical U17',
    url: 'https://images.unsplash.com/photo-1543326727-cf6c39e8f84c?q=80&w=1200&auto=format&fit=crop',
    type: 'IMAGE',
    album: 'Académie',
    createdAt: '2026-09-12',
  },
  {
    id: 'g4',
    title: 'Supporters du NFC au Stade Municipal',
    url: 'https://images.unsplash.com/photo-1489944440615-453fc2b6a9a9?q=80&w=1200&auto=format&fit=crop',
    type: 'IMAGE',
    album: 'Ferveur Supporters',
    createdAt: '2026-09-05',
  },
  {
    id: 'g5',
    title: 'Immersion entraînement — vue du terrain',
    url: 'https://images.unsplash.com/photo-1574629810360-7efbbe195018?q=80&w=1200&auto=format&fit=crop',
    type: 'IMAGE',
    album: 'Entraînements',
    createdAt: '2026-09-18',
    playerId: 'p5',
    playerName: 'Samuel Bassi',
  },
  {
    id: 'g6',
    title: 'Remise des trophées fin de saison',
    url: 'https://images.unsplash.com/photo-1522778119026-d647f0596c20?q=80&w=1200&auto=format&fit=crop',
    type: 'IMAGE',
    album: 'Saison 2025-2026',
    createdAt: '2026-06-15',
  },
];

// ===================================
// TROPHÉES & PALMARÈS
// ===================================
export const TROPHEES_DATA: TropheeItem[] = [
  {
    id: 't1',
    title: 'Champion de la Région Adamaoua',
    competition: 'Championnat Régional de l\'Adamaoua',
    year: 2022,
    description: 'Le NFC remporte son 4ème titre régional consécutif et confirme sa domination dans le Grand Nord du Cameroun.',
    imageUrl: 'https://images.unsplash.com/photo-1574629810360-7efbbe195018?q=80&w=800&auto=format&fit=crop',
    type: 'TITRE',
  },
  {
    id: 't2',
    title: 'Champion de la Région Adamaoua',
    competition: 'Championnat Régional de l\'Adamaoua',
    year: 2019,
    description: 'Troisième titre régional pour le NFC, marquant l\'ère de domination du club sous la présidence de El Hadj Mohamadou Bello.',
    type: 'TITRE',
  },
  {
    id: 't3',
    title: 'Champion de la Région Adamaoua',
    competition: 'Championnat Régional de l\'Adamaoua',
    year: 2016,
    description: 'Deuxième sacre régional qui lance définitivement le projet professionnel du Ngaoundéré FC.',
    type: 'TITRE',
  },
  {
    id: 't4',
    title: 'Champion de la Région Adamaoua',
    competition: 'Championnat Régional de l\'Adamaoua',
    year: 2012,
    description: 'Premier titre de champion régional pour le club, seulement 4 ans après sa fondation. Un exploit historique.',
    type: 'TITRE',
  },
  {
    id: 't5',
    title: 'Quart de Finale de la Coupe du Cameroun',
    competition: 'Coupe du Cameroun FECAFOOT',
    year: 2023,
    description: 'Parcours héroïque avec des victoires retentissantes contre les grands clubs de Douala et Yaoundé avant de s\'incliner honorablement.',
    imageUrl: 'https://images.unsplash.com/photo-1522778119026-d647f0596c20?q=80&w=800&auto=format&fit=crop',
    type: 'COUPE',
  },
  {
    id: 't6',
    title: 'Label Centre de Formation 5 Étoiles',
    competition: 'Certification FECAFOOT',
    year: 2021,
    description: 'L\'académie NFC reçoit la distinction suprême de la FECAFOOT, reconnaissant l\'excellence de son programme de formation.',
    type: 'DISTINCTION',
  },
];

// ===================================
// LÉGENDES DU CLUB
// ===================================
export const LEGENDES_DATA: LegendeItem[] = [
  {
    id: 'l1',
    fullName: 'Hamidou Aliou',
    period: '2010 – 2021',
    position: 'Défenseur Central / Capitaine',
    imageUrl: 'https://images.unsplash.com/photo-1543326727-cf6c39e8f84c?q=80&w=600&auto=format&fit=crop',
    story: 'Pilier incontesté de la défense pendant plus d\'une décennie, Hamidou Aliou a incarné l\'âme du Ngaoundéré FC. Capitaine pendant 7 saisons, il a conduit l\'équipe vers ses quatre sacres régionaux et son historique quart de finale en Coupe du Cameroun. Aujourd\'hui adjoint du coach Simplice Mbarga, il transmet sa passion et sa rigueur aux jeunes générations.',
    caps: 287,
    goals: 18,
  },
  {
    id: 'l2',
    fullName: 'Jean-Pierre Mfoumou',
    period: '2008 – 2016',
    position: 'Attaquant Centre',
    imageUrl: 'https://images.unsplash.com/photo-1508098682722-e99c43a406b2?q=80&w=600&auto=format&fit=crop',
    story: 'Fondateur et premier grand capitaine de l\'équipe, Jean-Pierre Mfoumou a marqué de son empreinte les débuts historiques du NFC. Meilleur buteur des trois premières saisons, son flair légendaire et son sens du but ont permis au club de s\'imposer rapidement dans le paysage régional. Il est aujourd\'hui ambassadeur du club.',
    caps: 198,
    goals: 127,
  },
  {
    id: 'l3',
    fullName: 'Yves Aboubakar Oumarou',
    period: '2012 – 2020',
    position: 'Milieu de Terrain Créateur',
    imageUrl: 'https://images.unsplash.com/photo-1517466787929-bc90951d0974?q=80&w=600&auto=format&fit=crop',
    story: 'Cerveau du jeu pendant 8 saisons exceptionnelles, Yves Aboubakar était l\'architecte de toutes les actions offensives. Sa vision hors du commun et son sens de la passe décisive ont fait de lui le meilleur créateur de l\'histoire du club. Ses 156 passes décisives restent un record absolu.',
    caps: 241,
    goals: 63,
  },
];

// ===================================
// HELPERS
// ===================================
// Récupérer un joueur par ID
export const getPlayerById = (id: string) => PLAYERS_DATA.find((p) => p.id === id);

// Récupérer les médias d'un joueur
export const getPlayerMedia = (playerId: string) =>
  GALLERY_DATA.filter((m) => m.playerId === playerId);
