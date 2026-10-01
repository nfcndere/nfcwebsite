import { NextRequest, NextResponse } from 'next/server';
import prisma from '@/lib/prisma';
import cloudinary from '@/lib/server/cloudinary';
import fs from 'fs';
import path from 'path';

// ===================================
// POST /api/uploads — Téléversement de médias (Images / Vidéos)
// ===================================
export async function POST(request: NextRequest) {
  try {
    const formData = await request.formData();
    const file = formData.get('file') as File | null;
    const altText = (formData.get('altText') as string) || '';
    const title = (formData.get('title') as string) || (file?.name ?? 'Média NFC');
    const album = (formData.get('album') as string) || 'Général';
    const playerId = (formData.get('playerId') as string) || null;

    if (!file) {
      return NextResponse.json({ success: false, error: 'Aucun fichier fourni' }, { status: 400 });
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
    return NextResponse.json(
      { success: false, error: error.message || 'Erreur lors du téléversement du média' },
      { status: 500 }
    );
  }
}
