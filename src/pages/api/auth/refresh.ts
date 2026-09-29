import { NextApiRequest, NextApiResponse } from 'next';
import jwt from 'jsonwebtoken';
import { prisma } from '@/lib/prisma';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const refreshCookie = req.cookies?.refresh || req.headers.cookie?.split(';').find((part) => part.trim().startsWith('refresh='))?.split('=')[1];
  const token = (req.body?.refreshToken as string) || refreshCookie;

  if (!token) {
    return res.status(401).json({ error: 'Refresh token missing' });
  }

  try {
    const payload = jwt.verify(token, process.env.JWT_REFRESH_SECRET || 'dev-refresh-secret') as {
      sub: string;
      email?: string;
      role?: string;
      type?: string;
    };

    if (payload.type !== 'refresh') {
      return res.status(401).json({ error: 'Invalid refresh token' });
    }

    const user = await (prisma as any).user.findUnique({ where: { id: payload.sub } });

    if (!user) {
      return res.status(401).json({ error: 'User not found' });
    }

    const accessToken = jwt.sign(
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
      token: accessToken,
      refreshToken,
      expiresIn: 15 * 60,
    });
  } catch (error) {
    return res.status(401).json({ error: 'Invalid refresh token' });
  }
}
