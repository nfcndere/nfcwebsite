import { NextRequest, NextResponse } from 'next/server';
import { z } from 'zod';
import { apiError } from '@/lib/api-response';
import { getUserFromToken, isAuthConfigured, issueTokenPair, securityConfigErrorResponse, toSessionUser } from '@/lib/server/auth';
import { enforceRateLimit } from '@/lib/server/rate-limit';
import { handleRouteError, parseJsonBody } from '@/lib/server/route-utils';

export const dynamic = 'force-dynamic';

const refreshSchema = z.object({
  refreshToken: z.string().min(20).max(4_096),
});

// ===================================
// POST /api/auth/refresh — Renouvelle le jeton d'accès (rotation du refresh token)
// ===================================
export async function POST(request: NextRequest) {
  if (!isAuthConfigured()) {
    console.error('[auth/refresh] JWT_SECRET ou JWT_REFRESH_SECRET manquant.');
    return securityConfigErrorResponse();
  }
  try {
    const parsed = await parseJsonBody(request, refreshSchema, 'Refresh token obligatoire.');
    if (!parsed.ok) return apiError('Refresh token invalide ou expiré.', 401);

    const limited = await enforceRateLimit(request, 'auth-refresh', 60, 15 * 60 * 1_000);
    if (limited) return limited;

    const user = await getUserFromToken(parsed.data.refreshToken, 'refresh');
    if (!user) return apiError('Refresh token invalide ou expiré.', 401);

    const tokens = issueTokenPair(user);
    return NextResponse.json({
      success: true,
      token: tokens.token,
      refreshToken: tokens.refreshToken,
      expiresIn: tokens.expiresIn,
      user: toSessionUser(user),
    });
  } catch (error) {
    return handleRouteError(error, 'Impossible de renouveler la session.', 'auth/refresh');
  }
}
