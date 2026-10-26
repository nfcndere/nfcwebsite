export type ResourceStatus = 'loading' | 'ok' | 'empty' | 'stale' | 'partial' | 'error';
export type ResourceView = 'skeleton' | 'error' | 'empty' | 'content';

export function getResourceView(status: ResourceStatus): ResourceView {
  if (status === 'loading') return 'skeleton';
  if (status === 'error') return 'error';
  if (status === 'empty') return 'empty';
  return 'content';
}

export function isDataStale(
  updatedAt: Date | string | null | undefined,
  staleAfterMs: number,
  now = Date.now(),
) {
  if (!updatedAt) return false;
  const timestamp = updatedAt instanceof Date ? updatedAt.getTime() : Date.parse(updatedAt);
  return Number.isFinite(timestamp) && now - timestamp > staleAfterMs;
}
