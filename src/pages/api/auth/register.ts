import { NextApiRequest, NextApiResponse } from 'next';
import bcrypt from 'bcryptjs';
import { prisma } from '@/lib/prisma';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const body = req.body ?? {};
  const name = String(body.name || '').trim();
  const email = String(body.email || '').trim().toLowerCase();
  const password = String(body.password || '');

  if (!name || !email || !password) {
    return res.status(400).json({ error: 'Name, email and password are required' });
  }

  if (password.length < 6) {
    return res.status(400).json({ error: 'Password must contain at least 6 characters' });
  }

  const exists = await (prisma as any).user.findUnique({ where: { email } });
  if (exists) {
    return res.status(409).json({ error: 'User already exists' });
  }

  const passwordHash = await bcrypt.hash(password, 10);
  const user = await (prisma as any).user.create({
    data: {
      name,
      email,
      passwordHash,
      role: 'USER',
    },
  });

  return res.status(201).json({
    data: {
      id: user.id,
      name: user.name,
      email: user.email,
      role: user.role,
    },
  });
}
