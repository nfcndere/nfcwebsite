import { NextRequest, NextResponse } from 'next/server';
import prisma from '@/lib/prisma';
import { z } from 'zod';
import { apiError, resourceResponse, latestDate } from '@/lib/api-response';
import { requireEditor } from '@/lib/server/auth';

export const dynamic = 'force-dynamic';

const emailLogSchema = z.object({
  emailLogId: z.string().optional(),
  to: z.string().email().optional(),
  subject: z.string().trim().min(1).optional(),
  body: z.string().optional(),
});

// ===================================
// GET /api/emails — Récupérer les logs d'emails envoyés
// ===================================
export async function GET(request: NextRequest) {
  const denied = await requireEditor(request);
  if (denied) return denied;
  try {
    const logs = await prisma.emailLog.findMany({
      orderBy: { createdAt: 'desc' },
      take: 50,
    });
    return resourceResponse(logs, latestDate(logs, (log) => log.createdAt));
  } catch (error) {
    console.error('Failed to retrieve email logs:', error);
    return apiError('Impossible de récupérer les journaux email.');
  }
}

// ===================================
// POST /api/emails — Réexpédier / Créer un log d'email
// ===================================
export async function POST(request: NextRequest) {
  const denied = await requireEditor(request);
  if (denied) return denied;
  try {
    const parsed = emailLogSchema.safeParse(await request.json());
    if (!parsed.success) return apiError('Données email invalides.', 400);
    const body = parsed.data;
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
      return apiError('Destinataire et sujet email obligatoires.', 400);
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

    return NextResponse.json({ status: 'ok', message: 'Journal email enregistré.', data: log, updatedAt: log.createdAt });
  } catch (error: any) {
    console.error('Failed to log email:', error);
    return apiError('Impossible d’enregistrer le journal email.');
  }
}
