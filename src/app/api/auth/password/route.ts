import { NextRequest, NextResponse } from 'next/server';
import { z } from 'zod';
import prisma from '@/lib/prisma';
import { apiError } from '@/lib/api-response';
import { authorize, issueTokenPair, toSessionUser, EDITOR_ROLES } from '@/lib/server/auth';
import { enforceRateLimit } from '@/lib/server/rate-limit';
import { handleRouteError, parseJsonBody } from '@/lib/server/route-utils';
import { hashPassword, passwordSchema, verifyPassword } from '@/lib/server/passwords';
import { recordAudit } from '@/lib/server/audit';

export const dynamic = 'force-dynamic';

const changePasswordSchema = z.object({
  currentPassword: z.string().min(1).max(256),
  newPassword: passwordSchema,
});

// ===================================
// POST /api/auth/password — Changement de mot de passe de l'utilisateur connecté
// Invalide tous les jetons existants (tokenVersion++) et renvoie une nouvelle paire.
// ===================================
export async function POST(request: NextRequest) {
  const auth = await authorize(request, [...EDITOR_ROLES, 'USER']);
  if (!auth.ok) return auth.response;
  try {
    const parsed = await parseJsonBody(request, changePasswordSchema, 'Mot de passe invalide.');
    if (!parsed.ok) return parsed.response;

    const limited = await enforceRateLimit(request, 'auth-password', 5, 15 * 60 * 1_000, { identifier: auth.user.id });
    if (limited) return limited;

    const { currentPassword, newPassword } = parsed.data;
    if (!(await verifyPassword(currentPassword, auth.user.passwordHash))) {
      return apiError('Mot de passe actuel incorrect.', 400);
    }
    if (currentPassword === newPassword) {
      return apiError('Le nouveau mot de passe doit être différent de l’actuel.', 400);
    }

    const updated = await prisma.user.update({
      where: { id: auth.user.id },
      data: {
        passwordHash: await hashPassword(newPassword),
        tokenVersion: { increment: 1 },
        mustChangePassword: false,
      },
    });
    await recordAudit({ request, userId: updated.id, action: 'PASSWORD_CHANGE', entity: 'User', entityId: updated.id });

    const tokens = issueTokenPair(updated);
    return NextResponse.json({
      status: 'ok',
      message: 'Mot de passe modifié.',
      token: tokens.token,
      refreshToken: tokens.refreshToken,
      expiresIn: tokens.expiresIn,
      user: toSessionUser(updated),
    });
  } catch (error) {
    return handleRouteError(error, 'Impossible de modifier le mot de passe.', 'auth/password');
  }
}
