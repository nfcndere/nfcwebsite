import { NextApiRequest, NextApiResponse } from 'next';
import { prisma } from '@/lib/prisma';
import auth, { hasRole } from '@/lib/server/auth';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  const { id } = req.query;
  if (!id || Array.isArray(id)) return res.status(400).json({ error: 'Player id is required' });

  if (req.method === 'GET') {
    const player = await (prisma as any).player.findUnique({ where: { id } });
    if (!player) return res.status(404).json({ error: 'Player not found' });
    return res.status(200).json({ data: player });
  }

  if (req.method === 'PATCH') {
    const user = await auth.getUserFromRequest(req as any);
    if (!user || !hasRole(user, ['ADMIN', 'EDITOR'])) return res.status(403).json({ error: 'Forbidden' });

    const body = req.body ?? {};
    const player = await (prisma as any).player.update({
      where: { id },
      data: {
        firstName: body.firstName !== undefined ? String(body.firstName) : undefined,
        lastName: body.lastName !== undefined ? String(body.lastName) : undefined,
        number: body.number !== undefined ? Number(body.number) : undefined,
        position: body.position !== undefined ? String(body.position) : undefined,
        nationality: body.nationality !== undefined ? String(body.nationality) : undefined,
        bio: body.bio !== undefined ? String(body.bio) : undefined,
        photoId: body.photoId !== undefined ? String(body.photoId) : undefined,
        stats: body.stats !== undefined ? body.stats : undefined,
      },
    });

    return res.status(200).json({ data: player });
  }

  if (req.method === 'DELETE') {
    const user = await auth.getUserFromRequest(req as any);
    if (!user || !hasRole(user, ['ADMIN'])) return res.status(403).json({ error: 'Forbidden' });

    await (prisma as any).player.delete({ where: { id } });
    return res.status(200).json({ success: true });
  }

  res.setHeader('Allow', ['GET', 'PATCH', 'DELETE']);
  return res.status(405).json({ error: 'Method not allowed' });
}
