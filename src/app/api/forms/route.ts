import { NextRequest, NextResponse } from 'next/server';
import prisma from '@/lib/prisma';

// ===================================
// GET /api/forms — Récupérer toutes les soumissions de formulaires (admin mobile)
// ===================================
export async function GET(request: NextRequest) {
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

    return NextResponse.json({ success: true, data: forms });
  } catch (error) {
    return NextResponse.json({ error: 'Erreur lors de la récupération des formulaires' }, { status: 500 });
  }
}
