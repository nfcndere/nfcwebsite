import webpush from 'web-push';
import prisma from '@/lib/prisma';

let vapidConfigured = false;

/**
 * Le Web Push est optionnel : il n'est actif que si PUSH_NOTIFICATIONS_ENABLED=true et que les
 * clés VAPID sont présentes. Sinon, toutes les fonctions sont des no-op.
 */
export function isPushEnabled() {
  return (
    process.env.PUSH_NOTIFICATIONS_ENABLED === 'true' &&
    Boolean(process.env.VAPID_PUBLIC_KEY && process.env.VAPID_PRIVATE_KEY)
  );
}

export function getVapidPublicKey() {
  return isPushEnabled() ? process.env.VAPID_PUBLIC_KEY ?? null : null;
}

function ensureVapid() {
  if (vapidConfigured) return;
  webpush.setVapidDetails(
    process.env.VAPID_SUBJECT || 'mailto:contact@ngaounderefc.cm',
    process.env.VAPID_PUBLIC_KEY as string,
    process.env.VAPID_PRIVATE_KEY as string,
  );
  vapidConfigured = true;
}

export type PushPayload = { title: string; body: string; url?: string; tag?: string };

/**
 * Envoie une notification à tous les abonnements d'administrateurs/éditeurs actifs.
 * Best effort : borné à 4 s, supprime les abonnements expirés (404/410), ne lève jamais.
 */
export async function notifyAdmins(payload: PushPayload) {
  if (!isPushEnabled()) return { sent: 0, skipped: true };
  try {
    ensureVapid();
    const subscriptions = await prisma.pushSubscription.findMany({
      where: { OR: [{ userId: null }, { user: { active: true, role: { in: ['ADMIN', 'EDITOR'] } } }] },
    });
    const body = JSON.stringify(payload);
    let sent = 0;
    const work = Promise.all(
      subscriptions.map(async (subscription) => {
        try {
          await webpush.sendNotification(
            { endpoint: subscription.endpoint, keys: { p256dh: subscription.p256dh, auth: subscription.auth } },
            body,
            { TTL: 60 * 60 },
          );
          sent += 1;
        } catch (error: any) {
          if (error?.statusCode === 404 || error?.statusCode === 410) {
            await prisma.pushSubscription.delete({ where: { id: subscription.id } }).catch(() => undefined);
          } else {
            console.warn('[push] Échec d’envoi :', error?.statusCode ?? error);
          }
        }
      }),
    );
    await Promise.race([work, new Promise((resolve) => setTimeout(resolve, 4_000))]);
    return { sent, skipped: false };
  } catch (error) {
    console.error('[push] Notification impossible :', error);
    return { sent: 0, skipped: false };
  }
}
