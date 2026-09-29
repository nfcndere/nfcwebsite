'use client';

import React from 'react';
import Image from 'next/image';

interface PageHeaderProps {
  tag: string;
  title: string;
  titleHighlight?: string;
  description: string;
  backgroundImageUrl: string;
  badgeContent?: React.ReactNode;
  children?: React.ReactNode;
}

export const PageHeader: React.FC<PageHeaderProps> = ({
  tag,
  title,
  titleHighlight,
  description,
  backgroundImageUrl,
  badgeContent,
  children,
}) => {
  return (
    <section className="relative bg-[color:var(--nfc-dark)] text-white min-h-[80vh] flex items-center overflow-hidden shadow-md font-display">
      {/* Background Image with Dark Gradient Overlay */}
      <div className="absolute inset-0 z-0">
        <img
          src={backgroundImageUrl}
          alt={title}
          className="w-full h-full object-cover opacity-30 scale-105 transition-transform duration-700 hover:scale-100"
        />
        <div className="absolute inset-0 bg-gradient-to-r from-[color:var(--nfc-dark)] via-[color:var(--nfc-dark)]/85 to-[color:var(--nfc-dark)]/60" />
      </div>

      <div className="relative z-10 max-w-7xl mx-auto px-3 sm:px-4 md:px-6 lg:px-8 py-10 sm:py-12 md:py-16 w-full">
        <div className="flex flex-col lg:flex-row items-start lg:items-center justify-between gap-6 lg:gap-8">

          {/* Left Text Block */}
          <div className="space-y-3 sm:space-y-4 max-w-2xl">
            <div className="inline-flex items-center gap-2 px-2.5 sm:px-3 py-0.5 sm:py-1 rounded-sm sm:rounded-md bg-[color:var(--nfc-green)] text-white text-[9px] sm:text-[10px] font-bold font-display uppercase tracking-wider">
              <span className="w-1 h-1 sm:w-1.5 sm:h-1.5 rounded-full bg-[color:var(--nfc-yellow)] shrink-0" />
              <span>{tag}</span>
            </div>

            <h1 className="font-display text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-extrabold text-white leading-tight uppercase tracking-tight">
              {title} {titleHighlight && <span className="text-[color:var(--nfc-green)]">{titleHighlight}</span>}
            </h1>

            <p className="text-gray-300 text-xs sm:text-sm leading-relaxed max-w-xl font-light">
              {description}
            </p>

            {children && <div className="pt-2">{children}</div>}
          </div>

          {/* Optional Right Box / Badge */}
          {badgeContent && (
            <div className="shrink-0 w-full lg:w-auto">
              {badgeContent}
            </div>
          )}

        </div>
      </div>
    </section>
  );
};
