import { PrismaClient } from '@prisma/client';

const globalForPrisma = globalThis as unknown as {
  prisma: PrismaClient | undefined;
};

/**
 * Prépare l'URL de connexion Prisma :
 * Lorsqu'un pooler de connexion (ex. Supabase PgBouncer sur port 6543) est utilisé,
 * les « prepared statements » doivent être désactivés via `pgbouncer=true` pour
 * éviter les erreurs Postgres 26000 ("prepared statement does not exist")
 * et 42P05 ("prepared statement already exists").
 */
function getDatasourceUrl(): string | undefined {
  const rawUrl = process.env.DATABASE_URL;
  if (!rawUrl) return undefined;

  try {
    const url = new URL(rawUrl);
    // Détection pooler Supabase ou port PgBouncer 6543
    if (url.port === '6543' || url.hostname.includes('pooler.supabase.com')) {
      if (!url.searchParams.has('pgbouncer')) {
        url.searchParams.set('pgbouncer', 'true');
      }
      if (!url.searchParams.has('connection_limit')) {
        url.searchParams.set('connection_limit', '1');
      }
      return url.toString();
    }
  } catch {
    // Si l'URL n'est pas un parseur URL standard, on retourne la valeur brute
  }

  return rawUrl;
}

const resolvedUrl = getDatasourceUrl();

export const prisma =
  globalForPrisma.prisma ??
  new PrismaClient({
    datasources: resolvedUrl ? { db: { url: resolvedUrl } } : undefined,
    log: process.env.NODE_ENV === 'development' ? ['query', 'error', 'warn'] : ['error'],
  });

if (process.env.NODE_ENV !== 'production') globalForPrisma.prisma = prisma;

export default prisma;
