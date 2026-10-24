export function isDataStale(
  updatedAt: Date | string | null | undefined,
  staleAfterMs: number,
  now = Date.now(),
) {
  if (!updatedAt) return false;
  const timestamp = updatedAt instanceof Date ? updatedAt.getTime() : Date.parse(updatedAt);
  return Number.isFinite(timestamp) && now - timestamp > staleAfterMs;
}
