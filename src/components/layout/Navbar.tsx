'use client';

import React, { useState, useEffect, useCallback } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { usePathname } from 'next/navigation';
import {
  Menu, X, User, ChevronDown, ChevronRight,
  Home, Newspaper, Trophy, Image as ImageIcon, Shield,
  GraduationCap, Calendar, BarChart2, Ticket
} from 'lucide-react';

// ─── Types ────────────────────────────────────────────────────────────────────
type NavItem = {
  label: string;
  href: string;
  icon?: React.ElementType;
  children?: { label: string; href: string; icon?: React.ElementType }[];
};

// ─── Nav Config ───────────────────────────────────────────────────────────────
const NAV_ITEMS: NavItem[] = [
  { label: 'ACCUEIL',    href: '/',            icon: Home },
  { label: 'ACTUALITÉS', href: '/actualites',  icon: Newspaper },
  {
    label: 'COMPÉTITIONS', href: '/competitions', icon: Trophy,
    children: [
      { label: 'Calendrier & Résultats', href: '/calendrier',  icon: Calendar },
      { label: 'Effectif',               href: '/effectif',    icon: User },
      { label: 'Classement',             href: '/classement',  icon: BarChart2 },
    ],
  },
  { label: 'GALERIE', href: '/galerie', icon: ImageIcon },
  {
    label: 'LE CLUB', href: '/le-club', icon: Shield,
    children: [
      { label: 'Présentation',  href: '/le-club',   icon: Shield },
      { label: 'Académie',      href: '/academie',  icon: GraduationCap },
    ],
  },
];

// ─── Helpers ──────────────────────────────────────────────────────────────────
const linkClass = (isActive: boolean) =>
  `inline-flex items-center gap-1.5 px-3 py-1.5 text-[12px] font-display font-semibold rounded-lg transition-all duration-200 whitespace-nowrap shrink-0 ${
    isActive
      ? 'text-[color:var(--nfc-green)] bg-[color:var(--nfc-green)]/8'
      : 'text-gray-700 hover:text-[color:var(--nfc-green)] hover:bg-gray-50'
  }`;

// ─── Navbar ───────────────────────────────────────────────────────────────────
export const Navbar = () => {
  const [isOpen,       setIsOpen]       = useState(false);
  const [isScrolled,   setIsScrolled]   = useState(false);
  const [openDropdown, setOpenDropdown] = useState<string | null>(null);
  const [closing,      setClosing]      = useState(false);

  const pathname = usePathname();

  // Scroll shadow
  useEffect(() => {
    const onScroll = () => setIsScrolled(window.scrollY > 6);
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  // Close on route change
  useEffect(() => {
    handleClose();
    setOpenDropdown(null);
  }, [pathname]);

  // Lock body scroll when sidebar open
  useEffect(() => {
    document.body.style.overflow = isOpen ? 'hidden' : '';
    return () => { document.body.style.overflow = ''; };
  }, [isOpen]);

  const isActive = (href: string) => {
    if (!pathname) return false;
    return href === '/' ? pathname === '/' : pathname.startsWith(href);
  };

  // Animated close
  const handleClose = useCallback(() => {
    if (!isOpen) return;
    setClosing(true);
    setTimeout(() => {
      setIsOpen(false);
      setClosing(false);
    }, 260);
  }, [isOpen]);

  const handleOpen = () => {
    setClosing(false);
    setIsOpen(true);
  };

  const toggleDropdown = (label: string) =>
    setOpenDropdown((cur) => (cur === label ? null : label));

  return (
    <header
      className={`sticky top-0 z-50 w-full bg-white font-sans transition-all duration-300 ${
        isScrolled
          ? 'shadow-[0_2px_16px_rgba(0,0,0,0.10)]'
          : 'border-b border-gray-100'
      }`}
    >

      {/* ── TOP BAR (desktop only) ──────────────────────────────── */}
      <div className="hidden sm:block bg-[color:var(--nfc-dark)] text-white text-[10px] py-2 px-4 font-display">
        <div className="max-w-7xl mx-auto flex items-center justify-between gap-4">
          <div className="flex items-center gap-3 min-w-0">
            <span className="bg-[color:var(--nfc-yellow)] text-[color:var(--nfc-dark)] font-extrabold px-2 py-0.5 text-[9px] uppercase shrink-0">
              PROCHAIN MATCH
            </span>
            <span className="text-gray-300 truncate hidden sm:block">
              LIGUE RÉGIONALE — J14 :{' '}
              <strong className="text-white">NFC vs NGAOUNDÉRÉ UNIV FC</strong>
            </span>
            <span className="text-gray-400 hidden md:block font-mono shrink-0">
              Dim. 04 Oct • 15h30
            </span>
          </div>
          <Link href="/calendrier" className="text-[color:var(--nfc-yellow)] font-bold hover:text-white transition-colors shrink-0 flex items-center gap-1.5 text-[9px] tracking-widest uppercase">
            <span className="w-1.5 h-1.5 rounded-full bg-[color:var(--nfc-yellow)] animate-pulse shrink-0" />
            RÉSERVER →
          </Link>
        </div>
      </div>

      {/* ── MAIN NAV BAR ────────────────────────────────────────── */}
      <div className="max-w-7xl mx-auto px-3 sm:px-6 lg:px-8">

        {/* ── MOBILE LAYOUT: 3-col grid [user | logo | menu] ─── */}
        <div className="flex lg:hidden items-center h-14 gap-2">

          {/* LEFT — Espace membre */}
          <div className="flex-1 flex justify-start">
            <Link
              href="/membre"
              aria-label="Espace supporter"
              className="flex items-center gap-1.5 text-[color:var(--nfc-green)] hover:bg-[color:var(--nfc-green)]/8 transition-colors px-2 py-1.5 rounded-lg"
            >
              <User className="w-5 h-5" />
              <span className="text-[10px] font-display font-bold uppercase tracking-wider hidden xs:block">Espace</span>
            </Link>
          </div>

          {/* CENTER — Logo */}
          <Link href="/" className="flex items-center gap-2 group shrink-0">
            <div className="relative w-9 h-9 overflow-hidden transition-transform duration-300 group-hover:scale-105">
              <Image src="/logo.png" alt="NFC Logo" fill className="object-contain" priority />
            </div>
            <span className="font-display text-[15px] font-extrabold tracking-wider text-[color:var(--nfc-dark)]">
              NFC
            </span>
          </Link>

          {/* RIGHT — Menu burger */}
          <div className="flex-1 flex justify-end">
            <button
              onClick={isOpen ? handleClose : handleOpen}
              aria-label="Menu principal"
              aria-expanded={isOpen}
              className="p-2 rounded-lg text-gray-700 hover:bg-gray-100 transition-colors"
            >
              {isOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>
          </div>
        </div>

        {/* ── DESKTOP LAYOUT ──────────────────────────────────── */}
        <div className="hidden lg:flex items-center h-[72px] gap-8 font-display">

          {/* Logo */}
          <Link href="/" className="flex items-center gap-3 group shrink-0">
            <div className="relative w-[46px] h-[46px] overflow-hidden transition-transform duration-300 group-hover:scale-105">
              <Image src="/logo.png" alt="Ngaoundéré FC Logo" fill className="object-contain" priority />
            </div>
            <div className="leading-tight">
              <span className="font-display text-[20px] font-extrabold tracking-wider text-[color:var(--nfc-dark)] block whitespace-nowrap">
                NGAOUNDÉRÉ <span className="text-[color:var(--nfc-green)]">FC</span>
              </span>
              <span className="text-[8px] tracking-[0.18em] text-[color:var(--nfc-green)] font-display font-bold uppercase block whitespace-nowrap">
                L'ÉTOILE DE L'ADAMAOUA
              </span>
            </div>
          </Link>

          {/* Desktop nav links */}
          <nav className="flex flex-1 items-center justify-center gap-0.5">
            {NAV_ITEMS.map((item) => {
              const active = isActive(item.href);
              if (!item.children) {
                return (
                  <Link key={item.href} href={item.href} className={linkClass(active)}>
                    {item.label}
                  </Link>
                );
              }
              const open = openDropdown === item.label;
              return (
                <div
                  key={item.label}
                  className="relative group shrink-0"
                  onMouseEnter={() => setOpenDropdown(item.label)}
                  onMouseLeave={() => setOpenDropdown((cur) => cur === item.label ? null : cur)}
                >
                  <button
                    type="button"
                    onClick={() => toggleDropdown(item.label)}
                    aria-expanded={open}
                    className={linkClass(active)}
                  >
                    <span>{item.label}</span>
                    <ChevronDown className={`w-3.5 h-3.5 shrink-0 transition-transform duration-200 ${open ? 'rotate-180' : ''}`} />
                  </button>
                  {/* Dropdown panel */}
                  <div className={`absolute left-0 top-full z-[60] pt-2 transition-all duration-150 ${open ? 'opacity-100 visible translate-y-0' : 'opacity-0 invisible -translate-y-1 pointer-events-none'} group-hover:opacity-100 group-hover:visible group-hover:translate-y-0 group-hover:pointer-events-auto`}>
                    <div className="w-52 bg-white rounded-xl shadow-xl ring-1 ring-black/5 overflow-hidden py-1">
                      {item.children.map((child) => (
                        <Link key={child.href} href={child.href} className="flex items-center gap-2.5 px-4 py-2.5 text-[12px] font-display text-gray-700 hover:bg-[#008751]/5 hover:text-[#008751] transition-colors">
                          {child.icon && <child.icon className="w-3.5 h-3.5 shrink-0 text-[#008751]/60" />}
                          {child.label}
                        </Link>
                      ))}
                    </div>
                  </div>
                </div>
              );
            })}
          </nav>

          {/* Desktop CTAs */}
          <div className="flex items-center gap-2.5 shrink-0">
            <Link href="/calendrier" className="btn-yellow text-[10px] px-4 py-2 whitespace-nowrap">
              BILLETTERIE
            </Link>
            <Link href="/membre" className="btn-green text-[10px] px-4 py-2 flex items-center gap-1.5 whitespace-nowrap">
              <User className="w-3.5 h-3.5 shrink-0" />
              ESPACE SUPPORTER
            </Link>
          </div>
        </div>
      </div>

      {/* ════════════════════════════════════════════════════════════
          MOBILE SIDEBAR — Dark modern drawer
      ════════════════════════════════════════════════════════════ */}
      {isOpen && (
        <div className="fixed inset-0 z-[99] lg:hidden">

          {/* Backdrop */}
          <div
            className={`fixed inset-0 bg-black/70 backdrop-blur-sm ${closing ? 'animate-fade-out' : 'animate-fade-in'}`}
            style={closing ? { animation: 'fadeIn 0.26s ease reverse both' } : {}}
            onClick={handleClose}
          />

          {/* Sidebar Panel */}
          <aside
            className={`fixed inset-y-0 right-0 z-[100] w-[300px] max-w-[88vw] flex flex-col ${closing ? 'animate-slide-out-right' : 'animate-slide-in-right'}`}
            style={{
              background: 'linear-gradient(160deg, #0c130e 0%, #0f1f13 60%, #1a2e1d 100%)',
            }}
          >
            {/* ── SIDEBAR HEADER ──────────────────────────────── */}
            <div className="flex items-center justify-between px-5 py-4 border-b border-white/8">
              <Link href="/" onClick={handleClose} className="flex items-center gap-3">
                <div className="relative w-10 h-10 overflow-hidden">
                  <Image src="/logo.png" alt="NFC Logo" fill className="object-contain" />
                </div>
                <div>
                  <h3 className="font-display text-sm font-extrabold text-white leading-none">NGAOUNDÉRÉ FC</h3>
                  <span className="text-[9px] font-display font-bold text-[#8cea5a] tracking-wider uppercase">L'Étoile de l'Adamaoua</span>
                </div>
              </Link>
              <button
                onClick={handleClose}
                className="w-8 h-8 flex items-center justify-center rounded-lg text-white/50 hover:text-white hover:bg-white/10 transition-colors"
                aria-label="Fermer"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* ── NAVIGATION ─────────────────────────────────── */}
            <nav className="flex-1 overflow-y-auto px-3 py-4 space-y-0.5">
              {NAV_ITEMS.map((item, idx) => {
                const active = isActive(item.href);
                const IconComp = item.icon;
                const open = openDropdown === item.label;

                if (!item.children) {
                  return (
                    <Link
                      key={item.href}
                      href={item.href}
                      onClick={handleClose}
                      className={`flex items-center justify-between px-4 py-3 rounded-xl transition-all duration-150 animate-fade-in-up stagger-${Math.min(idx + 1, 6)} ${
                        active
                          ? 'bg-[#008751] text-white'
                          : 'text-white/80 hover:bg-white/8 hover:text-white'
                      }`}
                    >
                      <span className="flex items-center gap-3">
                        {IconComp && <IconComp className={`w-4 h-4 shrink-0 ${active ? 'text-white' : 'text-[#8cea5a]/70'}`} />}
                        <span className="font-display text-xs font-bold uppercase tracking-wide">{item.label}</span>
                      </span>
                      <ChevronRight className="w-3.5 h-3.5 opacity-40" />
                    </Link>
                  );
                }

                return (
                  <div key={item.label} className={`animate-fade-in-up stagger-${Math.min(idx + 1, 6)}`}>
                    <button
                      type="button"
                      onClick={() => toggleDropdown(item.label)}
                      className={`w-full flex items-center justify-between px-4 py-3 rounded-xl transition-all duration-150 ${
                        active
                          ? 'bg-[#008751]/30 text-white'
                          : 'text-white/80 hover:bg-white/8 hover:text-white'
                      }`}
                    >
                      <span className="flex items-center gap-3">
                        {IconComp && <IconComp className={`w-4 h-4 shrink-0 ${active ? 'text-[#8cea5a]' : 'text-[#8cea5a]/70'}`} />}
                        <span className="font-display text-xs font-bold uppercase tracking-wide">{item.label}</span>
                      </span>
                      <ChevronDown className={`w-3.5 h-3.5 opacity-60 transition-transform duration-200 ${open ? 'rotate-180' : ''}`} />
                    </button>

                    {open && (
                      <div className="mt-0.5 ml-4 pl-3 border-l border-white/10 space-y-0.5 pb-1">
                        {item.children.map((child) => {
                          const ChildIcon = child.icon;
                          return (
                            <Link
                              key={child.href}
                              href={child.href}
                              onClick={handleClose}
                              className="flex items-center gap-2.5 px-3 py-2.5 rounded-lg text-white/60 hover:text-white hover:bg-white/8 transition-colors animate-slide-in"
                            >
                              {ChildIcon && <ChildIcon className="w-3.5 h-3.5 shrink-0 text-[#8cea5a]/60" />}
                              <span className="font-display text-[11px] font-semibold">{child.label}</span>
                            </Link>
                          );
                        })}
                      </div>
                    )}
                  </div>
                );
              })}
            </nav>

            {/* ── PROCHAIN MATCH (mobile only) ────────────────── */}
            <div className="mx-3 mb-3 px-4 py-3 rounded-xl border border-white/8 bg-white/5 flex items-center justify-between gap-3">
              <div className="min-w-0">
                <p className="text-[9px] font-bold uppercase tracking-widest text-[#8cea5a]">Prochain Match</p>
                <p className="text-[11px] font-display font-semibold text-white truncate mt-0.5">NFC vs NGAOUNDÉRÉ UNIV FC</p>
                <p className="text-[10px] text-white/40 font-mono">Dim. 04 Oct • 15h30</p>
              </div>
              <Link
                href="/calendrier"
                onClick={handleClose}
                className="shrink-0 bg-[#8cea5a] text-[#0c130e] text-[9px] font-display font-extrabold uppercase px-3 py-1.5 rounded-lg"
              >
                Billet
              </Link>
            </div>

            {/* ── SIDEBAR FOOTER CTAs ─────────────────────────── */}
            <div className="px-3 pb-5 space-y-2 border-t border-white/8 pt-3">
              <Link
                href="/membre"
                onClick={handleClose}
                className="flex items-center justify-center gap-2 w-full py-3 rounded-xl bg-[#008751] text-white font-display text-xs font-bold uppercase tracking-wide hover:bg-[#008751]/90 transition-colors"
              >
                <User className="w-4 h-4" />
                ESPACE SUPPORTER
              </Link>
              <Link
                href="/calendrier"
                onClick={handleClose}
                className="flex items-center justify-center gap-2 w-full py-2.5 rounded-xl bg-[#8cea5a] text-[#0c130e] font-display text-xs font-bold uppercase tracking-wide hover:opacity-90 transition-opacity"
              >
                <Ticket className="w-4 h-4" />
                BILLETTERIE
              </Link>
              <p className="text-center text-[9px] text-white/25 font-mono pt-1">© 2026 Ngaoundéré FC</p>
            </div>
          </aside>
        </div>
      )}
    </header>
  );
};