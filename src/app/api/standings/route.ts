import { NextRequest } from 'next/server';
import { z } from 'zod';
import prisma from '@/lib/prisma';
import { DATA_FRESHNESS_MS } from '@/constants/data-freshness';
import { apiError, resourceResponse } from '@/lib/api-response';
import { requireEditor } from '@/lib/server/auth';
import { isStandingConsistent } from '@/lib/match-state';

const writeSchema = z.object({
  id: z.string().optional(),
  teamName: z.string().trim().min(1).optional(),
  logoUrl: z.string().url().nullable().optional(),
  seasonId: z.string().optional(),
  played: z.coerce.number().int().min(0),
  won: z.coerce.number().int().min(0),
  drawn: z.coerce.number().int().min(0),
  lost: z.coerce.number().int().min(0),
  goalsFor: z.coerce.number().int().min(0),
  goalsAgainst: z.coerce.number().int().min(0),
  form: z.string().max(20).nullable().optional(),
});

export async function GET() {
  try {
    const season = await prisma.season.findFirst({
      where: { isCurrent: true },
      include: {
        standings: { include: { team: true } },
      },
    });
    if (!season) return resourceResponse({ season: null, data: [] }, null);

    const standings = season.standings
      .map((standing) => ({
        ...standing,
        teamName: standing.team.name,
        logoUrl: standing.team.logoUrl,
        goalDifference: standing.goalsFor - standing.goalsAgainst,
      }))
      .sort((a, b) => b.points - a.points || b.goalDifference - a.goalDifference)
      .map((standing, index) => ({ ...standing, rank: index + 1, position: index + 1 }));
    const updatedAt = standings.length
      ? new Date(Math.max(...standings.map(({ updatedAt }) => updatedAt.getTime())))
      : season.updatedAt;

    return resourceResponse(
      { season: { id: season.id, label: season.label }, data: standings },
      updatedAt,
      DATA_FRESHNESS_MS.standings,
      standings.some((standing) => !isStandingConsistent(standing)),
      standings.length === 0,
    );
  } catch (error) {
    console.error('Failed to retrieve standings:', error);
    return apiError('Impossible de récupérer le classement.');
  }
}

export async function POST(request: NextRequest) {
  const denied = await requireEditor(request);
  if (denied) return denied;
  try {
    const parsed = writeSchema.safeParse(await request.json());
    if (!parsed.success) return apiError('Données de classement invalides.', 400);
    const body = parsed.data;
    if (!body.teamName) return apiError('Le nom de l’équipe est obligatoire.', 400);

    const season = body.seasonId
      ? await prisma.season.findUnique({ where: { id: body.seasonId } })
      : await prisma.season.findFirst({ where: { isCurrent: true } });
    if (!season) return apiError('Aucune saison correspondante n’est configurée.', 400);

    const won = body.won;
    const drawn = body.drawn;
    const lost = body.lost;
    const played = body.played;
    if (played !== won + drawn + lost) {
      return apiError('Joués doit être égal à victoires + nuls + défaites.', 400);
    }

    const standingData = {
      played, won, drawn, lost,
      goalsFor: body.goalsFor,
      goalsAgainst: body.goalsAgainst,
      points: won * 3 + drawn,
      form: body.form ?? null,
    };
    const standing = await prisma.$transaction(async (tx) => {
      const team = await tx.team.upsert({
        where: { name: body.teamName! },
        update: { logoUrl: body.logoUrl },
        create: { name: body.teamName!, logoUrl: body.logoUrl },
      });
      return tx.standing.upsert({
        where: { seasonId_teamId: { seasonId: season.id, teamId: team.id } },
        update: standingData,
        create: { ...standingData, seasonId: season.id, teamId: team.id },
      });
    });
    return resourceResponse(standing, standing.updatedAt);
  } catch (error) {
    console.error('Failed to save standing:', error);
    return apiError('Impossible d’enregistrer le classement.');
  }
}

export async function PATCH(request: NextRequest) {
  const denied = await requireEditor(request);
  if (denied) return denied;
  try {
    const parsed = writeSchema.safeParse(await request.json());
    if (!parsed.success) return apiError('Données de classement invalides.', 400);
    const body = parsed.data;
    const season = await prisma.season.findFirst({ where: { isCurrent: true } });
    if (!season) return apiError('Aucune saison courante configurée.', 404);
    const standing = await prisma.standing.findFirst({
      where: { seasonId: season.id, team: { name: { contains: 'Ngaoundéré FC' } } },
    });
    if (!standing) return apiError('Le classement du NFC n’est pas configuré.', 404);

    const next = {
      played: body.played ?? standing.played,
      won: body.won ?? standing.won,
      drawn: body.drawn ?? standing.drawn,
      lost: body.lost ?? standing.lost,
      goalsFor: body.goalsFor ?? standing.goalsFor,
      goalsAgainst: body.goalsAgainst ?? standing.goalsAgainst,
      form: body.form === undefined ? standing.form : body.form,
    };
    if (next.played !== next.won + next.drawn + next.lost) {
      return apiError('Joués doit être égal à victoires + nuls + défaites.', 400);
    }
    const updated = await prisma.standing.update({
      where: { id: standing.id },
      data: { ...next, points: next.won * 3 + next.drawn },
    });
    return resourceResponse(updated, updated.updatedAt);
  } catch (error) {
    console.error('Failed to update NFC standing:', error);
    return apiError('Impossible de mettre à jour le classement.');
  }
}

export async function DELETE(request: NextRequest) {
  const denied = await requireEditor(request);
  if (denied) return denied;
  try {
    const id = new URL(request.url).searchParams.get('id');
    if (!id) return apiError('ID de classement obligatoire.', 400);
    await prisma.standing.delete({ where: { id } });
    return resourceResponse({ id, deleted: true }, new Date());
  } catch (error) {
    console.error('Failed to delete standing:', error);
    return apiError('Impossible de supprimer cette entrée du classement.');
  }
}
