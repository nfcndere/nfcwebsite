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

const client = new Client({
  connectionString: connectionString,
  ssl: { rejectUnauthorized: false },
});

async function main() {
  try {
    await client.connect();
    console.log('Connected to DB...');

    // 1. Create Henry user
    const henryHash = await bcrypt.hash('abc123', 10);
    await client.query(`
      INSERT INTO "User" (id, name, email, "passwordHash", role, "updatedAt")
      VALUES ('user-henry-1', 'Henry Admin', 'henry@gmail.com', $1, 'ADMIN', NOW())
      ON CONFLICT (email) DO UPDATE SET "passwordHash" = EXCLUDED."passwordHash", role = 'ADMIN';
    `, [henryHash]);
    console.log('✅ User henry@gmail.com created/updated with password abc123');

    // 2. Create Admin user
    const adminHash = await bcrypt.hash('admin123', 10);
    await client.query(`
      INSERT INTO "User" (id, name, email, "passwordHash", role, "updatedAt")
      VALUES ('admin-id-1', 'Admin NFC', 'admin@nfc.local', $1, 'ADMIN', NOW())
      ON CONFLICT (email) DO UPDATE SET "passwordHash" = EXCLUDED."passwordHash", role = 'ADMIN';
    `, [adminHash]);
    console.log('✅ User admin@nfc.local created/updated with password admin123');

    await client.end();
  } catch (err) {
    console.error('Error creating users:', err);
    process.exit(1);
  }
}

main();
