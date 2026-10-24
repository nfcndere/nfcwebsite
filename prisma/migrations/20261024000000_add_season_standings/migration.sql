CREATE TABLE "Season" (
    "id" TEXT NOT NULL,
    "label" TEXT NOT NULL,
    "startsAt" TIMESTAMP(3) NOT NULL,
    "endsAt" TIMESTAMP(3) NOT NULL,
    "isCurrent" BOOLEAN NOT NULL DEFAULT false,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    CONSTRAINT "Season_pkey" PRIMARY KEY ("id")
);

CREATE TABLE "Team" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "logoUrl" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    CONSTRAINT "Team_pkey" PRIMARY KEY ("id")
);

CREATE TABLE "Standing" (
    "id" TEXT NOT NULL,
    "seasonId" TEXT NOT NULL,
    "teamId" TEXT NOT NULL,
    "played" INTEGER NOT NULL DEFAULT 0,
    "won" INTEGER NOT NULL DEFAULT 0,
    "drawn" INTEGER NOT NULL DEFAULT 0,
    "lost" INTEGER NOT NULL DEFAULT 0,
    "goalsFor" INTEGER NOT NULL DEFAULT 0,
    "goalsAgainst" INTEGER NOT NULL DEFAULT 0,
    "points" INTEGER NOT NULL DEFAULT 0,
    "form" TEXT,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    CONSTRAINT "Standing_pkey" PRIMARY KEY ("id")
);

CREATE UNIQUE INDEX "Season_label_key" ON "Season"("label");
CREATE UNIQUE INDEX "Season_one_current_key" ON "Season"("isCurrent") WHERE "isCurrent" = true;
CREATE UNIQUE INDEX "Team_name_key" ON "Team"("name");
CREATE UNIQUE INDEX "Standing_seasonId_teamId_key" ON "Standing"("seasonId", "teamId");
CREATE INDEX "Standing_seasonId_points_idx" ON "Standing"("seasonId", "points");

ALTER TABLE "Standing" ADD CONSTRAINT "Standing_seasonId_fkey"
    FOREIGN KEY ("seasonId") REFERENCES "Season"("id") ON DELETE CASCADE ON UPDATE CASCADE;
ALTER TABLE "Standing" ADD CONSTRAINT "Standing_teamId_fkey"
    FOREIGN KEY ("teamId") REFERENCES "Team"("id") ON DELETE CASCADE ON UPDATE CASCADE;
