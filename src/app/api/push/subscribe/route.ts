import { NextRequest } from 'next/server';
import { z } from 'zod';
import prisma from '@/lib/prisma';
import { apiError, resourceResponse } from '@/lib/api-response';
import { authorize } from '@/lib/server/auth';
import { getVapidPublicKey, isPushEnabled } from '@/lib/server/push';
import { enforceRateLimit } from '@/lib/server/rate-limit';
import { recordAudit } from '@/lib/server/audit';
import { handleRouteError, parseJsonBody } from '@/lib/server/route-utils';

export const dynamic = 'force-dynamic';

const subscriptionSchema = z
  .object({
    endpoint: z.string().trim().url().max(1_000),
    keys: z
      .object({
        p256dh: z.string().trim().min(10).max(200),
        auth: z.string().trim().min(6).max(200),
      })
      .strict(),
  })
  .strict();

// ===================================
// GET /api/push/subscribe — Indique si le Web Push est activé et fournit la clé publique VAPID
// ===================================
export async function GET(request: NextRequest) {
  const auth = await authorize(request);
  if (!auth.ok) return auth.response;
  return resourceResponse({ enabled: isPushEnabled(), publicKey: getVapidPublicKey() }, new Date(), undefined, false, false);
}

// ===================================
// POST /api/push/subscribe — Enregistre un abonnement Web Push pour un éditeur / administrateur
// ===================================
export async function POST(request: NextRequest) {
  const auth = await authorize(request);
  if (!auth.ok) return auth.response;

  if (!isPushEnabled()) {
    return apiError('Les notifications Web Push sont désactivées sur ce serveur.', 503);
  }

  try {
    const limited = await enforceRateLimit(request, 'push-subscribe', 20, 60 * 60 * 1_000, { identifier: auth.user.id });
    if (limited) return limited;

    const parsed = await parseJsonBody(request, subscriptionSchema, 'Abonnement Web Push invalide.');
    if (!parsed.ok) return parsed.response;
    const { endpoint, keys } = parsed.data;

    const subscription = await prisma.pushSubscription.upsert({
      where: { endpoint },
      create: {
        endpoint,
        p256dh: keys.p256dh,
        auth: keys.auth,
        userId: auth.user.id,
        userAgent: request.headers.get('user-agent') || null,
      },
      update: {
        p256dh: keys.p256dh,
        auth: keys.auth,
        userId: auth.user.id,
        userAgent: request.headers.get('user-agent') || null,
      },
    });
    await recordAudit({
      request,
      userId: auth.user.id,
      action: 'CREATE',
      entity: 'PushSubscription',
      entityId: subscription.id,
    });

    return resourceResponse({ id: subscription.id, subscribed: true }, subscription.updatedAt);
  } catch (error) {
    return handleRouteError(error, 'Impossible d’enregistrer l’abonnement aux notifications.', 'push/subscribe:post');
  }
}

// ===================================
// DELETE /api/push/subscribe — Désinscrit un navigateur
// ===================================
export async function DELETE(request: NextRequest) {
  const auth = await authorize(request);
  if (!auth.ok) return auth.response;
  try {
    const parsed = await parseJsonBody(request, z.object({ endpoint: z.string().trim().url().max(1_000) }), 'Endpoint invalide.');
    if (!parsed.ok) return parsed.response;

    await prisma.pushSubscription.deleteMany({
      where: { endpoint: parsed.data.endpoint, userId: auth.user.id },
    });
    return resourceResponse({ unsubscribed: true }, new Date());
  } catch (error) {
    return handleRouteError(error, 'Impossible de supprimer l’abonnement.', 'push/subscribe:delete');
  }
}
