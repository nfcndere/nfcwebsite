import { NextRequest, NextResponse } from 'next/server';
import prisma from '@/lib/prisma';
import { z } from 'zod';
import { apiError, resourceResponse, latestDate } from '@/lib/api-response';
import { authorize } from '@/lib/server/auth';
import { enforceRateLimit, getClientIp } from '@/lib/server/rate-limit';
import { handleRouteError, parseJsonBody } from '@/lib/server/route-utils';
import { notifyAdmins } from '@/lib/server/push';

export const dynamic = 'force-dynamic';

const applicationSchema = z.object({
  nomJoueur: z.string().trim().min(1).max(100),
  prenomJoueur: z.string().trim().min(1).max(100),
  nomTuteur: z.string().trim().min(1).max(150),
  telephone: z.string().trim().min(6).max(30),
  dateNaissance: z.string().regex(/^\d{4}-\d{2}-\d{2}$/).refine((value) => {
    const date = new Date(`${value}T00:00:00.000Z`);
    return Number.isFinite(date.getTime()) && date.toISOString().slice(0, 10) === value;
  }).optional(),
  categorie: z.string().trim().max(30).optional(),
  poste: z.string().trim().max(60).optional(),
  description: z.string().max(2_000).optional(),
  notes: z.string().max(2_000).optional(),
});

// ===================================
// POST /api/academie — Soumettre une candidature d'académie en BD
// ===================================
export async function POST(request: NextRequest) {
  try {
    const parsed = await parseJsonBody(request, applicationSchema, 'Champs obligatoires manquants ou invalides.');
    if (!parsed.ok) return parsed.response;
    const body = parsed.data;
    const limited = await enforceRateLimit(request, 'academy-application', 5, 60 * 60 * 1_000);
    if (limited) return limited;

    const submission = await prisma.formSubmission.create({
      data: {
        type: 'ACADEMIE',
        followUpStatus: 'NOUVEAU',
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
        ip: getClientIp(request),
        userAgent: request.headers.get('user-agent') || '',
      },
    });

    await notifyAdmins({
      title: 'Nouvelle inscription Académie NFC',
      body: `${body.prenomJoueur} ${body.nomJoueur}${body.categorie ? ` (${body.categorie})` : ''}`,
      url: '/dashboard',
      tag: `academie-${submission.id}`,
    });

    return NextResponse.json({
      success: true,
      message: 'Candidature enregistrée. Vous serez contacté ultérieurement par notre service de détection.',
      submissionId: submission.id,
    });
  } catch (error) {
    return handleRouteError(error, 'Impossible d’enregistrer la candidature.', 'academie:post');
  }
}

// ===================================
// GET /api/academie — Récupérer les candidatures (admin)
// ===================================
export async function GET(request: NextRequest) {
  const auth = await authorize(request);
  if (!auth.ok) return auth.response;
  try {
    const submissions = await prisma.formSubmission.findMany({
      where: { type: 'ACADEMIE' },
      orderBy: { createdAt: 'desc' },
    });
    return resourceResponse(submissions, latestDate(submissions, (submission) => submission.updatedAt ?? submission.createdAt));
  } catch (error) {
    return handleRouteError(error, 'Impossible de récupérer les candidatures.', 'academie:get');
  }
}
