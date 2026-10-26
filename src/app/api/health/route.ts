import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';
import { isCloudinaryConfigured } from '@/lib/server/cloudinary';

export const dynamic = 'force-dynamic';

type TableCheck = { name: string; present: boolean };

/**
 * GET /api/health — Vérification de santé de la production.
 * Ne renvoie JAMAIS la valeur d'une variable d'environnement, uniquement un booléen de présence.
 */
export async function GET() {
  const env = {
    DATABASE_URL: Boolean(process.env.DATABASE_URL),
    JWT_SECRET: Boolean(process.env.JWT_SECRET),
    JWT_REFRESH_SECRET: Boolean(process.env.JWT_REFRESH_SECRET),
  };
  const optionalEnv = {
    DIRECT_URL: Boolean(process.env.DIRECT_URL),
    CLOUDINARY: isCloudinaryConfigured(),
    RESEND_API_KEY: Boolean(process.env.RESEND_API_KEY),
    WEB_PUSH: Boolean(
      process.env.PUSH_NOTIFICATIONS_ENABLED === 'true' && process.env.VAPID_PUBLIC_KEY && process.env.VAPID_PRIVATE_KEY,
    ),
  };

  let databaseReachable = false;
  let latencyMs: number | null = null;
  let tables: TableCheck[] = [];
  let missingTables: string[] = [];

  if (env.DATABASE_URL) {
    const started = Date.now();
    try {
      await prisma.$queryRaw`SELECT 1`;
      databaseReachable = true;
      latencyMs = Date.now() - started;

      const requiredTables = [
        'User',
        'Season',
        'ClubStanding',
        'ClubStandingHistory',
        'ClubSetting',
        'ApiRateLimitBucket',
        'Article',
        'Match',
        'Player',
        'Sponsor',
        'Media',
        'FormSubmission',
        'EmailLog',
        'AuditLog',
        'PasswordResetToken',
        'PushSubscription',
      ];
      const existing = await prisma.$queryRaw<{ tablename: string }[]>`
        SELECT tablename FROM pg_tables WHERE schemaname = current_schema()
      `;
      const existingSet = new Set(existing.map((row) => row.tablename));
      tables = requiredTables.map((name) => ({ name, present: existingSet.has(name) }));
      missingTables = tables.filter((table) => !table.present).map((table) => table.name);
    } catch (error) {
      console.error('[health] Base de données injoignable :', error);
    }
  }

  const envOk = env.DATABASE_URL && env.JWT_SECRET && env.JWT_REFRESH_SECRET;
  const schemaOk = databaseReachable && missingTables.length === 0;
  const healthy = envOk && schemaOk;

  return NextResponse.json(
    {
      status: healthy ? 'ok' : 'error',
      data: {
        healthy,
        env,
        optionalEnv,
        database: {
          reachable: databaseReachable,
          latencyMs,
          schemaReady: schemaOk,
          missingTables,
        },
      },
      updatedAt: new Date().toISOString(),
    },
    { status: healthy ? 200 : 503 },
  );
}
