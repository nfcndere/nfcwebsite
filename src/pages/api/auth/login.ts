import { NextApiRequest, NextApiResponse } from 'next';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { prisma } from '@/lib/prisma';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const { email, password } = req.body ?? {};
  if (!email || !password) {
    return res.status(400).json({ error: 'Missing credentials' });
  }

  const normalizedEmail = String(email).trim().toLowerCase();
  const user = await (prisma as any).user.findUnique({ where: { email: normalizedEmail } });

  if (!user) {
    return res.status(401).json({ error: 'Invalid credentials' });
  }

  const passwordHash = user.passwordHash ?? user.password ?? '';
  const valid = await bcrypt.compare(String(password), String(passwordHash));

  if (!valid) {
    return res.status(401).json({ error: 'Invalid credentials' });
  }

  const token = jwt.sign(
    { sub: user.id, email: user.email, role: user.role ?? 'USER', type: 'access' },
    process.env.JWT_SECRET || 'dev-secret',
    { expiresIn: '15m' }
  );

  const refreshToken = jwt.sign(
    { sub: user.id, email: user.email, role: user.role ?? 'USER', type: 'refresh' },
    process.env.JWT_REFRESH_SECRET || 'dev-refresh-secret',
    { expiresIn: '7d' }
  );

  res.setHeader('Set-Cookie', [
    `refresh=${refreshToken}; HttpOnly; Path=/; Max-Age=${7 * 24 * 60 * 60}; SameSite=Lax`,
  ]);

  return res.status(200).json({
    token,
    refreshToken,
    expiresIn: 15 * 60,
    user: {
      id: user.id,
      name: user.name,
      email: user.email,
      role: user.role ?? 'USER',
    },
  });
}
