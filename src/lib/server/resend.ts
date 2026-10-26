import { Resend } from 'resend';
import prisma from '@/lib/prisma';

let client: Resend | null = null;

export function isEmailConfigured() {
  return Boolean(process.env.RESEND_API_KEY);
}

function getClient() {
  if (!process.env.RESEND_API_KEY) throw new Error('RESEND_API_KEY is not configured.');
  if (!client) client = new Resend(process.env.RESEND_API_KEY);
  return client;
}

export function getDefaultFrom() {
  return process.env.DEFAULT_FROM_EMAIL || 'Ngaoundéré FC <no-reply@ngaounderefc.cm>';
}

export async function sendEmail({ to, subject, html, from, text }: { to: string; subject: string; html: string; from?: string; text?: string }) {
  return getClient().emails.send({
    from: from || getDefaultFrom(),
    to,
    subject,
    html,
    text,
  });
}

export function escapeHtml(value: string) {
  return value
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#39;');
}

/** Convertit un texte brut en HTML sûr (échappement + sauts de ligne). */
export function textToHtml(text: string) {
  return `<div style="font-family:Arial,sans-serif;font-size:15px;line-height:1.5">${escapeHtml(text).replace(/\r?\n/g, '<br>')}</div>`;
}

export type SendResult = {
  ok: boolean;
  status: 'SUCCESS' | 'FAILED' | 'SKIPPED';
  providerId: string | null;
  error: string | null;
  logId: string | null;
};

/**
 * Envoie un e-mail via Resend et journalise le résultat dans `EmailLog`
 * (status SUCCESS | FAILED | SKIPPED si Resend n'est pas configuré).
 * `logBody` permet de ne pas stocker un contenu sensible (ex. lien de réinitialisation).
 */
export async function sendAndLogEmail({
  to,
  subject,
  html,
  text,
  logBody,
  from,
}: {
  to: string;
  subject: string;
  html: string;
  text?: string;
  logBody?: string;
  from?: string;
}): Promise<SendResult> {
  const sender = from || getDefaultFrom();
  let status: SendResult['status'] = 'SKIPPED';
  let providerId: string | null = null;
  let error: string | null = null;

  if (!isEmailConfigured()) {
    error = 'RESEND_API_KEY non configurée.';
  } else {
    try {
      const result = await sendEmail({ to, subject, html, text, from: sender });
      if (result.error) {
        status = 'FAILED';
        error = result.error.message ?? 'Erreur Resend.';
      } else {
        status = 'SUCCESS';
        providerId = result.data?.id ?? null;
      }
    } catch (sendError) {
      status = 'FAILED';
      error = sendError instanceof Error ? sendError.message : 'Erreur Resend inconnue.';
    }
  }

  let logId: string | null = null;
  try {
    const log = await prisma.emailLog.create({
      data: {
        to,
        from: sender,
        subject,
        body: logBody ?? text ?? html,
        provider: 'resend',
        providerId,
        status,
        error,
      },
    });
    logId = log.id;
  } catch (logError) {
    console.error('[email] Échec de journalisation EmailLog :', logError);
  }

  if (status !== 'SUCCESS') console.warn(`[email] Envoi ${status} vers ${to} : ${error}`);
  return { ok: status === 'SUCCESS', status, providerId, error, logId };
}

const resendService = { sendEmail, sendAndLogEmail, isEmailConfigured };

export default resendService;
