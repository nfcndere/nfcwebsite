import { NextRequest, NextResponse } from 'next/server';
import prisma from '@/lib/prisma';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';

// ===================================
// POST /api/auth/login — Connexion Admin (Mobile & Web)
// ===================================
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const email = (body.email || '').toLowerCase().trim();
    const password = body.password || '';

    if (!email || !password) {
      return NextResponse.json(
        { success: false, message: 'Email et mot de passe obligatoires', error: 'Champs manquants' },
        { status: 400 }
      );
    }

    let user: any = null;

    try {
      user = await prisma.user.findUnique({
        where: { email },
      });
    } catch (dbError) {
      console.error('Database connection error in login, checking fallback users...', dbError);
    }

    // Comptes prédéfinis / Fallback de secours
    const FALLBACK_USERS: Record<string, { pass: string; id: string; name: string; role: string }> = {
      'henry@gmail.com': { pass: 'abc123', id: 'user-henry-1', name: 'Henry Admin', role: 'ADMIN' },
      'admin@nfc.local': { pass: 'admin123', id: 'admin-id-1', name: 'Admin NFC', role: 'ADMIN' },
      'admin@nfc.cm': { pass: 'admin123', id: 'admin-id-1', name: 'Admin NFC', role: 'ADMIN' },
      'admin@ngaounderefc.cm': { pass: 'admin123', id: 'admin-id-1', name: 'Bekono Nkoa (Admin)', role: 'ADMIN' },
    };

    let isValid = false;

    if (user) {
      isValid = await bcrypt.compare(password, user.passwordHash);
    } else if (FALLBACK_USERS[email]) {
      const fb = FALLBACK_USERS[email];
      if (password === fb.pass) {
        isValid = true;
        user = {
          id: fb.id,
          name: fb.name,
          email,
          role: fb.role,
        };
      }
    }

    if (!isValid || !user) {
      return NextResponse.json(
        { success: false, message: 'Email ou mot de passe incorrect.', error: 'Identifiants invalides' },
        { status: 401 }
      );
    }

    const jwtSecret = process.env.JWT_SECRET || 'nfc-jwt-secret-2026-key';
    const jwtRefreshSecret = process.env.JWT_REFRESH_SECRET || 'nfc-jwt-refresh-secret-2026-key';

    const token = jwt.sign(
      { id: user.id, email: user.email, role: user.role, name: user.name },
      jwtSecret,
      { expiresIn: '30d' }
    );

    const refreshToken = jwt.sign(
      { id: user.id, type: 'refresh' },
      jwtRefreshSecret,
      { expiresIn: '90d' }
    );

    return NextResponse.json({
      success: true,
      message: 'Connexion réussie',
      token,
      refreshToken,
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
        role: user.role,
      },
    });
  } catch (error: any) {
    return NextResponse.json(
      { success: false, message: 'Erreur serveur lors de la connexion', error: error.message },
      { status: 500 }
    );
  }
}
