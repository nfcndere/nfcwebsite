import prisma from '@/lib/prisma';

let schemaEnsured = false;

const IDEMPOTENT_DDL_STATEMENTS: string[] = [
  // 1. Colonnes additionnelles sur les tables existantes
  `ALTER TABLE "User" ADD COLUMN IF NOT EXISTS "active" BOOLEAN NOT NULL DEFAULT true`,
  `ALTER TABLE "User" ADD COLUMN IF NOT EXISTS "lastLoginAt" TIMESTAMP(3)`,
  `ALTER TABLE "User" ADD COLUMN IF NOT EXISTS "mustChangePassword" BOOLEAN NOT NULL DEFAULT false`,
  `ALTER TABLE "User" ADD COLUMN IF NOT EXISTS "tokenVersion" INTEGER NOT NULL DEFAULT 0`,
  `ALTER TABLE "Article" ADD COLUMN IF NOT EXISTS "deletedAt" TIMESTAMP(3)`,
  `ALTER TABLE "Player" ADD COLUMN IF NOT EXISTS "deletedAt" TIMESTAMP(3)`,
  `ALTER TABLE "Match" ADD COLUMN IF NOT EXISTS "deletedAt" TIMESTAMP(3)`,
  `ALTER TABLE "Sponsor" ADD COLUMN IF NOT EXISTS "active" BOOLEAN NOT NULL DEFAULT true`,
  `ALTER TABLE "Sponsor" ADD COLUMN IF NOT EXISTS "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP`,
  `ALTER TABLE "Sponsor" ADD COLUMN IF NOT EXISTS "updatedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP`,
  `ALTER TABLE "NewsletterSubscriber" ADD COLUMN IF NOT EXISTS "ip" TEXT`,
  `ALTER TABLE "FormSubmission" ADD COLUMN IF NOT EXISTS "adminNotes" TEXT`,
  `ALTER TABLE "FormSubmission" ADD COLUMN IF NOT EXISTS "followUpStatus" TEXT`,
  `ALTER TABLE "FormSubmission" ADD COLUMN IF NOT EXISTS "updatedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP`,
  `ALTER TABLE "EmailLog" ADD COLUMN IF NOT EXISTS "error" TEXT`,

  // 2. Nouvelles tables opérationnelles et d'administration
  `CREATE TABLE IF NOT EXISTS "Season" (
    "id" TEXT NOT NULL,
    "label" TEXT NOT NULL,
    "startsAt" TIMESTAMP(3) NOT NULL,
    "endsAt" TIMESTAMP(3) NOT NULL,
    "isCurrent" BOOLEAN NOT NULL DEFAULT false,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT "Season_pkey" PRIMARY KEY ("id")
  )`,
  `CREATE TABLE IF NOT EXISTS "ClubStanding" (
    "id" TEXT NOT NULL,
    "seasonId" TEXT NOT NULL,
    "rank" INTEGER NOT NULL,
    "played" INTEGER NOT NULL,
    "won" INTEGER NOT NULL,
    "drawn" INTEGER NOT NULL,
    "lost" INTEGER NOT NULL,
    "goalsFor" INTEGER NOT NULL,
    "goalsAgainst" INTEGER NOT NULL,
    "form" TEXT,
    "updatedById" TEXT,
    "updatedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT "ClubStanding_pkey" PRIMARY KEY ("id")
  )`,
  `CREATE TABLE IF NOT EXISTS "ClubStandingHistory" (
    "id" TEXT NOT NULL,
    "seasonId" TEXT NOT NULL,
    "rank" INTEGER NOT NULL,
    "played" INTEGER NOT NULL,
    "won" INTEGER NOT NULL,
    "drawn" INTEGER NOT NULL,
    "lost" INTEGER NOT NULL,
    "goalsFor" INTEGER NOT NULL,
    "goalsAgainst" INTEGER NOT NULL,
    "form" TEXT,
    "changedById" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT "ClubStandingHistory_pkey" PRIMARY KEY ("id")
  )`,
  `CREATE TABLE IF NOT EXISTS "ClubSetting" (
    "key" TEXT NOT NULL,
    "value" TEXT NOT NULL,
    "updatedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT "ClubSetting_pkey" PRIMARY KEY ("key")
  )`,
  `CREATE TABLE IF NOT EXISTS "ApiRateLimitBucket" (
    "key" TEXT NOT NULL,
    "count" INTEGER NOT NULL DEFAULT 0,
    "expiresAt" TIMESTAMP(3) NOT NULL,
    CONSTRAINT "ApiRateLimitBucket_pkey" PRIMARY KEY ("key")
  )`,
  `CREATE TABLE IF NOT EXISTS "PasswordResetToken" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "tokenHash" TEXT NOT NULL,
    "expiresAt" TIMESTAMP(3) NOT NULL,
    "usedAt" TIMESTAMP(3),
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT "PasswordResetToken_pkey" PRIMARY KEY ("id")
  )`,
  `CREATE TABLE IF NOT EXISTS "AuditLog" (
    "id" TEXT NOT NULL,
    "userId" TEXT,
    "action" TEXT NOT NULL,
    "entity" TEXT NOT NULL,
    "entityId" TEXT,
    "before" JSONB,
    "after" JSONB,
    "ip" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT "AuditLog_pkey" PRIMARY KEY ("id")
  )`,
  `CREATE TABLE IF NOT EXISTS "PushSubscription" (
    "id" TEXT NOT NULL,
    "endpoint" TEXT NOT NULL,
    "p256dh" TEXT NOT NULL,
    "auth" TEXT NOT NULL,
    "userId" TEXT,
    "userAgent" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT "PushSubscription_pkey" PRIMARY KEY ("id")
  )`,

  // 3. Index idempotents
  `CREATE UNIQUE INDEX IF NOT EXISTS "Season_label_key" ON "Season"("label")`,
  `CREATE UNIQUE INDEX IF NOT EXISTS "Season_one_current_key" ON "Season"("isCurrent") WHERE "isCurrent" = true`,
  `CREATE UNIQUE INDEX IF NOT EXISTS "ClubStanding_seasonId_key" ON "ClubStanding"("seasonId")`,
  `CREATE INDEX IF NOT EXISTS "ClubStandingHistory_seasonId_createdAt_idx" ON "ClubStandingHistory"("seasonId", "createdAt")`,
  `CREATE INDEX IF NOT EXISTS "ApiRateLimitBucket_expiresAt_idx" ON "ApiRateLimitBucket"("expiresAt")`,
  `CREATE UNIQUE INDEX IF NOT EXISTS "PasswordResetToken_tokenHash_key" ON "PasswordResetToken"("tokenHash")`,
  `CREATE INDEX IF NOT EXISTS "PasswordResetToken_userId_idx" ON "PasswordResetToken"("userId")`,
  `CREATE INDEX IF NOT EXISTS "AuditLog_createdAt_idx" ON "AuditLog"("createdAt")`,
  `CREATE INDEX IF NOT EXISTS "AuditLog_entity_entityId_idx" ON "AuditLog"("entity", "entityId")`,
  `CREATE INDEX IF NOT EXISTS "AuditLog_userId_idx" ON "AuditLog"("userId")`,
  `CREATE UNIQUE INDEX IF NOT EXISTS "PushSubscription_endpoint_key" ON "PushSubscription"("endpoint")`,
  `CREATE INDEX IF NOT EXISTS "Article_deletedAt_idx" ON "Article"("deletedAt")`,
  `CREATE INDEX IF NOT EXISTS "Player_deletedAt_idx" ON "Player"("deletedAt")`,
  `CREATE INDEX IF NOT EXISTS "Match_deletedAt_idx" ON "Match"("deletedAt")`,
  `CREATE INDEX IF NOT EXISTS "FormSubmission_type_followUpStatus_idx" ON "FormSubmission"("type", "followUpStatus")`,

  // 4. Clés étrangères idempotentes (ignorées si déjà présentes)
  ...[
    `ALTER TABLE "ClubStanding" ADD CONSTRAINT "ClubStanding_seasonId_fkey" FOREIGN KEY ("seasonId") REFERENCES "Season"("id") ON DELETE CASCADE ON UPDATE CASCADE`,
    `ALTER TABLE "ClubStanding" ADD CONSTRAINT "ClubStanding_updatedById_fkey" FOREIGN KEY ("updatedById") REFERENCES "User"("id") ON DELETE SET NULL ON UPDATE CASCADE`,
    `ALTER TABLE "ClubStandingHistory" ADD CONSTRAINT "ClubStandingHistory_seasonId_fkey" FOREIGN KEY ("seasonId") REFERENCES "Season"("id") ON DELETE CASCADE ON UPDATE CASCADE`,
    `ALTER TABLE "ClubStandingHistory" ADD CONSTRAINT "ClubStandingHistory_changedById_fkey" FOREIGN KEY ("changedById") REFERENCES "User"("id") ON DELETE SET NULL ON UPDATE CASCADE`,
    `ALTER TABLE "PasswordResetToken" ADD CONSTRAINT "PasswordResetToken_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE`,
    `ALTER TABLE "AuditLog" ADD CONSTRAINT "AuditLog_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE SET NULL ON UPDATE CASCADE`,
    `ALTER TABLE "PushSubscription" ADD CONSTRAINT "PushSubscription_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE`,
  ].map(
    (sql) => `DO $$ BEGIN ${sql}; EXCEPTION WHEN duplicate_object OR duplicate_table THEN NULL; END $$`,
  ),
];

/**
 * S'assure de manière idempotente que les tables et colonnes additionnelles
 * sont présentes sur la base PostgreSQL (utile si `prisma db push` n'a pas pu
 * s'exécuter lors du build ou sur un pooler).
 */
export async function ensureDatabaseSchema(force = false): Promise<void> {
  if (schemaEnsured && !force) return;
  let failures = 0;
  for (const statement of IDEMPOTENT_DDL_STATEMENTS) {
    try {
      await prisma.$executeRawUnsafe(statement);
    } catch (error) {
      failures += 1;
      console.error('[ensureDatabaseSchema] Instruction DDL en échec :', statement.slice(0, 120), error);
    }
  }
  schemaEnsured = failures === 0;
}
