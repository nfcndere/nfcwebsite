const SPONSORS = [
  {
    category: 'Partenaires Majeurs',
    logos: [
      { name: 'Synergie', type: 'synergie' },
      { name: 'Macron', type: 'macron' },
    ],
  },
  {
    category: 'Partenaires Premium',
    logos: [
      { name: 'Millet', type: 'millet' },
      { name: 'Vellefest', type: 'vellefest' },
      { name: 'Arnolia', type: 'arnolia' },
    ],
  },
  {
    category: 'Partenaires Officiels',
    logos: [
      { name: 'V&T', type: 'vt' },
      { name: 'Nantes Métropole', type: 'nantes' },
      { name: 'Crédit Mutuel', type: 'credit-mutuel' },
    ],
  },
  {
    category: 'Fournisseurs Officiels',
    logos: [
      { name: 'Le Lorec Groupe', type: 'le-lorec' },
      { name: 'Pautric', type: 'pautric' },
      { name: 'Fruidis', type: 'fruidis' },
      { name: 'Sportingsols', type: 'sportingsols' },
    ],
  },
];

function LogoText({ type, name }: { type: string; name: string }) {
  const baseClasses =
    'flex items-center justify-center grayscale opacity-70 hover:opacity-100 transition-opacity duration-300 cursor-pointer max-h-12';

  switch (type) {
    case 'synergie':
      return (
        <div className={`${baseClasses} flex-col`}>
          <span className="text-[15px] font-black tracking-tight text-gray-700">SYNERGIE</span>
          <span className="text-[7px] font-bold uppercase tracking-[0.18em] text-gray-500">
            INTERIM - RECRUTEMENT
          </span>
        </div>
      );

    case 'macron':
      return (
        <div className={`${baseClasses} gap-2`}>
          <span className="text-[10px] text-gray-600">◢</span>
          <span className="text-[18px] font-black lowercase tracking-tight text-gray-700">macron</span>
        </div>
      );

    case 'millet':
      return (
        <div className={`${baseClasses} flex-col`}>
          <span className="text-[16px] font-bold tracking-[0.08em] text-gray-700">MILLET</span>
          <span className="text-[7px] italic text-gray-500">Fenêtres et façades</span>
        </div>
      );

    case 'vellefest':
      return (
        <div className={`${baseClasses} flex-col`}>
          <span className="text-[22px] font-serif italic underline decoration-gray-500 underline-offset-4 text-gray-700">
            VELLEFEST
          </span>
        </div>
      );

    case 'arnolia':
      return (
        <div className={`${baseClasses}`}>
          <span className="text-[18px] font-light tracking-[0.28em] text-gray-700">ARNOLIA</span>
        </div>
      );

    case 'vt':
      return (
        <div className={`${baseClasses} gap-1`}>
          <span className="text-[15px] font-black text-gray-700">•</span>
          <span className="text-[20px] font-black tracking-tight text-gray-700">V&T</span>
        </div>
      );

    case 'nantes':
      return (
        <div className={`${baseClasses} gap-2`}>
          <span className="text-[16px] text-gray-600">✦</span>
          <div className="flex flex-col items-start leading-none">
            <span className="text-[16px] font-black text-gray-700">Nantes</span>
            <span className="text-[9px] font-semibold tracking-[0.15em] text-gray-600">MÉTROPOLE</span>
          </div>
        </div>
      );

    case 'credit-mutuel':
      return (
        <div className={`${baseClasses} flex-col`}>
          <span className="mb-1 text-[12px] text-gray-700">◬</span>
          <span className="text-[14px] font-black tracking-tight text-gray-700">Crédit Mutuel</span>
        </div>
      );

    case 'le-lorec':
      return (
        <div className={`${baseClasses} flex-col`}>
          <span className="text-[13px] font-black tracking-[0.12em] text-gray-700">LE LOREC</span>
          <span className="text-[8px] font-semibold tracking-[0.2em] text-gray-500">GROUPE</span>
          <span className="text-[6px] uppercase tracking-[0.18em] text-gray-500 mt-1">
            L&apos;UNION POUR ENTREPRENDRE
          </span>
        </div>
      );

    case 'pautric':
      return (
        <div className={`${baseClasses} gap-2`}>
          <span className="inline-flex h-6 w-6 items-center justify-center rounded-full border border-gray-500 text-[9px] font-bold text-gray-600">
            P
          </span>
          <div className="flex flex-col items-start leading-none">
            <span className="text-[18px] font-black text-gray-700">Pautric</span>
          </div>
        </div>
      );

    case 'fruidis':
      return (
        <div className={`${baseClasses}`}>
          <span className="text-[16px] font-black italic uppercase tracking-[0.14em] text-gray-700 skew-x-[-12deg] inline-block">
            FRUIDIS
          </span>
        </div>
      );

    case 'sportingsols':
      return (
        <div className={`${baseClasses} gap-2`}>
          <div className="flex h-5 items-end gap-[2px]">
            <span className="block h-5 w-[3px] bg-gray-600" />
            <span className="block h-4 w-[3px] bg-gray-600" />
            <span className="block h-3 w-[3px] bg-gray-600" />
          </div>
          <span className="text-[13px] font-black tracking-tight text-gray-700">SPORTINGSOLS</span>
        </div>
      );

    default:
      return <span className="text-gray-700 font-bold uppercase">{name}</span>;
  }
}

export default function Sponsor() {
  return (
    <section className="bg-white py-20">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 space-y-16">
        <div className="text-center mb-4">
          <h2 className="font-display text-2xl font-bold text-gray-900 uppercase tracking-tight">
            Nos Partenaires
          </h2>
          <p className="text-sm text-gray-500 mt-2">
            Ils soutiennent le Ngaoundéré Football Club
          </p>
        </div>

        {SPONSORS.map((group) => (
          <div key={group.category} className="text-center space-y-8">
            <h3 className="text-sm font-display font-medium text-gray-400 tracking-wide">
              {group.category}
            </h3>

            <div className="flex flex-wrap items-center justify-center gap-10 sm:gap-14 lg:gap-20">
              {group.logos.map((logo) => (
                <div
                  key={`${group.category}-${logo.name}`}
                  className="flex items-center justify-center max-h-12"
                >
                  <LogoText type={logo.type} name={logo.name} />
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}
