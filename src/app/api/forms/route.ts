import { NextRequest } from 'next/server';
import prisma from '@/lib/prisma';
import { z } from 'zod';
import { requireEditor } from '@/lib/server/auth';
import { apiError, resourceResponse, latestDate } from '@/lib/api-response';

export const dynamic = 'force-dynamic';

const formQuerySchema = z.object({
  type: z.enum(['ACADEMIE', 'NEWSLETTER', 'CONTACT', 'BILLETTERIE']).optional(),
  processed: z.enum(['true', 'false']).optional(),
});

// ===================================
// GET /api/forms — Récupérer toutes les soumissions de formulaires (admin mobile)
// ===================================
export async function GET(request: NextRequest) {
  const denied = await requireEditor(request);
  if (denied) return denied;
  try {
    const { searchParams } = new URL(request.url);
    const parsed = formQuerySchema.safeParse({
      type: searchParams.get('type') ?? undefined,
      processed: searchParams.get('processed') ?? undefined,
    });
    if (!parsed.success) return apiError('Paramètres de recherche invalides.', 400);
    const { type, processed } = parsed.data;

    const where: { type?: string; processed?: boolean } = {};
    if (type) where.type = type;
    if (processed !== undefined) where.processed = processed === 'true';

    const forms = await prisma.formSubmission.findMany({
      where,
      orderBy: { createdAt: 'desc' },
    });

    return resourceResponse(forms, latestDate(forms, (form) => form.createdAt));
  } catch (error) {
    console.error('Failed to retrieve form submissions:', error);
    return apiError('Impossible de récupérer les formulaires.');
  }
}
