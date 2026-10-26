import { NextRequest, NextResponse } from 'next/server';
import prisma from '@/lib/prisma';
import { z } from 'zod';
import { apiError, resourceResponse, latestDate } from '@/lib/api-response';
import { requireEditor } from '@/lib/server/auth';
import { enforceRateLimit, getClientIp } from '@/lib/server/rate-limit';

export const dynamic = 'force-dynamic';

const subscriberSchema = z.object({
  email: z.string().trim().email().max(254).transform((email) => email.toLowerCase()),
});

// ===================================
// POST /api/newsletter — Sauvegarder un email en base
// ===================================
export async function POST(request: NextRequest) {
  try {
    const parsed = subscriberSchema.safeParse(await request.json());
    if (!parsed.success) return apiError('Adresse email invalide.', 400);
    const { email } = parsed.data;
    const limited = await enforceRateLimit(request, 'newsletter', 5, 60 * 60 * 1_000);
    if (limited) return limited;

    // Upsert pour éviter les doublons
    const subscriber = await prisma.newsletterSubscriber.upsert({
      where: { email },
      update: { active: true, ip: getClientIp(request) },
      create: { email, ip: getClientIp(request) },
    });

    return NextResponse.json({
      status: 'ok',
      message: 'Votre inscription à la newsletter est prise en compte.',
      data: { subscribed: true },
      updatedAt: subscriber.createdAt,
    });
  } catch (error) {
    console.error('Failed to subscribe to newsletter:', error);
    return apiError('Impossible d’enregistrer l’inscription.');
  }
}

// ===================================
// GET /api/newsletter — Récupérer les abonnés (admin)
// ===================================
export async function GET(request: NextRequest) {
  const denied = await requireEditor(request);
  if (denied) return denied;
  try {
    const subscribers = await prisma.newsletterSubscriber.findMany({
      where: { active: true },
      orderBy: { createdAt: 'desc' },
    });
    return resourceResponse(subscribers, latestDate(subscribers, (subscriber) => subscriber.createdAt));
  } catch (error) {
    console.error('Failed to retrieve newsletter subscribers:', error);
    return apiError('Impossible de récupérer les abonnés.');
  }
}
