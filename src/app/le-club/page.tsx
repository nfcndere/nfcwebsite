"use client";

import React from "react";
import Link from "next/link";
import Image from "next/image";
import { PageHeader } from "@/components/ui/PageHeader";
import { SectionTag } from "@/components/ui/SectionTag";
import { TROPHEES_DATA, LEGENDES_DATA, CLUB_INFO, MANAGEMENT_DATA } from "@/lib/mock-data";
import { Shield, Trophy, Award, MapPin, Users, Star, Quote, ChevronRight, Crown, Sparkles, UserCheck, Flame, Briefcase } from "lucide-react";

export default function LeClubPage() {
  const seniorTrophies = TROPHEES_DATA.filter((t) => typeof t.year === 'string' || (typeof t.year === 'number' && t.year < 2023));
  const youthTrophies = TROPHEES_DATA.filter((t) => t.id.includes('jeunes'));

  const HOMMES_FORTS = [
    {
      badge: 'PRÉSIDENCE DU CLUB',
      name: 'BEKONO NKOA WILDFRIED',
      role: 'Président du Club',
      desc: 'Guide visionnaire et président exécutif impulsant le développement et l\'excellence du Ngaoundéré FC.',
      icon: Crown,
      highlight: true,
    },
    {
      badge: 'VICE-PRÉSIDENCE',
      name: 'ABDOU RAHIM',
      role: 'Vice-Président',
      desc: 'Supervise les affaires institutionnelles, les partenariats stratégiques et le soutien aux opérations.',
      icon: Shield,
      highlight: false,
    },
    {
      badge: 'COORDINATION GÉNÉRALE',
      name: 'TCHAKOUTE ROGER',
      role: 'Coordonnateur Général',
      desc: 'Garant de l\'efficacité opérationnelle, administrative et de la synergie entre les départements du club.',
      icon: UserCheck,
      highlight: false,
    },
    {
      badge: 'DIRECTION TECHNIQUE',
      name: 'NGUE NGUE NTEP',
      role: 'Directeur Technique',
      desc: 'Architecte de la politique sportive globale, garant de l\'identité de jeu et de la formation.',
      icon: Sparkles,
      highlight: false,
    },
    {
      badge: 'DIRECTION SPORTIVE',
      name: 'OMER TABA KOHLEUR',
      role: 'Directeur Sportif',
      desc: 'Responsable du recrutement, du suivi de l\'effectif professionnel et des performances sportives.',
      icon: Flame,
      highlight: false,
    },
    {
      badge: 'SECRÉTARIAT GÉNÉRAL',
      name: 'KOUETE NJIPAP Hilaire',
      role: 'Secrétaire Général',
      desc: 'Chef des services administratifs, responsable du suivi des compétitions et des dossiers FECAFOOT.',
      icon: Briefcase,
      highlight: false,
    },
  ];

  return (
    <div className="bg-[#f7f8f7] text-[#1f2937] font-sans space-y-6 sm:space-y-12 pb-16">

      {/* EN-TÊTE DE PAGE */}
      <PageHeader
        tag="HISTOIRE, VALEURS & PALMARÈS"
        title="NGAOUNDÉRÉ FOOTBALL CLUB"
        titleHighlight="— L'ÉTOILE DE L'ADAMAOUA"
        description="Fondé à Ngaoundéré, le NFC est un symbole culturel, un vecteur d'excellence sportive et la fierté de toute la région de l'Adamaoua."
        backgroundImageUrl="/back image le club.jpg"
        badgeContent={
          <div className="bg-[#0c130e]/90 backdrop-blur-md p-4 sm:p-6 rounded-2xl border border-white/10 text-center w-full lg:w-72 shadow-xl">
            <div className="relative w-12 h-12 sm:w-14 sm:h-14 rounded-full overflow-hidden ring-2 ring-[#008751] shadow-md mx-auto mb-2">
              <Image src="/logo.png" alt="NFC Crest" fill className="object-contain" />
            </div>
            <span className="badge-category badge-green text-[9px] mb-2 inline-block font-bold">DEPUIS {CLUB_INFO.founded}</span>
            <h3 className="font-display text-base sm:text-lg font-extrabold text-white">{CLUB_INFO.name.toUpperCase()}</h3>
            <p className="text-xs text-[color:var(--nfc-yellow)] mt-1 font-mono">{CLUB_INFO.nickname}</p>
          </div>
        }
      />

      <div className="max-w-7xl mx-auto px-3 sm:px-6 lg:px-8 space-y-8 sm:space-y-14">

        {/* BANDE DE STATS HISTORIQUES */}
        <section className="bg-white border border-gray-100/80 shadow-sm grid grid-cols-2 md:grid-cols-5 gap-0 divide-x divide-y md:divide-y-0 divide-gray-100 text-center overflow-hidden rounded-2xl">
          {[
            { value: '2004', label: 'Fondation', highlight: true },
            { value: '4', label: 'Titres Séniors', highlight: false },
            { value: '2', label: 'Accessions Élite 2', highlight: true },
            { value: '2', label: 'Titres Jeunes (2023)', highlight: false },
            { value: '1 000', label: 'Places au Stade', highlight: true },
          ].map((stat) => (
            <div key={stat.label} className="p-3.5 sm:p-6 hover:bg-[#f7f8f7]/60 transition-colors">
              <span className={`font-display text-xl sm:text-3xl font-extrabold block ${stat.highlight ? 'text-[#008751]' : 'text-gray-900'}`}>
                {stat.value}
              </span>
              <span className="text-[10px] sm:text-[11px] text-gray-500 uppercase font-display font-bold tracking-wider">{stat.label}</span>
            </div>
          ))}
        </section>

        {/* ===== HOMMES FORTS & DIRECTION du CLUB ===== */}
        <section className="space-y-4 sm:space-y-6">
          <SectionTag label="Les Hommes Forts — Le Comité Directeur (SAISON 2026-2027)" />
          <p className="text-xs sm:text-sm text-gray-500 max-w-3xl leading-relaxed">
            Découvrez le bureau exécutif et les membres de la direction qui impulsent la vision stratégique, l'encadrement technique et le rayonnement du Ngaoundéré FC pour la saison 2026-2027.
          </p>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3.5 sm:gap-6">
            {HOMMES_FORTS.map((man) => {
              const IconComp = man.icon;
              return (
                <div
                  key={man.name}
                  className={`p-4 sm:p-6 rounded-2xl border transition-all duration-300 flex flex-col justify-between ${
                    man.highlight
                      ? 'bg-[#0c130e] text-white border-[#008751] shadow-xl hover:shadow-2xl'
                      : 'bg-white text-gray-900 border-gray-100 shadow-sm hover:shadow-md hover:border-[#008751]/30'
                  }`}
                >
                  <div className="space-y-3">
                    <div className="flex items-center justify-between">
                      <span className={`badge-category text-[9px] px-2.5 py-1 ${man.highlight ? 'badge-green' : 'badge-dark'}`}>
                        {man.badge}
                      </span>
                      <div className={`w-9 h-9 rounded-xl flex items-center justify-center ${man.highlight ? 'bg-[#008751]/20 text-[#008751]' : 'bg-[#008751]/10 text-[#008751]'}`}>
                        <IconComp className="w-4 h-4" />
                      </div>
                    </div>
                    <div>
                      <h4 className={`font-display text-base font-bold tracking-tight ${man.highlight ? 'text-white' : 'text-gray-900'}`}>{man.name}</h4>
                      <p className={`text-xs font-semibold ${man.highlight ? 'text-[color:var(--nfc-yellow)]' : 'text-[#008751]'}`}>{man.role}</p>
                    </div>
                    <p className={`text-xs leading-relaxed ${man.highlight ? 'text-gray-300' : 'text-gray-500'}`}>{man.desc}</p>
                  </div>
                </div>
              );
            })}
          </div>
        </section>

        {/* ===== PALMARÈS OFFICIEL ÉQUIPE PREMIÈRE ===== */}
        <section className="space-y-4 sm:space-y-6">
          <SectionTag label="Palmarès Officiel — Équipe Séniors" />
          
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3.5 sm:gap-6">
            {seniorTrophies.map((trophee) => (
              <div
                key={trophee.id}
                className="bg-white border border-gray-100 rounded-2xl p-4 sm:p-5 shadow-sm hover:shadow-md hover:-translate-y-1 hover:border-[#008751]/30 transition-all duration-300 flex flex-col justify-between"
              >
                <div className="space-y-2.5">
                  <div className="flex items-center justify-between">
                    <span className="badge-category badge-green text-[9px]">{trophee.type}</span>
                    <span className="font-display font-extrabold text-xs sm:text-sm text-[color:var(--nfc-yellow)] bg-[#0c130e] px-2.5 py-0.5 rounded-lg">
                      {trophee.year}
                    </span>
                  </div>
                  <h3 className="font-display text-sm sm:text-base font-bold text-gray-900 leading-snug">{trophee.title}</h3>
                  <p className="text-xs text-gray-500 leading-relaxed">{trophee.description}</p>
                </div>
                <div className="pt-3 border-t border-gray-100 mt-3 flex items-center justify-between text-[11px] font-display font-bold text-[#008751]">
                  <span>{trophee.competition}</span>
                  <Trophy className="w-4 h-4 text-[color:var(--nfc-yellow)]" />
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* ===== PALMARÈS ÉQUIPES JEUNES & ACADÉMIE ===== */}
        <section className="bg-white border border-gray-100 p-4 sm:p-8 rounded-2xl shadow-sm space-y-4 sm:space-y-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-gray-100 pb-3">
            <div>
              <div className="flex items-center gap-2">
                <Flame className="w-5 h-5 text-[#008751]" />
                <h2 className="font-display text-lg sm:text-2xl font-extrabold text-gray-900 uppercase">PALMARÈS DE LA FORMATION & DES JEUNES</h2>
              </div>
              <p className="text-xs text-gray-500 mt-0.5">La relève dorée du Ngaoundéré FC brille dans les compétitions nationales.</p>
            </div>
            <span className="badge-category badge-green shrink-0">ACADÉMIE U17 & U19</span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-6">
            {youthTrophies.map((trophee) => (
              <div key={trophee.id} className="bg-[#f7f8f7] border border-gray-200/80 p-4 sm:p-6 rounded-2xl flex items-start gap-4 hover:border-[#008751] transition-colors shadow-xs">
                <div className="w-12 h-12 rounded-2xl bg-[#008751]/10 text-[#008751] flex items-center justify-center shrink-0">
                  <Award className="w-6 h-6 text-[#008751]" />
                </div>
                <div className="space-y-1.5 flex-grow">
                  <div className="flex items-center justify-between">
                    <span className="font-display font-extrabold text-xs text-[#008751]">{trophee.year}</span>
                    <span className="badge-category badge-dark text-[8px]">{trophee.competition}</span>
                  </div>
                  <h3 className="font-display text-sm sm:text-base font-bold text-gray-900">{trophee.title}</h3>
                  <p className="text-xs text-gray-600 leading-relaxed">{trophee.description}</p>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* ===== PHILOSOPHIE & ADN DE JEU ===== */}
        <section className="bg-[#008751] text-white p-6 sm:p-10 rounded-2xl shadow-xl space-y-4 sm:space-y-6">
          <div className="text-center max-w-2xl mx-auto space-y-2 sm:space-y-3">
            <span className="text-xs font-bold text-[color:var(--nfc-yellow)] uppercase font-display tracking-wider">PHILOSOPHIE TACTIQUE</span>
            <h2 className="font-display text-xl sm:text-3xl font-extrabold uppercase tracking-tight">L'ADN ET LE JEU DE L'ADAMAOUA</h2>
            <blockquote className="text-xs sm:text-sm italic text-emerald-100 font-light border-l-4 border-[color:var(--nfc-yellow)] pl-3 py-1 text-left">
              "Le jeu collectif, la générosité dans l'effort et la fierté de nos couleurs forment l'essence même du Ngaoundéré FC."
            </blockquote>
          </div>

          <div className="grid grid-cols-2 lg:grid-cols-4 gap-2.5 sm:gap-4 pt-2">
            {[
              { num: '01', title: 'INTENSITÉ', desc: 'Pressing haut et générosité physique sur le terrain.' },
              { num: '02', title: 'FORMATION', desc: 'Confiance absolue aux jeunes talents de l\'académie.' },
              { num: '03', title: 'RESPECT', desc: 'Discipline rigoureuse et exemplarité en dehors du pré.' },
              { num: '04', title: 'FERVEUR', desc: 'Communion vibrante avec nos supporters à domicile.' },
            ].map((item) => (
              <div key={item.num} className="bg-[#0c130e]/40 p-4 sm:p-5 rounded-2xl border border-emerald-600/50 space-y-1 backdrop-blur-xs">
                <span className="font-display text-xl sm:text-2xl font-extrabold text-[color:var(--nfc-yellow)]">{item.num}</span>
                <h4 className="font-display font-bold text-white text-xs sm:text-sm">{item.title}</h4>
                <p className="text-[10px] sm:text-xs text-emerald-100">{item.desc}</p>
              </div>
            ))}
          </div>
        </section>

        {/* ===== LÉGENDES DU CLUB (SECTION COMMENTÉE À LA DEMANDE) ===== */}
        {/* 
        <section className="space-y-4 sm:space-y-6">
          <SectionTag label="Les Légendes du Club — Empreintes Indélébiles" />

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 sm:gap-6">
            {LEGENDES_DATA.map((legende) => (
              <div
                key={legende.id}
                className="bg-white border border-gray-100 rounded-xl overflow-hidden shadow-sm hover:shadow-lg hover:-translate-y-1 transition-all duration-300 group flex flex-col"
              >
                <div className="relative h-48 sm:h-56 overflow-hidden bg-gray-900">
                  <img
                    src={legende.imageUrl}
                    alt={legende.fullName}
                    className="w-full h-full object-cover opacity-80 group-hover:scale-105 group-hover:opacity-90 transition-all duration-500"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-[#0c130e] via-transparent to-transparent" />
                  <div className="absolute bottom-0 inset-x-0 p-3 sm:p-4">
                    <span className="badge-category badge-green text-[9px] mb-1">{legende.period}</span>
                    <h3 className="font-display text-base sm:text-lg font-extrabold text-white">{legende.fullName}</h3>
                    <p className="text-xs text-gray-300">{legende.position}</p>
                  </div>
                </div>

                <div className="p-4 sm:p-5 space-y-3 flex-grow flex flex-col justify-between">
                  <div className="flex items-start gap-2">
                    <Quote className="w-4 h-4 text-[#008751] shrink-0 mt-0.5" />
                    <p className="text-xs text-gray-600 leading-relaxed line-clamp-4">{legende.story}</p>
                  </div>

                  {(legende.caps || legende.goals) && (
                    <div className="pt-3 border-t border-gray-100 flex gap-6">
                      {legende.caps && (
                        <div>
                          <span className="font-display text-lg sm:text-xl font-extrabold text-[#008751] block">{legende.caps}</span>
                          <span className="text-[10px] text-gray-400 uppercase font-mono">Matchs</span>
                        </div>
                      )}
                      {legende.goals && (
                        <div>
                          <span className="font-display text-lg sm:text-xl font-extrabold text-gray-900 block">{legende.goals}</span>
                          <span className="text-[10px] text-gray-400 uppercase font-mono">Buts</span>
                        </div>
                      )}
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>
        </section>
        */}

        {/* ===== STADE MUNICIPAL DE NGAOUNDÉRÉ ===== */}
        <section className="bg-white border border-gray-100 rounded-2xl shadow-sm overflow-hidden">
          <div className="w-full">
            <img src="/stade2.jpg" alt="Stade Municipal" className="w-full h-[35vh] sm:h-[45vh] object-cover" />
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 p-4 sm:p-8 items-center">
            <div className="lg:col-span-6 space-y-3 sm:space-y-4">
              <span className="section-tag">NOTRE ANTRE EN HAUTEUR</span>
              <h2 className="font-display text-xl sm:text-3xl font-extrabold text-gray-900 uppercase">LE STADE MUNICIPAL DE NGAOUNDÉRÉ</h2>
              <p className="text-xs sm:text-sm text-gray-500 leading-relaxed">
                Situé au quartier Baladji à Ngaoundéré, le Stade Municipal est l'enceinte emblématique où battent les cœurs des supporters des Vert et Blanc. À 1 392m d'altitude, c'est une forteresse réputée difficile pour tous les adversaires.
              </p>

              <div className="grid grid-cols-3 gap-2 sm:gap-3 text-center pt-2">
                {[
                  { value: '1 000', label: 'Capacité' },
                  { value: '1 392m', label: 'Altitude', green: true },
                  { value: 'Baladji', label: 'Quartier' },
                ].map((stat) => (
                  <div key={stat.label} className="p-2.5 sm:p-3.5 bg-[#f7f8f7] border border-gray-200/60 rounded-xl">
                    <span className={`font-display text-sm sm:text-lg font-bold block ${stat.green ? 'text-[#008751]' : 'text-gray-900'}`}>{stat.value}</span>
                    <span className="text-[9px] sm:text-[10px] text-gray-500 uppercase font-mono">{stat.label}</span>
                  </div>
                ))}
              </div>

              <Link href="/calendrier" className="btn-green inline-flex items-center gap-2 mt-2 text-xs py-2.5 px-5 rounded-xl shadow-sm">
                RÉSERVER BILLETS POUR LE PROCHAIN MATCH &rarr;
              </Link>
            </div>

            <div className="lg:col-span-6">
              <div className="grid grid-cols-2 gap-2 sm:gap-4">
                <img src="/stade3.jpg" alt="Stade vue 1" className="w-full h-28 sm:h-36 object-cover border border-gray-100 rounded-xl shadow-xs" />
                <img src="/stade4.jpg" alt="Stade vue 2" className="w-full h-28 sm:h-36 object-cover border border-gray-100 rounded-xl shadow-xs" />
              </div>
            </div>
          </div>
        </section>

      </div>
    </div>
  );
}
