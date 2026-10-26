'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { Shield, Mail, Send, CheckCircle2, X, MessageCircle, Handshake, Building2 } from 'lucide-react';
import NewsGrid from '@/components/sections/NewsGrid';
import NextMatchBanner from '@/components/sections/NextMatchBanner';
import StatsBar from '@/components/sections/StatsBar';
import { SectionTag } from '@/components/ui/SectionTag';
import { useClubOverview } from '@/components/providers/ClubOverviewProvider';
import { getGoalDifferenceLabel, getOrdinalFr } from '@/lib/match-state';
import { DataState } from '@/components/ui/DataState';
import { getWhatsAppNumber } from '@/lib/public-links';

function HomeStandingsSkeleton() {
  return (
    <div className="grid grid-cols-1 gap-8 lg:grid-cols-12" aria-hidden="true">
      <div className="h-64 animate-pulse rounded-2xl bg-white lg:col-span-4" />
      <div className="rounded-2xl border border-gray-100 bg-white p-5 shadow-sm lg:col-span-8">
        <div className="mb-4 h-5 animate-pulse rounded bg-gray-100" />
        <table className="w-full">
          <tbody>
            {Array.from({ length: 8 }, (_, index) => (
              <tr key={index} className="border-b border-gray-100">
                {Array.from({ length: 5 }, (_, cell) => (
                  <td key={cell} className="py-3">
                    <span className="mx-auto block h-3 w-10 animate-pulse rounded bg-gray-100" />
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

export default function HomePage() {
  const overview = useClubOverview();
  const nfcStanding = overview.data?.nfc ?? null;
  const [email, setEmail] = useState('');
  const [newsletterSent, setNewsletterSent] = useState(false);
  const [newsletterMessage, setNewsletterMessage] = useState('');
  const [newsletterLoading, setNewsletterLoading] = useState(false);
  const [isPartenaireModalOpen, setIsPartenaireModalOpen] = useState(false);

  // Formulaire partenaire
  const [partenaireForm, setPartenaireForm] = useState({
    nomSociete: '',
    nomContact: '',
    telephone: '',
    email: '',
    typePartenariat: 'Partenariat Principal',
    message: '',
  });

  // Newsletter — sauvegarde en BD via API
  const handleNewsletter = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email) return;
    setNewsletterLoading(true);
    try {
      const response = await fetch('/api/newsletter', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email }),
      });
      const result = await response.json();
      if (!response.ok) throw new Error(result.message || 'Inscription impossible pour le moment.');
      setNewsletterSent(true);
      setNewsletterMessage(result.message || 'Votre inscription à la newsletter est prise en compte.');
      setEmail('');
      window.setTimeout(() => setNewsletterSent(false), 5000);
    } catch {
      window.alert('Impossible de vous inscrire à la newsletter. Veuillez réessayer.');
    } finally {
      setNewsletterLoading(false);
    }
  };

  // Soumission partenaire — redirige vers WhatsApp
  const handlePartenaireSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const message = encodeURIComponent(
      `Bonjour, je souhaite devenir partenaire du Ngaoundéré FC.\n\n` +
      `🏢 Société : ${partenaireForm.nomSociete}\n` +
      `👤 Contact : ${partenaireForm.nomContact}\n` +
      `📞 Téléphone : ${partenaireForm.telephone}\n` +
      `📧 Email : ${partenaireForm.email}\n` +
      `🤝 Type de partenariat : ${partenaireForm.typePartenariat}\n\n` +
      `📝 Message : ${partenaireForm.message || 'Pas de message supplémentaire.'}`
    );
    const whatsapp = getWhatsAppNumber(overview.data?.settings.whatsappPartenaire || process.env.NEXT_PUBLIC_WHATSAPP_PARTENAIRE);
    if (!whatsapp) return;
    window.open(`https://wa.me/${whatsapp}?text=${message}`, '_blank');
    setIsPartenaireModalOpen(false);
  };

  return (
    <div className="bg-[color:var(--nfc-bg)] text-[color:var(--nfc-text)] font-sans space-y-20 pb-20">
      
      {/* 1. HERO SECTION (Dark Stadium Banner) */}
      <section className="relative bg-[color:var(--nfc-dark)] text-white min-h-[70vh] flex items-center overflow-hidden">
        {/* Background Image with Gradient Overlay */}
        <div className="absolute inset-0 z-0">
          <img
            src="/cover man pic.jpg"
            alt="Stade Municipal de Ngaoundéré"
            className="w-full h-full object-cover opacity-35"
          />
          <div className="absolute inset-0 bg-gradient-to-r from-[color:var(--nfc-dark)] via-[color:var(--nfc-dark)]/80 to-transparent" />
        </div>

        <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 w-full">
          <div className="max-w-3xl space-y-5">
            
            {/* Tag */}
            <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-lg bg-[color:var(--nfc-yellow)] text-[color:var(--nfc-dark)] text-xs font-bold font-display uppercase animate-fade-in-up">
              <span className="w-1.5 h-1.5 rounded-full bg-[color:var(--nfc-dark)] inline-block" />
              <span>ÉQUIPE PRO • LIGUE RÉGIONALE DE L'ADAMAOUA</span>
            </div>

            {/* Main Title */}
            <h1 className="font-display text-4xl sm:text-6xl font-extrabold text-white leading-none tracking-tight">
              LA FERVEUR VERTE ET BLANCHE <br />
              <span className="text-[color:var(--nfc-yellow)]">DÉFERLE SUR NGAOUNDÉRÉ</span>
            </h1>

            {/* Subtitle */}
            <p className="text-gray-300 text-sm sm:text-base leading-relaxed font-normal max-w-2xl">
              Un lancement de saison en feu pour conquérir le championnat régional cette année et viser l'Élite 2 camerounaise.
            </p>

            {/* Buttons */}
            <div className="flex flex-wrap items-center gap-4 pt-4">
              <Link href="/actualites" className="btn-dark">
                LIRE LES ACTUALITÉS
              </Link>
            </div>

          </div>
        </div>
      </section>

      <div className="relative z-30 -mt-8 sm:-mt-12">
        <NextMatchBanner />
      </div>
      <StatsBar />

      {/* 3. ACTUALITÉS OFFICIELLES SECTION */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <SectionTag label="Dernières actualités" className="mb-8" />
        <NewsGrid />
      </section>

      {/* 5. CLASSEMENT & DYNAMIQUE SECTION */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <SectionTag label="Classement & dynamique" className="mb-8" />
        <DataState
          status={overview.status}
          error={overview.error}
          onRetry={overview.retry}
          updatedAt={overview.updatedAt}
          emptyMessage="Le classement n'est pas encore disponible."
          skeleton={<HomeStandingsSkeleton />}
        >
          {nfcStanding ? (
            <div className="grid grid-cols-1 gap-8 lg:grid-cols-12">
                <div className="flex flex-col justify-between rounded-2xl border border-gray-100 bg-white p-7 shadow-sm lg:col-span-4">
                  <div>
                    <span className="block text-xs font-bold uppercase text-gray-500">COMPÉTITION OFFICIELLE</span>
                    <h3 className="mt-1 font-display text-2xl font-bold uppercase text-gray-900">CLASSEMENT & DYNAMIQUE</h3>
                    <p className="mt-2 text-xs leading-relaxed text-gray-600">
                      {overview.data?.season?.label ? `Saison ${overview.data.season.label} : ` : ''}
                      Le NFC est au {getOrdinalFr(nfcStanding.rank)} rang avec {nfcStanding.won} victoires en {nfcStanding.played} rencontres.
                    </p>
                  </div>
                  <div className="my-6 flex items-center gap-6 rounded-xl border border-gray-200 bg-[color:var(--nfc-bg)] p-4">
                    <div className="flex h-16 w-16 items-center justify-center rounded-xl bg-[#008751] font-display text-3xl font-extrabold text-white">{nfcStanding.rank}</div>
                    <div>
                      <span className="block font-display text-xl font-bold text-gray-900">{nfcStanding.teamName}</span>
                      <span className="text-xs text-gray-500">{nfcStanding.points} points · Diff. {getGoalDifferenceLabel(nfcStanding.goalDifference)}</span>
                    </div>
                  </div>
                  <Link href="/classement" className="btn-dark block w-full py-3 text-center text-xs">VOIR LE CLASSEMENT INTÉGRAL →</Link>
                </div>
              <div className="rounded-2xl border border-gray-100 bg-white p-5 shadow-sm lg:col-span-8">
                <h3 className="mb-4 border-b border-gray-100 pb-3 font-display text-sm font-bold uppercase text-gray-900">CLASSEMENT OFFICIEL</h3>
                <div className="overflow-x-auto">
                  <table className="w-full text-left text-xs">
                    <thead><tr className="border-b border-gray-200 text-gray-500"><th className="py-2">#</th><th>Équipe</th><th className="text-center">J</th><th className="text-center">Diff.</th><th className="text-center">Pts</th></tr></thead>
                    <tbody className="divide-y divide-gray-100">
                      <tr className="bg-[#008751]/10 font-bold text-[#008751]">
                        <td className="py-3">{nfcStanding.rank}</td><td>{nfcStanding.teamName}</td><td className="text-center">{nfcStanding.played}</td>
                        <td className="text-center">{getGoalDifferenceLabel(nfcStanding.goalDifference)}</td><td className="text-center">{nfcStanding.points}</td>
                      </tr>
                      {Array.from({ length: 7 }, (_, index) => (
                        <tr key={`placeholder-${index}`} aria-hidden="true" className="text-gray-300">
                          <td className="py-3"><span className="block h-3 w-5 rounded bg-gray-100" /></td>
                          <td><span className="block h-3 w-28 rounded bg-gray-100" /></td>
                          <td className="text-center"><span className="mx-auto block h-3 w-5 rounded bg-gray-100" /></td>
                          <td className="text-center"><span className="mx-auto block h-3 w-7 rounded bg-gray-100" /></td>
                          <td className="text-center"><span className="mx-auto block h-3 w-7 rounded bg-gray-100" /></td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          ) : (
            <p role="status" className="rounded-xl bg-white p-6 text-center text-sm text-gray-600">Les statistiques du NFC pour cette saison seront publiées prochainement.</p>
          )}
        </DataState>
      </section>

      {/* 6. CENTRE DE FORMATION & ACADÉMIE GREEN BANNER */}
      <section className="max-w-9xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-[color:var(--nfc-green)] text-white p-8 sm:p-12 shadow-lg relative overflow-hidden">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
            
            <div className="lg:col-span-7 space-y-5">
              <span className="bg-[color:var(--nfc-yellow)] text-[color:var(--nfc-dark)] text-[10px] font-extrabold px-2.5 py-1 rounded uppercase font-display inline-block">
                CENTRE DE FORMATION & ACADÉMIE
              </span>
              <h2 className="font-display text-3xl sm:text-5xl font-extrabold leading-tight">
                LE JEU, LA FORMATION, LA PASSION
              </h2>
              <p className="text-[color:var(--nfc-white)] text-xs sm:text-sm leading-relaxed max-w-xl">
                Notre académie allie excellence sportive et cursus éducatif rigoureux. Nous préparons les jeunes pépites de la région de l'Adamaoua et du Cameroun au football professionnel.
              </p>

              <div className="flex flex-wrap gap-3 pt-4">
                <Link href="/academie" className="btn-yellow">
                  DÉCOUVRIR LES DÉTECTIONS
                </Link>
                <Link href="/academie" className="btn-dark bg-[color:var(--nfc-dark)] text-[color:var(--nfc-white)]">
                  PROJET PÉDAGOGIQUE
                </Link>
              </div>
            </div>

            {/* Right Photo */}
            <div className="lg:col-span-5 relative">
              <div className="rounded-2xl overflow-hidden shadow-2xl border-4 border-white/20">
                <img
                  src="/accademie1.jpg"
                  alt="Académie NFC"
                  className="w-full h-100 object-cover"
                />
              </div>
            </div>

          </div>
        </div>
      </section>

      {/* 7. NEWSLETTER & PARTENAIRES */}
      <section className="max-w-7xl mx-auto px-3 sm:px-6 lg:px-8">
        <SectionTag label="Communauté & Partenariats" className="mb-6" />

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 sm:gap-8 items-stretch">
          
          {/* Card 1: Newsletter */}
          <div className="rounded-2xl bg-gradient-to-br from-[#0c130e] via-[#152e1f] to-[#008751] p-6 sm:p-8 text-white relative overflow-hidden shadow-sm hover:shadow-md transition-all duration-300 flex flex-col justify-between border border-emerald-900/40 min-h-[340px]">
            {/* Background Decorative Glow */}
            <div className="absolute -top-12 -right-12 w-48 h-48 bg-[#008751]/20 rounded-full blur-3xl pointer-events-none" />

            <div>
              <div className="flex items-center justify-between mb-4">
                <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#008751]/30 text-[color:var(--nfc-yellow)] text-[10px] font-bold uppercase tracking-wider border border-[#008751]/40">
                  <Mail className="w-3.5 h-3.5" /> Newsletter Officielle
                </span>
                <span className="text-[10px] text-emerald-200/70 uppercase font-semibold">Gracieux & Hebdomadaire</span>
              </div>

              <h3 className="font-display text-xl sm:text-2xl font-extrabold uppercase leading-tight text-white mt-2">
                RESTEZ AU CŒUR DE L'ACTION
              </h3>
              <p className="text-xs text-gray-200 mt-2 leading-relaxed max-w-lg font-normal">
                Recevez en avant-première les résumés des matchs, les dates des détections de l'académie et les actualités exclusives du Ngaoundéré FC.
              </p>
            </div>

            <div className="mt-6">
              {newsletterSent ? (
                <div className="inline-flex items-center gap-2 bg-[#0c130e]/90 text-[color:var(--nfc-yellow)] border border-emerald-500/30 px-4 py-3 text-xs font-bold rounded-xl w-full">
                  <CheckCircle2 className="w-4 h-4 text-[color:var(--nfc-yellow)] shrink-0" />
                  <span>{newsletterMessage}</span>
                </div>
              ) : (
                <form onSubmit={handleNewsletter} className="flex flex-col sm:flex-row gap-2.5">
                  <input
                    type="email"
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="Entrez votre adresse email..."
                    className="flex-grow px-4 py-3 rounded-xl text-gray-900 text-xs font-medium border-0 outline-none bg-white/95 focus:bg-white focus:ring-2 focus:ring-[color:var(--nfc-yellow)] transition-all shadow-inner"
                  />
                  <button
                    type="submit"
                    disabled={newsletterLoading}
                    className="bg-[color:var(--nfc-yellow)] hover:bg-[#ebd234] text-[#0c130e] font-display font-extrabold text-xs px-6 py-3 rounded-xl uppercase tracking-wider transition-colors disabled:opacity-60 shrink-0 flex items-center justify-center gap-1.5 shadow-sm"
                  >
                    <span>{newsletterLoading ? 'ENVOI...' : "M'INSCRIRE"}</span>
                    <Send className="w-3.5 h-3.5" />
                  </button>
                </form>
              )}
            </div>
          </div>

          {/* Card 2: Devenir Partenaire */}
          <div className="rounded-2xl bg-white p-6 sm:p-8 border border-gray-100 shadow-sm hover:shadow-md transition-all duration-300 flex flex-col justify-between relative overflow-hidden min-h-[340px]">
            <div>
              <div className="flex items-center justify-between mb-4">
                <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#008751]/10 text-[#008751] text-[10px] font-bold uppercase tracking-wider border border-[#008751]/20">
                  <Handshake className="w-3.5 h-3.5" /> Partenariats & Sponsoring
                </span>
                <span className="text-[10px] text-gray-400 uppercase font-semibold">{overview.data?.season?.label ?? 'Saison non communiquée'}</span>
              </div>

              <h3 className="font-display text-xl sm:text-2xl font-extrabold uppercase leading-tight text-gray-900 mt-2">
                ASSOCIEZ VOTRE IMAGE AU NFC
              </h3>
              <p className="text-xs text-gray-600 mt-2 leading-relaxed">
                Devenez partenaire officiel du Ngaoundéré FC et bénéficiez d'une visibilité stratégique maximale lors de nos matchs à domicile et événements.
              </p>

              {/* Bullet perks */}
              <div className="grid grid-cols-3 gap-2 mt-5 pt-4 border-t border-gray-100 text-center">
                <div className="bg-gray-50 p-2.5 rounded-xl border border-gray-100">
                  <span className="text-xs font-bold text-gray-900 block">Stade</span>
                  <span className="text-[10px] text-gray-500">Panneaux bord terrain</span>
                </div>
                <div className="bg-gray-50 p-2.5 rounded-xl border border-gray-100">
                  <span className="text-xs font-bold text-gray-900 block">Digital</span>
                  <span className="text-[10px] text-gray-500">Réseaux & Site web</span>
                </div>
                <div className="bg-gray-50 p-2.5 rounded-xl border border-gray-100">
                  <span className="text-xs font-bold text-gray-900 block">Maillots</span>
                  <span className="text-[10px] text-gray-500">Sponsoring officiel</span>
                </div>
              </div>
            </div>

            <div className="mt-6 pt-2">
              <button
                disabled={!getWhatsAppNumber(overview.data?.settings.whatsappPartenaire || process.env.NEXT_PUBLIC_WHATSAPP_PARTENAIRE)}
                onClick={() => setIsPartenaireModalOpen(true)}
                className="w-full bg-[#008751] hover:bg-[#006e42] disabled:cursor-not-allowed disabled:opacity-50 text-white font-display font-extrabold text-xs px-6 py-3.5 rounded-xl uppercase tracking-wider transition-all duration-200 shadow-sm hover:shadow flex items-center justify-center gap-2"
              >
                <Handshake className="w-4 h-4" />
                <span>DEVENIR PARTENAIRE DU CLUB &rarr;</span>
              </button>
              {!getWhatsAppNumber(overview.data?.settings.whatsappPartenaire || process.env.NEXT_PUBLIC_WHATSAPP_PARTENAIRE) && (
                <p className="mt-2 text-center text-xs text-white/80">Les coordonnées du service partenariats seront publiées prochainement.</p>
              )}
            </div>
          </div>

        </div>
      </section>

      {/* ===== MODAL PARTENAIRE ===== */}
      {isPartenaireModalOpen && (
        <div
          className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4 animate-fade-in"
          onClick={() => setIsPartenaireModalOpen(false)}
        >
          <div
            className="bg-white max-w-lg w-full p-7 shadow-2xl animate-fade-in-up space-y-5"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center justify-between border-b border-gray-100 pb-3">
              <div>
                <span className="section-tag">PARTENARIAT NFC</span>
                <h3 className="font-display font-bold text-gray-900 text-base">DEVENEZ PARTENAIRE OFFICIEL</h3>
              </div>
              <button onClick={() => setIsPartenaireModalOpen(false)} className="p-1 hover:bg-gray-100 text-gray-500">
                <X className="w-5 h-5" />
              </button>
            </div>

            <p className="text-xs text-gray-500 leading-relaxed">
              Remplissez ce formulaire et notre responsable partenariats vous contactera via WhatsApp pour discuter des modalités de collaboration.
            </p>

            <form onSubmit={handlePartenaireSubmit} className="space-y-3">
              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-1">
                  <label className="text-xs font-bold text-gray-700 uppercase font-display">Société *</label>
                  <input type="text" required placeholder="Nom de votre entreprise" className="form-input" value={partenaireForm.nomSociete} onChange={(e) => setPartenaireForm(p => ({...p, nomSociete: e.target.value}))} />
                </div>
                <div className="space-y-1">
                  <label className="text-xs font-bold text-gray-700 uppercase font-display">Votre Nom *</label>
                  <input type="text" required placeholder="Nom complet" className="form-input" value={partenaireForm.nomContact} onChange={(e) => setPartenaireForm(p => ({...p, nomContact: e.target.value}))} />
                </div>
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-1">
                  <label className="text-xs font-bold text-gray-700 uppercase font-display">Téléphone *</label>
                  <input type="tel" required placeholder="+237 6..." className="form-input" value={partenaireForm.telephone} onChange={(e) => setPartenaireForm(p => ({...p, telephone: e.target.value}))} />
                </div>
                <div className="space-y-1">
                  <label className="text-xs font-bold text-gray-700 uppercase font-display">Email</label>
                  <input type="email" placeholder="votre@email.com" className="form-input" value={partenaireForm.email} onChange={(e) => setPartenaireForm(p => ({...p, email: e.target.value}))} />
                </div>
              </div>
              <div className="space-y-1">
                <label className="text-xs font-bold text-gray-700 uppercase font-display">Type de Partenariat *</label>
                <select className="form-input" value={partenaireForm.typePartenariat} onChange={(e) => setPartenaireForm(p => ({...p, typePartenariat: e.target.value}))}>
                  <option>Partenariat Principal</option>
                  <option>Sponsor Maillot</option>
                  <option>Partenaire Institutionnel</option>
                  <option>Partenaire Médias</option>
                  <option>Partenaire Local</option>
                </select>
              </div>
              <div className="space-y-1">
                <label className="text-xs font-bold text-gray-700 uppercase font-display">Message</label>
                <textarea rows={3} placeholder="Décrivez brièvement votre projet de partenariat..." className="form-input resize-none" value={partenaireForm.message} onChange={(e) => setPartenaireForm(p => ({...p, message: e.target.value}))} />
              </div>
              <button type="submit" className="btn-green w-full py-3 text-xs justify-center flex items-center gap-2 font-bold">
                <MessageCircle className="w-4 h-4" />
                CONTINUER SUR WHATSAPP &rarr;
              </button>
              <p className="text-center text-[10px] text-gray-400">Vous serez redirigé sur WhatsApp avec votre message prérempli.</p>
            </form>
          </div>
        </div>
      )}

    </div>
  );
}
