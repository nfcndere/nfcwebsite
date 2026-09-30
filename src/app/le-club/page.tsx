"use client";

import React from "react";
import Link from "next/link";
import Image from "next/image";
import { PageHeader } from "@/components/ui/PageHeader";
import { SectionTag } from "@/components/ui/SectionTag";
import { TROPHEES_DATA, LEGENDES_DATA, CLUB_INFO } from "@/lib/mock-data";
import { Shield, Trophy, Award, MapPin, Users, Star, Quote, ChevronRight, Swords } from "lucide-react";

export default function LeClubPage() {
  return (
    <div className="bg-[#f7f8f7] text-[#1f2937] font-sans space-y-0 pb-20">

      {/* EN-TÊTE DE PAGE */}
      <PageHeader
        tag="HISTOIRE, VALEURS & VISION"
        title="PLUS QU'UN CLUB, UNE LÉGENDE DU"
        titleHighlight="FOOTBALL"
        description="Le Ngaoundéré Football Club est bien plus qu'une équipe sportive : c'est un symbole culturel, un vecteur de cohésion sociale et la fierté de toute la région de l'Adamaoua."
        backgroundImageUrl="/back image le club.jpg"
        badgeContent={
          <div className="bg-[color:var(--nfc-dark)]/90 backdrop-blur-md p-6 border border-white/10 text-center w-full lg:w-72 shadow-xl">
            <div className="relative w-14 h-14 rounded-full overflow-hidden ring-2 ring-[color:var(--nfc-green)] shadow-md mx-auto mb-2">
              <Image src="/logo.png" alt="NFC Crest" fill className="object-contain" />
            </div>
            <span className="badge-category badge-green text-[9px] mb-2 inline-block font-bold">DEPUIS {CLUB_INFO.founded}</span>
            <h3 className="font-display text-lg font-extrabold text-white">{CLUB_INFO.name.toUpperCase()}</h3>
            <p className="text-xs text-[color:var(--nfc-yellow)] mt-1 font-mono">{CLUB_INFO.nickname}</p>
          </div>
        }
      />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-16 pt-12">

        {/* BANDE DE STATS */}
        <section className="bg-white border border-gray-100 shadow-sm grid grid-cols-2 md:grid-cols-5 gap-0 divide-x divide-gray-100 text-center overflow-hidden">
          {[
            { value: '2008', label: 'Fondation', highlight: true },
            { value: '4', label: 'Titres Régionaux', highlight: false },
            { value: '10 000', label: 'Places au Stade', highlight: true },
            { value: '4', label: 'Équipes Jeunes', highlight: false },
            { value: '85+', label: 'Joueurs Pros', highlight: true },
          ].map((stat) => (
            <div key={stat.label} className="p-6">
              <span className={`font-display text-2xl font-extrabold block ${stat.highlight ? 'text-[color:var(--nfc-green)]' : 'text-gray-900'}`}>
                {stat.value}
              </span>
              <span className="text-[10px] text-gray-500 uppercase font-display font-bold">{stat.label}</span>
            </div>
          ))}
        </section>

        {/* ===== SALLE DES TROPHÉES & PALMARÈS ===== */}
        <section className="space-y-8">
          <SectionTag label="Salle des Trophées & Palmarès" />

          {/* Titres & Distinctions */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {TROPHEES_DATA.map((trophee) => {
              const IconComp = trophee.type === 'TITRE' ? Trophy : trophee.type === 'COUPE' ? Award : Star;
              const badgeVariant = trophee.type === 'TITRE' ? 'badge-green' : trophee.type === 'COUPE' ? 'badge-yellow' : 'badge-outline';

              return (
                <div
                  key={trophee.id}
                  className="bg-white border border-gray-100 overflow-hidden shadow-sm hover:shadow-md hover:-translate-y-1 transition-all duration-300 group"
                >
                  {/* Image optionnelle */}
                  {trophee.imageUrl && (
                    <div className="h-40 overflow-hidden">
                      <img
                        src={trophee.imageUrl}
                        alt={trophee.title}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                      />
                    </div>
                  )}

                  <div className="p-6 space-y-3">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 bg-[color:var(--nfc-green)]/10 text-[color:var(--nfc-green)] flex items-center justify-center shrink-0">
                        <IconComp className="w-5 h-5" />
                      </div>
                      <div>
                        <span className={`badge-category ${badgeVariant} text-[9px] mb-1`}>{trophee.type}</span>
                        <span className="font-display text-[color:var(--nfc-yellow)] font-extrabold text-lg block">{trophee.year}</span>
                      </div>
                    </div>
                    <h3 className="font-display text-base font-bold text-gray-900">{trophee.title}</h3>
                    <p className="text-xs text-gray-500 leading-relaxed">{trophee.description}</p>
                    <div className="pt-2 border-t border-gray-100">
                      <span className="text-xs text-[color:var(--nfc-green)] font-display font-bold">{trophee.competition}</span>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </section>

        {/* ===== L'ADN ET LE JEU ===== */}
        <section className="bg-[color:var(--nfc-green)] text-white p-8 shadow-lg space-y-6">
          <div className="text-center max-w-2xl mx-auto space-y-3">
            <span className="text-xs font-bold text-[color:var(--nfc-yellow)] uppercase font-display">PHILOSOPHIE TACTIQUE</span>
            <h2 className="font-display text-3xl font-extrabold uppercase">L'ADN ET LE JEU DE L'ADAMAOUA</h2>
            <blockquote className="text-sm italic text-emerald-100 font-light border-l-4 border-[color:var(--nfc-yellow)] pl-4 py-1">
              "Le jeu collectif, la générosité dans l'effort et la fierté de nos couleurs forment l'essence même de notre maillot."
            </blockquote>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 pt-4">
            {[
              { num: '01', title: 'INTENSITÉ', desc: 'Un pressing haut et une générosité physique permanente.' },
              { num: '02', title: 'FORMATION', desc: 'Confiance absolue aux jeunes talents de l\'académie.' },
              { num: '03', title: 'RESPECT', desc: 'Discipline sur le terrain et exemplarité en dehors.' },
              { num: '04', title: 'FERVEUR', desc: 'Communion vibrante avec nos supporters à domicile.' },
            ].map((item) => (
              <div key={item.num} className="bg-[#0c130e]/40 p-4 border border-emerald-600/60 space-y-2">
                <span className="font-display text-2xl font-extrabold text-[color:var(--nfc-yellow)]">{item.num}</span>
                <h4 className="font-display font-bold text-white text-sm">{item.title}</h4>
                <p className="text-xs text-emerald-100">{item.desc}</p>
              </div>
            ))}
          </div>
        </section>

        {/* ===== LÉGENDES DU CLUB ===== */}
        <section className="space-y-8">
          <SectionTag label="Les Légendes du Club — Ceux qui ont Marqué l'Histoire" />

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {LEGENDES_DATA.map((legende) => (
              <div
                key={legende.id}
                className="bg-white border border-gray-100 overflow-hidden shadow-sm hover:shadow-lg hover:-translate-y-1 transition-all duration-300 group"
              >
                {/* Photo légende */}
                <div className="relative h-56 overflow-hidden bg-gray-900">
                  <img
                    src={legende.imageUrl}
                    alt={legende.fullName}
                    className="w-full h-full object-cover opacity-80 group-hover:scale-105 group-hover:opacity-90 transition-all duration-500"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-[color:var(--nfc-dark)] via-transparent to-transparent" />
                  <div className="absolute bottom-0 inset-x-0 p-4">
                    <span className="badge-category badge-green text-[9px] mb-1">{legende.period}</span>
                    <h3 className="font-display text-lg font-extrabold text-white">{legende.fullName}</h3>
                    <p className="text-xs text-gray-300">{legende.position}</p>
                  </div>
                </div>

                {/* Story & Stats */}
                <div className="p-5 space-y-4">
                  <div className="flex items-start gap-2">
                    <Quote className="w-4 h-4 text-[color:var(--nfc-green)] shrink-0 mt-0.5" />
                    <p className="text-xs text-gray-600 leading-relaxed line-clamp-4">{legende.story}</p>
                  </div>

                  {/* Stats carrière */}
                  {(legende.caps || legende.goals) && (
                    <div className="pt-3 border-t border-gray-100 flex gap-6">
                      {legende.caps && (
                        <div>
                          <span className="font-display text-xl font-extrabold text-[color:var(--nfc-green)] block">{legende.caps}</span>
                          <span className="text-[10px] text-gray-400 uppercase font-mono">Matchs</span>
                        </div>
                      )}
                      {legende.goals && (
                        <div>
                          <span className="font-display text-xl font-extrabold text-gray-900 block">{legende.goals}</span>
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

        {/* ===== ORGANIGRAMME ===== */}
        <section className="space-y-6">
          <SectionTag label="Direction Administrative — Organigramme du Club" />
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {[
              { badge: 'PRÉSIDENCE', name: 'El Hadj Mohamadou Bello', role: 'Président du Bureau Exécutif' },
              { badge: 'DIRECTION TECHNIQUE', name: 'Coach Simplice Mbarga', role: 'Directeur Technique & Coach' },
              { badge: 'SECRÉTARIAT', name: 'Ahmadou Oumarou', role: 'Secrétaire Général du Club' },
              { badge: 'COMMUNICATION', name: 'Salihou Abba', role: 'Responsable Médias & Presse' },
            ].map((person) => (
              <div key={person.name} className="bg-white p-5 border border-gray-100 shadow-sm space-y-2 hover:shadow-md hover:-translate-y-0.5 transition-all duration-200">
                <span className="badge-category badge-green">{person.badge}</span>
                <h4 className="font-display font-bold text-gray-900 text-base">{person.name}</h4>
                <p className="text-xs text-gray-500">{person.role}</p>
              </div>
            ))}
          </div>
        </section>

        {/* ===== STADE MUNICIPAL ===== */}
        <section className="bg-white border border-gray-100 shadow-sm overflow-hidden">
          <div className="w-full">
            <img src="/stade2.jpg" alt="Stade Municipal - pleine largeur" className="w-full h-[55vh] object-cover" />
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 p-8 items-center">
            <div className="lg:col-span-6 space-y-4">
              <span className="section-tag">NOTRE ANTRE</span>
              <h2 className="font-display text-3xl font-extrabold text-gray-900 uppercase">LE STADE MUNICIPAL DE NGAOUNDÉRÉ</h2>
              <p className="text-xs text-gray-500 leading-relaxed">
                Situé au cœur de la ville de Ngaoundéré (quartier Baladji), le Stade Municipal est une enceinte mythique perchée sur le plateau de l'Adamaoua. Il offre une ambiance électrique lors de chaque derby.
              </p>

              <div className="grid grid-cols-3 gap-3 text-center pt-2">
                {[
                  { value: '10 000', label: 'Capacité' },
                  { value: '1 392m', label: 'Altitude', green: true },
                  { value: 'Hybride', label: 'Pelouse' },
                ].map((stat) => (
                  <div key={stat.label} className="p-3 bg-[#f7f8f7] border border-gray-200/60">
                    <span className={`font-display text-lg font-bold block ${stat.green ? 'text-[color:var(--nfc-green)]' : 'text-gray-900'}`}>{stat.value}</span>
                    <span className="text-[10px] text-gray-500 uppercase">{stat.label}</span>
                  </div>
                ))}
              </div>

              <Link href="/calendrier" className="btn-green inline-block mt-4 text-xs">
                RÉSERVER MES BILLETS POUR LE PROCHAIN MATCH &rarr;
              </Link>
            </div>

            <div className="lg:col-span-6">
              <div className="grid grid-cols-1 gap-4">
                <img src="/stade3.jpg" alt="Stade - angle 1" className="w-full h-36 object-cover border border-gray-100" />
                <img src="/stade4.jpg" alt="Stade - angle 2" className="w-full h-36 object-cover border border-gray-100" />
              </div>
            </div>
          </div>
        </section>

      </div>
    </div>
  );
}
