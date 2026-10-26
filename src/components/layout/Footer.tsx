'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { ArrowUpRight, CheckCircle2, Facebook, Mail } from 'lucide-react';
import { useClubOverview } from '@/components/providers/ClubOverviewProvider';
import { getSafeExternalUrl } from '@/lib/public-links';

export default function Footer() {
  const { data } = useClubOverview();
  const [newsletterEmail, setNewsletterEmail] = useState('');
  const [newsletterState, setNewsletterState] = useState<'idle' | 'loading' | 'success' | 'error'>('idle');
  const [newsletterMessage, setNewsletterMessage] = useState('');
  const facebookUrl = getSafeExternalUrl(data?.settings.facebookUrl || process.env.NEXT_PUBLIC_FACEBOOK_URL);

  const handleNewsletterSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (!newsletterEmail.trim()) return;
    setNewsletterState('loading');
    setNewsletterMessage('');
    try {
      const response = await fetch('/api/newsletter', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: newsletterEmail }),
      });
      const result = await response.json();
      if (!response.ok) throw new Error(result.message || result.error || 'Inscription impossible.');
      setNewsletterState('success');
      setNewsletterMessage(result.message || 'Inscription enregistrée.');
      setNewsletterEmail('');
    } catch (error) {
      setNewsletterState('error');
      setNewsletterMessage(error instanceof Error ? error.message : 'Impossible de contacter le service newsletter.');
    }
  };

  const footerLinks = {
    club: [
      { label: 'Présentation', href: '/le-club' },
      { label: 'Effectif', href: '/effectif' },
      { label: 'Académie', href: '/academie' },
    ],
    competitions: [
      { label: 'Calendrier', href: '/calendrier' },
      { label: 'Classement', href: '/classement' },
    ],
    media: [
      { label: 'Actualités', href: '/actualites' },
      { label: 'Photos & vidéos', href: '/galerie' },
      { label: 'Newsletter', href: '#newsletter' },
    ],
    support: [
      { label: 'Billetterie', href: '/calendrier' },
      { label: 'Devenir partenaire', href: '/partenaires' },
      { label: 'Espace supporter', href: '/membre' },
    ],
  };

  return (
    <footer className="bg-[color:var(--nfc-green)] text-[color:var(--nfc-white)]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-14 lg:py-20">
        {/* Zone 1: Top brand + newsletter + social */}
        <div className="grid grid-cols-1 gap-12 pb-16 border-b border-white/15 lg:grid-cols-12">
          <div className="lg:col-span-4">
            <div className="flex items-center gap-4 sm:items-center">
              <div className="relative w-20 h-20 shrink-0">
                <Image src="/logo.png" alt="Logo du Ngaoundéré FC" fill className="object-contain" />
              </div>

              <div>
                <span className="block font-display text-2xl font-extrabold uppercase tracking-wider text-[color:var(--nfc-white)]">
                  NGAOUNDÉRÉ <span className="text-[color:var(--nfc-yellow)]">FC</span>
                </span>
                <span className="mt-1 block text-[10px] font-display font-bold uppercase tracking-[0.22em] text-[color:var(--nfc-yellow)]">
                  L'ÉTOILE DE L'ADAMAOUA
                </span>
              </div>
            </div>

            <p className="mt-5 max-w-xs text-base italic text-[color:var(--nfc-green-light)]">
              L'Étoile de l'Adamaoua
            </p>
            <p className="mt-2 max-w-xs text-xs text-[color:var(--nfc-green-light)]/80">
              Passion, fierté et formation au cœur du football camerounais.
            </p>
          </div>

          <div className="lg:col-span-5" id="newsletter">
            <div className="text-[11px] font-display font-bold uppercase tracking-[0.25em] text-[color:var(--nfc-yellow)]">
              Newsletter
            </div>
            <h3 className="mt-3 max-w-md font-display text-xl font-extrabold leading-tight text-[color:var(--nfc-white)] sm:text-2xl">
              Recevez toute l'actualité du club en avant-première
            </h3>
            <p className="mt-2 max-w-md text-xs text-[color:var(--nfc-green-light)]">
              Inscrivez-vous gratuitement pour recevoir les compos, les résultats et les offres exclusives.
            </p>

            <form onSubmit={handleNewsletterSubmit} className="mt-5 flex flex-col gap-2 sm:flex-row">
              <label htmlFor="newsletter-email" className="sr-only">
                Adresse email pour la newsletter
              </label>
              <div className="relative flex-grow">
                <Mail className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-[color:var(--nfc-green-light)]" />
                <input
                  id="newsletter-email"
                  type="email"
                  aria-label="Adresse email pour la newsletter"
                  placeholder="Votre adresse email..."
                  value={newsletterEmail}
                  onChange={(event) => setNewsletterEmail(event.target.value)}
                  className="w-full rounded-lg border border-white/20 bg-white/10 px-10 py-3 text-sm text-[color:var(--nfc-white)] placeholder:text-white/50 focus:border-[color:var(--nfc-yellow)] focus:outline-none"
                />
              </div>

              <button
                type="submit"
                disabled={newsletterState === 'loading'}
                className="whitespace-nowrap rounded-lg bg-[color:var(--nfc-yellow)] px-6 py-3 text-xs font-display font-extrabold uppercase tracking-[0.18em] text-[color:var(--nfc-dark)] transition-all duration-200 hover:scale-[1.02] hover:bg-[color:var(--nfc-yellow-hover)]"
              >
                {newsletterState === 'loading' ? 'Envoi…' : "S'abonner"}
              </button>
            </form>

            <div className="mt-3 flex items-center gap-2 text-[10px] text-[color:var(--nfc-green-light)]/90">
              <input id="consent-newsletter" type="checkbox" className="h-3.5 w-3.5 accent-[color:var(--nfc-yellow)]" readOnly checked />
              <label htmlFor="consent-newsletter">
                J'accepte de recevoir les emails du NFC. Désinscription possible à tout moment.
              </label>
            </div>

            {newsletterMessage && (
              <div role={newsletterState === 'error' ? 'alert' : 'status'} aria-live="polite" className="mt-4 inline-flex items-center gap-2 rounded-md border border-[color:var(--nfc-yellow)]/30 bg-[color:var(--nfc-yellow)]/10 px-3 py-2 text-[11px] font-medium text-[color:var(--nfc-yellow)]">
                {newsletterState !== 'error' && <CheckCircle2 className="h-4 w-4" />}
                {newsletterMessage}
              </div>
            )}
          </div>

          {facebookUrl && <div className="lg:col-span-3">
            <div className="text-[11px] font-display font-bold uppercase tracking-[0.25em] text-[color:var(--nfc-yellow)]">
              Suivez-nous
            </div>

            <a
              href={facebookUrl}
              target="_blank"
              rel="noopener noreferrer"
              aria-label="Suivez le NFC sur Facebook"
              className="group mt-4 inline-flex w-full items-center gap-3 rounded-lg border border-white/20 bg-white/10 px-4 py-3 transition-all duration-200 hover:bg-white/20 sm:w-auto"
            >
              <Facebook className="h-5 w-5 text-[color:var(--nfc-white)]" />
              <span className="font-display text-sm font-bold text-[color:var(--nfc-white)]">Facebook</span>
              <ArrowUpRight className="ml-auto h-4 w-4 text-[color:var(--nfc-yellow)] transition-transform duration-200 group-hover:-translate-y-0.5 group-hover:translate-x-0.5" />
            </a>

            {/* TODO: Ajouter d'autres réseaux plus tard (Instagram, X, YouTube, TikTok) */}
          </div>}
        </div>

        {/* Zone 2: Middle link columns */}
        <div className="grid grid-cols-2 gap-10 py-16 md:grid-cols-4">
          <div>
            <h4 className="mb-5 text-[11px] font-display font-bold uppercase tracking-[0.25em] text-[color:var(--nfc-yellow)]">
              Le club
            </h4>
            <ul className="space-y-3 text-sm text-[color:var(--nfc-white)]">
              {footerLinks.club.map((link) => (
                <li key={link.label}>
                  <Link href={link.href} className="transition-colors duration-200 hover:text-[color:var(--nfc-yellow)]">
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h4 className="mb-5 text-[11px] font-display font-bold uppercase tracking-[0.25em] text-[color:var(--nfc-yellow)]">
              Compétitions
            </h4>
            <ul className="space-y-3 text-sm text-[color:var(--nfc-white)]">
              {footerLinks.competitions.map((link) => (
                <li key={link.label}>
                  <Link href={link.href} className="transition-colors duration-200 hover:text-[color:var(--nfc-yellow)]">
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h4 className="mb-5 text-[11px] font-display font-bold uppercase tracking-[0.25em] text-[color:var(--nfc-yellow)]">
              Médias
            </h4>
            <ul className="space-y-3 text-sm text-[color:var(--nfc-white)]">
              {footerLinks.media.map((link) => (
                <li key={link.label}>
                  <Link href={link.href} className="transition-colors duration-200 hover:text-[color:var(--nfc-yellow)]">
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h4 className="mb-5 text-[11px] font-display font-bold uppercase tracking-[0.25em] text-[color:var(--nfc-yellow)]">
              Support
            </h4>
            <ul className="space-y-3 text-sm text-[color:var(--nfc-white)]">
              {footerLinks.support.map((link) => (
                <li key={link.label}>
                  <Link href={link.href} className="transition-colors duration-200 hover:text-[color:var(--nfc-yellow)]">
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* Zone 3: Bottom legal + copyright */}
        <div className="flex flex-col gap-4 border-t border-white/15 pt-8 md:flex-row md:items-center md:justify-between">
          <div className="flex flex-wrap gap-x-6 gap-y-2 text-[11px] text-[color:var(--nfc-green-light)]">
            <Link href="/mentions-legales" className="transition-colors duration-200 hover:text-[color:var(--nfc-yellow)]">
              Mentions légales
            </Link>
          </div>

          <div className="text-center text-[11px] text-[color:var(--nfc-green-light)]/70 md:text-right">
            <div>© {new Date().getFullYear()} NGAOUNDÉRÉ FOOTBALL CLUB.</div>
            <div className="mt-1">Site conçu et développé avec ❤️ à Ngaoundéré</div>
          </div>
        </div>
      </div>
    </footer>
  );
}
