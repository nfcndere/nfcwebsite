import type { NextRequest } from 'next/server';
import prisma from '@/lib/prisma';
import { getClientIp } from '@/lib/server/rate-limit';
import { toAuditJson } from '@/lib/server/route-utils';

export type AuditAction =
  | 'CREATE'
  | 'UPDATE'
  | 'DELETE'
  | 'SOFT_DELETE'
  | 'RESTORE'
  | 'LOGIN'
  | 'PASSWORD_CHANGE'
  | 'PASSWORD_RESET_REQUEST'
  | 'PASSWORD_RESET'
  | 'SEND'
  | 'SIGN_UPLOAD';

type AuditInput = {
  request?: NextRequest;
  userId?: string | null;
  action: AuditAction;
  entity: string;
  entityId?: string | null;
  before?: unknown;
  after?: unknown;
};

/**
 * Enregistre une entrée d'audit. Best effort : un échec d'écriture du journal ne doit jamais
 * faire échouer la mutation déjà effectuée ; il est journalisé côté serveur.
 * Les champs `passwordHash` et `tokenVersion` sont retirés des instantanés.
 */
export async function recordAudit({ request, userId, action, entity, entityId, before, after }: AuditInput) {
  try {
    await prisma.auditLog.create({
      data: {
        userId: userId ?? null,
        action,
        entity,
        entityId: entityId ?? null,
        before: toAuditJson(before),
        after: toAuditJson(after),
        ip: request ? getClientIp(request) : null,
      },
    });
  } catch (error) {
    console.error(`[audit] Échec d'écriture de l'audit ${action} ${entity}#${entityId ?? '-'} :`, error);
  }
}
