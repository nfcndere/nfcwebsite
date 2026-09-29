import { NextApiRequest, NextApiResponse } from 'next';
import { prisma } from '@/lib/prisma';
import auth, { hasRole } from '@/lib/server/auth';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  const { id } = req.query;
  if (!id || Array.isArray(id)) return res.status(400).json({ error: 'Match id is required' });

  if (req.method === 'GET') {
    const match = await (prisma as any).match.findUnique({ where: { id } });
    if (!match) return res.status(404).json({ error: 'Match not found' });
    return res.status(200).json({ data: match });
  }

  if (req.method === 'PATCH') {
    const user = await auth.getUserFromRequest(req as any);
    if (!user || !hasRole(user, ['ADMIN', 'EDITOR'])) return res.status(403).json({ error: 'Forbidden' });

    const body = req.body ?? {};
    const match = await (prisma as any).match.update({
      where: { id },
      data: {
        date: body.date ? new Date(body.date) : undefined,
        homeTeam: body.homeTeam !== undefined ? String(body.homeTeam) : undefined,
        awayTeam: body.awayTeam !== undefined ? String(body.awayTeam) : undefined,
        homeScore: body.homeScore !== undefined ? Number(body.homeScore) : undefined,
        awayScore: body.awayScore !== undefined ? Number(body.awayScore) : undefined,
        events: body.events !== undefined ? body.events : undefined,
      },
    });

    return res.status(200).json({ data: match });
  }

  if (req.method === 'DELETE') {
    const user = await auth.getUserFromRequest(req as any);
    if (!user || !hasRole(user, ['ADMIN'])) return res.status(403).json({ error: 'Forbidden' });

    await (prisma as any).match.delete({ where: { id } });
    return res.status(200).json({ success: true });
  }

  res.setHeader('Allow', ['GET', 'PATCH', 'DELETE']);
  return res.status(405).json({ error: 'Method not allowed' });
}
