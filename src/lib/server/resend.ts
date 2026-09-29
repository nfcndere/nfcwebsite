import { Resend } from 'resend';

const resend = new Resend(process.env.RESEND_API_KEY || '');

export async function sendEmail({ to, subject, html, from }: { to: string; subject: string; html: string; from?: string }) {
  return resend.emails.send({
    from: from || process.env.DEFAULT_FROM_EMAIL || 'no-reply@example.com',
    to,
    subject,
    html,
  });
}

export default resend;
