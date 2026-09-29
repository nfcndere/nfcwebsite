import { NextApiRequest, NextApiResponse } from 'next';
import { prisma } from '@/lib/prisma';
import auth, { hasRole } from '@/lib/server/auth';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method === 'GET') {
    const media = await (prisma as any).media.findMany({
      orderBy: [{ createdAt: 'desc' }],
      include: { uploadedBy: true },
    });

    return res.status(200).json({ data: media });
  }

  if (req.method === 'DELETE') {
    const user = await auth.getUserFromRequest(req as any);
    if (!user || !hasRole(user, ['ADMIN'])) return res.status(403).json({ error: 'Forbidden' });

    const { id } = req.query;
    if (!id || Array.isArray(id)) return res.status(400).json({ error: 'Media id is required' });

    await (prisma as any).media.delete({ where: { id } });
    return res.status(200).json({ success: true });
  }

  res.setHeader('Allow', ['GET', 'DELETE']);
  return res.status(405).json({ error: 'Method not allowed' });
}
