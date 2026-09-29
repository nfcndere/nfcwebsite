import { NextApiRequest, NextApiResponse } from 'next';
import auth from '@/lib/server/auth';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'GET') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const user = await auth.getUserFromRequest(req as any);
  if (!user) {
    return res.status(401).json({ error: 'Unauthorized' });
  }

  return res.status(200).json({ user: auth.sanitizeUser(user) });
}
