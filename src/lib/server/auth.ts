import jwt from 'jsonwebtoken';
import { NextApiRequest } from 'next';
import { prisma } from '@/lib/prisma';

type TokenPayload = {
  sub: string;
  email?: string;
  role?: string;
  type?: 'access' | 'refresh';
  iat?: number;
  exp?: number;
};

const JWT_SECRET = process.env.JWT_SECRET || 'dev-secret';
const JWT_REFRESH_SECRET = process.env.JWT_REFRESH_SECRET || JWT_SECRET;

export function signAccessToken(user: { id: string; email?: string | null; role?: string | null }) {
  return jwt.sign(
    {
      sub: user.id,
      email: user.email,
      role: user.role,
      type: 'access',
    },
    JWT_SECRET,
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
    JWT_REFRESH_SECRET,
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
    const payload = jwt.verify(token, type === 'refresh' ? JWT_REFRESH_SECRET : JWT_SECRET) as TokenPayload;
    if (!payload?.sub || payload.type !== type) return null;

    const user = await (prisma as any).user.findUnique({
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
