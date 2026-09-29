import { NextApiRequest, NextApiResponse } from 'next';
import { prisma } from '@/lib/prisma';
import { sendEmail } from '@/lib/server/resend';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const body = req.body ?? {};
  const type = String(body.type || 'contact').toLowerCase();
  const payload = { ...body };
  delete payload.type;

  const submission = await (prisma as any).formSubmission.create({
    data: {
      type,
      payload,
      ip: req.headers['x-forwarded-for']?.toString() || req.socket.remoteAddress || null,
      userAgent: req.headers['user-agent'] || null,
    },
  });

  if (type === 'newsletter' && payload.email) {
    const email = String(payload.email);
    const existing = await (prisma as any).newsletterSubscriber?.findUnique?.({ where: { email } }).catch(() => null);
    if (!existing) {
      try {
        await (prisma as any).newsletterSubscriber?.create?.({ data: { email } });
      } catch (err) {
        // ignore unique race
      }
    }

    if (process.env.RESEND_API_KEY) {
      await sendEmail({
        to: email,
        from: process.env.DEFAULT_FROM_EMAIL || 'noreply@nfc.cm',
        subject: 'Bienvenue dans la newsletter NFC',
        html: '<p>Merci de vous être inscrit à la newsletter du Ngaoundéré FC.</p>',
      });
    }
  }

  if (type === 'contact' && payload.email) {
    const email = String(payload.email);
    const name = String(payload.name || 'Client');

    if (process.env.RESEND_API_KEY) {
      await sendEmail({
        to: process.env.DEFAULT_TO_EMAIL || email,
        from: process.env.DEFAULT_FROM_EMAIL || 'noreply@nfc.cm',
        subject: `Nouveau message contact - ${name}`,
        html: `<h3>Nouveau message</h3><p><strong>Nom:</strong> ${name}</p><p><strong>Email:</strong> ${email}</p><p><strong>Objet:</strong> ${String(payload.subject || '')}</p><p>${String(payload.message || '')}</p>`,
      });
    }
  }

  return res.status(201).json({ data: submission });
}
