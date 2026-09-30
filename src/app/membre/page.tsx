'use client';

import React, { useState } from 'react';
import Image from 'next/image';
import { PageHeader } from '@/components/ui/PageHeader';
import { SectionTag } from '@/components/ui/SectionTag';
import { Shield, QrCode, CreditCard, Star, Zap, Crown, Lock, AlertCircle } from 'lucide-react';

// ===================================
// Configuration des niveaux d'adhésion
// ===================================
const TIERS = {
  BRONZE: {
    label: 'MEMBRE BRONZE',
    price: '4 999 FCFA / an',
    icon: Shield,
    // Couleur bronze
    iconColor: 'text-amber-700',
    iconBg: 'bg-amber-700/10',
    cardBorder: 'border-amber-700/40',
    badgeBg: 'bg-amber-700 text-white',
    accentColor: '#92400e',
    privileges: [
      { title: 'CARTE NUMÉRIQUE', desc: 'Votre carte de supporter officielle NFC à présenter au stade.' },
      { title: 'NEWSLETTER EXCLUSIVE', desc: 'Informations en avant-première avant la publication officielle.' },
      { title: 'RÉDUCTION BOUTIQUE 5%', desc: 'Remise sur les produits dérivés du club en boutique.' },
    ],
  },
  ARGENT: {
    label: 'MEMBRE ARGENT',
    price: '19 999 FCFA / an',
    icon: Shield,
    // Couleur argent
    iconColor: 'text-slate-400',
    iconBg: 'bg-slate-400/10',
    cardBorder: 'border-slate-400/40',
    badgeBg: 'bg-slate-500 text-white',
    accentColor: '#94a3b8',
    privileges: [
      { title: 'PRIORITÉ BILLETTERIE 48H', desc: 'Accès prioritaire aux réservations pour les derbys et matchs à guichet fermé.' },
      { title: 'RÉDUCTION BOUTIQUE 10%', desc: 'Remise étendue sur le maillot officiel et tous les produits dérivés.' },
      { title: 'NEWSLETTER EXCLUSIVE', desc: 'Informations en avant-première et contenu exclusif membres Argent.' },
      { title: 'INVITATION ENTRAÎNEMENTS', desc: 'Assistez à une session d\'entraînement par saison.' },
    ],
  },
  OR: {
    label: 'MEMBRE OR',
    price: '49 999 FCFA / an',
    icon: Shield,
    // Couleur or
    iconColor: 'text-yellow-500',
    iconBg: 'bg-yellow-500/10',
    cardBorder: 'border-yellow-500/40',
    badgeBg: 'bg-yellow-500 text-black',
    accentColor: '#eab308',
    privileges: [
      { title: 'PRIORITÉ BILLETTERIE ', desc: 'Le premier accès absolu à tous les billets, VIP inclus.' },
      { title: 'RÉDUCTION BOUTIQUE 20%', desc: 'La meilleure remise sur l\'intégralité des produits officiels NFC.' },
      { title: 'Espace VIP AU STADE', desc: 'Accès à l\'espace VIP lors des matchs à domicile avec rafraîchissements.' },
      { title: 'ENTRAÎNEMENTS PRIVÉS', desc: 'Invitations illimitées aux sessions d\'entraînement à huis clos.' },
      { title: 'RENCONTRE JOUEURS', desc: 'Séances de dédicaces exclusives et rencontres avec le staff.' },
    ],
  },
};

type TierKey = keyof typeof TIERS;

export default function MembrePage() {
  const [activeTier, setActiveTier] = useState<TierKey>('OR');

  // Données d'exemple du membre (nom fourni par le client)
  const member = {
    fullName: 'FOTSO KEMENI HENRY',
    memberId: 'NFC-2026-8842',
    city: 'Ngaoundéré',
    joinedDate: '2024',
  };

  const currentTier = TIERS[activeTier];
  const TierIcon = currentTier.icon;

  return (
    <div className="bg-[color:var(--nfc-bg)] text-[color:var(--nfc-text)] font-sans space-y-12 pb-20">

      {/* EN-TÊTE DE PAGE */}
      <PageHeader
        tag="ESPACE SUPPORTER OFFICIEL"
        title="VOTRE CARTE DE"
        titleHighlight="MEMBRE NFC"
        description="Accédez à vos avantages exclusifs, réductions sur la billetterie, réductions boutique et votre carte de supporter numérique."
        backgroundImageUrl="https://images.unsplash.com/photo-1543326727-cf6c39e8f84c?q=80&w=1600&auto=format&fit=crop"
        badgeContent={
          <div className="bg-[color:var(--nfc-dark)]/90 backdrop-blur-md p-6 border border-white/10 text-center w-full lg:w-72 shadow-xl">
            <div className="relative w-14 h-14 rounded-full overflow-hidden ring-2 ring-[color:var(--nfc-green)] shadow-md mx-auto mb-2">
              <Image src="/logo.png" alt="NFC Crest" fill className="object-contain" />
            </div>
            <p className="text-xs text-gray-400 mt-1">Carte Numérique Officielle</p>
          </div>
        }
      />

      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-10">

        {/* SÉLECTION DU NIVEAU */}
        <SectionTag label="Choisissez votre niveau d'adhésion" />
        <div className="flex flex-wrap items-center justify-center gap-3">
          {(Object.keys(TIERS) as TierKey[]).map((tier) => {
            const T = TIERS[tier];
            const Icon = T.icon;
            return (
              <button
                key={tier}
                onClick={() => setActiveTier(tier)}
                className={`px-5 py-2.5 font-display text-xs font-bold tracking-wider transition-all duration-200 flex items-center gap-2 ${
                  activeTier === tier
                    ? 'bg-[color:var(--nfc-dark)] text-white shadow-md'
                    : 'bg-white text-gray-600 border border-gray-200 hover:border-gray-400'
                }`}
              >
                <Icon
                  className={`w-4 h-4 ${activeTier === tier ? '' : T.iconColor}`}
                  style={activeTier === tier ? { color: T.accentColor } : {}}
                />
                ADHÉSION {tier}
              </button>
            );
          })}
        </div>

        {/* GRILLE : CARTE + AVANTAGES */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">

          {/* ===== CARTE MEMBRE DIGITALE ===== */}
          <div className="lg:col-span-5">
            <div className={`bg-[color:var(--nfc-dark)] text-white rounded-2xl p-7 border ${currentTier.cardBorder} shadow-2xl space-y-6 relative overflow-hidden transition-all duration-500`}>

              {/* Watermark logo */}
              <div className="absolute -right-10 -bottom-10 opacity-5 pointer-events-none w-64 h-64">
                <Image src="/logo.png" alt="Watermark" fill className="object-contain" />
              </div>

              {/* En-tête de la carte */}
              <div className="flex items-center justify-between pb-4">
                <div className="flex items-center gap-3">
                  <div className="relative w-10 h-10 rounded-full overflow-hidden shrink-0">
                    <Image src="/logo.png" alt="NFC Logo" fill className="object-contain" />
                  </div>
                  <div>
                    <span className="font-display text-lg font-bold block leading-none text-white">NGAOUNDÉRÉ FC</span>
                    <span className="text-[9px] text-[color:var(--nfc-green)] font-bold tracking-widest uppercase block mt-0.5">CARTE SUPPORTER</span>
                  </div>
                </div>

                {/* Badge niveau avec icône couleur */}
                <div className={`flex items-center gap-1.5 px-3 py-1.5 ${currentTier.badgeBg} text-[9px] font-extrabold font-display uppercase`}>
                  <TierIcon className="w-3.5 h-3.5" />
                </div>
              </div>

              {/* Infos titulaire */}
              <div className="space-y-4">
                <div>
                  <span className="text-[10px] text-gray-400 uppercase font-mono block">Titulaire de la Carte</span>
                  <span className="font-display text-xl font-bold text-white uppercase tracking-wider">{member.fullName}</span>
                </div>

                <div className="grid grid-cols-2 gap-4 text-xs font-mono">
                  <div>
                    <span className="text-[10px] text-gray-400 uppercase block">ID Supporter</span>
                    <span className="text-[color:var(--nfc-green)] font-bold">{member.memberId}</span>
                  </div>
                  <div>
                    <span className="text-[10px] text-gray-400 uppercase block">Adhérent Depuis</span>
                    <span className="text-white font-bold">{member.joinedDate}</span>
                  </div>
                </div>

                {/* Icône couleur du niveau */}
                <div className={`flex items-center gap-3 p-3 ${currentTier.iconBg} border border-white/10`}>
                  <TierIcon className={`w-6 h-6 ${currentTier.iconColor}`} />
                  <span className={`font-display font-bold text-sm ${currentTier.iconColor}`}>{currentTier.label}</span>
                </div>
              </div>

              {/* Section QR */}
              <div className="pt-4 border-t border-white/10 flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="p-1.5 bg-white">
                    <QrCode className="w-8 h-8 text-[color:var(--nfc-dark)]" />
                  </div>
                  <span className="text-[10px] text-gray-400 leading-tight max-w-[140px]">
                    Scannez au guichet du Stade Municipal
                  </span>
                </div>
                <span className="badge-category badge-green">STATUT • ACTIF</span>
              </div>
            </div>
          </div>

          {/* ===== AVANTAGES DU NIVEAU ===== */}
          <div className="lg:col-span-7 bg-white border border-gray-100 shadow-sm space-y-6 p-8">
            <div className="flex items-center justify-between border-b border-gray-100 pb-4">
              <div>
                <span className="section-tag">PAQUET SUPPORTER</span>
                <h3 className="font-display text-2xl font-bold text-gray-900 uppercase flex items-center gap-2">
                  <TierIcon className={`w-6 h-6 ${currentTier.iconColor}`} />
                  AVANTAGES — ADHÉSION {activeTier}
                </h3>
              </div>
              <span className="font-display text-lg font-extrabold text-[color:var(--nfc-green)]">
                {currentTier.price}
              </span>
            </div>

            <div className="space-y-3">
              {currentTier.privileges.map((priv, i) => (
                <div key={i} className="flex items-start gap-3 p-4 bg-[#f7f8f7] border border-gray-200/60">
                  <div className={`w-8 h-8 flex items-center justify-center shrink-0 ${currentTier.iconBg}`}>
                    <Zap className={`w-4 h-4 ${currentTier.iconColor}`} />
                  </div>
                  <div>
                    <h4 className="font-display font-bold text-sm text-gray-900">{priv.title}</h4>
                    <p className="text-xs text-gray-500 mt-0.5 leading-relaxed">{priv.desc}</p>
                  </div>
                </div>
              ))}
            </div>

            {/* CTA désactivé + message */}
            <div className="pt-2 space-y-3">
              <div className="flex flex-col sm:flex-row gap-3 opacity-50 pointer-events-none select-none">
                <button className="btn-green text-xs flex-1 py-3 justify-center flex items-center gap-2" disabled>
                  <CreditCard className="w-4 h-4" />
                  RENOUVELER / S'ABONNER →
                </button>
                <button className="btn-dark text-xs flex-1 py-3 justify-center" disabled>
                  GESTION DE MON COMPTE
                </button>
              </div>
              <div className="flex items-center gap-2 text-xs text-amber-600 bg-amber-50 border border-amber-200 p-3">
                <Lock className="w-4 h-4 shrink-0" />
                <span className="font-display font-bold">Service non encore disponible. Contactez directement le club pour adhérer.</span>
              </div>
            </div>
          </div>

        </div>
      </section>

    </div>
  );
}
