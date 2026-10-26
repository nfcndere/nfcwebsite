import { NextRequest } from 'next/server';
import { z } from 'zod';
import prisma from '@/lib/prisma';
import { apiError, latestDate, resourceResponse } from '@/lib/api-response';
import { requireAdmin } from '@/lib/server/auth';
import { handleRouteError } from '@/lib/server/route-utils';

export const dynamic = 'force-dynamic';

const auditQuerySchema = z.object({
  entity: z.string().trim().max(60).optional(),
  entityId: z.string().trim().max(100).optional(),
  userId: z.string().trim().max(100).optional(),
  action: z.string().trim().max(60).optional(),
  page: z.coerce.number().int().min(1).default(1),
  pageSize: z.coerce.number().int().min(1).max(100).default(50),
});

// ===================================
// GET /api/audit — Journal des mutations d'administration (ADMIN)
// ===================================
export async function GET(request: NextRequest) {
  const auth = await requireAdmin(request);
  if (!auth.ok) return auth.response;
  try {
    const { searchParams } = new URL(request.url);
    const parsed = auditQuerySchema.safeParse({
      entity: searchParams.get('entity') ?? undefined,
      entityId: searchParams.get('entityId') ?? undefined,
      userId: searchParams.get('userId') ?? undefined,
      action: searchParams.get('action') ?? undefined,
      page: searchParams.get('page') ?? undefined,
      pageSize: searchParams.get('pageSize') ?? undefined,
    });
    if (!parsed.success) return apiError('Paramètres de filtrage invalides.', 400);
    const { entity, entityId, userId, action, page, pageSize } = parsed.data;

    const where: Record<string, unknown> = {};
    if (entity) where.entity = entity;
    if (entityId) where.entityId = entityId;
    if (userId) where.userId = userId;
    if (action) where.action = action;

    const logs = await prisma.auditLog.findMany({
      where,
      orderBy: { createdAt: 'desc' },
      skip: (page - 1) * pageSize,
      take: pageSize,
      include: {
        user: { select: { id: true, name: true, email: true, role: true } },
      },
    });

    return resourceResponse(logs, latestDate(logs, (log) => log.createdAt));
  } catch (error) {
    return handleRouteError(error, 'Impossible de récupérer le journal d’audit.', 'audit:get');
  }
}
