import Image from 'next/image';

const STATS = {
  rank: 2,
  points: 44,
  played: 21,
};

const NEXT_MATCH = {
  date: 'Samedi 10 octobre 2026 – 14:00',
  competition: 'L2 J8',
  ticketLabel: 'BILLETS',
  broadcaster: 'BOIN SPORTS',
  home: {
    name: 'Ngaoundéré FC',
    initials: 'NFC',
    logo: '/logo.png',
    color: '#008751',
    bg: 'bg-[#008751]/8',
    text: 'text-[#008751]',
  },
  away: {
    name: 'Canon Yaoundé',
    initials: 'CY',
    logo: '',
    color: '#b91c1c',
    bg: 'bg-[#b91c1c]/8',
    text: 'text-[#b91c1c]',
  },
  fecafoot: {
    name: 'FECAFOOT',
    initials: 'F',
    logo: '/part%20fecafoot.jpg',
    color: '#FFD100',
    bg: 'bg-[#FFD100]/15',
    text: 'text-[#9a7b00]',
  },
};

function TeamBadge(
  {
    name,
    initials,
    logo,
    color,
    bgClass,
    textClass,
  }: {
    name: string;
    initials: string;
    logo?: string;
    color: string;
    bgClass: string;
    textClass: string;
  }
) {
  const hasLogo = Boolean(logo && logo.trim());
  const safeLogo = logo && logo.trim() ? logo : '/logo.png';

  return (
    <div
      className={`flex h-14 w-14 items-center justify-center overflow-hidden rounded-full shadow-[0_10px_22px_rgba(15,23,42,0.08)] sm:h-16 sm:w-16 ${bgClass}`}
      style={{ backgroundColor: hasLogo ? '#fff' : `${color}1A` }}
    >
      {hasLogo ? (
        <Image
          src={safeLogo}
          alt={name}
          width={72}
          height={72}
          className="h-full w-full object-contain p-1"
        />
      ) : (
        <span className={`font-display text-sm font-extrabold tracking-wide ${textClass} sm:text-base`} aria-label={name}>
          {initials}
        </span>
      )}
    </div>
  );
}

export default function StatsBar() {
  return (
    <section className="relative z-20 -mt-8 sm:-mt-12 lg:-mt-16">
      <div className="mx-auto max-w-7xl px-3 sm:px-4 md:px-6 lg:px-8">
        <div className="rounded-xl sm:rounded-2xl border border-gray-100 bg-white p-3 sm:p-4 md:p-6 lg:p-8 shadow-[0_18px_40px_rgba(15,23,42,0.08)]">
          <div className="grid grid-cols-1 items-center gap-4 sm:gap-5 lg:grid-cols-12 lg:gap-0">
            {/* LEFT — STATS */}
            <div className="lg:col-span-7 lg:pr-8">
              <div className="grid grid-cols-3 divide-x divide-[#008751]/20">
                {/* Zone 1 — CLASSEMENT */}
                <div className="flex flex-col items-center px-1 sm:px-2 md:px-4 text-center">
                  <span className="mb-1 sm:mb-2 block text-[9px] sm:text-[10px] font-display font-bold uppercase tracking-[0.15em] text-[#008751]">
                    CLASSEMENT
                  </span>
                  <span className="mb-0.5 sm:mb-1 block text-[9px] font-display font-medium uppercase text-gray-500">
                    PLACE
                  </span>
                  <span className="font-display text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-extrabold leading-none text-[#008751]">
                    {STATS.rank}
                  </span>
                </div>

                {/* Zone 2 — POINTS */}
                <div className="flex flex-col items-center px-2 text-center sm:px-4">
                  <span className="mb-2 block select-none text-[11px] font-display font-bold uppercase tracking-[0.2em] text-transparent" aria-hidden="true">
                    &nbsp;
                  </span>
                  <span className="mb-1 block text-[11px] font-display font-medium uppercase text-gray-500">
                    POINTS
                  </span>
                  <span className="font-display text-4xl font-extrabold leading-none text-[#008751] sm:text-5xl lg:text-6xl">
                    {STATS.points}
                  </span>
                </div>

                {/* Zone 3 — JOUÉS */}
                <div className="flex flex-col items-center px-2 text-center sm:px-4">
                  <span className="mb-2 block select-none text-[11px] font-display font-bold uppercase tracking-[0.2em] text-transparent" aria-hidden="true">
                    &nbsp;
                  </span>
                  <span className="mb-1 block text-[11px] font-display font-medium uppercase text-gray-500">
                    JOUÉS
                  </span>
                  <span className="font-display text-4xl font-extrabold leading-none text-[#008751] sm:text-5xl lg:text-6xl">
                    {STATS.played}
                  </span>
                </div>
              </div>
            </div>

            {/* RIGHT — MATCH */}
            <div className="border-t border-[#008751]/25 pt-6 lg:col-span-5 lg:border-l lg:border-t-0 lg:pl-8 lg:pt-0">
              <div className="flex h-full flex-col justify-center text-center lg:text-left">
                <div className="mb-4">
                  <span className="block text-[11px] font-display font-bold uppercase tracking-[0.2em] text-[#008751]">
                    PROCHAIN MATCH
                  </span>
                  <span className="mt-1 block text-sm font-display font-medium text-gray-700">
                    {NEXT_MATCH.date}
                  </span>
                </div>

                <div className="flex items-center justify-center gap-3 sm:gap-5 lg:justify-start">
                  {/* Home team */}
                  <div className="flex flex-col items-center gap-2" aria-label={NEXT_MATCH.home.name}>
                    <TeamBadge
                      name={NEXT_MATCH.home.name}
                      initials={NEXT_MATCH.home.initials}
                      logo={NEXT_MATCH.home.logo}
                      color={NEXT_MATCH.home.color}
                      bgClass="bg-[#008751]/8"
                      textClass="text-[#008751]"
                    />
                    <span className="max-w-[90px] text-center text-[10px] font-display font-bold uppercase leading-tight text-gray-700">
                      {NEXT_MATCH.home.name}
                    </span>
                  </div>

                  {/* Center info */}
                  <div className="flex flex-col items-center gap-1.5 px-2">
                    <div className="flex h-12 w-12 items-center justify-center overflow-hidden rounded-full bg-[#FFD100]/15 shadow-[0_8px_18px_rgba(15,23,42,0.06)] sm:h-14 sm:w-14">
                      {NEXT_MATCH.fecafoot.logo ? (
                        <Image
                          src={NEXT_MATCH.fecafoot.logo}
                          alt={NEXT_MATCH.fecafoot.name}
                          width={56}
                          height={56}
                          className="h-full w-full object-contain p-1"
                        />
                      ) : (
                        <span className="font-display text-sm font-extrabold text-[#9a7b00] sm:text-base" aria-label={NEXT_MATCH.fecafoot.name}>
                          {NEXT_MATCH.fecafoot.initials}
                        </span>
                      )}
                    </div>
                    <span className="text-center text-[10px] font-display font-bold uppercase tracking-wide text-gray-700">
                      {NEXT_MATCH.competition}
                    </span>
                    <span className="text-center text-[10px] font-display font-bold uppercase tracking-wide text-gray-700">
                      {NEXT_MATCH.ticketLabel}
                    </span>
                    <span className="rounded bg-[#0a1e5e] px-2 py-0.5 text-[9px] font-display font-bold uppercase tracking-wider text-white">
                      {NEXT_MATCH.broadcaster}
                    </span>
                  </div>

                  {/* Away team */}
                  <div className="flex flex-col items-center gap-2" aria-label={NEXT_MATCH.away.name}>
                    <TeamBadge
                      name={NEXT_MATCH.away.name}
                      initials={NEXT_MATCH.away.initials}
                      logo={NEXT_MATCH.away.logo}
                      color={NEXT_MATCH.away.color}
                      bgClass="bg-[#b91c1c]/8"
                      textClass="text-[#b91c1c]"
                    />
                    <span className="max-w-[90px] text-center text-[10px] font-display font-bold uppercase leading-tight text-gray-700">
                      {NEXT_MATCH.away.name}
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
