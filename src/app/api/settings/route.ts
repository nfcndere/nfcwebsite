import { NextRequest } from 'next/server';
import { z } from 'zod';
import prisma from '@/lib/prisma';
import { latestDate, resourceResponse } from '@/lib/api-response';
import { authorize, requireAdmin } from '@/lib/server/auth';
import { recordAudit } from '@/lib/server/audit';
import { handleRouteError, parseJsonBody } from '@/lib/server/route-utils';
import { PUBLIC_SETTING_KEYS } from '@/constants/club-settings';

export const dynamic = 'force-dynamic';

const settingKeyEnum = z.enum(PUBLIC_SETTING_KEYS);
const settingValueSchema = z.string().trim().max(2_000);

/**
 * Accepte soit un objet `{ facebookUrl: "...", ... }`, soit `{ settings: { ... } }`,
 * soit un tableau `[{ key, value }]`, afin d'accommoder les différents formulaires d'administration.
 */
const settingsInputSchema = z.union([
  z
    .object({
      facebookUrl: settingValueSchema.optional(),
      whatsappPartenaire: settingValueSchema.optional(),
      whatsappBilletterie: settingValueSchema.optional(),
      homeIntroText: settingValueSchema.optional(),
      academyCompletionRate: settingValueSchema.optional(),
      academyGraduates: settingValueSchema.optional(),
      academyLabel: settingValueSchema.optional(),
    })
    .strict(),
  z.object({ settings: z.record(settingKeyEnum, settingValueSchema) }).strict(),
  z.object({ items: z.array(z.object({ key: settingKeyEnum, value: settingValueSchema }).strict()).min(1) }).strict(),
]);

function normalizeEntries(input: z.infer<typeof settingsInputSchema>): [string, string][] {
  if ('items' in input) return input.items.map((item) => [item.key, item.value]);
  const map = 'settings' in input ? input.settings : input;
  return Object.entries(map).filter((entry): entry is [string, string] => typeof entry[1] === 'string');
}

// ===================================
// GET /api/settings — Lecture des réglages du club (éditeur / admin)
// Les clés publiques continuent d'être servies sans authentification par GET /api/club-overview.
// ===================================
export async function GET(request: NextRequest) {
  const auth = await authorize(request);
  if (!auth.ok) return auth.response;
  try {
    const rows = await prisma.clubSetting.findMany({ where: { key: { in: [...PUBLIC_SETTING_KEYS] } } });
    const values = Object.fromEntries(PUBLIC_SETTING_KEYS.map((key) => [key, '']));
    for (const row of rows) values[row.key as (typeof PUBLIC_SETTING_KEYS)[number]] = row.value;

    return resourceResponse(
      { keys: PUBLIC_SETTING_KEYS, values, items: rows },
      latestDate(rows, (row) => row.updatedAt),
      undefined,
      false,
      rows.length === 0,
    );
  } catch (error) {
    return handleRouteError(error, 'Impossible de récupérer les réglages du club.', 'settings:get');
  }
}

// ===================================
// PUT /api/settings — Mise à jour des réglages du club (ADMIN uniquement)
// ===================================
export async function PUT(request: NextRequest) {
  const auth = await requireAdmin(request);
  if (!auth.ok) return auth.response;
  try {
    const parsed = await parseJsonBody(request, settingsInputSchema, 'Réglages invalides.');
    if (!parsed.ok) return parsed.response;
    const entries = normalizeEntries(parsed.data);

    const beforeRows = await prisma.clubSetting.findMany({ where: { key: { in: [...PUBLIC_SETTING_KEYS] } } });
    await prisma.$transaction(
      entries.map(([key, value]) =>
        prisma.clubSetting.upsert({
          where: { key },
          create: { key, value },
          update: { value },
        }),
      ),
    );
    const afterRows = await prisma.clubSetting.findMany({ where: { key: { in: [...PUBLIC_SETTING_KEYS] } } });

    await recordAudit({
      request,
      userId: auth.user.id,
      action: 'UPDATE',
      entity: 'ClubSetting',
      before: Object.fromEntries(beforeRows.map((row) => [row.key, row.value])),
      after: Object.fromEntries(afterRows.map((row) => [row.key, row.value])),
    });

    const values = Object.fromEntries(PUBLIC_SETTING_KEYS.map((key) => [key, '']));
    for (const row of afterRows) values[row.key as (typeof PUBLIC_SETTING_KEYS)[number]] = row.value;
    return resourceResponse({ keys: PUBLIC_SETTING_KEYS, values, items: afterRows }, latestDate(afterRows, (row) => row.updatedAt));
  } catch (error) {
    return handleRouteError(error, 'Impossible de mettre à jour les réglages du club.', 'settings:put');
  }
}
