import { NextApiRequest, NextApiResponse } from 'next';
import { prisma } from '@/lib/prisma';
import auth, { hasRole } from '@/lib/server/auth';

function normalizeSlug(value: string) {
  return value
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9\s-]/g, '')
    .replace(/\s+/g, '-')
    .replace(/-+/g, '-');
}

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method === 'GET') {
    const page = Math.max(1, parseInt((req.query.page as string) || '1', 10));
    const limit = Math.min(50, Math.max(1, parseInt((req.query.limit as string) || '10', 10)));
    const skip = (page - 1) * limit;

    const articles = await (prisma as any).article.findMany({
      where: { published: true },
      skip,
      take: limit,
      orderBy: { publishedAt: 'desc' },
      include: { cover: true, author: true },
    });

    return res.status(200).json({ data: articles, page, limit });
  }

  if (req.method === 'POST') {
    const user = await auth.getUserFromRequest(req as any);
    if (!user || !hasRole(user, ['ADMIN', 'EDITOR'])) {
      return res.status(403).json({ error: 'Forbidden' });
    }

    const body = req.body ?? {};
    const title = String(body.title || '').trim();
    const rawSlug = String(body.slug || title || '').trim();
    const content = String(body.content || '').trim();

    if (!title || !content) {
      return res.status(400).json({ error: 'Title and content are required' });
    }

    const slug = normalizeSlug(rawSlug) || `article-${Date.now()}`;

    const article = await (prisma as any).article.create({
      data: {
        title,
        slug,
        summary: body.summary ? String(body.summary) : null,
        content,
        coverId: body.coverId ? String(body.coverId) : null,
        category: body.category ? String(body.category) : null,
        published: body.published === true,
        publishedAt: body.published === true ? new Date() : null,
        authorId: user.id,
      },
      include: { cover: true, author: true },
    });

    return res.status(201).json({ data: article });
  }

  res.setHeader('Allow', ['GET', 'POST']);
  return res.status(405).json({ error: 'Method not allowed' });
}
