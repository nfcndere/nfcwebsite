import { NextRequest } from 'next/server';
import { apiError, resourceResponse } from '@/lib/api-response';
import { getUserFromRequest, sanitizeUser } from '@/lib/server/auth';

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
    console.error('Failed to retrieve authenticated user:', error);
    return apiError('Impossible de vérifier la session.');
  }
}
