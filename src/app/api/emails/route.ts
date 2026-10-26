import { NextRequest, NextResponse } from 'next/server';
import prisma from '@/lib/prisma';
import { z } from 'zod';
import { apiError, resourceResponse, latestDate } from '@/lib/api-response';
import { authorize } from '@/lib/server/auth';
import { enforceRateLimit } from '@/lib/server/rate-limit';
import { sendAndLogEmail, textToHtml } from '@/lib/server/resend';
import { recordAudit } from '@/lib/server/audit';
import { handleRouteError, parseJsonBody } from '@/lib/server/route-utils';

export const dynamic = 'force-dynamic';

const emailSchema = z.object({
  emailLogId: z.string().trim().min(1).max(100).optional(),
  to: z.string().trim().email().max(254).optional(),
  subject: z.string().trim().min(1).max(200).optional(),
  body: z.string().min(1).max(20_000).optional(),
  html: z.string().min(1).max(40_000).optional(),
});

// ===================================
// GET /api/emails — Récupérer les logs d'emails envoyés
// ===================================
export async function GET(request: NextRequest) {
  const auth = await authorize(request);
  if (!auth.ok) return auth.response;
  try {
    const logs = await prisma.emailLog.findMany({
      orderBy: { createdAt: 'desc' },
      take: 50,
    });
    return resourceResponse(logs, latestDate(logs, (log) => log.createdAt));
  } catch (error) {
    return handleRouteError(error, 'Impossible de récupérer les journaux email.', 'emails:get');
  }
}

// ===================================
// POST /api/emails — Envoi réel via Resend (ou réexpédition d'un EmailLog) et journalisation
// ===================================
export async function POST(request: NextRequest) {
  const auth = await authorize(request);
  if (!auth.ok) return auth.response;
  try {
    const limited = await enforceRateLimit(request, 'emails-send', 30, 60 * 60 * 1_000, { identifier: auth.user.id });
    if (limited) return limited;

    const parsed = await parseJsonBody(request, emailSchema, 'Données email invalides.');
    if (!parsed.ok) return parsed.response;
    const { emailLogId, to, subject, body: textBody, html: htmlBody } = parsed.data;

    let targetTo = to;
    let targetSubject = subject;
    let targetText = textBody;

    if (emailLogId) {
      const existing = await prisma.emailLog.findUnique({ where: { id: emailLogId } });
      if (!existing) return apiError('Journal email introuvable.', 404);
      targetTo = existing.to;
      targetSubject = existing.subject;
      targetText = existing.body;
    }

    if (!targetTo || !targetSubject) {
      return apiError('Destinataire et sujet email obligatoires.', 400);
    }

    const plain = targetText || 'Notification du Ngaoundéré FC.';
    const html = htmlBody ?? textToHtml(plain);

    const result = await sendAndLogEmail({
      to: targetTo,
      subject: targetSubject,
      html,
      text: plain,
      logBody: plain,
    });

    const log = result.logId ? await prisma.emailLog.findUnique({ where: { id: result.logId } }) : null;
    await recordAudit({
      request,
      userId: auth.user.id,
      action: 'SEND',
      entity: 'EmailLog',
      entityId: log?.id ?? null,
      after: { to: targetTo, subject: targetSubject, status: result.status, providerId: result.providerId },
    });

    if (!result.ok) {
      return NextResponse.json(
        {
          status: 'error',
          message: result.status === 'SKIPPED' ? 'Service d’envoi d’e-mails non configuré.' : 'Échec de l’envoi de l’e-mail.',
          data: log,
          updatedAt: log?.createdAt?.toISOString() ?? new Date().toISOString(),
        },
        { status: result.status === 'SKIPPED' ? 503 : 502 },
      );
    }

    return NextResponse.json({
      status: 'ok',
      message: 'E-mail envoyé.',
      data: log,
      updatedAt: log?.createdAt?.toISOString() ?? new Date().toISOString(),
    });
  } catch (error: unknown) {
    return handleRouteError(error, 'Impossible d’envoyer l’e-mail.', 'emails:post');
  }
}
