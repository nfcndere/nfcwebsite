import { NextApiRequest, NextApiResponse } from 'next';
import { prisma } from '@/lib/prisma';
import auth, { hasRole } from '@/lib/server/auth';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  const { id } = req.query;
  if (!id || Array.isArray(id)) return res.status(400).json({ error: 'Media id is required' });

  if (req.method === 'GET') {
    const media = await (prisma as any).media.findUnique({
      where: { id },
      include: { uploadedBy: true },
    });

    if (!media) return res.status(404).json({ error: 'Media not found' });
    return res.status(200).json({ data: media });
  }

  if (req.method === 'DELETE') {
    const user = await auth.getUserFromRequest(req as any);
    if (!user || !hasRole(user, ['ADMIN'])) return res.status(403).json({ error: 'Forbidden' });

    await (prisma as any).media.delete({ where: { id } });
    return res.status(200).json({ success: true });
  }

  res.setHeader('Allow', ['GET', 'DELETE']);
  return res.status(405).json({ error: 'Method not allowed' });
}
