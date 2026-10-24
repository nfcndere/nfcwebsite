import { NextResponse } from 'next/server';
import { isDataStale } from '@/lib/resource-state';

export type ResourceStatus = 'ok' | 'empty' | 'stale' | 'partial' | 'error';

export function resourceResponse<T>(
  data: T,
  updatedAt: Date | string | null,
  staleAfterMs?: number,
  partial = false,
  emptyOverride?: boolean,
) {
  const timestamp = updatedAt ? new Date(updatedAt).toISOString() : null;
  const stale = staleAfterMs !== undefined && isDataStale(timestamp, staleAfterMs);
  const hasContent = (value: unknown): boolean => {
    if (value === null || value === undefined) return false;
    if (Array.isArray(value)) return value.length > 0;
    if (typeof value === 'object') return Object.values(value).some(hasContent);
    return true;
  };
  const empty = emptyOverride ?? !hasContent(data);
  const status: ResourceStatus = partial ? 'partial' : empty ? 'empty' : stale ? 'stale' : 'ok';

  return NextResponse.json({ status, data, updatedAt: timestamp });
}

export function apiError(message: string, status = 500) {
  return NextResponse.json({ status: 'error', message }, { status });
}

export function latestDate<T>(items: T[], getDate: (item: T) => Date | string | null | undefined) {
  const dates = items
    .map(getDate)
    .filter((value): value is Date | string => Boolean(value))
    .map((value) => new Date(value).getTime())
    .filter(Number.isFinite);
  return dates.length ? new Date(Math.max(...dates)) : null;
}
