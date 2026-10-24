import { NextRequest, NextResponse } from 'next/server';
import prisma from '@/lib/prisma';
import { z } from 'zod';
import { apiError, resourceResponse, latestDate } from '@/lib/api-response';
import { requireEditor } from '@/lib/server/auth';

const subscriberSchema = z.object({ email: z.string().trim().email().transform((email) => email.toLowerCase()) });

// ===================================
// POST /api/newsletter — Sauvegarder un email en base
// ===================================
export async function POST(request: NextRequest) {
  try {
    const parsed = subscriberSchema.safeParse(await request.json());
    if (!parsed.success) return apiError('Adresse email invalide.', 400);
    const { email } = parsed.data;

    // Upsert pour éviter les doublons
    const subscriber = await prisma.newsletterSubscriber.upsert({
      where: { email },
      update: { active: true },
      create: { email },
    });

    return NextResponse.json({ status: 'ok', message: 'Abonnement enregistré avec succès', data: subscriber, updatedAt: subscriber.createdAt });
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
