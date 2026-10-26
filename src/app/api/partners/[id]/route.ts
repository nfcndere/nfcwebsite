import { NextRequest } from 'next/server';
import { z } from 'zod';
import prisma from '@/lib/prisma';
import { apiError, resourceResponse } from '@/lib/api-response';
import { authorize } from '@/lib/server/auth';
import { recordAudit } from '@/lib/server/audit';
import { handleRouteError, parseJsonBody } from '@/lib/server/route-utils';
import { resolvePartnerLogos } from '@/constants/club-settings';

export const dynamic = 'force-dynamic';

const partnerPatchSchema = z
  .object({
    name: z.string().trim().min(1).max(160).optional(),
    link: z.string().trim().url().max(500).nullable().optional(),
    logoId: z.string().trim().min(1).max(200).nullable().optional(),
    priority: z.coerce.number().int().min(0).max(1_000).optional(),
    active: z.boolean().optional(),
  })
  .strict();

// ===================================
// PATCH /api/partners/[id] — Modifier un sponsor / partenaire (requireEditor)
// ===================================
export async function PATCH(request: NextRequest, { params }: { params: { id: string } }) {
  const auth = await authorize(request);
  if (!auth.ok) return auth.response;
  try {
    const parsed = await parseJsonBody(request, partnerPatchSchema, 'Données de partenaire invalides.');
    if (!parsed.ok) return parsed.response;

    const existing = await prisma.sponsor.findUnique({ where: { id: params.id } });
    if (!existing) return apiError('Partenaire introuvable.', 404);

    const updated = await prisma.sponsor.update({
      where: { id: params.id },
      data: parsed.data,
    });
    await recordAudit({
      request,
      userId: auth.user.id,
      action: 'UPDATE',
      entity: 'Sponsor',
      entityId: updated.id,
      before: existing,
      after: updated,
    });

    const mediaById = await resolvePartnerLogos(updated.logoId ? [updated.logoId] : []);
    return resourceResponse(
      {
        id: updated.id,
        name: updated.name,
        link: updated.link,
        logoId: updated.logoId,
        logoUrl: updated.logoId ? mediaById.get(updated.logoId) ?? null : null,
        priority: updated.priority,
        active: updated.active,
      },
      updated.updatedAt,
    );
  } catch (error) {
    return handleRouteError(error, 'Impossible de modifier le partenaire.', 'partners/[id]:patch');
  }
}

// ===================================
// DELETE /api/partners/[id] — Supprimer un sponsor / partenaire (requireEditor)
// ===================================
export async function DELETE(request: NextRequest, { params }: { params: { id: string } }) {
  const auth = await authorize(request);
  if (!auth.ok) return auth.response;
  try {
    const existing = await prisma.sponsor.findUnique({ where: { id: params.id } });
    if (!existing) return apiError('Partenaire introuvable.', 404);

    await prisma.sponsor.delete({ where: { id: params.id } });
    await recordAudit({
      request,
      userId: auth.user.id,
      action: 'DELETE',
      entity: 'Sponsor',
      entityId: existing.id,
      before: existing,
    });

    return resourceResponse({ id: params.id, deleted: true }, new Date());
  } catch (error) {
    return handleRouteError(error, 'Impossible de supprimer le partenaire.', 'partners/[id]:delete');
  }
}
