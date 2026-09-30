const SPONSORS = [
  {
    category: 'Partenaires Majeurs',
    logos: [
      { name: 'MTN Cameroun', type: 'mtn' },
      { name: 'FECAFOOT', type: 'fecafoot' },
    ],
  },
  {
    category: 'Partenaires Premium',
    logos: [
      { name: 'Sodecoton', type: 'sodecoton' },
      { name: 'Tradex', type: 'tradex' },
      { name: 'Brasseries du Cameroun', type: 'sabc' },
    ],
  },
  {
    category: 'Partenaires Officiels',
    logos: [
      { name: 'Mehanda Green Oil', type: 'mehanda' },
      { name: 'CAMTEL', type: 'camtel' },
      { name: 'KSA', type: 'ksa' },
    ],
  },
  {
    category: 'Fournisseurs Officiels',
    logos: [
      { name: 'Olympique Mainganga', type: 'mainganga' },
      { name: 'Real Asong', type: 'real-asong' },
      { name: 'Sketch', type: 'sketch' },
    ],
  },
];

function LogoText({ type, name }: { type: string; name: string }) {
  const baseClasses =
    'flex items-center justify-center grayscale opacity-70 hover:opacity-100 transition-opacity duration-300 cursor-pointer max-h-12';

  switch (type) {
    case 'mtn':
      return (
        <div className={`${baseClasses} flex-col`}>
          <span className="text-[18px] font-black tracking-tight text-[#FFCC00] bg-black px-2 py-0.5 rounded">MTN</span>
          <span className="text-[7px] font-bold uppercase tracking-[0.18em] text-gray-500 mt-0.5">
            EVERYWHERE YOU GO
          </span>
        </div>
      );

    case 'fecafoot':
      return (
        <div className={`${baseClasses} flex-col`}>
          <span className="text-[15px] font-black tracking-widest text-[#008751]">FECAFOOT</span>
          <span className="text-[7px] font-bold uppercase tracking-[0.15em] text-gray-500">
            FÉDÉRATION CAMEROUNAISE DE FOOTBALL
          </span>
        </div>
      );

    case 'sodecoton':
      return (
        <div className={`${baseClasses} flex-col`}>
          <span className="text-[16px] font-extrabold tracking-[0.1em] text-emerald-800">SODECOTON</span>
          <span className="text-[7px] italic text-gray-500">L'or blanc du Grand Nord</span>
        </div>
      );

    case 'tradex':
      return (
        <div className={`${baseClasses} flex-col`}>
          <span className="text-[17px] font-black tracking-wider text-red-700">TRADEX</span>
          <span className="text-[7px] font-semibold tracking-[0.15em] text-gray-500">PÉTROLE & ÉNERGIE</span>
        </div>
      );

    case 'sabc':
      return (
        <div className={`${baseClasses} flex-col`}>
          <span className="text-[15px] font-black tracking-tight text-yellow-700">SABC</span>
          <span className="text-[7px] font-bold uppercase tracking-[0.1em] text-gray-500">BRASSERIES DU CAMEROUN</span>
        </div>
      );

    case 'mehanda':
      return (
        <div className={`${baseClasses} gap-1`}>
          <span className="text-[14px] font-bold text-emerald-700">Mehanda Green Oil</span>
        </div>
      );

    case 'camtel':
      return (
        <div className={`${baseClasses} flex-col`}>
          <span className="text-[16px] font-black text-blue-800 tracking-wider">CAMTEL</span>
          <span className="text-[7px] font-semibold tracking-[0.15em] text-gray-500">TÉLÉCOM CAMEROUN</span>
        </div>
      );

    case 'ksa':
      return (
        <div className={`${baseClasses} flex-col`}>
          <span className="text-[16px] font-black text-gray-800 tracking-widest">KSA</span>
          <span className="text-[7px] uppercase tracking-[0.15em] text-gray-500">KADJI SPORTS ACADEMY</span>
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
