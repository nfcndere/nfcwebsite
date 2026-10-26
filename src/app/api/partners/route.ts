import { NextRequest, NextResponse } from 'next/server';
import { z } from 'zod';
import prisma from '@/lib/prisma';
import { apiError, resourceResponse, latestDate } from '@/lib/api-response';
import { DATA_FRESHNESS_MS } from '@/constants/data-freshness';
import { authorize, getOptionalEditor } from '@/lib/server/auth';
import { recordAudit } from '@/lib/server/audit';
import { handleRouteError, parseJsonBody } from '@/lib/server/route-utils';

import { resolvePartnerLogos } from '@/constants/club-settings';

export const dynamic = 'force-dynamic';

const partnerSchema = z
  .object({
    name: z.string().trim().min(1).max(160),
    link: z.string().trim().url().max(500).nullable().optional(),
    logoId: z.string().trim().min(1).max(200).nullable().optional(),
    priority: z.coerce.number().int().min(0).max(1_000).default(0),
    active: z.boolean().default(true),
  })
  .strict();

// ===================================
// GET /api/partners — Liste des partenaires (public : actifs uniquement ; éditeur : ?includeInactive=true)
// ===================================
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const wantsInactive = searchParams.get('includeInactive') === 'true' || searchParams.get('status') === 'all';
    const editor = wantsInactive ? await getOptionalEditor(request) : null;

    const sponsors = await prisma.sponsor.findMany({
      where: editor ? {} : { active: true },
      orderBy: [{ priority: 'asc' }, { name: 'asc' }],
    });
    const logoIds = sponsors.flatMap((sponsor) => (sponsor.logoId ? [sponsor.logoId] : []));
    const mediaById = await resolvePartnerLogos(logoIds);

    const data = sponsors.map((sponsor) => ({
      id: sponsor.id,
      name: sponsor.name,
      link: sponsor.link,
      logoId: sponsor.logoId,
      logoUrl: sponsor.logoId ? mediaById.get(sponsor.logoId) ?? null : null,
      priority: sponsor.priority,
      active: sponsor.active,
    }));

    return resourceResponse(data, latestDate(sponsors, (sponsor) => sponsor.updatedAt), DATA_FRESHNESS_MS.partners);
  } catch (error) {
    console.error('Failed to retrieve club partners:', error);
    return apiError('Impossible de récupérer les partenaires du club.');
  }
}

// ===================================
// POST /api/partners — Créer un sponsor / partenaire (requireEditor)
// ===================================
export async function POST(request: NextRequest) {
  const auth = await authorize(request);
  if (!auth.ok) return auth.response;
  try {
    const parsed = await parseJsonBody(request, partnerSchema, 'Données de partenaire invalides.');
    if (!parsed.ok) return parsed.response;
    const body = parsed.data;

    const sponsor = await prisma.sponsor.create({
      data: {
        name: body.name,
        link: body.link ?? null,
        logoId: body.logoId ?? null,
        priority: body.priority,
        active: body.active,
      },
    });
    await recordAudit({
      request,
      userId: auth.user.id,
      action: 'CREATE',
      entity: 'Sponsor',
      entityId: sponsor.id,
      after: sponsor,
    });

    const mediaById = await resolvePartnerLogos(sponsor.logoId ? [sponsor.logoId] : []);
    const data = {
      id: sponsor.id,
      name: sponsor.name,
      link: sponsor.link,
      logoId: sponsor.logoId,
      logoUrl: sponsor.logoId ? mediaById.get(sponsor.logoId) ?? null : null,
      priority: sponsor.priority,
      active: sponsor.active,
    };

    return NextResponse.json({ status: 'ok', data, updatedAt: sponsor.updatedAt.toISOString() }, { status: 201 });
  } catch (error) {
    return handleRouteError(error, 'Impossible de créer le partenaire.', 'partners:post');
  }
}
