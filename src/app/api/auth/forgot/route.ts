import { NextRequest, NextResponse } from 'next/server';
import { z } from 'zod';
import prisma from '@/lib/prisma';
import { enforceRateLimit } from '@/lib/server/rate-limit';
import { handleRouteError, parseJsonBody } from '@/lib/server/route-utils';
import { generateResetToken, RESET_TOKEN_TTL_MS } from '@/lib/server/passwords';
import { escapeHtml, sendAndLogEmail } from '@/lib/server/resend';
import { recordAudit } from '@/lib/server/audit';

export const dynamic = 'force-dynamic';

const forgotSchema = z.object({
  email: z.string().trim().email().max(254).transform((email) => email.toLowerCase()),
});

const GENERIC_MESSAGE = 'Si un compte correspond à cette adresse, un e-mail de réinitialisation vient d’être envoyé.';

function buildResetUrl(token: string) {
  const base = process.env.PASSWORD_RESET_URL
    || `${(process.env.NEXT_PUBLIC_SITE_URL || 'https://www.ngaounderefc.cm').replace(/\/$/, '')}/reinitialiser-mot-de-passe`;
  const url = new URL(base);
  url.searchParams.set('token', token);
  return url.toString();
}

// ===================================
// POST /api/auth/forgot — Demande de réinitialisation (réponse identique que le compte existe ou non)
// ===================================
export async function POST(request: NextRequest) {
  try {
    const parsed = await parseJsonBody(request, forgotSchema, 'Adresse e-mail invalide.');
    if (!parsed.ok) return parsed.response;
    const { email } = parsed.data;

    const message = 'Trop de demandes de réinitialisation. Réessayez plus tard.';
    const limitedByIp = await enforceRateLimit(request, 'forgot-ip', 10, 60 * 60 * 1_000, { message });
    if (limitedByIp) return limitedByIp;
    const limitedByEmail = await enforceRateLimit(request, 'forgot-email', 3, 60 * 60 * 1_000, { identifier: email, message });
    if (limitedByEmail) return limitedByEmail;

    const user = await prisma.user.findUnique({ where: { email } });
    if (user && user.active !== false) {
      const { token, tokenHash } = generateResetToken();
      await prisma.$transaction([
        // Un seul jeton valide à la fois : les précédents non utilisés sont invalidés.
        prisma.passwordResetToken.updateMany({ where: { userId: user.id, usedAt: null }, data: { usedAt: new Date() } }),
        prisma.passwordResetToken.create({
          data: { userId: user.id, tokenHash, expiresAt: new Date(Date.now() + RESET_TOKEN_TTL_MS) },
        }),
      ]);

      const resetUrl = buildResetUrl(token);
      const subject = 'Réinitialisation de votre mot de passe – Ngaoundéré FC';
      const html = `<div style="font-family:Arial,sans-serif;font-size:15px;line-height:1.5">
<p>Bonjour ${escapeHtml(user.name)},</p>
<p>Une réinitialisation du mot de passe de votre compte d’administration a été demandée.</p>
<p><a href="${escapeHtml(resetUrl)}">Choisir un nouveau mot de passe</a></p>
<p>Ce lien est valable 1 heure et ne peut être utilisé qu’une seule fois. Si vous n’êtes pas à l’origine de cette demande, ignorez cet e-mail.</p>
</div>`;
      await sendAndLogEmail({
        to: user.email,
        subject,
        html,
        text: `Réinitialisez votre mot de passe (valable 1 heure) : ${resetUrl}`,
        // Le lien (secret) n'est jamais stocké dans le journal.
        logBody: 'Lien de réinitialisation de mot de passe (contenu masqué).',
      });
      await recordAudit({ request, userId: user.id, action: 'PASSWORD_RESET_REQUEST', entity: 'User', entityId: user.id });
    }

    return NextResponse.json({ status: 'ok', message: GENERIC_MESSAGE });
  } catch (error) {
    return handleRouteError(error, 'Impossible de traiter la demande de réinitialisation.', 'auth/forgot');
  }
}
