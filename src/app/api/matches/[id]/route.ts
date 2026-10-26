import { NextRequest } from 'next/server';
import prisma from '@/lib/prisma';
import { z } from 'zod';
import { apiError, resourceResponse } from '@/lib/api-response';
import { DATA_FRESHNESS_MS } from '@/constants/data-freshness';
import { authorize } from '@/lib/server/auth';
import { recordAudit } from '@/lib/server/audit';
import { handleRouteError, parseJsonBody } from '@/lib/server/route-utils';
import { NOT_DELETED } from '@/lib/soft-delete';

export const dynamic = 'force-dynamic';

const matchPatchSchema = z.object({
  homeTeam: z.string().trim().min(1).max(120).optional(),
  awayTeam: z.string().trim().min(1).max(120).optional(),
  homeScore: z.coerce.number().int().min(0).nullable().optional(),
  awayScore: z.coerce.number().int().min(0).nullable().optional(),
  date: z.string().datetime({ offset: true }).optional(),
  stadium: z.string().trim().max(160).nullable().optional(),
  competition: z.string().trim().max(120).nullable().optional(),
  status: z.enum(['PROGRAMME', 'EN_COURS', 'TERMINE', 'REPORTE', 'ANNULE']).optional(),
  summary: z.string().max(4_000).nullable().optional(),
  restore: z.boolean().optional(),
});

// ===================================
// GET /api/matches/[id] — Récupérer un match par ID (non supprimé)
// ===================================
export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const match = await prisma.match.findFirst({
      where: { id: params.id, ...NOT_DELETED },
    });

    if (!match) {
      return apiError('Match non trouvé.', 404);
    }

    return resourceResponse(match, match.updatedAt, match.status === 'EN_COURS' ? DATA_FRESHNESS_MS.liveMatch : DATA_FRESHNESS_MS.matches);
  } catch (error: unknown) {
    return handleRouteError(error, 'Impossible de récupérer le match.', 'matches/[id]:get');
  }
}

// ===================================
// PATCH /api/matches/[id] — Modifier un match (Score, Date, Statut)
// ===================================
export async function PATCH(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  const auth = await authorize(request);
  if (!auth.ok) return auth.response;
  try {
    const parsed = await parseJsonBody(request, matchPatchSchema, 'Données de match invalides.');
    if (!parsed.ok) return parsed.response;
    const body = parsed.data;

    const existing = await prisma.match.findFirst({
      where: { id: params.id, ...(body.restore ? {} : NOT_DELETED) },
    });
    if (!existing) return apiError('Match non trouvé.', 404);

    const dataToUpdate: Record<string, unknown> = {};
    if (body.homeTeam !== undefined) dataToUpdate.homeTeam = body.homeTeam;
    if (body.awayTeam !== undefined) dataToUpdate.awayTeam = body.awayTeam;
    if (body.homeScore !== undefined) dataToUpdate.homeScore = body.homeScore !== null ? Number(body.homeScore) : null;
    if (body.awayScore !== undefined) dataToUpdate.awayScore = body.awayScore !== null ? Number(body.awayScore) : null;
    if (body.date !== undefined) dataToUpdate.date = new Date(body.date);
    if (body.stadium !== undefined) dataToUpdate.stadium = body.stadium;
    if (body.competition !== undefined) dataToUpdate.competition = body.competition;
    if (body.status !== undefined) dataToUpdate.status = body.status;
    if (body.summary !== undefined) dataToUpdate.summary = body.summary;
    if (body.restore === true) dataToUpdate.deletedAt = null;

    const updated = await prisma.match.update({
      where: { id: params.id },
      data: dataToUpdate,
    });
    await recordAudit({
      request,
      userId: auth.user.id,
      action: body.restore ? 'RESTORE' : 'UPDATE',
      entity: 'Match',
      entityId: updated.id,
      before: existing,
      after: updated,
    });

    return resourceResponse(updated, updated.updatedAt);
  } catch (error: unknown) {
    return handleRouteError(error, 'Impossible de modifier le match.', 'matches/[id]:patch');
  }
}

// ===================================
// DELETE /api/matches/[id] — Suppression logique d'un match
// ===================================
export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  const auth = await authorize(request);
  if (!auth.ok) return auth.response;
  try {
    const existing = await prisma.match.findFirst({ where: { id: params.id, ...NOT_DELETED } });
    if (!existing) return apiError('Match non trouvé.', 404);

    const deletedAt = new Date();
    const updated = await prisma.match.update({
      where: { id: params.id },
      data: { deletedAt },
    });
    await recordAudit({
      request,
      userId: auth.user.id,
      action: 'SOFT_DELETE',
      entity: 'Match',
      entityId: updated.id,
      before: existing,
      after: updated,
    });

    return resourceResponse({ id: params.id, deleted: true, deletedAt: deletedAt.toISOString() }, deletedAt);
  } catch (error: unknown) {
    return handleRouteError(error, 'Impossible de supprimer le match.', 'matches/[id]:delete');
  }
}
