import { z } from 'zod';

const FORM_PATTERN = /^[VND](-[VND]){0,4}$/;

const count = z.number({ invalid_type_error: 'Valeur entière attendue.' }).int('Valeur entière attendue.').min(0, 'La valeur doit être positive ou nulle.');

/**
 * Validation du classement du NFC (PUT /api/standings).
 * - entiers ≥ 0 (rang ≥ 1) ;
 * - joués = victoires + nuls + défaites ;
 * - `form` : 1 à 5 résultats V/N/D séparés par des tirets, ex. « V-V-N-V-V » (null pour effacer).
 */
export const standingInputSchema = z
  .object({
    seasonId: z.string().trim().min(1).max(100).optional(),
    rank: z.number().int('Valeur entière attendue.').min(1, 'Le rang doit être supérieur ou égal à 1.'),
    played: count,
    won: count,
    drawn: count,
    lost: count,
    goalsFor: count,
    goalsAgainst: count,
    form: z.preprocess(
      (value) => (typeof value === 'string' && value.trim() === '' ? null : value),
      z
        .string()
        .trim()
        .toUpperCase()
        .regex(FORM_PATTERN, 'Forme attendue : 5 résultats maximum parmi V, N, D séparés par des tirets (ex. V-V-N-V-V).')
        .nullable()
        .optional(),
    ),
  })
  .strict()
  .refine((value) => value.played === value.won + value.drawn + value.lost, {
    message: 'Le nombre de matchs joués doit être égal à victoires + nuls + défaites.',
    path: ['played'],
  });

export type StandingInput = z.infer<typeof standingInputSchema>;

export function computeStandingTotals(row: { won: number; drawn: number; goalsFor: number; goalsAgainst: number }) {
  return { points: row.won * 3 + row.drawn, goalDifference: row.goalsFor - row.goalsAgainst };
}
