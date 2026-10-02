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
    <section className="relative bg-[color:var(--nfc-dark)] text-white min-h-[55vh] sm:min-h-[70vh] flex items-center overflow-hidden font-display">
      {/* Background Image */}
      <div className="absolute inset-0 z-0">
        <img
          src={backgroundImageUrl}
          alt={title}
          className="w-full h-full object-cover opacity-30 scale-105 transition-transform duration-700 hover:scale-100"
        />
        <div className="absolute inset-0 bg-gradient-to-r from-[color:var(--nfc-dark)] via-[color:var(--nfc-dark)]/85 to-[color:var(--nfc-dark)]/60" />
      </div>

      {/* Content */}
      <div className="relative z-10 w-full max-w-7xl mx-auto px-3 sm:px-5 md:px-8 lg:px-10 py-8 sm:py-12 md:py-16">
        <div className="flex flex-col lg:flex-row items-start lg:items-center justify-between gap-5 lg:gap-8">

          {/* Left Text */}
          <div className="space-y-2.5 sm:space-y-4 max-w-2xl">
            <div className="inline-flex items-center gap-2 px-2.5 py-0.5 bg-[color:var(--nfc-green)] text-white text-[8px] sm:text-[10px] font-bold font-display uppercase tracking-wider">
              <span className="w-1 h-1 sm:w-1.5 sm:h-1.5 rounded-full bg-[color:var(--nfc-yellow)] shrink-0" />
              <span>{tag}</span>
            </div>

            <h1 className="font-display text-xl sm:text-3xl md:text-4xl lg:text-5xl font-extrabold text-white leading-tight uppercase tracking-tight">
              {title}{' '}
              {titleHighlight && (
                <span className="text-[color:var(--nfc-green)]">{titleHighlight}</span>
              )}
            </h1>

            <p className="text-gray-300 text-[11px] sm:text-sm leading-relaxed max-w-xl font-light">
              {description}
            </p>

            {children && <div className="pt-1 sm:pt-2">{children}</div>}
          </div>

          {/* Right Badge */}
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
