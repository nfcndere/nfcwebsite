"use client";

import React from 'react';

const sponsorNames = [
  'MTN CAMEROUN',
  'FECAFOOT',
  'SODECOTON',
  'TRADEX',
  'MEHANDA GREEN OIL',
  'KSA',
  'SABC',
  'CAMTEL',
];

export const SponsorsStrip: React.FC<{ logos?: string[] }> = ({ logos }) => {
  const items = logos || sponsorNames;

  return (
    <div className="bg-[#f3f5f3] border-t border-b border-[color:var(--nfc-border)] py-6">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="mb-4 flex items-center justify-center">
          <span className="text-[10px] font-display font-bold uppercase tracking-[0.28em] text-[color:var(--nfc-dark)]/70">
            Partenaires officiels
          </span>
        </div>
        <div className="flex flex-wrap items-center justify-center gap-x-8 gap-y-4 text-center">
          {items.map((item, i) => (
            <div
              key={i}
              className="flex-shrink-0 border border-[color:var(--nfc-border)] bg-white px-5 py-3 text-[11px] font-display font-bold uppercase tracking-[0.2em] text-[color:var(--nfc-dark)]/80"
            >
              {item}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
