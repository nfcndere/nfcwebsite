import { NextRequest } from 'next/server';
import { z } from 'zod';
import { apiError, resourceResponse } from '@/lib/api-response';
import { authorize } from '@/lib/server/auth';
import {
  isCloudinaryConfigured,
  resourceTypeFromMime,
  signUploadParams,
  UPLOAD_LIMITS,
  validateDeclaredUpload,
} from '@/lib/server/cloudinary';
import { enforceRateLimit } from '@/lib/server/rate-limit';
import { recordAudit } from '@/lib/server/audit';
import { handleRouteError, parseJsonBody } from '@/lib/server/route-utils';

export const dynamic = 'force-dynamic';

const signSchema = z
  .object({
    mimeType: z.string().trim().min(3).max(100),
    size: z.number().int().positive(),
    resourceType: z.enum(['image', 'video']).optional(),
    filename: z.string().trim().max(255).optional(),
  })
  .strict();

// ===================================
// POST /api/uploads/sign — Signature Cloudinary pour envoi direct depuis le navigateur
// Ne renvoie JAMAIS `CLOUDINARY_API_SECRET`.
// ===================================
export async function POST(request: NextRequest) {
  const auth = await authorize(request);
  if (!auth.ok) return auth.response;

  if (!isCloudinaryConfigured()) {
    return apiError('Cloudinary n’est pas configuré sur ce serveur.', 503);
  }

  try {
    const parsed = await parseJsonBody(request, signSchema, 'Paramètres d’upload invalides.');
    if (!parsed.ok) return parsed.response;
    const { mimeType, size, resourceType: explicitType, filename } = parsed.data;

    const limited = await enforceRateLimit(request, 'upload-sign', 40, 15 * 60 * 1_000, { identifier: auth.user.id });
    if (limited) return limited;

    const detectedType = resourceTypeFromMime(mimeType);
    if (!detectedType || (explicitType && explicitType !== detectedType)) {
      return apiError('Seules les images (≤ 10 Mio) et vidéos (≤ 50 Mio) sont acceptées.', 400);
    }

    const validationError = validateDeclaredUpload(detectedType, mimeType, size);
    if (validationError) return apiError(validationError, 400);

    const signed = signUploadParams(detectedType);
    await recordAudit({
      request,
      userId: auth.user.id,
      action: 'SIGN_UPLOAD',
      entity: 'Media',
      after: { resourceType: detectedType, mimeType, size, filename: filename ?? null, folder: signed.folder },
    });

    return resourceResponse(
      {
        timestamp: signed.timestamp,
        signature: signed.signature,
        apiKey: signed.apiKey,
        cloudName: signed.cloudName,
        folder: signed.folder,
        resourceType: signed.resourceType,
        allowedFormats: signed.allowedFormats,
        maxBytes: signed.maxBytes,
        uploadUrl: signed.uploadUrl,
        limits: {
          imageMaxBytes: UPLOAD_LIMITS.image.maxBytes,
          videoMaxBytes: UPLOAD_LIMITS.video.maxBytes,
        },
      },
      new Date(),
    );
  } catch (error) {
    return handleRouteError(error, 'Impossible de signer l’envoi vers Cloudinary.', 'uploads/sign');
  }
}
