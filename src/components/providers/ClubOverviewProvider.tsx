'use client';

import { createContext, useContext, type ReactNode } from 'react';
import type { MatchItem, StandingItem } from '@/types';
import { useApiResource } from '@/lib/use-api-resource';

type ClubOverview = {
  season: { id: string; label: string } | null;
  standings: (StandingItem & { rank: number })[];
  nextMatch: MatchItem | null;
  liveMatch: MatchItem | null;
};

const ClubOverviewContext = createContext<ReturnType<typeof useApiResource<ClubOverview>> | null>(null);

export function ClubOverviewProvider({ children }: { children: ReactNode }) {
  const resource = useApiResource<ClubOverview>('/api/club-overview', {
    staleAfterMs: 48 * 60 * 60 * 1_000,
    retry: 1,
    timeoutMs: 10_000,
  });
  return <ClubOverviewContext.Provider value={resource}>{children}</ClubOverviewContext.Provider>;
}

export function useClubOverview() {
  const value = useContext(ClubOverviewContext);
  if (!value) throw new Error('useClubOverview doit être utilisé dans ClubOverviewProvider.');
  return value;
}
