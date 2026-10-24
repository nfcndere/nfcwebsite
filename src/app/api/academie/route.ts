import { NextRequest, NextResponse } from 'next/server';
import prisma from '@/lib/prisma';
import { z } from 'zod';
import { apiError, resourceResponse, latestDate } from '@/lib/api-response';
import { requireEditor } from '@/lib/server/auth';

const applicationSchema = z.object({
  nomJoueur: z.string().trim().min(1),
  prenomJoueur: z.string().trim().min(1),
  nomTuteur: z.string().trim().min(1),
  telephone: z.string().trim().min(6),
  dateNaissance: z.string().optional(),
  categorie: z.string().optional(),
  poste: z.string().optional(),
  description: z.string().optional(),
  notes: z.string().optional(),
});

// ===================================
// POST /api/academie — Soumettre une candidature d'académie en BD
// ===================================
export async function POST(request: NextRequest) {
  try {
    const parsed = applicationSchema.safeParse(await request.json());
    if (!parsed.success) return apiError('Champs obligatoires manquants ou invalides.', 400);
    const body = parsed.data;

    // Sauvegarde en BD via FormSubmission
    const submission = await prisma.formSubmission.create({
      data: {
        type: 'ACADEMIE',
        payload: {
          nomJoueur: body.nomJoueur,
          prenomJoueur: body.prenomJoueur,
          dateNaissance: body.dateNaissance,
          categorie: body.categorie,
          poste: body.poste,
          nomTuteur: body.nomTuteur,
          telephone: body.telephone,
          description: body.description || '',
          notes: body.notes || '',
        },
        ip: request.headers.get('x-forwarded-for') || 'inconnue',
        userAgent: request.headers.get('user-agent') || '',
      },
    });

    return NextResponse.json({
      success: true,
      message: 'Candidature enregistrée. Vous serez contacté ultérieurement par notre service de détection.',
      submissionId: submission.id,
    });
  } catch (error) {
    console.error('Failed to create academy application:', error);
    return apiError('Impossible d’enregistrer la candidature.');
  }
}

// ===================================
// GET /api/academie — Récupérer les candidatures (admin)
// ===================================
export async function GET(request: NextRequest) {
  const denied = await requireEditor(request);
  if (denied) return denied;
  try {
    const submissions = await prisma.formSubmission.findMany({
      where: { type: 'ACADEMIE' },
      orderBy: { createdAt: 'desc' },
    });
    return resourceResponse(submissions, latestDate(submissions, (submission) => submission.createdAt));
  } catch (error) {
    console.error('Failed to retrieve academy applications:', error);
    return apiError('Impossible de récupérer les candidatures.');
  }
}
