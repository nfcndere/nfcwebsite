import { NextRequest, NextResponse } from 'next/server';
import prisma from '@/lib/prisma';

// ===================================
// POST /api/academie — Soumettre une candidature d'académie en BD
// ===================================
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();

    // Validation des champs obligatoires
    if (!body.nomJoueur || !body.prenomJoueur || !body.nomTuteur || !body.telephone) {
      return NextResponse.json({ error: 'Champs obligatoires manquants' }, { status: 400 });
    }

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
    return NextResponse.json({ error: 'Erreur lors de l\'enregistrement de la candidature' }, { status: 500 });
  }
}

// ===================================
// GET /api/academie — Récupérer les candidatures (admin)
// ===================================
export async function GET() {
  try {
    const submissions = await prisma.formSubmission.findMany({
      where: { type: 'ACADEMIE' },
      orderBy: { createdAt: 'desc' },
    });
    return NextResponse.json(submissions);
  } catch (error) {
    return NextResponse.json({ error: 'Erreur lors de la récupération' }, { status: 500 });
  }
}
