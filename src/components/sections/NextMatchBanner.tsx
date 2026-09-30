'use client';

import Image from 'next/image';
import Link from 'next/link';
import { useEffect, useState } from 'react';
import { ArrowRight, Clock, Shield } from 'lucide-react';

const NEXT_MATCH = {
  date: '2026-10-10T14:00:00',
  dateLabel: '10 OCTOBRE 2026 — 14:00',
  competition: 'LIGUE RÉGIONALE DE L\'ADAMAOUA',
  matchday: 'JOURNÉE 14',
  home: {
    name: 'Ngaoundéré FC',
    logo: '/logo.png',
  },
  away: {
    name: 'Ngaoundéré University FC',
    logo: '',
  },
  watchHref: '/calendrier',
  ticketHref: '/billetterie',
};

const MATCH_DATE = new Date(NEXT_MATCH.date);

export default function NextMatchBanner() {
  const [now, setNow] = useState(() => new Date());

  useEffect(() => {
    const id = window.setInterval(() => setNow(new Date()), 1000);
    return () => window.clearInterval(id);
  }, []);

  const diff = Math.max(0, MATCH_DATE.getTime() - now.getTime());
  const days = Math.floor(diff / (1000 * 60 * 60 * 24));
  const hours = Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
  const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
  const seconds = Math.floor((diff % (1000 * 60)) / 1000);

  const hh = String(hours).padStart(2, '0');
  const mm = String(minutes).padStart(2, '0');
  const ss = String(seconds).padStart(2, '0');

  return (
    <section className="mx-auto max-w-7xl px-3 sm:px-4 md:px-6 lg:px-8">
      <div className="flex flex-col overflow-hidden border-t-4 border-[#008751] bg-white shadow-xl rounded-lg lg:flex-row">
        {/* Block 1: club crests */}
        <div className="flex items-center justify-center gap-2 border-b border-gray-100 p-3 sm:p-4 lg:w-40 lg:shrink-0 lg:border-b-0 lg:border-r">
          <div className="relative h-14 w-12 shrink-0 sm:h-18 sm:w-14 lg:h-20 lg:w-16" aria-label={NEXT_MATCH.home.name}>
            <Image
              src={NEXT_MATCH.home.logo}
              alt={NEXT_MATCH.home.name}
              fill
              className="object-contain"
            />
          </div>

          <div className="relative flex h-14 w-12 items-center justify-center shrink-0 rounded-sm bg-[#008751]/5 sm:h-18 sm:w-14 lg:h-20 lg:w-16" aria-label={NEXT_MATCH.away.name}>
            {NEXT_MATCH.away.logo ? (
              <Image
                src={NEXT_MATCH.away.logo}
                alt={NEXT_MATCH.away.name}
                fill
                className="object-contain"
              />
            ) : (
              <Shield className="h-6 w-6 text-[color:var(--nfc-green)] sm:h-7 sm:w-7" />
            )}
          </div>
        </div>

        {/* Block 2: match info + countdown */}
        <div className="flex flex-1 flex-col items-center justify-between gap-3 border-b border-gray-100 p-3 sm:p-4 lg:flex-row lg:border-b-0">
          <div className="space-y-1 text-center sm:text-left min-w-0">
            <div className="flex items-center justify-center gap-1.5 sm:justify-start">
              <Clock className="h-3.5 w-3.5 text-[#008751] shrink-0" />
              <span className="font-display text-xs sm:text-sm font-extrabold uppercase tracking-wide text-[#0c130e] line-clamp-2">
                {NEXT_MATCH.dateLabel}
              </span>
            </div>
            <span className="block text-[10px] font-display uppercase tracking-wider text-gray-500">
              {NEXT_MATCH.competition}
            </span>
            <span className="block text-[10px] font-display uppercase tracking-wider text-gray-500">
              {NEXT_MATCH.matchday}
            </span>
          </div>

          <div className="flex flex-col items-center gap-2 sm:items-end">
            <div aria-live="polite" aria-atomic="false" className="flex items-baseline gap-1 font-display font-extrabold text-[#0c130e] text-sm sm:text-base">
              {diff === 0 ? (
                <>
                  <span className="mr-1 inline-block h-2 w-2 rounded-full bg-red-600 animate-pulse" />
                  <span className="text-sm font-extrabold uppercase text-[#008751]">
                    EN DIRECT
                  </span>
                </>
              ) : (
                <>
                  <span className="text-xl sm:text-2xl">{days}</span>
                  <span className="text-[9px] font-medium uppercase text-gray-500 ml-0.5">j</span>

                  <span className="text-xl sm:text-2xl ml-1">{hh}</span>
                  <span className="text-[9px] font-medium uppercase text-gray-500 ml-0.5">h</span>

                  <span className="text-xl sm:text-2xl ml-1">{mm}</span>
                  <span className="text-[9px] font-medium uppercase text-gray-500 ml-0.5">m</span>

                  <span className="text-xl text-[#008751] sm:text-2xl ml-1">{ss}</span>
                  <span className="text-[9px] font-medium uppercase text-gray-500 ml-0.5">s</span>
                </>
              )}
            </div>
          </div>
        </div>

        {/* Block 3: ticket CTA */}
        <div className="flex items-center justify-center p-2.5 sm:p-4 lg:w-48 lg:shrink-0">
          <Link
            href="/calendrier"
            className="flex w-full items-center justify-center gap-1.5 whitespace-nowrap bg-[#008751] px-3 sm:px-6 py-3 sm:py-4 text-center text-[10px] sm:text-xs font-display font-extrabold uppercase tracking-wider text-white transition-colors hover:bg-[#0c130e]"
          >
            BILLETTERIE
            <ArrowRight className="h-3 w-3 sm:h-4 sm:w-4" />
          </Link>
        </div>
      </div>
    </section>
  );
}
