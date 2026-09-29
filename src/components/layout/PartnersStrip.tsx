import React from 'react';

const partners = [
  'SYNERGIE',
  'MILLET',
  'VELLEFEST',
  'ARNOLIA',
  'V&T',
  'LE LOREC GROUPE',
];

export const PartnersStrip: React.FC = () => {
  return (
    <section className="bg-white py-8 border-b border-[color:var(--nfc-border)]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-center gap-x-6 gap-y-4 flex-wrap">
          {partners.map((partner) => (
            <div
              key={partner}
              className="border border-[color:var(--nfc-border)] bg-[#fafcfb] px-4 py-2 text-[10px] font-display font-bold uppercase tracking-[0.24em] text-[color:var(--nfc-dark)]/70"
            >
              {partner}
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default PartnersStrip;
