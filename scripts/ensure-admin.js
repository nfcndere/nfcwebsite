const { PrismaClient } = require('@prisma/client');
const bcrypt = require('bcryptjs');

const prisma = new PrismaClient();

async function main() {
  const users = await prisma.user.findMany({
    select: { id: true, email: true, role: true, name: true },
  });

  console.log('USERS', JSON.stringify(users, null, 2));

  const candidate = users.find((user) => user.email === 'admin@nfc.local');

  if (!candidate) {
    const hash = await bcrypt.hash('admin123', 10);
    const created = await prisma.user.create({
      data: {
        name: 'Admin',
        email: 'admin@nfc.local',
        passwordHash: hash,
        role: 'ADMIN',
      },
    });

    console.log('CREATED_ADMIN', JSON.stringify({ id: created.id, email: created.email, role: created.role }, null, 2));
  } else {
    console.log('EXISTING_ADMIN', JSON.stringify({ id: candidate.id, email: candidate.email, role: candidate.role }, null, 2));
  }

  await prisma.$disconnect();
}

main().catch((error) => {
  console.error(error);
  process.exit(1);
});
