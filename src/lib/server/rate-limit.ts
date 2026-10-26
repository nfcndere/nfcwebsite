import type { NextRequest } from 'next/server';
import prisma from '@/lib/prisma';
import { apiError } from '@/lib/api-response';

export function getClientIp(request: NextRequest) {
  const vercelIp = request.headers.get('x-real-ip');
  if (vercelIp) return vercelIp.trim();

  const forwarded = request.headers.get('x-forwarded-for');
  return forwarded?.split(',').at(-1)?.trim() || null;
}

type RateLimitOptions = {
  /**
   * Identifiant supplémentaire (ex. e-mail ciblé par une tentative de connexion).
   * Par défaut, la limite s'applique à l'adresse IP du client.
   */
  identifier?: string;
  message?: string;
};

/**
 * Limitation de débit par fenêtre fixe, persistée dans `ApiRateLimitBucket`.
 * Renvoie une réponse 429 (avec en-tête `Retry-After` en secondes) si la limite est dépassée,
 * sinon null. En cas d'indisponibilité de la table (migration non appliquée, base saturée),
 * la limite est ignorée (fail-open) et l'erreur est journalisée, pour ne pas bloquer la connexion.
 */
export async function enforceRateLimit(
  request: NextRequest,
  scope: string,
  limit: number,
  windowMs: number,
  options: RateLimitOptions = {},
) {
  const subject = options.identifier ?? getClientIp(request) ?? 'unknown';

  const now = Date.now();
  const bucketNumber = Math.floor(now / windowMs);
  const expiresAt = new Date((bucketNumber + 1) * windowMs);
  const key = `${scope}:${encodeURIComponent(subject)}:${bucketNumber}`;

  try {
    await prisma.apiRateLimitBucket.deleteMany({ where: { expiresAt: { lte: new Date(now) } } });
    const bucket = await prisma.apiRateLimitBucket.upsert({
      where: { key },
      create: { key, count: 1, expiresAt },
      update: { count: { increment: 1 } },
    });

    if (bucket.count <= limit) return null;
  } catch (error) {
    console.error(`[rate-limit] Limitation "${scope}" indisponible (vérifiez la migration ApiRateLimitBucket) :`, error);
    return null;
  }

  const retryAfterSeconds = Math.max(1, Math.ceil((expiresAt.getTime() - now) / 1_000));
  const response = apiError(options.message ?? 'Trop de demandes. Veuillez réessayer plus tard.', 429);
  response.headers.set('Retry-After', String(retryAfterSeconds));
  return response;
}
