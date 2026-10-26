import { NextRequest } from 'next/server';
import prisma from '@/lib/prisma';
import { z } from 'zod';
import { authorize } from '@/lib/server/auth';
import { apiError, resourceResponse } from '@/lib/api-response';
import { recordAudit } from '@/lib/server/audit';
import { handleRouteError, parseJsonBody } from '@/lib/server/route-utils';

import { type AcademyFollowUpStatus } from '@/constants/club-settings';

export const dynamic = 'force-dynamic';

const followUpInputMap: Record<string, AcademyFollowUpStatus> = {
  NOUVEAU: 'NOUVEAU',
  nouveau: 'NOUVEAU',
  CONTACTE: 'CONTACTE',
  contacte: 'CONTACTE',
  contacté: 'CONTACTE',
  CONVOQUE: 'CONVOQUE',
  convoque: 'CONVOQUE',
  convoqué: 'CONVOQUE',
  ADMIS: 'ADMIS',
  admis: 'ADMIS',
  REFUSE: 'REFUSE',
  refuse: 'REFUSE',
  refusé: 'REFUSE',
};

const followUpSchema = z
  .string()
  .trim()
  .transform((value) => followUpInputMap[value] ?? followUpInputMap[value.toUpperCase()])
  .refine((value): value is AcademyFollowUpStatus => Boolean(value), {
    message: 'Statut de suivi invalide (attendu : nouveau, contacté, convoqué, admis, refusé).',
  });

const formPatchSchema = z
  .object({
    processed: z.boolean().optional(),
    adminNotes: z.string().max(4_000).nullable().optional(),
    followUpStatus: followUpSchema.nullable().optional(),
    // Alias accepté pour un client envoyant `status` sur une candidature académie.
    status: followUpSchema.nullable().optional(),
  })
  .strict()
  .refine(
    (data) =>
      data.processed !== undefined ||
      data.adminNotes !== undefined ||
      data.followUpStatus !== undefined ||
      data.status !== undefined,
    { message: 'Aucune modification fournie.' },
  );

// ===================================
// PATCH /api/forms/[id] — Mettre à jour le traitement, les notes internes ou le suivi académie
// Sans argument `processed` et sans note/statut, conserve le comportement historique (`processed = true`).
// ===================================
export async function PATCH(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  const auth = await authorize(request);
  if (!auth.ok) return auth.response;
  try {
    const parsed = await parseJsonBody(request, formPatchSchema, 'Données de suivi invalides.');
    if (!parsed.ok) return parsed.response;
    const body = parsed.data;

    const existing = await prisma.formSubmission.findUnique({ where: { id: params.id } });
    if (!existing) return apiError('Formulaire non trouvé.', 404);

    const nextStatus = body.followUpStatus !== undefined ? body.followUpStatus : body.status;
    const data: Record<string, unknown> = {};
    if (body.adminNotes !== undefined) data.adminNotes = body.adminNotes;
    if (nextStatus !== undefined) data.followUpStatus = nextStatus;

    if (body.processed !== undefined) {
      data.processed = body.processed;
    } else if (nextStatus) {
      data.processed = nextStatus !== 'NOUVEAU';
    } else if (body.adminNotes === undefined) {
      data.processed = true;
    }

    const updated = await prisma.formSubmission.update({
      where: { id: params.id },
      data,
    });
    await recordAudit({
      request,
      userId: auth.user.id,
      action: 'UPDATE',
      entity: 'FormSubmission',
      entityId: updated.id,
      before: existing,
      after: updated,
    });
    return resourceResponse(updated, updated.updatedAt ?? updated.createdAt);
  } catch (error) {
    return handleRouteError(error, 'Impossible de mettre à jour le formulaire.', 'forms/[id]:patch');
  }
}

// ===================================
// GET /api/forms/[id] — Récupérer un formulaire spécifique
// ===================================
export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  const auth = await authorize(request);
  if (!auth.ok) return auth.response;
  try {
    const form = await prisma.formSubmission.findUnique({
      where: { id: params.id },
    });
    if (!form) {
      return apiError('Formulaire non trouvé.', 404);
    }
    return resourceResponse(form, form.updatedAt ?? form.createdAt);
  } catch (error) {
    return handleRouteError(error, 'Impossible de récupérer le formulaire.', 'forms/[id]:get');
  }
}

// ===================================
// DELETE /api/forms/[id] — Supprimer une candidature / formulaire
// ===================================
export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  const auth = await authorize(request);
  if (!auth.ok) return auth.response;
  try {
    const existing = await prisma.formSubmission.findUnique({ where: { id: params.id } });
    if (!existing) return apiError('Formulaire non trouvé.', 404);

    await prisma.formSubmission.delete({
      where: { id: params.id },
    });
    await recordAudit({
      request,
      userId: auth.user.id,
      action: 'DELETE',
      entity: 'FormSubmission',
      entityId: existing.id,
      before: existing,
    });
    return resourceResponse({ id: params.id, deleted: true }, new Date());
  } catch (error) {
    return handleRouteError(error, 'Impossible de supprimer le formulaire.', 'forms/[id]:delete');
  }
}
