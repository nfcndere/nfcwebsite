import { NextRequest } from 'next/server';
import { z } from 'zod';
import prisma from '@/lib/prisma';
import { apiError, resourceResponse } from '@/lib/api-response';
import { authorize } from '@/lib/server/auth';
import { recordAudit } from '@/lib/server/audit';
import { handleRouteError, parseJsonBody } from '@/lib/server/route-utils';

export const dynamic = 'force-dynamic';

const seasonPatchSchema = z
  .object({
    label: z.string().trim().min(1).max(30).optional(),
    startsAt: z.string().datetime({ offset: true }).optional(),
    endsAt: z.string().datetime({ offset: true }).optional(),
    isCurrent: z.boolean().optional(),
  })
  .strict();

// ===================================
// PATCH /api/seasons/[id] — Modifier une saison (dont isCurrent, une seule saison courante en transaction)
// ===================================
export async function PATCH(request: NextRequest, { params }: { params: { id: string } }) {
  const auth = await authorize(request);
  if (!auth.ok) return auth.response;
  try {
    const parsed = await parseJsonBody(request, seasonPatchSchema, 'Données de saison invalides.');
    if (!parsed.ok) return parsed.response;
    const body = parsed.data;

    const existing = await prisma.season.findUnique({ where: { id: params.id } });
    if (!existing) return apiError('Saison introuvable.', 404);

    const startsAt = body.startsAt ? new Date(body.startsAt) : existing.startsAt;
    const endsAt = body.endsAt ? new Date(body.endsAt) : existing.endsAt;
    if (endsAt <= startsAt) {
      return apiError('La fin de saison doit suivre son début.', 400);
    }

    const updated = await prisma.$transaction(async (tx) => {
      if (body.isCurrent === true) {
        await tx.season.updateMany({ where: { isCurrent: true, id: { not: params.id } }, data: { isCurrent: false } });
      }
      return tx.season.update({
        where: { id: params.id },
        data: {
          ...(body.label !== undefined ? { label: body.label } : {}),
          ...(body.startsAt !== undefined ? { startsAt } : {}),
          ...(body.endsAt !== undefined ? { endsAt } : {}),
          ...(body.isCurrent !== undefined ? { isCurrent: body.isCurrent } : {}),
        },
      });
    });

    await recordAudit({
      request,
      userId: auth.user.id,
      action: 'UPDATE',
      entity: 'Season',
      entityId: updated.id,
      before: existing,
      after: updated,
    });

    return resourceResponse(updated, updated.updatedAt);
  } catch (error) {
    return handleRouteError(error, 'Impossible de modifier la saison.', 'seasons/[id]:patch');
  }
}
