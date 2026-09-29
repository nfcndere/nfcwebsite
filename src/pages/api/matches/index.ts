import { NextApiRequest, NextApiResponse } from 'next';
import { prisma } from '@/lib/prisma';
import auth, { hasRole } from '@/lib/server/auth';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method === 'GET') {
    const matches = await (prisma as any).match.findMany({
      orderBy: [{ date: 'desc' }],
    });
    return res.status(200).json({ data: matches });
  }

  if (req.method === 'POST') {
    const user = await auth.getUserFromRequest(req as any);
    if (!user || !hasRole(user, ['ADMIN', 'EDITOR'])) return res.status(403).json({ error: 'Forbidden' });

    const body = req.body ?? {};
    const match = await (prisma as any).match.create({
      data: {
        date: new Date(body.date || Date.now()),
        homeTeam: String(body.homeTeam || '').trim(),
        awayTeam: String(body.awayTeam || '').trim(),
        homeScore: body.homeScore !== undefined ? Number(body.homeScore) : null,
        awayScore: body.awayScore !== undefined ? Number(body.awayScore) : null,
        events: body.events ?? undefined,
      },
    });

    return res.status(201).json({ data: match });
  }

  res.setHeader('Allow', ['GET', 'POST']);
  return res.status(405).json({ error: 'Method not allowed' });
}
