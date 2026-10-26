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
  /** Version du jeton (User.tokenVersion). Absente des jetons émis avant la migration : 0. */
  ver?: number;
  iat?: number;
  exp?: number;
};

type SignableUser = { id: string; email?: string | null; role?: string | null; tokenVersion?: number | null };

export type UserRoleName = 'ADMIN' | 'EDITOR' | 'USER';

export const EDITOR_ROLES: UserRoleName[] = ['ADMIN', 'EDITOR'];
export const ADMIN_ROLES: UserRoleName[] = ['ADMIN'];

export const SECURITY_CONFIG_ERROR_MESSAGE = 'Configuration de sécurité indisponible.';

/**
 * Levée lorsque les secrets JWT sont absents. Les secrets ne sont plus vérifiés au chargement
 * du module (ce qui faisait échouer `next build` et renvoyait une page HTML) : la vérification
 * a lieu à l'appel, et les routes traduisent cette erreur en JSON 500.
 */
export class AuthConfigError extends Error {
  constructor(message = 'JWT_SECRET and JWT_REFRESH_SECRET must be configured.') {
    super(message);
    this.name = 'AuthConfigError';
  }
}

export function securityConfigErrorResponse() {
  return NextResponse.json({ status: 'error', message: SECURITY_CONFIG_ERROR_MESSAGE }, { status: 500 });
}

export function isAuthConfigured() {
  return Boolean(process.env.JWT_SECRET && process.env.JWT_REFRESH_SECRET);
}

function getJwtSecret() {
  const secret = process.env.JWT_SECRET;
  if (!secret) throw new AuthConfigError('JWT_SECRET must be configured.');
  return secret;
}

function getRefreshSecret() {
  const secret = process.env.JWT_REFRESH_SECRET;
  if (!secret) throw new AuthConfigError('JWT_REFRESH_SECRET must be configured.');
  return secret;
}

export const ACCESS_TOKEN_TTL_SECONDS = 15 * 60;
export const REFRESH_TOKEN_TTL_SECONDS = 7 * 24 * 60 * 60;

export function signAccessToken(user: SignableUser) {
  return jwt.sign(
    {
      sub: user.id,
      email: user.email,
      role: user.role,
      type: 'access',
      ver: user.tokenVersion ?? 0,
    },
    getJwtSecret(),
    { expiresIn: ACCESS_TOKEN_TTL_SECONDS }
  );
}

export function signRefreshToken(user: SignableUser) {
  return jwt.sign(
    {
      sub: user.id,
      email: user.email,
      role: user.role,
      type: 'refresh',
      ver: user.tokenVersion ?? 0,
    },
    getRefreshSecret(),
    { expiresIn: REFRESH_TOKEN_TTL_SECONDS }
  );
}

/** Paire de jetons renvoyée par login / refresh / changement de mot de passe. */
export function issueTokenPair(user: SignableUser) {
  return {
    token: signAccessToken(user),
    refreshToken: signRefreshToken(user),
    expiresIn: ACCESS_TOKEN_TTL_SECONDS,
  };
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

/**
 * Vérifie un jeton et renvoie l'utilisateur correspondant, ou null si le jeton est invalide,
 * expiré, d'un autre type, révoqué (tokenVersion) ou si le compte est désactivé.
 * Lève AuthConfigError si les secrets ne sont pas configurés.
 */
export async function getUserFromToken(token: string, type: 'access' | 'refresh' = 'access') {
  const secret = type === 'refresh' ? getRefreshSecret() : getJwtSecret();
  try {
    const payload = jwt.verify(token, secret) as TokenPayload;
    if (!payload?.sub || payload.type !== type) return null;

    const user = await prisma.user.findUnique({
      where: { id: payload.sub },
    });
    if (!user) return null;
    if (user.active === false) return null;
    if ((payload.ver ?? 0) !== (user.tokenVersion ?? 0)) return null;

    return user;
  } catch (err) {
    if (err instanceof jwt.JsonWebTokenError || err instanceof jwt.TokenExpiredError) return null;
    throw err;
  }
}

export async function getUserFromRequest(req: NextApiRequest | { headers: Headers | { authorization?: string | undefined; get?: (name: string) => string | null } }) {
  const token = extractBearerToken(req);
  if (!token) return null;

  return getUserFromToken(token, 'access');
}

export async function getAuthorizedUser(request: NextRequest, roles: string[] = EDITOR_ROLES) {
  const user = await getUserFromRequest(request);
  return hasRole(user, roles) ? user : null;
}

export type AuthenticatedUser = NonNullable<Awaited<ReturnType<typeof getUserFromToken>>>;

export type AuthorizationResult =
  | { ok: true; user: AuthenticatedUser; response?: undefined }
  | { ok: false; user?: undefined; response: NextResponse };

const UNAUTHENTICATED_MESSAGE = 'Session expirée ou invalide. Veuillez vous reconnecter.';
const FORBIDDEN_MESSAGE = 'Accès réservé aux administrateurs et éditeurs.';
const ADMIN_ONLY_MESSAGE = 'Accès réservé aux administrateurs.';

/**
 * Vérifie la session et le rôle.
 * - 401 : pas de jeton, jeton invalide/expiré/révoqué, compte supprimé ou désactivé ;
 * - 403 : utilisateur authentifié mais rôle insuffisant ;
 * - 500 JSON : secrets JWT absents.
 */
export async function authorize(request: NextRequest, roles: string[] = EDITOR_ROLES): Promise<AuthorizationResult> {
  try {
    const user = await getUserFromRequest(request);
    if (!user) {
      return { ok: false, response: NextResponse.json({ status: 'error', message: UNAUTHENTICATED_MESSAGE }, { status: 401 }) };
    }
    if (!hasRole(user, roles)) {
      const message = roles.length === 1 && roles[0] === 'ADMIN' ? ADMIN_ONLY_MESSAGE : FORBIDDEN_MESSAGE;
      return { ok: false, response: NextResponse.json({ status: 'error', message }, { status: 403 }) };
    }
    return { ok: true, user };
  } catch (error) {
    console.error('Authentication configuration error:', error);
    return { ok: false, response: securityConfigErrorResponse() };
  }
}

export function requireAdmin(request: NextRequest) {
  return authorize(request, ADMIN_ROLES);
}

/**
 * Compatibilité : renvoie une réponse d'erreur (401/403/500) ou null si l'accès est accordé.
 * Préférer `authorize()` lorsque l'utilisateur est nécessaire (audit).
 */
export async function requireEditor(request: NextRequest) {
  const result = await authorize(request, EDITOR_ROLES);
  return result.ok ? null : result.response;
}

/** Renvoie l'utilisateur éditeur si un jeton valide est fourni, sinon null (sans erreur). */
export async function getOptionalEditor(request: NextRequest) {
  if (!extractBearerToken(request)) return null;
  try {
    return await getAuthorizedUser(request, EDITOR_ROLES);
  } catch {
    return null;
  }
}

export function sanitizeUser<T extends Record<string, any> | null | undefined>(user: T) {
  if (!user) return null;
  const safeUser: Record<string, any> = { ...user };
  delete safeUser.passwordHash;
  delete safeUser.tokenVersion;
  return safeUser as Omit<NonNullable<T>, 'passwordHash' | 'tokenVersion'>;
}

/** Profil public renvoyé par login/refresh (forme existante + champs additifs). */
export function toSessionUser(user: { id: string; name: string; email: string; role: string; mustChangePassword?: boolean | null }) {
  return {
    id: user.id,
    name: user.name,
    email: user.email,
    role: user.role,
    mustChangePassword: Boolean(user.mustChangePassword),
  };
}

export function hasRole(user: any, allowed: string[]) {
  if (!user) return false;
  const role = (user.role ?? '').toString();
  return allowed.includes(role);
}

const authService = {
  getUserFromRequest,
  getUserFromToken,
  signAccessToken,
  signRefreshToken,
  sanitizeUser,
  hasRole,
};

export default authService;
