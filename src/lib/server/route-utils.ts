import type { NextRequest } from 'next/server';
import { NextResponse } from 'next/server';
import type { ZodType, ZodTypeDef } from 'zod';
import { Prisma } from '@prisma/client';
import { apiError } from '@/lib/api-response';
import { AuthConfigError, securityConfigErrorResponse } from '@/lib/server/auth';
import { ensureDatabaseSchema } from '@/lib/server/ensure-schema';

type ParseResult<T> = { ok: true; data: T; response?: undefined } | { ok: false; data?: undefined; response: NextResponse };

/**
 * Lit le corps JSON et le valide avec zod. Un JSON mal formé renvoie 400 (et non 500).
 * Le détail des champs invalides est ajouté dans `issues` (additif, sans valeur sensible).
 */
export async function parseJsonBody<T>(
  request: NextRequest,
  schema: ZodType<T, ZodTypeDef, unknown>,
  message = 'Données invalides.',
): Promise<ParseResult<T>> {
  let raw: unknown;
  try {
    raw = await request.json();
  } catch {
    return { ok: false, response: apiError('Corps de requête JSON invalide.', 400) };
  }
  const parsed = schema.safeParse(raw);
  if (!parsed.success) {
    const issues = parsed.error.issues.map((issue) => ({ path: issue.path.join('.'), message: issue.message }));
    return { ok: false, response: NextResponse.json({ status: 'error', message, issues }, { status: 400 }) };
  }
  return { ok: true, data: parsed.data };
}

/**
 * Traduction homogène des erreurs : configuration JWT absente → 500 JSON explicite,
 * enregistrement introuvable → 404, contrainte d'unicité → 409, table/colonne absente → 503
 * (migrations non appliquées), autre → 500 avec le message de repli.
 */
export function handleRouteError(error: unknown, fallbackMessage: string, context = 'API') {
  if (error instanceof AuthConfigError) {
    console.error(`[${context}] Configuration JWT manquante :`, error.message);
    return securityConfigErrorResponse();
  }
  if (error instanceof Prisma.PrismaClientKnownRequestError) {
    if (error.code === 'P2025') return apiError('Ressource introuvable.', 404);
    if (error.code === 'P2002') return apiError('Une ressource avec cet identifiant unique existe déjà.', 409);
    if (error.code === 'P2003') return apiError('Référence invalide vers une ressource liée.', 400);
    if (error.code === 'P2021' || error.code === 'P2022') {
      console.error(`[${context}] Schéma de base incomplet (tentative d'auto-migration) :`, error.message);
      void ensureDatabaseSchema(true);
      return apiError(`${fallbackMessage} Base de données non migrée.`, 503);
    }
  }
  if (error instanceof Prisma.PrismaClientInitializationError) {
    console.error(`[${context}] Base de données injoignable :`, error.message);
    return apiError(`${fallbackMessage} Base de données indisponible.`, 503);
  }
  console.error(`[${context}] ${fallbackMessage}`, error);
  return apiError(fallbackMessage);
}

/** Convertit un objet Prisma en JSON pur (dates ISO) pour l'audit. */
export function toAuditJson(value: unknown): Prisma.InputJsonValue | undefined {
  if (value === undefined || value === null) return undefined;
  const json = JSON.parse(JSON.stringify(value, (key, val) => (key === 'passwordHash' || key === 'tokenVersion' ? undefined : val)));
  return json as Prisma.InputJsonValue;
}
