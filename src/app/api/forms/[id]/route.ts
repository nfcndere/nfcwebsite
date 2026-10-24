import { NextRequest } from 'next/server';
import prisma from '@/lib/prisma';
import { z } from 'zod';
import { requireEditor } from '@/lib/server/auth';
import { apiError, resourceResponse } from '@/lib/api-response';

const processedSchema = z.object({ processed: z.boolean().optional() });

// ===================================
// PATCH /api/forms/[id] — Marquer un formulaire comme traité (admin mobile)
// ===================================
export async function PATCH(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  const denied = await requireEditor(request);
  if (denied) return denied;
  try {
    const parsed = processedSchema.safeParse(await request.json());
    if (!parsed.success) return apiError('Valeur processed invalide.', 400);
    const body = parsed.data;
    const updated = await prisma.formSubmission.update({
      where: { id: params.id },
      data: { processed: body.processed ?? true },
    });
    return resourceResponse(updated, updated.createdAt);
  } catch (error) {
    console.error('Failed to update form submission:', error);
    return apiError('Impossible de mettre à jour le formulaire.');
  }
}

// ===================================
// GET /api/forms/[id] — Récupérer un formulaire spécifique
// ===================================
export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  const denied = await requireEditor(request);
  if (denied) return denied;
  try {
    const form = await prisma.formSubmission.findUnique({
      where: { id: params.id },
    });
    if (!form) {
      return apiError('Formulaire non trouvé.', 404);
    }
    return resourceResponse(form, form.createdAt);
  } catch (error) {
    console.error('Failed to retrieve form submission:', error);
    return apiError('Impossible de récupérer le formulaire.');
  }
}

// ===================================
// DELETE /api/forms/[id] — Supprimer une candidature / formulaire
// ===================================
export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  const denied = await requireEditor(request);
  if (denied) return denied;
  try {
    await prisma.formSubmission.delete({
      where: { id: params.id },
    });
    return resourceResponse({ id: params.id, deleted: true }, new Date());
  } catch (error) {
    console.error('Failed to delete form submission:', error);
    return apiError('Impossible de supprimer le formulaire.');
  }
}
