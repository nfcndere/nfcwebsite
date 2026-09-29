import { NextApiRequest, NextApiResponse } from 'next';
import { prisma } from '@/lib/prisma';
import auth, { hasRole } from '@/lib/server/auth';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method === 'GET') {
    const players = await (prisma as any).player.findMany({
      orderBy: [{ createdAt: 'desc' }],
    });
    return res.status(200).json({ data: players });
  }

  if (req.method === 'POST') {
    const user = await auth.getUserFromRequest(req as any);
    if (!user || !hasRole(user, ['ADMIN', 'EDITOR'])) {
      return res.status(403).json({ error: 'Forbidden' });
    }

    const body = req.body ?? {};
    const player = await (prisma as any).player.create({
      data: {
        firstName: String(body.firstName || '').trim(),
        lastName: String(body.lastName || '').trim(),
        number: body.number !== undefined ? Number(body.number) : null,
        position: body.position ? String(body.position) : null,
        nationality: body.nationality ? String(body.nationality) : null,
        bio: body.bio ? String(body.bio) : null,
        photoId: body.photoId ? String(body.photoId) : null,
        stats: body.stats ?? undefined,
      },
    });

    return res.status(201).json({ data: player });
  }

  res.setHeader('Allow', ['GET', 'POST']);
  return res.status(405).json({ error: 'Method not allowed' });
}
