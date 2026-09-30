const fs = require('fs');
const path = require('path');
const { Client } = require('pg');
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

const connectionString = process.env.DIRECT_URL || process.env.DATABASE_URL;

console.log('🌱 Seeding database via PG client...');

const client = new Client({
  connectionString: connectionString,
  ssl: { rejectUnauthorized: false },
});

async function seed() {
  try {
    await client.connect();

    // 1. Admin user
    const hash = await bcrypt.hash('admin123', 10);
    await client.query(`
      INSERT INTO "User" (id, name, email, "passwordHash", role, "updatedAt")
      VALUES ('admin-id-1', 'Admin NFC', 'admin@nfc.local', $1, 'ADMIN', NOW())
      ON CONFLICT (email) DO UPDATE SET "passwordHash" = EXCLUDED."passwordHash";
    `, [hash]);
    console.log('👤 Admin user seeded: admin@nfc.local / admin123');

    // 2. Players
    const players = [
      { id: 'p1', fn: 'Ibrahim', ln: 'Ousmanou', num: 1, pos: 'GARDIEN', bio: 'Dernier rempart infranchissable, formé à l\'académie NFC.' },
      { id: 'p2', fn: 'Emmanuel', ln: 'Ndjeng', num: 4, pos: 'DEFENSEUR', bio: 'Patron de la défense centrale. Capitaine emblématique.' },
      { id: 'p3', fn: 'Samuel', ln: 'Bassi', num: 9, pos: 'ATTAQUANT', bio: 'Meilleur buteur du club cette saison.' },
      { id: 'p4', fn: 'Abdoulaye', ln: 'Hamadou', num: 10, pos: 'MILIEU', bio: 'Meneur de jeu et chef d\'orchestre au milieu.' },
    ];

    for (const p of players) {
      await client.query(`
        INSERT INTO "Player" (id, "firstName", "lastName", number, position, nationality, bio, "isCaptain", "updatedAt")
        VALUES ($1, $2, $3, $4, $5, 'Camerounaise', $6, $7, NOW())
        ON CONFLICT (id) DO NOTHING;
      `, [p.id, p.fn, p.ln, p.num, p.pos, p.bio, p.id === 'p2']);
    }
    console.log('⚽ Players seeded.');

    // 3. Matches
    const matches = [
      {
        id: 'm1',
        home: 'Ngaoundéré FC',
        away: 'Ngaoundéré University FC',
        date: '2026-10-04 15:30:00',
        stadium: 'Stade Municipal de Ngaoundéré',
        comp: 'Ligue Régionale de l\'Adamaoua - Journée 14',
        status: 'PROGRAMME',
        summary: 'Le derby local de Ngaoundéré.'
      },
      {
        id: 'm2',
        home: 'Renaissance de Meiganga',
        away: 'Ngaoundéré FC',
        date: '2026-09-20 16:00:00',
        stadium: 'Stade Municipal de Meiganga',
        comp: 'Ligue Régionale de l\'Adamaoua - Journée 13',
        status: 'TERMINE',
        summary: 'Victoire 2-1 à l\'extérieur.'
      }
    ];

    for (const m of matches) {
      await client.query(`
        INSERT INTO "Match" (id, date, "homeTeam", "awayTeam", stadium, competition, status, summary, "updatedAt")
        VALUES ($1, $2, $3, $4, $5, $6, $7, $8, NOW())
        ON CONFLICT (id) DO NOTHING;
      `, [m.id, m.date, m.home, m.away, m.stadium, m.comp, m.status, m.summary]);
    }
    console.log('📅 Matches seeded.');

    // 4. Articles
    await client.query(`
      INSERT INTO "Article" (id, slug, title, summary, content, category, published, "publishedAt", "updatedAt")
      VALUES ($1, $2, $3, $4, $5, $6, $7, NOW(), NOW())
      ON CONFLICT (slug) DO NOTHING;
    `, [
      'art-1',
      'lancement-officiel-saison-2026-2027',
      'LANCEMENT OFFICIEL DE LA SAISON 2026-2027 : LES VERT ET BLANC SONT DE RETOUR !',
      "Le Ngaoundéré Football Club dévoile ses ambitions pour la nouvelle saison en Ligue Régionale de l'Adamaoua.",
      "Le coup d'envoi de la saison a été officiellement donné au Stade Municipal de Ngaoundéré.",
      'ACTUALITE',
      true
    ]);
    console.log('📰 Article seeded.');

    console.log('\n🎉🎉 DATABASE SEEDING COMPLETED SUCCESSFULLY!');
    await client.end();
  } catch (err) {
    console.error('❌ Seeding failed:', err);
    process.exit(1);
  }
}

seed();
