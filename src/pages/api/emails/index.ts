import { NextApiRequest, NextApiResponse } from 'next';
import { prisma } from '@/lib/prisma';
import auth, { hasRole } from '@/lib/server/auth';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method === 'GET') {
    const user = await auth.getUserFromRequest(req as any);
    if (!user || !hasRole(user, ['ADMIN', 'EDITOR'])) return res.status(403).json({ error: 'Forbidden' });

    const logs = await (prisma as any).emailLog.findMany({
      orderBy: [{ createdAt: 'desc' }],
    });

    return res.status(200).json({ data: logs });
  }

  if (req.method === 'POST') {
    const user = await auth.getUserFromRequest(req as any);
    if (!user || !hasRole(user, ['ADMIN', 'EDITOR'])) return res.status(403).json({ error: 'Forbidden' });

    const { emailLogId } = req.body ?? {};
    if (!emailLogId) return res.status(400).json({ error: 'emailLogId is required' });

    const log = await (prisma as any).emailLog.findUnique({ where: { id: String(emailLogId) } });
    if (!log) return res.status(404).json({ error: 'Email log not found' });

    return res.status(200).json({
      success: true,
      data: {
        id: log.id,
        resent: true,
        to: log.to,
        subject: log.subject,
      },
    });
  }

  res.setHeader('Allow', ['GET', 'POST']);
  return res.status(405).json({ error: 'Method not allowed' });
}
