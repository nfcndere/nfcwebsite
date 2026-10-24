const fs = require('fs');
const path = require('path');
const { PrismaClient } = require('@prisma/client');
const bcrypt = require('bcryptjs');

let envPath = path.join(__dirname, '..', '.env.local');
if (!fs.existsSync(envPath)) {
  envPath = path.join(__dirname, '..', '.env');
}

if (fs.existsSync(envPath)) {
  const lines = fs.readFileSync(envPath, 'utf8').split('\n');
  lines.forEach((line) => {
    const match = line.match(/^\s*([\w_]+)\s*=\s*"?([^"\r\n]+)"?/);
    if (match) {
      process.env[match[1]] = match[2];
    }
  });
}

const prisma = new PrismaClient();

async function main() {
  if (process.env.NODE_ENV === 'production') {
    throw new Error('The demo seed cannot run in production.');
  }
  if (process.env.ENABLE_DEMO_SEED !== 'true') {
    throw new Error('Set ENABLE_DEMO_SEED=true to explicitly load development demo data.');
  }
  if (!process.env.SEED_ADMIN_PASSWORD || process.env.SEED_ADMIN_PASSWORD.length < 16) {
    throw new Error('Set SEED_ADMIN_PASSWORD to a unique password of at least 16 characters.');
  }
  console.log('🌱 Loading DEVELOPMENT-ONLY demo data for Ngaoundéré FC...');

  // Development-only account and sample content; never use for real club data.
  const passwordHash = await bcrypt.hash(process.env.SEED_ADMIN_PASSWORD, 10);
  const adminUser = await prisma.user.upsert({
    where: { email: 'admin@nfc.local' },
    update: {},
    create: {
      name: 'Admin NFC',
      email: 'admin@nfc.local',
      passwordHash: passwordHash,
      role: 'ADMIN',
    },
  });
  console.log('👤 Admin user created/verified:', adminUser.email);

  // 2. Initial Players
  const players = [
    {
      firstName: 'Ibrahim',
      lastName: 'Ousmanou',
      number: 1,
      position: 'GARDIEN',
      nationality: 'Camerounaisse',
      bio: 'Dernier rempart infranchissable, formé à l\'académie NFC.',
      isCaptain: false,
    },
    {
      firstName: 'Emmanuel',
      lastName: 'Ndjeng',
      number: 4,
      position: 'DEFENSEUR',
      nationality: 'Camerounaisse',
      bio: 'Patron de la défense centrale. Capitaine emblématique.',
      isCaptain: true,
    },
    {
      firstName: 'Samuel',
      lastName: 'Bassi',
      number: 9,
      position: 'ATTAQUANT',
      nationality: 'Camerounaisse',
      bio: 'Meilleur buteur du club cette saison.',
      isCaptain: false,
    },
    {
      firstName: 'Abdoulaye',
      lastName: 'Hamadou',
      number: 10,
      position: 'MILIEU',
      nationality: 'Camerounaisse',
      bio: 'Meneur de jeu et chef d\'orchestre au milieu.',
      isCaptain: false,
    },
  ];

  for (const player of players) {
    const existing = await prisma.player.findFirst({
      where: { firstName: player.firstName, lastName: player.lastName },
    });
    if (!existing) {
      await prisma.player.create({ data: player });
    }
  }
  console.log('⚽ Players seeded.');

  // 3. Initial Matches
  const matches = [
    {
      homeTeam: 'Ngaoundéré FC',
      awayTeam: 'Ngaoundéré University FC',
      date: new Date('2026-10-04T15:30:00Z'),
      stadium: 'Stade Municipal de Ngaoundéré',
      competition: 'Ligue Régionale de l\'Adamaoua - Journée 14',
      status: 'PROGRAMME',
      summary: 'Le derby local de Ngaoundéré.',
    },
    {
      homeTeam: 'Renaissance de Meiganga',
      awayTeam: 'Ngaoundéré FC',
      homeScore: 1,
      awayScore: 2,
      date: new Date('2026-09-20T16:00:00Z'),
      stadium: 'Stade Municipal de Meiganga',
      competition: 'Ligue Régionale de l\'Adamaoua - Journée 13',
      status: 'TERMINE',
      summary: 'Victoire 2-1 à l\'extérieur.',
    },
  ];

  for (const match of matches) {
    const existing = await prisma.match.findFirst({
      where: { homeTeam: match.homeTeam, awayTeam: match.awayTeam, date: match.date },
    });
    if (!existing) {
      await prisma.match.create({ data: match });
    }
  }
  console.log('📅 Matches seeded.');

  // 4. Initial Articles
  const articles = [
    {
      slug: 'lancement-officiel-saison-2026-2027',
      title: 'LANCEMENT OFFICIEL DE LA SAISON 2026-2027 : LES VERT ET BLANC SONT DE RETOUR !',
      summary: 'Le Ngaoundéré Football Club dévoile ses ambitions pour la nouvelle saison en Ligue Régionale de l\'Adamaoua.',
      content: 'Le coup d\'envoi de la saison a été officiellement donné au Stade Municipal de Ngaoundéré.',
      category: 'ACTUALITE',
      published: true,
      publishedAt: new Date(),
    },
  ];

  for (const article of articles) {
    await prisma.article.upsert({
      where: { slug: article.slug },
      update: {},
      create: article,
    });
  }
  console.log('📰 Articles seeded.');

  console.log('✅ Seeding completed successfully!');
}

main()
  .catch((e) => {
    console.error('❌ Seeding failed:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
