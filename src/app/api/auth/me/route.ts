import { NextRequest } from 'next/server';
import { apiError, resourceResponse } from '@/lib/api-response';
import { getUserFromRequest, sanitizeUser } from '@/lib/server/auth';
import { handleRouteError } from '@/lib/server/route-utils';

export const dynamic = 'force-dynamic';

// ===================================
// GET /api/auth/me — Obtenir le profil de l'utilisateur connecté
// ===================================
export async function GET(request: NextRequest) {
  try {
    const user = await getUserFromRequest(request);

    if (!user) {
      return apiError('Session expirée ou utilisateur introuvable.', 401);
    }

    return resourceResponse(sanitizeUser(user), user.updatedAt);
  } catch (error) {
    return handleRouteError(error, 'Impossible de vérifier la session.', 'auth/me');
  }
}
