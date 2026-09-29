import { NextApiRequest, NextApiResponse } from 'next';
import { prisma } from '@/lib/prisma';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  const { id } = req.query;

  if (!id || Array.isArray(id)) {
    return res.status(400).json({ error: 'Article id is required' });
  }

  if (req.method === 'GET') {
    const article = await (prisma as any).article.findUnique({
      where: { id },
      include: { cover: true, author: true },
    });

    if (!article) {
      return res.status(404).json({ error: 'Article not found' });
    }

    return res.status(200).json({ data: article });
  }

  if (req.method === 'PATCH') {
    const user = await (await import('@/lib/server/auth')).getUserFromRequest(req as any);
    const hasRole = (await import('@/lib/server/auth')).hasRole;
    if (!user || !hasRole(user, ['ADMIN', 'EDITOR'])) {
      return res.status(403).json({ error: 'Forbidden' });
    }

    const body = req.body ?? {};
    const updated = await (prisma as any).article.update({
      where: { id },
      data: {
        title: body.title ? String(body.title) : undefined,
        summary: body.summary !== undefined ? String(body.summary) : undefined,
        content: body.content ? String(body.content) : undefined,
        slug: body.slug ? String(body.slug) : undefined,
        category: body.category !== undefined ? String(body.category) : undefined,
        coverId: body.coverId !== undefined ? (body.coverId ? String(body.coverId) : null) : undefined,
        published: body.published !== undefined ? Boolean(body.published) : undefined,
        publishedAt: body.published === true ? new Date() : body.published === false ? null : undefined,
      },
      include: { cover: true, author: true },
    });

    return res.status(200).json({ data: updated });
  }

  if (req.method === 'DELETE') {
    const user = await (await import('@/lib/server/auth')).getUserFromRequest(req as any);
    const hasRole = (await import('@/lib/server/auth')).hasRole;
    if (!user || !hasRole(user, ['ADMIN'])) {
      return res.status(403).json({ error: 'Forbidden' });
    }

    await (prisma as any).article.delete({ where: { id } });
    return res.status(200).json({ success: true });
  }

  res.setHeader('Allow', ['GET', 'PATCH', 'DELETE']);
  return res.status(405).json({ error: 'Method not allowed' });
}
