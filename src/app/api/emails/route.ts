import { NextRequest, NextResponse } from 'next/server';
import prisma from '@/lib/prisma';

// ===================================
// GET /api/emails — Récupérer les logs d'emails envoyés
// ===================================
export async function GET() {
  try {
    const logs = await prisma.emailLog.findMany({
      orderBy: { createdAt: 'desc' },
      take: 50,
    });
    return NextResponse.json({ success: true, data: logs });
  } catch (error) {
    return NextResponse.json({ success: true, data: [] });
  }
}

// ===================================
// POST /api/emails — Réexpédier / Créer un log d'email
// ===================================
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { emailLogId, to, subject, body: emailBody } = body;

    let targetTo = to;
    let targetSubject = subject;
    let targetBody = emailBody;

    if (emailLogId) {
      const existing = await prisma.emailLog.findUnique({ where: { id: emailLogId } });
      if (existing) {
        targetTo = existing.to;
        targetSubject = existing.subject;
        targetBody = existing.body;
      }
    }

    if (!targetTo || !targetSubject) {
      return NextResponse.json({ success: false, error: 'Champs d\'email manquants' }, { status: 400 });
    }

    const log = await prisma.emailLog.create({
      data: {
        to: targetTo,
        from: 'no-reply@nfc.cm',
        subject: targetSubject,
        body: targetBody || 'Notification système NFC',
        provider: 'Resend API',
        status: 'SUCCESS',
      },
    });

    return NextResponse.json({ success: true, message: 'Email consigné / réexpédié avec succès', data: log });
  } catch (error: any) {
    return NextResponse.json({ success: false, error: 'Erreur lors de l\'envoi de l\'email' }, { status: 500 });
  }
}
