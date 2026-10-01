import { Player, StaffMember, MatchItem, StandingItem, NewsItem, MediaItem, TropheeItem, LegendeItem } from '@/types';

// ===================================
// INFOS GÉNÉRALES DU CLUB
// ===================================
export const CLUB_INFO = {
  name: 'Ngaoundéré Football Club',
  shortName: 'NFC',
  nickname: "L'Étoile de l'Adamaoua",
  founded: 2004,
  stadium: 'Stade Municipal de Ngaoundéré (Cote 1392)',
  capacity: '1 000 places',
  president: 'BEKONO NKOA WILDFRIED',
  headCoach: 'MAMOUDOU DAIROU',
  season: 'SAISON 2026-2027',
  city: 'Ngaoundéré, Adamaoua, Cameroun',
  colors: {
    primary: '#008751', // Vert NFC
    secondary: '#ffffff', // Blanc Pur
    accent: '#FFCC00', // Jaune Or NFC
  }
};

// ===================================
// COMITÉ DIRECTEUR (LE CLUB) - SAISON 2026-2027
// ===================================
export const MANAGEMENT_DATA = [
  {
    id: 'm1',
    badge: 'PRÉSIDENCE',
    name: 'BEKONO NKOA WILDFRIED',
    role: 'Président du Club',
    desc: 'Président exécutif et guide de la vision stratégique du Ngaoundéré FC pour la Saison 2026-2027.',
    highlight: true,
  },
  {
    id: 'm2',
    badge: 'VICE-PRÉSIDENCE',
    name: 'ABDOU RAHIM',
    role: 'Vice-Président',
    desc: 'Supervise les affaires institutionnelles, les partenariats et le soutien stratégique aux opérations.',
    highlight: false,
  },
  {
    id: 'm3',
    badge: 'COORDINATION GÉNÉRALE',
    name: 'TCHAKOUTE ROGER',
    role: 'Coordonnateur Général',
    desc: 'Garant de l\'efficacité opérationnelle, administrative et logistique globale du club.',
    highlight: false,
  },
  {
    id: 'm4',
    badge: 'DIRECTION TECHNIQUE',
    name: 'NGUE NGUE NTEP',
    role: 'Directeur Technique',
    desc: 'Architecte du projet de jeu, superviseur de l\'encadrement et de la politique sportive.',
    highlight: false,
  },
  {
    id: 'm5',
    badge: 'DIRECTION SPORTIVE',
    name: 'OMER TABA KOHLEUR',
    role: 'Directeur Sportif',
    desc: 'Responsable du recrutement, de la gestion de l\'effectif professionnel et du développement sportif.',
    highlight: false,
  },
  {
    id: 'm6',
    badge: 'SECRÉTARIAT GÉNÉRAL',
    name: 'KOUETE NJIPAP Hilaire',
    role: 'Secrétaire Général',
    desc: 'Chef des services administratifs, de la coordination des compétitions et du suivi juridique.',
    highlight: false,
  },
];

// ===================================
// ENCADREMENT ACADÉMIE - SAISON 2026-2027
// ===================================
export const ACADEMY_STAFF_DATA = [
  {
    id: 'ac1',
    name: 'EDWOOD RICHARD',
    role: 'Responsable de l\'Académie',
    detail: 'Directeur & Superviseur du Centre de Formation (Saison 2026-2027)',
    badge: 'RESPONSABLE',
  },
  {
    id: 'ac2',
    name: 'YAYA ANDRÉ',
    role: 'Entraîneur Académie',
    detail: 'Encadrement Technique Jeunes & Détection (Saison 2026-2027)',
    badge: 'ENTRAÎNEUR',
  },
  {
    id: 'ac3',
    name: 'MORBE MATURIN',
    role: 'Entraîneur Académie',
    detail: 'Encadrement Technique Jeunes & Formations (Saison 2026-2027)',
    badge: 'ENTRAÎNEUR',
  },
  {
    id: 'ac4',
    name: 'MAIDOBA BERNADETTE ARMANDINE',
    role: 'Entraîneure Académie',
    detail: 'Encadrement Technique Pré-Formation & Jeunes (Saison 2026-2027)',
    badge: 'ENTRAÎNEURE',
  },
];

// ===================================
// JOUEURS
// ===================================
export const PLAYERS_DATA: Player[] = [];

// ===================================
// STAFF TECHNIQUE ÉQUIPE PREMIÈRE - SAISON 2026-2027
// ===================================
export const STAFF_DATA: StaffMember[] = [
  {
    id: 's1',
    initials: 'MD',
    fullName: 'MAMOUDOU DAIROU',
    role: 'COACH PRINCIPAL',
    detail: 'Entraîneur Principal • Licence A CAF • Saison 2026-2027',
    bgColor: 'green',
  },
  {
    id: 's2',
    initials: 'AO',
    fullName: 'ALI JEAN OTIS',
    role: 'COACH ADJOINT',
    detail: 'Entraîneur Adjoint • Saison 2026-2027',
    bgColor: 'dark',
  },
  {
    id: 's3',
    initials: 'BB',
    fullName: 'BABA BASILE',
    role: 'COACH ADJOINT',
    detail: 'Entraîneur Adjoint • Saison 2026-2027',
    bgColor: 'dark',
  },
  {
    id: 's4',
    initials: 'YO',
    fullName: 'YOUSSOUFA OUMAROU',
    role: 'PRÉPARATEUR PHYSIQUE',
    detail: 'Préparation Physique & Athlétique • Saison 2026-2027',
    bgColor: 'green',
  },
];

// ===================================
// MATCHS
// ===================================
export const MATCHES_DATA: MatchItem[] = [];

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
export const NEWS_DATA: NewsItem[] = [];

// ===================================
// GALERIE MÉDIAS
// ===================================
export const GALLERY_DATA: MediaItem[] = [];

// ===================================
// TROPHÉES & PALMARÈS
// ===================================
export const TROPHEES_DATA: TropheeItem[] = [
  {
    id: 't-2008-2009',
    title: 'Champion de l\'Adamaoua & Accession en Élite Two',
    competition: 'Championnat Régional de l\'Adamaoua',
    year: '2008-2009',
    description: 'Sacre régional marquant la première grande montée historique du club en MTN Élite Two.',
    imageUrl: 'https://images.unsplash.com/photo-1574629810360-7efbbe195018?q=80&w=800&auto=format&fit=crop',
    type: 'TITRE',
  },
  {
    id: 't-2013-2014',
    title: 'Champion Régional de l\'Adamaoua',
    competition: 'Ligue Régionale de l\'Adamaoua',
    year: '2013-2014',
    description: 'Deuxième sacre de champion régional après un parcours sans faute.',
    type: 'TITRE',
  },
  {
    id: 't-2016-2017',
    title: 'Champion de l\'Adamaoua & Montée en Élite Two',
    competition: 'Championnat Régional de l\'Adamaoua',
    year: '2016-2017',
    description: 'Sacre magistral et deuxième accession du Ngaoundéré FC au championnat national professionnel Élite Two.',
    imageUrl: 'https://images.unsplash.com/photo-1508098682722-e99c43a406b2?q=80&w=800&auto=format&fit=crop',
    type: 'TITRE',
  },
  {
    id: 't-2021-2022',
    title: 'Champion de l\'Adamaoua',
    competition: 'Ligue Régionale de l\'Adamaoua',
    year: '2021-2022',
    description: 'Quatrième titre de champion de la région de l\'Adamaoua consolidant la suprématie des Vert et Blanc.',
    type: 'TITRE',
  },
  {
    id: 't-jeunes-u17',
    title: 'Champion du Tournoi de l\'Enfant Africain (U17)',
    competition: 'Tournoi d\'Akono (Catégorie U17)',
    year: 2023,
    description: 'Victoire éclatante des pépites de l\'Académie NFC à Akono, couronnant les jeunes espoirs du club au niveau national.',
    imageUrl: 'https://images.unsplash.com/photo-1543326727-cf6c39e8f84c?q=80&w=800&auto=format&fit=crop',
    type: 'COUPE',
  },
  {
    id: 't-jeunes-u19',
    title: 'Vainqueur du Djamaor Challenge (U19)',
    competition: 'Tournoi Garoua par Coton Sport (Catégorie U19)',
    year: 2023,
    description: 'Titre de prestige remporté à Garoua lors du Djamaor Challenge organisé par Coton Sport de Garoua.',
    imageUrl: 'https://images.unsplash.com/photo-1522778119026-d647f0596c20?q=80&w=800&auto=format&fit=crop',
    type: 'COUPE',
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
