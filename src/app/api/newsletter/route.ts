import { NextRequest, NextResponse } from 'next/server';
import prisma from '@/lib/prisma';

// ===================================
// POST /api/newsletter — Sauvegarder un email en base
// ===================================
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { email } = body;

    if (!email || !email.includes('@')) {
      return NextResponse.json({ error: 'Adresse email invalide' }, { status: 400 });
    }

    // Upsert pour éviter les doublons
    const subscriber = await prisma.newsletterSubscriber.upsert({
      where: { email },
      update: { active: true },
      create: { email },
    });

    return NextResponse.json({ success: true, message: 'Abonnement enregistré avec succès', subscriber });
  } catch (error) {
    return NextResponse.json({ error: 'Erreur lors de l\'enregistrement' }, { status: 500 });
  }
}

// ===================================
// GET /api/newsletter — Récupérer les abonnés (admin)
// ===================================
export async function GET() {
  try {
    const subscribers = await prisma.newsletterSubscriber.findMany({
      where: { active: true },
      orderBy: { createdAt: 'desc' },
    });
    return NextResponse.json(subscribers);
  } catch (error) {
    return NextResponse.json({ error: 'Erreur lors de la récupération' }, { status: 500 });
  }
}
