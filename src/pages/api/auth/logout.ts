import { NextApiRequest, NextApiResponse } from 'next';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  res.setHeader('Set-Cookie', [
    'refresh=; HttpOnly; Path=/; Max-Age=0; SameSite=Lax',
    'token=; HttpOnly; Path=/; Max-Age=0; SameSite=Lax',
  ]);

  return res.status(200).json({ success: true });
}
