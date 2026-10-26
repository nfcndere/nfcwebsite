import { NextRequest, NextResponse } from 'next/server';
import prisma from '@/lib/prisma';
import { issueTokenPair, isAuthConfigured, securityConfigErrorResponse, toSessionUser } from '@/lib/server/auth';
import { z } from 'zod';
import { apiError } from '@/lib/api-response';
import { enforceRateLimit } from '@/lib/server/rate-limit';
import { parseJsonBody, handleRouteError } from '@/lib/server/route-utils';
import { verifyPassword } from '@/lib/server/passwords';
import { recordAudit } from '@/lib/server/audit';

export const dynamic = 'force-dynamic';

const loginSchema = z.object({
  email: z.string().trim().email().transform((email) => email.toLowerCase().trim()),
  password: z.string().min(1).max(256),
  // 'admin' : refuse les comptes USER (clients d'administration comme nfcmanager).
  scope: z.enum(['admin', 'site']).optional(),
});

const LOGIN_WINDOW_MS = 15 * 60 * 1_000;
// Hash bcrypt factice pour égaliser le temps de réponse lorsque l'e-mail est inconnu.
const DUMMY_HASH = '$2b$12$WlqT4kqxw7lUY/dsB6Kz6.NlGnHnRef9X5kkJzmNNhkCG4C2ljjYC';

// ===================================
// POST /api/auth/login — Connexion Admin (Mobile & Web)
// ===================================
export async function POST(request: NextRequest) {
  if (!isAuthConfigured()) {
    console.error('[auth/login] JWT_SECRET ou JWT_REFRESH_SECRET manquant.');
    return securityConfigErrorResponse();
  }
  try {
    const parsed = await parseJsonBody(request, loginSchema, 'Email et mot de passe valides obligatoires.');
    if (!parsed.ok) return parsed.response;
    const { email, password, scope } = parsed.data;

    const message = 'Trop de tentatives de connexion. Réessayez plus tard.';
    const limitedByIp = await enforceRateLimit(request, 'login-ip', 20, LOGIN_WINDOW_MS, { message });
    if (limitedByIp) return limitedByIp;
    const limitedByEmail = await enforceRateLimit(request, 'login-email', 8, LOGIN_WINDOW_MS, { identifier: email, message });
    if (limitedByEmail) return limitedByEmail;

    const user = await prisma.user.findUnique({ where: { email } });
    const passwordOk = await verifyPassword(password, user?.passwordHash ?? DUMMY_HASH);
    if (!user || !passwordOk) {
      return apiError('Email ou mot de passe incorrect.', 401);
    }
    if (user.active === false) {
      return apiError('Compte désactivé. Contactez un administrateur.', 403);
    }
    if (scope === 'admin' && user.role === 'USER') {
      return apiError("Compte sans droits d'administration", 403);
    }

    const tokens = issueTokenPair(user);
    await prisma.user.update({ where: { id: user.id }, data: { lastLoginAt: new Date() } }).catch((error) => {
      console.warn('[auth/login] lastLoginAt non mis à jour :', error);
    });
    if (scope === 'admin') {
      await recordAudit({ request, userId: user.id, action: 'LOGIN', entity: 'User', entityId: user.id });
    }

    return NextResponse.json({
      success: true,
      message: 'Connexion réussie',
      token: tokens.token,
      refreshToken: tokens.refreshToken,
      expiresIn: tokens.expiresIn,
      user: toSessionUser(user),
    });
  } catch (error: unknown) {
    return handleRouteError(error, 'Erreur serveur lors de la connexion.', 'auth/login');
  }
}
