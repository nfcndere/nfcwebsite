import { NextRequest } from 'next/server';
import prisma from '@/lib/prisma';
import { requireEditor } from '@/lib/server/auth';
import { apiError, resourceResponse, latestDate } from '@/lib/api-response';

// ===================================
// GET /api/forms — Récupérer toutes les soumissions de formulaires (admin mobile)
// ===================================
export async function GET(request: NextRequest) {
  const denied = await requireEditor(request);
  if (denied) return denied;
  try {
    const { searchParams } = new URL(request.url);
    const type = searchParams.get('type');
    const processed = searchParams.get('processed');

    const where: any = {};
    if (type) where.type = type;
    if (processed !== null) where.processed = processed === 'true';

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
