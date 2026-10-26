'use client';

import { createContext, useCallback, useContext, type ReactNode } from 'react';
import type { MatchItem, StandingItem } from '@/types';
import { useApiResource } from '@/lib/use-api-resource';
import type { ApiStatus } from '@/lib/use-api-resource';
import { DATA_FRESHNESS_MS } from '@/constants/data-freshness';

type StandingResponse = {
  season: { id: string; label: string } | null;
  nfc: (StandingItem & { rank: number }) | null;
};

type ClubExtras = {
  nextMatch: MatchItem | null;
  liveMatch: MatchItem | null;
  settings: Record<string, string>;
};

type ClubOverview = StandingResponse & ClubExtras;
type ClubOverviewValue = {
  data: ClubOverview | null;
  status: ApiStatus;
  error: string | null;
  updatedAt: string | null;
  retry: () => void;
  matchStatus: ApiStatus;
  matchError: string | null;
  matchUpdatedAt: string | null;
};

const ClubOverviewContext = createContext<ClubOverviewValue | null>(null);

export function ClubOverviewProvider({ children }: { children: ReactNode }) {
  const standings = useApiResource<StandingResponse>('/api/standings', {
    staleAfterMs: DATA_FRESHNESS_MS.standings,
    retry: 1,
    timeoutMs: 10_000,
  });
  const extras = useApiResource<ClubExtras>('/api/club-overview', {
    staleAfterMs: DATA_FRESHNESS_MS.matches,
    retry: 1,
    timeoutMs: 10_000,
  });
  const retry = useCallback(() => {
    standings.retry();
    extras.retry();
  }, [standings.retry, extras.retry]);
  const value: ClubOverviewValue = {
    data: standings.data || extras.data ? {
      season: standings.data?.season ?? null,
      nfc: standings.data?.nfc ?? null,
      nextMatch: extras.data?.nextMatch ?? null,
      liveMatch: extras.data?.liveMatch ?? null,
      settings: extras.data?.settings ?? {},
    } : null,
    status: standings.status,
    error: standings.error,
    updatedAt: standings.updatedAt,
    retry,
    matchStatus: extras.status,
    matchError: extras.error,
    matchUpdatedAt: extras.updatedAt,
  };
  return <ClubOverviewContext.Provider value={value}>{children}</ClubOverviewContext.Provider>;
}

export function useClubOverview() {
  const value = useContext(ClubOverviewContext);
  if (!value) throw new Error('useClubOverview doit être utilisé dans ClubOverviewProvider.');
  return value;
}
