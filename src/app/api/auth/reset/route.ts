import { NextRequest, NextResponse } from 'next/server';
import { z } from 'zod';
import prisma from '@/lib/prisma';
import { apiError } from '@/lib/api-response';
import { enforceRateLimit } from '@/lib/server/rate-limit';
import { handleRouteError, parseJsonBody } from '@/lib/server/route-utils';
import { hashPassword, hashResetToken, passwordSchema } from '@/lib/server/passwords';
import { recordAudit } from '@/lib/server/audit';

export const dynamic = 'force-dynamic';

const resetSchema = z.object({
  token: z.string().trim().min(20).max(200),
  password: passwordSchema,
});

// ===================================
// POST /api/auth/reset — Définit un nouveau mot de passe avec un jeton à usage unique
// ===================================
export async function POST(request: NextRequest) {
  try {
    const parsed = await parseJsonBody(request, resetSchema, 'Jeton ou mot de passe invalide.');
    if (!parsed.ok) return parsed.response;

    const limited = await enforceRateLimit(request, 'auth-reset', 10, 60 * 60 * 1_000);
    if (limited) return limited;

    const tokenHash = hashResetToken(parsed.data.token);
    const passwordHash = await hashPassword(parsed.data.password);
    const now = new Date();

    const userId = await prisma.$transaction(async (tx) => {
      // Consommation atomique : seul le premier appel avec ce jeton réussit.
      const consumed = await tx.passwordResetToken.updateMany({
        where: { tokenHash, usedAt: null, expiresAt: { gt: now } },
        data: { usedAt: now },
      });
      if (consumed.count !== 1) return null;
      const record = await tx.passwordResetToken.findUnique({ where: { tokenHash }, include: { user: true } });
      if (!record || record.user.active === false) return null;
      await tx.user.update({
        where: { id: record.userId },
        data: { passwordHash, tokenVersion: { increment: 1 }, mustChangePassword: false },
      });
      return record.userId;
    });

    if (!userId) return apiError('Lien de réinitialisation invalide ou expiré.', 400);

    await recordAudit({ request, userId, action: 'PASSWORD_RESET', entity: 'User', entityId: userId });
    return NextResponse.json({ status: 'ok', message: 'Mot de passe réinitialisé. Vous pouvez vous connecter.' });
  } catch (error) {
    return handleRouteError(error, 'Impossible de réinitialiser le mot de passe.', 'auth/reset');
  }
}
