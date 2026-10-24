import { NextRequest, NextResponse } from 'next/server';
import prisma from '@/lib/prisma';
import bcrypt from 'bcryptjs';
import { signAccessToken, signRefreshToken } from '@/lib/server/auth';
import { z } from 'zod';
import { apiError } from '@/lib/api-response';

const loginSchema = z.object({
  email: z.string().email().transform((email) => email.toLowerCase().trim()),
  password: z.string().min(1),
});

// ===================================
// POST /api/auth/login — Connexion Admin (Mobile & Web)
// ===================================
export async function POST(request: NextRequest) {
  try {
    const parsed = loginSchema.safeParse(await request.json());
    if (!parsed.success) {
      return apiError('Email et mot de passe valides obligatoires.', 400);
    }
    const { email, password } = parsed.data;
    const user = await prisma.user.findUnique({ where: { email } });
    if (!user || !(await bcrypt.compare(password, user.passwordHash))) {
      return apiError('Email ou mot de passe incorrect.', 401);
    }

    const token = signAccessToken(user);
    const refreshToken = signRefreshToken(user);

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
    console.error('Login failed:', error);
    return apiError('Erreur serveur lors de la connexion.');
  }
}
