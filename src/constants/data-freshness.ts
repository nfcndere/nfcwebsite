export const DATA_FRESHNESS_MS = {
  liveMatch: 60_000,
  standings: 48 * 60 * 60 * 1_000,
  articles: 7 * 24 * 60 * 60 * 1_000,
  players: 30 * 24 * 60 * 60 * 1_000,
  matches: 30 * 24 * 60 * 60 * 1_000,
  media: 30 * 24 * 60 * 60 * 1_000,
} as const;
