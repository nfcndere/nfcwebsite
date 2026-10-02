'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { Shield, Play, Trophy, Mail, Send, CheckCircle2, Star, X, MessageCircle, Handshake, Building2 } from 'lucide-react';
import NewsGrid from '@/components/sections/NewsGrid';
import Partners from '@/components/sections/Partners';
import NextMatchBanner from '@/components/sections/NextMatchBanner';
import VideoPlayer from '@/components/ui/VideoPlayer';
import StatsBar from '@/components/sections/StatsBar';
import { SectionTag } from '@/components/ui/SectionTag';
import { NEWS_DATA, MATCHES_DATA, STANDINGS_DATA } from '@/lib/mock-data';

// Numéro WhatsApp partenariat
const WHATSAPP_PARTENAIRE = '691616959';

const NFC_TV_VIDEO = {
  videoUrl: 'https://res.cloudinary.com/u9588m3i/video/upload/v1790743140/video5895481472965419044.mp4', // À remplacer par l'URL réelle
  thumbnailUrl: 'https://res.cloudinary.com/u9588m3i/image/upload/v1790743348/galerie_baneer_2.jpg',
  title: 'ENTRAINEMENT : La prise de temperature pour la nouvelle saison',
  badge: 'GRAND FORMAT',
  context: "Immersion session d'entraînement",
};

export default function HomePage() {
  const [email, setEmail] = useState('');
  const [newsletterSent, setNewsletterSent] = useState(false);
  const [newsletterLoading, setNewsletterLoading] = useState(false);
  const [isPartenaireModalOpen, setIsPartenaireModalOpen] = useState(false);

  // Classement API state
  const [nfcStanding, setNfcStanding] = useState({
    position: 1,
    rank: 1,
    points: 31,
    played: 13,
    won: 10,
    drawn: 1,
    lost: 2,
    goalsFor: 34,
    goalsAgainst: 12,
    goalDifference: 22,
    form: 'V-V-N-V-V',
    teamName: 'Ngaoundéré FC',
  });

  useEffect(() => {
    async function loadStandings() {
      try {
        const res = await fetch('/api/standings');
        if (res.ok) {
          const json = await res.json();
          if (json.nfc) {
            setNfcStanding(json.nfc);
          }
        }
      } catch (err) {
        console.warn('API standings fallback home page');
      }
    }
    loadStandings();
  }, []);

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
      await fetch('/api/newsletter', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email }),
      });
    } catch {}
    setNewsletterSent(true);
    setEmail('');
    setNewsletterLoading(false);
    setTimeout(() => setNewsletterSent(false), 5000);
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
    window.open(`https://wa.me/${WHATSAPP_PARTENAIRE}?text=${message}`, '_blank');
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
              Un lancement de saison en feu pour conquerir le championat regional cette annee et viser l elite two camerounaise. Le Ngaoundéré Football Club, l'Étoile de l'Adamaoua, est prêt à briller sur le terrain et à captiver ses supporters avec des performances inoubliables.
            </p>

            {/* Buttons */}
            <div className="flex flex-wrap items-center gap-4 pt-4">
              <Link href="/actualites" className="btn-yellow flex items-center gap-2">
                <Play className="w-4 h-4 fill-current" />
                VOIR LE RÉSUMÉ VIDÉO
              </Link>
              <Link href="/actualites" className="btn-dark">
                LIRE LE COMPTE-RENDU
              </Link>
            </div>

          </div>
        </div>
      </section>

      <div className="relative z-30 -mt-8 sm:-mt-12">
        <NextMatchBanner />
      </div>

      {/* 3. ACTUALITÉS OFFICIELLES SECTION */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <SectionTag label="Dernières actualités" className="mb-8" />
        <NewsGrid />
      </section>

      {/* 5. CLASSEMENT & DYNAMIQUE SECTION */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <SectionTag label="Classement & dynamique" className="mb-8" />
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          
          {(() => {
            const nfcRank = nfcStanding.rank || nfcStanding.position || 1;
            const nfcForm = nfcStanding.form || 'V-V-N-V-V';
            const rows = [1, 2, 3, 4, 5];

            return (
              <>
                {/* Big Rank Highlight Card */}
                <div className="lg:col-span-4 bg-[color:var(--nfc-white)] rounded-2xl border border-gray-100 p-7 shadow-sm flex flex-col justify-between transition-shadow duration-300 hover:shadow-md">
                  <div>
                    <span className="text-xs font-bold text-gray-500 uppercase font-display block">COMPÉTITION OFFICIELLE</span>
                    <h3 className="font-display text-2xl font-bold text-gray-900 uppercase mt-1">CLASSEMENT & DYNAMIQUE</h3>
                    <p className="text-xs text-gray-600 mt-2 leading-relaxed">
                      Saison 2025-2026 : Le NFC se classe au {nfcRank}er rang provisoire du championnat régional avec une dynamique de {nfcStanding.won} victoires en {nfcStanding.played} rencontres.
                    </p>
                  </div>

                  <div className="my-6 p-4 bg-[color:var(--nfc-bg)] rounded-xl border border-gray-200 flex items-center gap-6">
                    <div className="w-16 h-16 bg-[#008751] text-white font-display font-extrabold text-3xl rounded-xl flex items-center justify-center shadow-sm">
                      {nfcRank}
                    </div>
                    <div>
                      <span className="font-display font-bold text-xl text-gray-900 block">NGAOUNDÉRÉ FC</span>
                      <span className="text-xs text-gray-500">{nfcStanding.points} points • Diff: +{nfcStanding.goalDifference} ({nfcStanding.goalsFor}/{nfcStanding.goalsAgainst})</span>
                    </div>
                  </div>

                  <Link href="/classement" className="btn-dark text-xs text-center block w-full py-3">
                    VOIR LE CLASSEMENT INTÉGRAL &rarr;
                  </Link>
                </div>

                {/* Standings Extract Table */}
                <div className="lg:col-span-8 bg-white rounded-2xl border border-gray-100 p-7 shadow-sm transition-shadow duration-300 hover:shadow-md">
                  <div className="flex items-center justify-between mb-4 border-b border-gray-100 pb-3">
                    <span className="font-display text-sm font-bold text-gray-900 uppercase">EXTRAIT DU CLASSEMENT</span>
                    <div className="flex items-center gap-1.5 text-[11px] font-bold">
                      <span className="text-gray-500 uppercase">Forme :</span>
                      {nfcForm.split('-').map((state: string, index: number) => (
                        <span
                          key={`nfc-form-${index}`}
                          className={`flex h-4 w-4 items-center justify-center rounded-full text-[9px] text-white ${
                            state === 'V' ? 'bg-[#008751]' : state === 'N' ? 'bg-amber-500' : 'bg-rose-600'
                          }`}
                        >
                          {state}
                        </span>
                      ))}
                    </div>
                  </div>

                  <table className="w-full text-left text-xs">
                    <thead>
                      <tr className="border-b border-gray-200 text-gray-500 uppercase font-display font-bold">
                        <th className="py-2.5 px-2">#</th>
                        <th className="py-2.5 px-3">Équipe</th>
                        <th className="py-2.5 px-3 text-center">Joués</th>
                        <th className="py-2.5 px-3 text-center">Diff</th>
                        <th className="py-2.5 px-3 text-center font-extrabold text-gray-900">Pts</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-100">
                      {rows.map((pos) => {
                        const isNFC = pos === nfcRank;

                        if (isNFC) {
                          return (
                            <tr key={`home-rank-${pos}`} className="bg-[#008751]/10 font-bold border-l-4 border-[#008751]">
                              <td className="py-3 px-2 font-display font-bold text-sm text-[#008751]">{pos}</td>
                              <td className="py-3 px-3 flex items-center gap-2">
                                <div className="w-5 h-5 relative shrink-0">
                                  <Image
                                    src="/logo.png"
                                    alt="Ngaoundéré FC Logo"
                                    width={20}
                                    height={20}
                                    className="w-full h-full object-contain"
                                  />
                                </div>
                                <span className="text-[#008751] font-bold">{nfcStanding.teamName}</span>
                              </td>
                              <td className="py-3 px-3 text-center font-mono">{nfcStanding.played}</td>
                              <td className="py-3 px-3 text-center font-mono">+{nfcStanding.goalDifference}</td>
                              <td className="py-3 px-3 text-center font-display font-bold text-sm text-[#008751]">{nfcStanding.points}</td>
                            </tr>
                          );
                        }

                        return (
                          <tr key={`home-rank-${pos}`} className="bg-gray-50/40">
                            <td className="py-3 px-2 font-display text-sm text-gray-400">{pos}</td>
                            <td className="py-3 px-3">
                              <div className="h-3.5 w-32 bg-gray-200 rounded animate-pulse" />
                            </td>
                            <td className="py-3 px-3 text-center">
                              <div className="h-3.5 w-6 mx-auto bg-gray-200 rounded animate-pulse" />
                            </td>
                            <td className="py-3 px-3 text-center">
                              <div className="h-3.5 w-7 mx-auto bg-gray-200 rounded animate-pulse" />
                            </td>
                            <td className="py-3 px-3 text-center">
                              <div className="h-4 w-6 mx-auto bg-gray-200 rounded animate-pulse" />
                            </td>
                          </tr>
                        );
                      })}
                    </tbody>
                  </table>
                </div>
              </>
            );
          })()}

        </div>
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

              {/* Stats row */}
              <div className="grid grid-cols-3 gap-4 pt-4 border-t border-emerald-600/60 max-w-md">
                <div>
                  <span className="font-display text-3xl font-extrabold text-[color:var(--nfc-yellow)] block">94%</span>
                  <span className="text-[10px] text-emerald-100 uppercase">Taux de réussite scolaire</span>
                </div>
                <div>
                  <span className="font-display text-3xl font-extrabold text-white block">+85</span>
                  <span className="text-[10px] text-emerald-100 uppercase">Joueurs devenus pros</span>
                </div>
                <div>
                  <span className="font-display text-3xl font-extrabold text-[color:var(--nfc-yellow)] block flex items-center">5 <Star className="w-5 h-5 fill-current inline ml-1 text-[color:var(--nfc-yellow)]" /></span>
                  <span className="text-[10px] text-emerald-100 uppercase">Label de qualité FECAFOOT</span>
                </div>
              </div>

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

      {/* Lecteur vidéo principal */}
      <section className="bg-[color:var(--nfc-dark)] text-[color:var(--nfc-white)] p-8 shadow-xl m-8 space-y-6">
        <div className="border-b border-gray-800 pb-4">
          <span className="text-xs font-bold text-gray-400 uppercase font-display block">PORTAIL VIDÉO OFFICIEL</span>
          <h2 className="font-display text-3xl font-extrabold uppercase">IMMERSION VESTIAIRE & VIDÉOS</h2>
        </div>

        <div className="gap-8 items-center">

          {/* Lecteur vidéo principal */}
          <div className="lg:col-span-7">
            <VideoPlayer
              videoUrl={NFC_TV_VIDEO.videoUrl}
              thumbnailUrl={NFC_TV_VIDEO.thumbnailUrl}
              title={NFC_TV_VIDEO.title}
              badge={NFC_TV_VIDEO.badge}
              context={NFC_TV_VIDEO.context}
            />
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
                  <span>Votre inscription à la newsletter a été enregistrée avec succès !</span>
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
                <span className="text-[10px] text-gray-400 uppercase font-semibold">Saison 2025-2026</span>
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
                onClick={() => setIsPartenaireModalOpen(true)}
                className="w-full bg-[#008751] hover:bg-[#006e42] text-white font-display font-extrabold text-xs px-6 py-3.5 rounded-xl uppercase tracking-wider transition-all duration-200 shadow-sm hover:shadow flex items-center justify-center gap-2"
              >
                <Handshake className="w-4 h-4" />
                <span>DEVENIR PARTENAIRE DU CLUB &rarr;</span>
              </button>
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
