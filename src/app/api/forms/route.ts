import { NextRequest, NextResponse } from 'next/server';
import prisma from '@/lib/prisma';
import { z } from 'zod';
import { authorize } from '@/lib/server/auth';
import { apiError, resourceResponse, latestDate } from '@/lib/api-response';
import { enforceRateLimit, getClientIp } from '@/lib/server/rate-limit';
import { handleRouteError, parseJsonBody } from '@/lib/server/route-utils';
import { notifyAdmins } from '@/lib/server/push';

export const dynamic = 'force-dynamic';

const formQuerySchema = z.object({
  type: z.enum(['ACADEMIE', 'NEWSLETTER', 'CONTACT', 'BILLETTERIE']).optional(),
  processed: z.enum(['true', 'false']).optional(),
  followUpStatus: z.enum(['NOUVEAU', 'CONTACTE', 'CONVOQUE', 'ADMIS', 'REFUSE']).optional(),
});

const contactSubmissionSchema = z.object({
  type: z.enum(['CONTACT', 'BILLETTERIE']).default('CONTACT'),
  name: z.string().trim().min(1).max(120),
  email: z.string().trim().email().max(254).optional(),
  phone: z.string().trim().min(6).max(30).optional(),
  subject: z.string().trim().max(200).optional(),
  message: z.string().trim().min(1).max(4_000),
});

// ===================================
// GET /api/forms — Récupérer toutes les soumissions de formulaires (admin)
// ===================================
export async function GET(request: NextRequest) {
  const auth = await authorize(request);
  if (!auth.ok) return auth.response;
  try {
    const { searchParams } = new URL(request.url);
    const parsed = formQuerySchema.safeParse({
      type: searchParams.get('type') ?? undefined,
      processed: searchParams.get('processed') ?? undefined,
      followUpStatus: searchParams.get('followUpStatus') ?? undefined,
    });
    if (!parsed.success) return apiError('Paramètres de recherche invalides.', 400);
    const { type, processed, followUpStatus } = parsed.data;

    const where: { type?: string; processed?: boolean; followUpStatus?: string } = {};
    if (type) where.type = type;
    if (processed !== undefined) where.processed = processed === 'true';
    if (followUpStatus) where.followUpStatus = followUpStatus;

    const forms = await prisma.formSubmission.findMany({
      where,
      orderBy: { createdAt: 'desc' },
    });

    return resourceResponse(forms, latestDate(forms, (form) => form.updatedAt ?? form.createdAt));
  } catch (error) {
    return handleRouteError(error, 'Impossible de récupérer les formulaires.', 'forms:get');
  }
}

// ===================================
// POST /api/forms — Soumettre un message de contact / billetterie (public) et notifier par Web Push
// ===================================
export async function POST(request: NextRequest) {
  try {
    const parsed = await parseJsonBody(request, contactSubmissionSchema, 'Message de contact invalide.');
    if (!parsed.ok) return parsed.response;
    const body = parsed.data;

    const limited = await enforceRateLimit(request, 'contact-submission', 5, 60 * 60 * 1_000);
    if (limited) return limited;

    const submission = await prisma.formSubmission.create({
      data: {
        type: body.type,
        payload: {
          name: body.name,
          email: body.email ?? null,
          phone: body.phone ?? null,
          subject: body.subject ?? null,
          message: body.message,
        },
        ip: getClientIp(request),
        userAgent: request.headers.get('user-agent') || '',
      },
    });

    await notifyAdmins({
      title: `Nouveau message (${body.type.toLowerCase()})`,
      body: `${body.name}${body.subject ? ` — ${body.subject}` : ''}`,
      url: `/dashboard`,
      tag: `form-${submission.id}`,
    });

    return NextResponse.json(
      {
        status: 'ok',
        message: 'Votre message a bien été enregistré.',
        data: { submissionId: submission.id },
        updatedAt: submission.createdAt.toISOString(),
      },
      { status: 201 },
    );
  } catch (error) {
    return handleRouteError(error, 'Impossible d’enregistrer votre message.', 'forms:post');
  }
}
