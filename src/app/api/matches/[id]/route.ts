import { NextRequest } from 'next/server';
import prisma from '@/lib/prisma';
import { z } from 'zod';
import { apiError, resourceResponse } from '@/lib/api-response';
import { DATA_FRESHNESS_MS } from '@/constants/data-freshness';
import { requireEditor } from '@/lib/server/auth';

const matchPatchSchema = z.object({
  homeTeam: z.string().trim().min(1).optional(),
  awayTeam: z.string().trim().min(1).optional(),
  homeScore: z.coerce.number().int().min(0).nullable().optional(),
  awayScore: z.coerce.number().int().min(0).nullable().optional(),
  date: z.string().datetime({ offset: true }).optional(),
  stadium: z.string().trim().nullable().optional(),
  competition: z.string().trim().nullable().optional(),
  status: z.enum(['PROGRAMME', 'EN_COURS', 'TERMINE', 'REPORTE', 'ANNULE']).optional(),
  summary: z.string().nullable().optional(),
});

// ===================================
// GET /api/matches/[id] — Récupérer un match par ID
// ===================================
export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const match = await prisma.match.findUnique({
      where: { id: params.id },
    });

    if (!match) {
      return apiError('Match non trouvé.', 404);
    }

    return resourceResponse(match, match.updatedAt, match.status === 'EN_COURS' ? DATA_FRESHNESS_MS.liveMatch : DATA_FRESHNESS_MS.matches);
  } catch (error: any) {
    console.error('Failed to retrieve match:', error);
    return apiError('Impossible de récupérer le match.');
  }
}

// ===================================
// PATCH /api/matches/[id] — Modifier un match (Score, Date, Statut)
// ===================================
export async function PATCH(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  const denied = await requireEditor(request);
  if (denied) return denied;
  try {
    const parsed = matchPatchSchema.safeParse(await request.json());
    if (!parsed.success) return apiError('Données de match invalides.', 400);
    const body = parsed.data;

    const dataToUpdate: any = {};
    if (body.homeTeam !== undefined) dataToUpdate.homeTeam = body.homeTeam;
    if (body.awayTeam !== undefined) dataToUpdate.awayTeam = body.awayTeam;
    if (body.homeScore !== undefined) dataToUpdate.homeScore = body.homeScore !== null ? Number(body.homeScore) : null;
    if (body.awayScore !== undefined) dataToUpdate.awayScore = body.awayScore !== null ? Number(body.awayScore) : null;
    if (body.date !== undefined) dataToUpdate.date = new Date(body.date);
    if (body.stadium !== undefined) dataToUpdate.stadium = body.stadium;
    if (body.competition !== undefined) dataToUpdate.competition = body.competition;
    if (body.status !== undefined) dataToUpdate.status = body.status;
    if (body.summary !== undefined) dataToUpdate.summary = body.summary;

    const updated = await prisma.match.update({
      where: { id: params.id },
      data: dataToUpdate,
    });

    return resourceResponse(updated, updated.updatedAt);
  } catch (error: any) {
    console.error('Failed to update match:', error);
    return apiError('Impossible de modifier le match.');
  }
}

// ===================================
// DELETE /api/matches/[id] — Supprimer un match
// ===================================
export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  const denied = await requireEditor(request);
  if (denied) return denied;
  try {
    await prisma.match.delete({
      where: { id: params.id },
    });

    return resourceResponse({ id: params.id, deleted: true }, new Date());
  } catch (error: any) {
    console.error('Failed to delete match:', error);
    return apiError('Impossible de supprimer le match.');
  }
}
