import { NextRequest, NextResponse } from 'next/server';
import prisma from '@/lib/prisma';
import cloudinary from '@/lib/server/cloudinary';
import fs from 'fs';
import path from 'path';
import { requireEditor } from '@/lib/server/auth';
import { apiError } from '@/lib/api-response';
import { z } from 'zod';

const uploadMetadataSchema = z.object({
  file: z.instanceof(File),
  title: z.string().trim().max(160),
  altText: z.string().trim().max(300),
  album: z.string().trim().max(100),
  playerId: z.string().trim().max(100).nullable(),
});

// ===================================
// POST /api/uploads — Téléversement de médias (Images / Vidéos)
// ===================================
export async function POST(request: NextRequest) {
  const denied = await requireEditor(request);
  if (denied) return denied;
  try {
    const formData = await request.formData();
    const file = formData.get('file') as File | null;
    if (!file) return apiError('Aucun fichier fourni.', 400);
    if (!file.type.startsWith('image/') && !file.type.startsWith('video/')) {
      return apiError('Seules les images et vidéos sont acceptées.', 400);
    }
    const metadata = uploadMetadataSchema.safeParse({
      file,
      title: formData.get('title') || file.name,
      altText: formData.get('altText') || '',
      album: formData.get('album') || 'Général',
      playerId: formData.get('playerId') || null,
    });
    if (!metadata.success) return apiError('Métadonnées de média invalides.', 400);
    const { title, altText, album, playerId } = metadata.data;
    const maxBytes = file.type.startsWith('video/') ? 50 * 1024 * 1024 : 10 * 1024 * 1024;
    if (file.size === 0 || file.size > maxBytes) {
      return apiError('La taille du fichier est invalide ou dépasse la limite autorisée.', 400);
    }

    const bytes = await file.arrayBuffer();
    const buffer = Buffer.from(bytes);

    let mediaUrl = '';
    let publicId = `nfc_${Date.now()}_${Math.random().toString(36).substring(2, 7)}`;
    let provider = 'local';

    // 1. Tenter un upload vers Cloudinary si configuré
    const hasCloudinary =
      process.env.CLOUDINARY_CLOUD_NAME &&
      process.env.CLOUDINARY_API_KEY &&
      process.env.CLOUDINARY_API_SECRET;

    if (hasCloudinary) {
      try {
        const uploadResult = await new Promise<any>((resolve, reject) => {
          const uploadStream = cloudinary.uploader.upload_stream(
            {
              folder: 'nfc-media',
              resource_type: file.type.startsWith('video/') ? 'video' : 'image',
            },
            (error, result) => {
              if (error) reject(error);
              else resolve(result);
            }
          );
          uploadStream.end(buffer);
        });

        mediaUrl = uploadResult.secure_url;
        publicId = uploadResult.public_id;
        provider = 'cloudinary';
      } catch (cloudError) {
        console.warn('Échec Cloudinary, sauvegarde en stockage local...', cloudError);
      }
    }

    // 2. Fallback Stockage Local dans public/uploads si Cloudinary pas actif ou a échoué
    if (!mediaUrl) {
      if (process.env.NODE_ENV === 'production') {
        return apiError('Cloudinary est indisponible. Le stockage local temporaire est désactivé en production.', 503);
      }
      const uploadDir = path.join(process.cwd(), 'public', 'uploads');
      if (!fs.existsSync(uploadDir)) {
        fs.mkdirSync(uploadDir, { recursive: true });
      }

      const ext = path.extname(file.name) || (file.type.startsWith('video/') ? '.mp4' : '.jpg');
      const filename = `${publicId}${ext}`;
      const filePath = path.join(uploadDir, filename);

      fs.writeFileSync(filePath, buffer);
      mediaUrl = `/uploads/${filename}`;
      provider = 'local';
    }

    // 3. Enregistrer l'asset média dans la base de données Prisma
    const media = await prisma.media.create({
      data: {
        provider,
        publicId,
        url: mediaUrl,
        mimeType: file.type || 'image/jpeg',
        size: file.size,
        title,
        altText,
        album,
        mediaType: file.type.startsWith('video/') ? 'VIDEO' : 'IMAGE',
        playerId: playerId || undefined,
      },
    });

    return NextResponse.json({
      success: true,
      message: 'Fichier téléversé avec succès',
      data: media,
      url: media.url,
    }, { status: 201 });
  } catch (error: any) {
    console.error('Erreur téléversement média:', error);
    return apiError('Erreur lors du téléversement du média.');
  }
}
