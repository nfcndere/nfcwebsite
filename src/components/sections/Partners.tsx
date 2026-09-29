import Image from 'next/image';

type PartnerGroup = {
  category: string;
  logos: Array<{
    name: string;
    src: string;
    href?: string;
  }>;
};

const PARTNERS: PartnerGroup[] = [
  {
    category: 'Partenaires Officiels',
    logos: [
      { name: 'KSA', src: '/part_ksa-removebg-preview.png' },
      { name: 'Olympique Mainganga', src: '/part_olympique_M-removebg-preview.png' },
      { name: 'Real Asong', src: '/part%20realasong.png' },
      { name: 'Fecafoot', src: '/part%20fecafoot.jpg' },
      { name: 'Mehanda green oil', src: '/part%20mehanda.png' },
      { name: 'Sketch', src: '/part%20sand.png' },
    ],
  },
];

export default function Partners() {
  return (
    <section className="bg-white py-16 sm:py-20 lg:py-24">
      <div className="mx-auto max-w-5xl space-y-14 px-4 sm:px-6 lg:px-8">
        <div className="mb-8 text-center">
          <span className="mb-2 block text-[11px] font-display font-bold uppercase tracking-[0.25em] text-[#008751]">
            Nos Partenaires
          </span>
          <h2 className="font-display text-3xl font-extrabold uppercase tracking-tight text-gray-900 sm:text-4xl">
            Ils nous accompagnent dans notre aventure
          </h2>
          <p className="mx-auto mt-3 max-w-xl text-sm text-gray-500">
            Le Ngaoundéré Football Club remercie chaleureusement tous ses partenaires et fournisseurs pour leur soutien indéfectible.
          </p>
        </div>

        {PARTNERS.map((group) => (
          <div key={group.category} className="space-y-8 text-center">
            <h3 className="text-sm font-display font-medium uppercase tracking-[0.2em] text-gray-400">
              {group.category}
            </h3>

            <div className="flex flex-wrap items-center justify-center gap-x-10 gap-y-10 sm:gap-x-14 lg:gap-x-16">
              {group.logos.map((logo) => {
                const logoContent = (
                  <div key={logo.name} className="flex h-20 items-center justify-center sm:h-24">
                    <Image
                      src={logo.src}
                      alt={logo.name}
                      width={360}
                      height={128}
                      className="h-16 w-auto max-h-20 object-contain opacity-70 transition-opacity duration-300 hover:opacity-100 sm:h-20 sm:max-h-24"
                    />
                  </div>
                );

                if (logo.href) {
                  return (
                    <a
                      key={logo.name}
                      href={logo.href}
                      target="_blank"
                      rel="noopener noreferrer"
                      aria-label={`Visiter le site de ${logo.name}`}
                      className="inline-flex items-center justify-center"
                    >
                      {logoContent}
                    </a>
                  );
                }

                return logoContent;
              })}
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}
