import { NextRequest, NextResponse } from 'next/server';
import { getUserFromRequest, sanitizeUser } from '@/lib/server/auth';

// ===================================
// GET /api/auth/me — Obtenir le profil de l'utilisateur connecté
// ===================================
export async function GET(request: NextRequest) {
  try {
    const user = await getUserFromRequest(request);

    if (!user) {
      return NextResponse.json({ error: 'Utilisateur non trouvé' }, { status: 404 });
    }

    return NextResponse.json({ success: true, user: sanitizeUser(user) });
  } catch (error) {
    return NextResponse.json({ error: 'Session expirée' }, { status: 401 });
  }
}
