import jwt from 'jsonwebtoken';
import { NextApiRequest } from 'next';
import { prisma } from '@/lib/prisma';
import type { NextRequest } from 'next/server';
import { NextResponse } from 'next/server';

type TokenPayload = {
  sub: string;
  email?: string;
  role?: string;
  type?: 'access' | 'refresh';
  iat?: number;
  exp?: number;
};

function getJwtSecret() {
  const secret = process.env.JWT_SECRET;
  if (!secret && process.env.NODE_ENV === 'production') {
    throw new Error('JWT_SECRET must be configured in production.');
  }
  return secret || 'local-development-secret-only';
}

function getRefreshSecret() {
  const secret = process.env.JWT_REFRESH_SECRET;
  if (!secret && process.env.NODE_ENV === 'production') {
    throw new Error('JWT_REFRESH_SECRET must be configured in production.');
  }
  return secret || getJwtSecret();
}

export function signAccessToken(user: { id: string; email?: string | null; role?: string | null }) {
  return jwt.sign(
    {
      sub: user.id,
      email: user.email,
      role: user.role,
      type: 'access',
    },
    getJwtSecret(),
    { expiresIn: '15m' }
  );
}

export function signRefreshToken(user: { id: string; email?: string | null; role?: string | null }) {
  return jwt.sign(
    {
      sub: user.id,
      email: user.email,
      role: user.role,
      type: 'refresh',
    },
    getRefreshSecret(),
    { expiresIn: '7d' }
  );
}

export function extractBearerToken(req: {
  headers: Headers | { authorization?: string | undefined; get?: (name: string) => string | null };
}) {
  const headers = req.headers as Headers | { authorization?: string | undefined; get?: (name: string) => string | null };

  if (typeof (headers as Headers).get === 'function') {
    const authHeader = (headers as Headers).get('authorization');
    if (!authHeader) return null;
    return authHeader.startsWith('Bearer ') ? authHeader.split(' ')[1] : null;
  }

  const objectHeaders = headers as { authorization?: string | undefined };
  const authHeader = objectHeaders.authorization || '';
  if (!authHeader) return null;

  return authHeader.startsWith('Bearer ') ? authHeader.split(' ')[1] : null;
}

export async function getUserFromToken(token: string, type: 'access' | 'refresh' = 'access') {
  try {
    const payload = jwt.verify(token, type === 'refresh' ? getRefreshSecret() : getJwtSecret()) as TokenPayload;
    if (!payload?.sub || payload.type !== type) return null;

    const user = await prisma.user.findUnique({
      where: { id: payload.sub },
    });

    return user ?? null;
  } catch (err) {
    return null;
  }
}

export async function getUserFromRequest(req: NextApiRequest | { headers: Headers | { authorization?: string | undefined; get?: (name: string) => string | null } }) {
  const token = extractBearerToken(req);
  if (!token) return null;

  return getUserFromToken(token, 'access');
}

export async function getAuthorizedUser(request: NextRequest, roles: string[] = ['ADMIN', 'EDITOR']) {
  const user = await getUserFromRequest(request);
  return hasRole(user, roles) ? user : null;
}

export async function requireEditor(request: NextRequest) {
  try {
    const user = await getAuthorizedUser(request);
    return user
      ? null
      : NextResponse.json({ status: 'error', message: 'Accès réservé aux administrateurs et éditeurs.' }, { status: 401 });
  } catch (error) {
    console.error('Authentication configuration error:', error);
    return NextResponse.json({ status: 'error', message: 'Configuration de sécurité indisponible.' }, { status: 500 });
  }
}

export function sanitizeUser(user: any) {
  if (!user) return null;
  const { passwordHash, ...safeUser } = user;
  return safeUser;
}

export function hasRole(user: any, allowed: string[]) {
  if (!user) return false;
  const role = (user.role ?? '').toString();
  return allowed.includes(role);
}

export default {
  getUserFromRequest,
  getUserFromToken,
  signAccessToken,
  signRefreshToken,
  sanitizeUser,
  hasRole,
};
