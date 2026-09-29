'use client';

import React, { useState } from 'react';
import Image from 'next/image';
import { PageHeader } from '@/components/ui/PageHeader';
import { Shield, CheckCircle2, QrCode, CreditCard } from 'lucide-react';

export default function MembrePage() {
  const [activeTier, setActiveTier] = useState<'BRONZE' | 'ARGENT' | 'OR'>('OR');
  const [member, setMember] = useState({
    fullName: 'Ousmane Bello',
    memberId: 'NFC-2026-8842',
    city: 'Ngaoundéré',
    joinedDate: '2024',
  });

  const tierColors = {
    BRONZE: {
      badgeBg: 'bg-slate-700 text-white',
      label: 'MEMBRE BRONZE',
      price: '5 000 FCFA / an',
    },
    ARGENT: {
      badgeBg: 'bg-[#008751] text-white',
      label: 'MEMBRE ARGENT',
      price: '15 000 FCFA / an',
    },
    OR: {
      badgeBg: 'bg-[#008751] text-white',
      label: 'MEMBRE OR (SUPPORTER OFFICIEL)',
      price: '30 000 FCFA / an',
    },
  };

  return (
    <div className="bg-[color:var(--nfc-bg)] text-[color:var(--nfc-text)] font-sans space-y-12 pb-20">

      {/* PAGE HERO HEADER WITH BACKGROUND IMAGE */}
      <PageHeader
        tag="ESPACE SUPPORTER OFFICIEL"
        title="VOTRE CARTE DE"
        titleHighlight="MEMBRE NFC"
        description="Accédez à vos avantages exclusifs, réductions sur la billetterie, réductions boutique et votre carte de supporter numérique."
        backgroundImageUrl="https://images.unsplash.com/photo-1543326727-cf6c39e8f84c?q=80&w=1600&auto=format&fit=crop"
        
        badgeContent={
          <div className="bg-[color:var(--nfc-dark)]/90 backdrop-blur-md p-6 rounded-2xl border border-white/10 text-center w-full lg:w-72 shadow-xl">
            <div className="relative w-14 h-14 rounded-full overflow-hidden ring-2 ring-[color:var(--nfc-green)] shadow-md mx-auto mb-2">
              <Image src="/logo.png" alt="NFC Crest" fill className="object-contain" />
            </div>
            <p className="text-xs text-gray-400 mt-1">Carte Numérique Valide</p>
          </div>
        }
      />

      {/* MAIN CONTENT */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-10">

        {/* TIER SELECTION TABS */}
        <div className="flex flex-wrap items-center justify-center gap-3">
          {(['BRONZE', 'ARGENT', 'OR'] as const).map((tier) => (
            <button
              key={tier}
              onClick={() => setActiveTier(tier)}
              className={`px-5 py-2.5 rounded-xl font-display text-xs font-bold tracking-wider transition-all duration-200 ${
                activeTier === tier
                  ? 'bg-[#008751] text-white shadow-md'
                  : 'bg-white text-gray-600 border border-gray-200 hover:border-[#008751] hover:text-[#008751]'
              }`}
            >
              ADHÉSION {tier}
            </button>
          ))}
        </div>

        {/* CARD PREVIEW & ADVANTAGES GRID */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">

          {/* DIGITAL CARD PREVIEW */}
          <div className="lg:col-span-5 bg-[color:var(--nfc-dark)] text-[color:var(--nfc-white)] rounded-2xl p-7 border border-[color:var(--nfc-green)]/60 shadow-2xl space-y-6 relative overflow-hidden transition-all duration-300">
            {/* Background watermark logo */}
            <div className="absolute -right-10 -bottom-10 opacity-10 pointer-events-none w-60 h-60">
              <Image src="/logo.png" alt="Watermark" fill className="object-contain" />
            </div>

            {/* Card Header */}
            <div className="flex items-center justify-between border-b border-white/10 pb-4">
              <div className="flex items-center gap-3">
                <div className="relative w-10 h-10 rounded-full overflow-hidden ring-2 ring-[color:var(--nfc-green)] shrink-0">
                  <Image src="/logo.png" alt="NFC Logo" fill className="object-contain" />
                </div>
                <div>
                  <span className="font-display text-lg font-bold block leading-none text-white">NGAOUNDÉRÉ FC</span>
                  <span className="text-[9px] text-[color:var(--nfc-green)] font-bold tracking-widest uppercase block mt-0.5">CARTE SUPPORTER</span>
                </div>
              </div>
              <span className={`text-[9px] font-extrabold px-2.5 py-1 rounded-md uppercase font-display ${tierColors[activeTier].badgeBg}`}>
                {activeTier}
              </span>
            </div>

            {/* Card Info */}
            <div className="space-y-4">
              <div>
                <span className="text-[10px] text-gray-400 uppercase font-mono block">Titulaire de la Carte</span>
                <span className="font-display text-xl font-bold text-white uppercase tracking-wider">{member.fullName}</span>
              </div>

              <div className="grid grid-cols-2 gap-4 text-xs font-mono">
                <div>
                  <span className="text-[10px] text-gray-400 uppercase block">ID Supporter</span>
                  <span className="text-[#008751] font-bold">{member.memberId}</span>
                </div>
                <div>
                  <span className="text-[10px] text-gray-400 uppercase block">Adhérent Depuis</span>
                  <span className="text-white font-bold">{member.joinedDate}</span>
                </div>
              </div>
            </div>

            {/* QR Code section */}
            <div className="pt-4 border-t border-white/10 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="p-1.5 bg-white rounded-lg">
                  <QrCode className="w-8 h-8 text-[color:var(--nfc-dark)]" />
                </div>
                <span className="text-[10px] text-gray-400 leading-tight max-w-[140px]">
                  Scannez au guichet du Stade Municipal
                </span>
              </div>
              <span className="badge-category badge-green">STATUT • ACTIF</span>
            </div>
          </div>

          {/* ADVANTAGES LIST CARD */}
          <div className="lg:col-span-7 bg-white rounded-2xl p-8 border border-gray-100 shadow-sm space-y-6">
            <div className="flex items-center justify-between border-b border-gray-100 pb-4">
              <div>
                <span className="section-tag">PAKET SUPPORTER</span>
                <h3 className="font-display text-2xl font-bold text-gray-900 uppercase">
                  AVANTAGES — ADHÉSION {activeTier}
                </h3>
              </div>
              <span className="font-display text-lg font-extrabold text-[#008751]">
                {tierColors[activeTier].price}
              </span>
            </div>

            <div className="space-y-4 text-xs">
              <div className="flex items-start gap-3 p-4 bg-[#f7f8f7] rounded-xl border border-gray-200/60">
                <CheckCircle2 className="w-5 h-5 text-[#008751] shrink-0 mt-0.5" />
                <div>
                  <h4 className="font-display font-bold text-sm text-gray-900">PRIORITÉ BILLETTERIE 48H</h4>
                  <p className="text-gray-500 mt-0.5">Accès prioritaire aux réservations pour les derbys et les matchs à guichet fermé au Stade Municipal.</p>
                </div>
              </div>

              <div className="flex items-start gap-3 p-4 bg-[#f7f8f7] rounded-xl border border-gray-200/60">
                <CheckCircle2 className="w-5 h-5 text-[#008751] shrink-0 mt-0.5" />
                <div>
                  <h4 className="font-display font-bold text-sm text-gray-900">BOUTIQUE : RÉDUCTIONS EXCLUSIVES</h4>
                  <p className="text-gray-500 mt-0.5">Remise sur le maillot officiel et tous les produits dérivés du club.</p>
                </div>
              </div>

              <div className="flex items-start gap-3 p-4 bg-[#f7f8f7] rounded-xl border border-gray-200/60">
                <CheckCircle2 className="w-5 h-5 text-[#008751] shrink-0 mt-0.5" />
                <div>
                  <h4 className="font-display font-bold text-sm text-gray-900">INVITATION ENTRAÎNEMENTS PRIVÉS</h4>
                  <p className="text-gray-500 mt-0.5">Assistez aux sessions d'entraînement à huis clos et participez aux séances de dédicaces.</p>
                </div>
              </div>
            </div>

            <div className="pt-2 flex flex-col sm:flex-row gap-3">
              <button className="btn-green text-xs flex-1 py-3 justify-center">
                <CreditCard className="w-4 h-4" />
                RENOUVELER / S'ABONNER &rarr;
              </button>
              <button className="btn-dark text-xs flex-1 py-3 justify-center">
                CONTACTER LE SERVICE ADHÉSION
              </button>
            </div>
          </div>

        </div>

      </section>

    </div>
  );
}
