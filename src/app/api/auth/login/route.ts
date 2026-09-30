import { NextRequest, NextResponse } from 'next/server';
import prisma from '@/lib/prisma';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';

// ===================================
// POST /api/auth/login — Connexion Admin pour l'application Mobile & Web
// ===================================
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { email, password } = body;

    if (!email || !password) {
      return NextResponse.json(
        { success: false, error: 'Email et mot de passe obligatoires' },
        { status: 400 }
      );
    }

    const user = await prisma.user.findUnique({
      where: { email: email.toLowerCase().trim() },
    });

    if (!user) {
      return NextResponse.json(
        { success: false, error: 'Identifiants incorrects' },
        { status: 401 }
      );
    }

    const passwordMatch = await bcrypt.compare(password, user.passwordHash);

    if (!passwordMatch) {
      return NextResponse.json(
        { success: false, error: 'Identifiants incorrects' },
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
  } catch (error) {
    return NextResponse.json(
      { success: false, error: 'Erreur serveur lors de la connexion' },
      { status: 500 }
    );
  }
}
