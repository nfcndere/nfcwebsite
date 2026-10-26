import type { NextRequest } from 'next/server';
import prisma from '@/lib/prisma';
import { apiError } from '@/lib/api-response';

export function getClientIp(request: NextRequest) {
  const vercelIp = request.headers.get('x-real-ip');
  if (vercelIp) return vercelIp.trim();

  const forwarded = request.headers.get('x-forwarded-for');
  return forwarded?.split(',').at(-1)?.trim() || null;
}

export async function enforceRateLimit(
  request: NextRequest,
  scope: string,
  limit: number,
  windowMs: number,
) {
  const ip = getClientIp(request) ?? 'unknown';

  const now = Date.now();
  const bucketNumber = Math.floor(now / windowMs);
  const expiresAt = new Date((bucketNumber + 1) * windowMs);
  const key = `${scope}:${encodeURIComponent(ip)}:${bucketNumber}`;

  await prisma.apiRateLimitBucket.deleteMany({ where: { expiresAt: { lte: new Date(now) } } });
  const bucket = await prisma.apiRateLimitBucket.upsert({
    where: { key },
    create: { key, count: 1, expiresAt },
    update: { count: { increment: 1 } },
  });

  return bucket.count > limit
    ? apiError('Trop de demandes. Veuillez réessayer plus tard.', 429)
    : null;
}
