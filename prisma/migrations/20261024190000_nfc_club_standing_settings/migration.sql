CREATE TABLE "ClubStanding" (
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
    "updatedAt" TIMESTAMP(3) NOT NULL,
    CONSTRAINT "ClubStanding_pkey" PRIMARY KEY ("id")
);

CREATE TABLE "ClubSetting" (
    "key" TEXT NOT NULL,
    "value" TEXT NOT NULL,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    CONSTRAINT "ClubSetting_pkey" PRIMARY KEY ("key")
);

CREATE TABLE "ApiRateLimitBucket" (
    "key" TEXT NOT NULL,
    "count" INTEGER NOT NULL DEFAULT 0,
    "expiresAt" TIMESTAMP(3) NOT NULL,
    CONSTRAINT "ApiRateLimitBucket_pkey" PRIMARY KEY ("key")
);

ALTER TABLE "NewsletterSubscriber" ADD COLUMN "ip" TEXT;
ALTER TABLE "Sponsor" ADD COLUMN "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP;
ALTER TABLE "Sponsor" ADD COLUMN "updatedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP;
ALTER TABLE "Sponsor" ALTER COLUMN "updatedAt" DROP DEFAULT;

CREATE UNIQUE INDEX "ClubStanding_seasonId_key" ON "ClubStanding"("seasonId");
CREATE INDEX "ApiRateLimitBucket_expiresAt_idx" ON "ApiRateLimitBucket"("expiresAt");

INSERT INTO "ClubStanding" (
    "id", "seasonId", "rank", "played", "won", "drawn", "lost",
    "goalsFor", "goalsAgainst", "form", "updatedById", "updatedAt"
)
SELECT
    source."id",
    source."seasonId",
    ranked."rank",
    source."played",
    source."won",
    source."drawn",
    source."lost",
    source."goalsFor",
    source."goalsAgainst",
    source."form",
    NULL,
    source."updatedAt"
FROM "Standing" AS source
JOIN "Team" AS team ON team."id" = source."teamId"
JOIN (
    SELECT
        standing."id",
        ROW_NUMBER() OVER (
            PARTITION BY standing."seasonId"
            ORDER BY standing."points" DESC,
                     (standing."goalsFor" - standing."goalsAgainst") DESC,
                     standing."goalsFor" DESC,
                     team."name" ASC
        ) AS "rank"
    FROM "Standing" AS standing
    JOIN "Team" AS team ON team."id" = standing."teamId"
) AS ranked ON ranked."id" = source."id"
WHERE team."name" = 'Ngaoundéré FC'
ON CONFLICT ("seasonId") DO NOTHING;

ALTER TABLE "ClubStanding" ADD CONSTRAINT "ClubStanding_seasonId_fkey"
    FOREIGN KEY ("seasonId") REFERENCES "Season"("id") ON DELETE CASCADE ON UPDATE CASCADE;
ALTER TABLE "ClubStanding" ADD CONSTRAINT "ClubStanding_updatedById_fkey"
    FOREIGN KEY ("updatedById") REFERENCES "User"("id") ON DELETE SET NULL ON UPDATE CASCADE;

DROP TABLE "Standing";
DROP TABLE "Team";
