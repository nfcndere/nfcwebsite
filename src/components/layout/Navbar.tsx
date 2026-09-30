'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { usePathname } from 'next/navigation';
import {
  Menu,
  X,
  User,
  ChevronDown,
  ChevronRight,
} from 'lucide-react';

// ─────────────────────────────────────────────────────────────
// Navigation
// ─────────────────────────────────────────────────────────────

type NavItem = {
  label: string;
  href: string;
  children?: {
    label: string;
    href: string;
  }[];
};

const NAV_ITEMS: NavItem[] = [
  {
    label: 'ACCUEIL',
    href: '/',
  },

  {
    label: 'ACTUALITÉS',
    href: '/actualites',
  },

  {
    label: 'COMPÉTITIONS',
    href: '/competitions',
    children: [
      {
        label: 'Calendrier',
        href: '/calendrier',
      },
      {
        label: 'Équipe',
        href: '/effectif',
      },
    ],
  },

  {
    label: 'Galerie',
    href: '/galerie',
  },

  {
    label: 'LE CLUB',
    href: '/le-club',
    children: [
      {
        label: 'Présentation',
        href: '/le-club',
      },
      {
        label: 'Académie',
        href: '/academie',
      },
    ],
  },
];

// ─────────────────────────────────────────────────────────────
// Styles
// ─────────────────────────────────────────────────────────────

const LINK_BASE =
  'inline-flex items-center justify-center gap-1.5 px-3 py-2 text-[13px] font-display font-medium rounded-lg transition-colors whitespace-nowrap shrink-0';

const linkClass = (isActive: boolean) =>
  `${LINK_BASE} ${
    isActive
      ? 'text-[color:var(--nfc-green)] bg-[color:var(--nfc-green)]/8'
      : 'text-gray-700 hover:text-[color:var(--nfc-green)] hover:bg-gray-50'
  }`;

const dropdownItemClass =
  'block px-4 py-2.5 text-[13px] font-display text-gray-700 hover:bg-gray-50 hover:text-[color:var(--nfc-green)] transition-colors whitespace-nowrap';

// ─────────────────────────────────────────────────────────────
// Navbar
// ─────────────────────────────────────────────────────────────

export const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const [openDropdown, setOpenDropdown] = useState<string | null>(null);

  const pathname = usePathname();

  // ─────────────────────────────────────────────────────────
  // Scroll
  // ─────────────────────────────────────────────────────────

  useEffect(() => {
    const onScroll = () => {
      setIsScrolled(window.scrollY > 8);
    };

    window.addEventListener('scroll', onScroll, {
      passive: true,
    });

    return () => {
      window.removeEventListener('scroll', onScroll);
    };
  }, []);

  // ─────────────────────────────────────────────────────────
  // Fermer les menus au changement de page
  // ─────────────────────────────────────────────────────────

  useEffect(() => {
    setIsOpen(false);
    setOpenDropdown(null);
  }, [pathname]);

  // ─────────────────────────────────────────────────────────
  // Active
  // ─────────────────────────────────────────────────────────

  const isActive = (href: string) => {
    if (!pathname) return false;
    return href === '/' ? pathname === '/' : pathname.startsWith(href);
  };

  // ─────────────────────────────────────────────────────────
  // Dropdown
  // ─────────────────────────────────────────────────────────

  const toggleDropdown = (label: string) => {
    setOpenDropdown((current) =>
      current === label ? null : label
    );
  };

  return (
    <header
      className={`sticky top-0 z-50 w-full bg-white font-sans transition-shadow duration-300 ${
        isScrolled
          ? 'shadow-[0_4px_20px_rgba(0,0,0,0.08)]'
          : 'shadow-sm border-b border-gray-100'
      }`}
    >

      {/* =====================================================
          TOP BAR
      ====================================================== */}

      <div className="bg-[color:var(--nfc-dark)] text-white text-[11px] py-4 px-4 font-display">

        <div className="max-w-7xl mx-auto flex items-center justify-between gap-4">

          <div className="flex items-center gap-3 min-w-0">

            <span className="bg-[color:var(--nfc-yellow)] text-[color:var(--nfc-dark)] font-display font-extrabold px-2 py-0.5 rounded text-[10px] uppercase shrink-0 whitespace-nowrap">
              PROCHAIN MATCH
            </span>

            <span className="text-gray-300 hidden sm:block truncate">
              LIGUE RÉGIONALE ADAMAOUA — J14 :{' '}
              <strong className="text-white">
                NGAOUNDÉRÉ FC vs NGAOUNDÉRÉ UNIV FC
              </strong>
            </span>

            <span className="text-gray-400 hidden md:block text-[10px] font-mono shrink-0 whitespace-nowrap">
              Dim. 04 Oct • 15h30
            </span>

          </div>

          <Link
            href="/calendrier"
            className="text-[color:var(--nfc-yellow)] font-display font-bold hover:text-white transition-colors shrink-0 flex items-center gap-1.5 text-[10px] tracking-widest uppercase whitespace-nowrap"
          >
            <span className="w-1.5 h-1.5 rounded-full bg-[color:var(--nfc-yellow)] animate-pulse shrink-0" />
            RÉSERVER →
          </Link>

        </div>

      </div>

      {/* =====================================================
          NAVBAR
      ====================================================== */}

      <div className="max-w-7xl mx-auto px-3 sm:px-6 lg:px-8">

        <div className="flex items-center h-[100px] gap-8 font-display">

          {/* =================================================
              LOGO
          ================================================= */}

          <Link
            href="/"
            className="flex items-center gap-3 group shrink-0"
          >

            <div className="relative w-[50px] h-[50px] rounded-full overflow-hidden ring-2 ring-[color:var(--nfc-green)]/20 shadow-md transition-transform duration-300 group-hover:scale-105">

              <Image
                src="/logo.png"
                alt="Ngaoundéré FC Logo"
                fill
                className="object-contain"
                priority
              />

            </div>

            <div className="hidden sm:block leading-tight">

              <span className="font-display text-[22px] font-extrabold tracking-wider text-[color:var(--nfc-dark)] block whitespace-nowrap">
                NGAOUNDÉRÉ{' '}
                <span className="text-[color:var(--nfc-green)]">
                  FC
                </span>
              </span>

              <span className="text-[9px] tracking-[0.18em] text-[color:var(--nfc-green)] font-display font-bold uppercase block whitespace-nowrap">
                L'ÉTOILE DE L'ADAMAOUA
              </span>

            </div>

          </Link>

          {/* =================================================
              DESKTOP NAV
          ================================================= */}

          <nav className="hidden lg:flex flex-1 items-center justify-center gap-1">

            {NAV_ITEMS.map((item) => {

              const active = isActive(item.href);

              // ───────────────────────────────────────────────
              // Lien simple
              // ───────────────────────────────────────────────

              if (!item.children) {
                return (
                  <Link
                    key={item.href}
                    href={item.href}
                    className={linkClass(active)}
                  >
                    {item.label}
                  </Link>
                );
              }

              // ───────────────────────────────────────────────
              // Dropdown
              // ───────────────────────────────────────────────

              const open = openDropdown === item.label;

              return (
                <div
                  key={item.label}
                  className="relative group shrink-0"
                  onMouseEnter={() => {
                    setOpenDropdown(item.label);
                  }}
                  onMouseLeave={() => {
                    setOpenDropdown((current) =>
                      current === item.label
                        ? null
                        : current
                    );
                  }}
                >

                  {/* Bouton principal */}

                  <button
                    type="button"
                    onClick={() =>
                      toggleDropdown(item.label)
                    }
                    aria-expanded={open}
                    aria-haspopup="true"
                    className={linkClass(active)}
                  >

                    <span className="whitespace-nowrap">
                      {item.label}
                    </span>

                    <ChevronDown
                      className={`w-4 h-4 shrink-0 transition-transform duration-200 ${
                        open
                          ? 'rotate-180'
                          : 'rotate-0'
                      }`}
                    />

                  </button>

                  {/* ─────────────────────────────────────────
                      Dropdown
                  ───────────────────────────────────────── */}

                  <div
                    className={`
                      absolute
                      left-0
                      top-full
                      z-[60]
                      pt-2

                      transition-all
                      duration-150

                      ${
                        open
                          ? 'opacity-100 visible pointer-events-auto translate-y-0'
                          : 'opacity-0 invisible pointer-events-none -translate-y-1'
                      }

                      group-hover:opacity-100
                      group-hover:visible
                      group-hover:pointer-events-auto
                      group-hover:translate-y-0
                    `}
                  >

                    <div className="w-60 bg-white rounded-lg shadow-xl ring-1 ring-black/5 overflow-hidden">

                      {item.children.map((child) => (

                        <Link
                          key={child.href}
                          href={child.href}
                          className={dropdownItemClass}
                        >
                          {child.label}
                        </Link>

                      ))}

                    </div>

                  </div>

                </div>
              );
            })}

          </nav>

          {/* =================================================
              DESKTOP BUTTONS
          ================================================= */}

          <div className="hidden lg:flex items-center gap-3 shrink-0">

            <Link
              href="/calendrier"
              className="btn-yellow text-[11px] px-4 py-2.5 whitespace-nowrap"
            >
              BILLETTERIE
            </Link>

            <Link
              href="/membre"
              className="btn-green text-[11px] px-4 py-2.5 flex items-center gap-1.5 whitespace-nowrap"
            >

              <User className="w-3.5 h-3.5 shrink-0" />

              <span>
                ESPACE SUPPORTER
              </span>

              <ChevronRight className="w-4 h-4 shrink-0" />

            </Link>

          </div>

          {/* =================================================
              MOBILE
          ================================================= */}

          <div className="flex lg:hidden items-center gap-2 shrink-0 ml-auto">

            <Link
              href="/membre"
              aria-label="Espace supporter"
              className="p-2 rounded-lg text-[color:var(--nfc-green)] hover:bg-[color:var(--nfc-green)]/10 transition-colors"
            >
              <User className="w-5 h-5" />
            </Link>

            <button
              onClick={() =>
                setIsOpen((v) => !v)
              }
              aria-label="Menu principal"
              aria-expanded={isOpen}
              className="p-2 rounded-lg text-gray-800 hover:bg-gray-100 transition-colors"
            >

              {isOpen ? (
                <X className="w-6 h-6" />
              ) : (
                <Menu className="w-6 h-6" />
              )}

            </button>

          </div>

        </div>

      </div>

      {/* =====================================================
          MOBILE SIDEBAR (SLIDE-OVER DRAWER)
      ====================================================== */}
      {isOpen && (
        <div className="fixed inset-0 z-50 lg:hidden">
          {/* Backdrop avec flou */}
          <div
            className="fixed inset-0 bg-black/60 backdrop-blur-sm transition-opacity animate-fade-in"
            onClick={() => setIsOpen(false)}
          />

          {/* Panneau latéral Sidebar */}
          <aside className="fixed inset-y-0 right-0 z-50 w-80 max-w-[85vw] bg-white shadow-2xl flex flex-col justify-between p-5 animate-slide-in-right overflow-y-auto">
            <div>
              {/* En-tête Sidebar */}
              <div className="flex items-center justify-between pb-4 mb-4 border-b border-gray-100">
                <div className="flex items-center gap-2.5">
                  <div className="relative w-9 h-9 rounded-full overflow-hidden ring-2 ring-[#008751]/20">
                    <Image src="/logo.png" alt="NFC Logo" fill className="object-contain" />
                  </div>
                  <div>
                    <h3 className="font-display text-sm font-extrabold text-gray-900 leading-none">NGAOUNDÉRÉ FC</h3>
                    <span className="text-[9px] font-display font-bold text-[#008751] tracking-wider uppercase">L'Étoile de l'Adamaoua</span>
                  </div>
                </div>

                <button
                  onClick={() => setIsOpen(false)}
                  className="p-2 rounded-xl text-gray-500 hover:text-gray-900 hover:bg-gray-100 transition-colors"
                  aria-label="Fermer le menu"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              {/* Navigation Items */}
              <nav className="space-y-1.5 font-display text-xs font-bold">
                {NAV_ITEMS.map((item) => {
                  const active = isActive(item.href);

                  if (!item.children) {
                    return (
                      <Link
                        key={item.href}
                        href={item.href}
                        onClick={() => setIsOpen(false)}
                        className={`flex items-center justify-between px-3.5 py-3 rounded-xl transition-all duration-150 ${
                          active
                            ? 'bg-[#008751] text-white shadow-sm'
                            : 'text-gray-800 hover:bg-gray-50 hover:text-[#008751]'
                        }`}
                      >
                        <span>{item.label}</span>
                        <ChevronRight className={`w-4 h-4 opacity-50 ${active ? 'text-white' : ''}`} />
                      </Link>
                    );
                  }

                  const open = openDropdown === item.label;

                  return (
                    <div key={item.label} className="space-y-1">
                      <button
                        type="button"
                        onClick={() => toggleDropdown(item.label)}
                        className={`w-full flex items-center justify-between px-3.5 py-3 rounded-xl transition-all duration-150 ${
                          active
                            ? 'bg-[#008751] text-white shadow-sm'
                            : 'text-gray-800 hover:bg-gray-50 hover:text-[#008751]'
                        }`}
                      >
                        <span>{item.label}</span>
                        <ChevronDown className={`w-4 h-4 transition-transform duration-200 ${open ? 'rotate-180' : ''}`} />
                      </button>

                      {open && (
                        <div className="pl-3 py-1 space-y-1 border-l-2 border-[#008751]/20 ml-3">
                          {item.children.map((child) => (
                            <Link
                              key={child.href}
                              href={child.href}
                              onClick={() => setIsOpen(false)}
                              className="block px-3 py-2 rounded-lg text-xs text-gray-600 hover:bg-gray-50 hover:text-[#008751] transition-colors"
                            >
                              {child.label}
                            </Link>
                          ))}
                        </div>
                      )}
                    </div>
                  );
                })}
              </nav>
            </div>

            {/* Pied de Sidebar avec CTAs */}
            <div className="pt-4 border-t border-gray-100 space-y-2.5 mt-6">
              <Link
                href="/calendrier"
                onClick={() => setIsOpen(false)}
                className="btn-yellow w-full justify-center py-2.5 text-xs whitespace-nowrap shadow-sm"
              >
                BILLETTERIE
              </Link>

              <Link
                href="/membre"
                onClick={() => setIsOpen(false)}
                className="btn-green w-full justify-center py-2.5 text-xs whitespace-nowrap shadow-sm flex items-center gap-2"
              >
                <User className="w-4 h-4" />
                <span>ESPACE SUPPORTER</span>
              </Link>

              <p className="text-[10px] text-center text-gray-400 font-mono pt-2">
                © 2026 Ngaoundéré FC • Adamaoua
              </p>
            </div>
          </aside>
        </div>
      )}
    </header>
  );
};