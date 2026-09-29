import { NextApiRequest, NextApiResponse } from 'next';
import formidable from 'formidable';
import fs from 'fs';
import { uploadToCloudinary } from '@/lib/server/cloudinary';
import { prisma } from '@/lib/prisma';
import auth, { hasRole } from '@/lib/server/auth';

export const config = {
  api: {
    bodyParser: false,
  },
};

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'POST') return res.status(405).end();

  const form = new formidable.IncomingForm();
  form.parse(req, async (err, fields, files) => {
    if (err) return res.status(500).json({ error: 'Form parse error' });
    // formidable may return arrays for files; normalize to a single file
    const raw = (files as any).file;
    const file: formidable.File = Array.isArray(raw) ? raw[0] : raw;
    if (!file) return res.status(400).json({ error: 'No file uploaded' });

    try {
      const user = await auth.getUserFromRequest(req as any);
      if (!user || !hasRole(user, ['ADMIN', 'EDITOR'])) {
        return res.status(403).json({ error: 'Forbidden' });
      }

      const result = await uploadToCloudinary(file.filepath, { folder: 'nfc_uploads' });
      const altTextField = Array.isArray(fields.altText)
        ? fields.altText[0]
        : (fields.altText as string | undefined);

      const media = await (prisma as any).media.create({
        data: {
          provider: 'cloudinary',
          publicId: result.public_id,
          url: result.secure_url,
          mimeType: result.format,
          width: result.width,
          height: result.height,
          size: result.bytes,
          variants: {},
          altText: altTextField ?? null,
          uploadedById: user.id,
        },
      });
      return res.status(201).json({ data: media });
    } catch (err) {
      const msg = err instanceof Error ? err.message : String(err);
      return res.status(500).json({ error: 'Upload failed', details: msg });
    }
  });
}
