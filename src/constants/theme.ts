/**
 * Theme constants and design system definitions for Ngaoundéré Football Club (NFC)
 * Primary colors: Vert (#008751), Blanc (#ffffff), Neutral (#f7f8f7, #0c130e, #1f2937)
 * Yellow (#ffcc00) is used for subtle details & micro-accents only.
 */

export const NFC_THEME = {
  colors: {
    green: {
      50: '#f3fbe6',
      100: '#e6f7cd',
      500: '#8CEA5A',
      600: '#78D04A',
      700: '#66B93A',
      900: '#0c130e',
    },
    yellow: {
      500: '#2FA84D', // Replaced yellow with distinct accent green
      hover: '#238A3E',
    },
    neutral: {
      bg: '#f7f8f7',
      dark: '#0c130e',
      surface: '#ffffff',
      text: '#1f2937',
      muted: '#6b7280',
      border: '#e5e7eb',
    },
  },
  club: {
    fullName: 'Ngaoundéré Football Club',
    shortName: 'NFC',
    nickname: 'L\'Étoile de l\'Adamaoua',
    founded: 2008,
    stadium: 'Stade Municipal de Ngaoundéré',
    capacity: '10 000 Places',
    city: 'Ngaoundéré, Région de l\'Adamaoua, Cameroun',
    league: 'Ligue Régionale de l\'Adamaoua',
  },
  navLinks: [
    { href: '/', label: 'ACCUEIL' },
    { href: '/actualites', label: 'ACTUALITÉS' },
    { href: '/effectif', label: 'EFFECTIF' },
    { href: '/calendrier', label: 'CALENDRIER' },
    { href: '/classement', label: 'CLASSEMENT' },
    { href: '/academie', label: 'ACADÉMIE' },
    { href: '/galerie', label: 'MÉDIATHÈQUE' },
    { href: '/le-club', label: 'LE CLUB' },
  ],
};

export type ThemeColors = typeof NFC_THEME.colors;
