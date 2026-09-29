"use client";

import React from "react";
import Link from "next/link";
import Image from "next/image";
import { PageHeader } from "@/components/ui/PageHeader";
import { Shield, Trophy, Award, MapPin, Users, Star } from "lucide-react";

export default function LeClubPage() {
  return (
    <div className="bg-[#f7f8f7] text-[#1f2937] font-sans space-y-12 pb-20">

      {/* PAGE HERO HEADER WITH BACKGROUND IMAGE */}
      <PageHeader
        tag="HISTOIRE, VALEURS & VISION"
        title="PLUS QU'UN CLUB, UNE LÉGENDE DU"
        titleHighlight="FOOTBALL"
        description="Le Ngaoundéré Football Club est bien plus qu'une équipe sportive : c'est un symbole culturel, un vecteur de cohésion sociale et la fierté de toute la région de l'Adamaoua."
        backgroundImageUrl="/back image le club.jpg"
        badgeContent={
          <div className="bg-[color:var(--nfc-dark)]/90 backdrop-blur-md p-6 rounded-2xl border border-white/10 text-center w-full lg:w-72 shadow-xl">
            <div className="relative w-14 h-14 rounded-full overflow-hidden ring-2 ring-[color:var(--nfc-green)] shadow-md mx-auto mb-2">
              <Image src="/logo.png" alt="NFC Crest" fill className="object-contain" />
            </div>
            <h3 className="font-display text-lg font-bold text-white">NGAOUNDÉRÉ FC</h3>
            <p className="text-xs text-gray-400">Fondé en 2008 • Adamaoua</p>
          </div>
        }
      />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12">

        {/* STATS STRIP */}
        <section className="bg-white rounded-2xl p-6 border border-gray-100 shadow-sm grid grid-cols-2 md:grid-cols-5 gap-4 text-center">
          <div>
            <span className="font-display text-2xl font-extrabold text-[#008751] block">2008</span>
            <span className="text-[10px] text-gray-500 uppercase font-display font-bold">Fondation</span>
          </div>
          <div>
            <span className="font-display text-2xl font-extrabold text-gray-900 block">4</span>
            <span className="text-[10px] text-gray-500 uppercase font-display font-bold">Titres Régionaux</span>
          </div>
          <div>
            <span className="font-display text-2xl font-extrabold text-[#008751] block">10 000</span>
            <span className="text-[10px] text-gray-500 uppercase font-display font-bold">Places au Stade</span>
          </div>
          <div>
            <span className="font-display text-2xl font-extrabold text-gray-900 block">4</span>
            <span className="text-[10px] text-gray-500 uppercase font-display font-bold">Équipes de jeunes</span>
          </div>
          <div>
            <span className="font-display text-2xl font-extrabold text-[#008751] block">85+</span>
            <span className="text-[10px] text-gray-500 uppercase font-display font-bold">Joueurs pros</span>
          </div>
        </section>

        {/* SALLE DES TROPHÉES */}
        <section className="space-y-6">
          <div className="border-b border-gray-200 pb-3">
            <span className="section-tag">GLOIRE ET VICTOIRES</span>
            <h2 className="font-display text-3xl font-extrabold text-gray-900 uppercase">SALLE DES TROPHÉES & PALMARÈS</h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div className="bg-white p-7 rounded-2xl border border-gray-100 shadow-sm space-y-4 transition-all duration-300 hover:shadow-md">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 rounded-xl bg-[#008751]/10 text-[#008751] flex items-center justify-center shrink-0">
                  <Trophy className="w-6 h-6" />
                </div>
                <div>
                  <h3 className="font-display text-lg font-bold text-gray-900">CHAMPIONNAT RÉGIONAL ADAMAOUA</h3>
                  <span className="text-xs font-bold text-[#008751]">4 TITRES NATIONAUX</span>
                </div>
              </div>

              <p className="text-xs text-gray-500 leading-relaxed">Le NFC s'est imposé comme le maître incontesté du championnat régional avant son accession historique en MTN Elite One.</p>

              <div className="flex flex-wrap gap-2 pt-2">
                <span className="badge-category badge-green">2012</span>
                <span className="badge-category badge-green">2016</span>
                <span className="badge-category badge-green">2019</span>
                <span className="badge-category badge-green">2022</span>
              </div>
            </div>

            <div className="bg-white p-7 rounded-2xl border border-gray-100 shadow-sm space-y-4 transition-all duration-300 hover:shadow-md">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 rounded-xl bg-[#008751]/10 text-[#008751] flex items-center justify-center shrink-0">
                  <Award className="w-6 h-6" />
                </div>
                <div>
                  <h3 className="font-display text-lg font-bold text-gray-900">COUPE DU CAMEROUN</h3>
                  <span className="text-xs font-bold text-[#008751]">1 QUART DE FINALE NATIONALE</span>
                </div>
              </div>

              <p className="text-xs text-gray-500 leading-relaxed">Un parcours héroïque en Coupe du Cameroun qui a marqué la mémoire des supporters avec des victoires retentissantes contre les grands clubs de Douala et Yaoundé.</p>

              <div className="flex flex-wrap gap-2 pt-2">
                <span className="badge-category badge-green">2023 — 1/4 FINALE</span>
              </div>
            </div>
          </div>
        </section>

        {/* L'ADN ET LE JEU */}
        <section className="bg-[#008751] text-white rounded-2xl p-8 shadow-lg space-y-6">
          <div className="text-center max-w-2xl mx-auto space-y-3">
            <span className="text-xs font-bold text-[color:var(--nfc-yellow)] uppercase font-display">PHILOSOPHIE TACTIQUE</span>
            <h2 className="font-display text-3xl font-extrabold uppercase">L'ADN ET LE JEU DE L'ADAMAOUA</h2>
            <blockquote className="text-sm italic text-emerald-100 font-light border-l-4 border-[color:var(--nfc-yellow)] pl-4 py-1">"Le jeu collectif, la générosité dans l'effort et la fierté de nos couleurs forment l'essence même de notre maillot."</blockquote>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 pt-4">
            <div className="bg-[#0c130e]/40 p-4 rounded-xl border border-emerald-600/60">
              <h4 className="font-display font-bold text-white text-sm">01. INTENSITÉ</h4>
              <p className="text-xs text-emerald-100 mt-1">Un pressing haut et une générosité physique permanente.</p>
            </div>
            <div className="bg-[#0c130e]/40 p-4 rounded-xl border border-emerald-600/60">
              <h4 className="font-display font-bold text-white text-sm">02. FORMATION</h4>
              <p className="text-xs text-emerald-100 mt-1">Confiance absolue aux jeunes talents de l'académie.</p>
            </div>
            <div className="bg-[#0c130e]/40 p-4 rounded-xl border border-emerald-600/60">
              <h4 className="font-display font-bold text-white text-sm">03. RESPECT</h4>
              <p className="text-xs text-emerald-100 mt-1">Discipline sur le terrain et exemplarité en dehors.</p>
            </div>
            <div className="bg-[#0c130e]/40 p-4 rounded-xl border border-emerald-600/60">
              <h4 className="font-display font-bold text-white text-sm">04. FERVEUR</h4>
              <p className="text-xs text-emerald-100 mt-1">Communion vibrante avec nos supporters à domicile.</p>
            </div>
          </div>
        </section>

        {/* ORGANIGRAMME */}
        <section className="space-y-6">
          <div className="border-b border-gray-200 pb-3">
            <span className="section-tag">DIRECTION ADMINISTRATIVE</span>
            <h2 className="font-display text-2xl font-extrabold text-gray-900 uppercase">ORGANIGRAMME DU NGAOUNDÉRÉ FC</h2>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            <div className="bg-white p-5 rounded-2xl border border-gray-100 shadow-sm space-y-2 hover:shadow-md transition-shadow">
              <span className="badge-category badge-green">PRÉSIDENCE</span>
              <h4 className="font-display font-bold text-gray-900 text-base">El Hadj Mohamadou Bello</h4>
              <p className="text-xs text-gray-500">Président du Bureau Exécutif</p>
            </div>

            <div className="bg-white p-5 rounded-2xl border border-gray-100 shadow-sm space-y-2 hover:shadow-md transition-shadow">
              <span className="badge-category badge-green">DIRECTION TECHNIQUE</span>
              <h4 className="font-display font-bold text-gray-900 text-base">Coach Simplice Mbarga</h4>
              <p className="text-xs text-gray-500">Directeur Technique & Coach</p>
            </div>

            <div className="bg-white p-5 rounded-2xl border border-gray-100 shadow-sm space-y-2 hover:shadow-md transition-shadow">
              <span className="badge-category badge-outline">SECRÉTARIAT</span>
              <h4 className="font-display font-bold text-gray-900 text-base">Ahmadou Oumarou</h4>
              <p className="text-xs text-gray-500">Secrétaire Général du Club</p>
            </div>

            <div className="bg-white p-5 rounded-2xl border border-gray-100 shadow-sm space-y-2 hover:shadow-md transition-shadow">
              <span className="badge-category badge-green">COMMUNICATION</span>
              <h4 className="font-display font-bold text-gray-900 text-base">Salihou Abba</h4>
              <p className="text-xs text-gray-500">Responsable Médias & Presse</p>
            </div>
          </div>
        </section>

        {/* STADE: full-bleed image followed by description + two supporting images */}
        <section className="bg-white rounded-2xl p-0 border border-gray-100 shadow-sm overflow-hidden">
          <div className="w-full">
            <img src="/stade2.jpg" alt="Stade Municipal - pleine largeur" className="w-full h-[55vh] object-cover" />
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 p-8 items-center">
            <div className="lg:col-span-6 space-y-4">
              <span className="section-tag">NOTRE ANTRE</span>
              <h2 className="font-display text-3xl font-extrabold text-gray-900 uppercase">LE STADE MUNICIPAL DE NGAOUNDÉRÉ</h2>
              <p className="text-xs text-gray-500 leading-relaxed">Situé au cœur de la ville de Ngaoundéré (quartier Baladji), le Stade Municipal est une enceinte mythique perchée sur le plateau de l'Adamaoua. Il offre une ambiance électrique lors de chaque derby.</p>

              <div className="grid grid-cols-3 gap-3 text-center pt-2">
                <div className="p-3 bg-[#f7f8f7] rounded-xl border border-gray-200/60">
                  <span className="font-display text-lg font-bold text-gray-900 block">10 000</span>
                  <span className="text-[10px] text-gray-500 uppercase">Capacité</span>
                </div>
                <div className="p-3 bg-[#f7f8f7] rounded-xl border border-gray-200/60">
                  <span className="font-display text-lg font-bold text-[#008751] block">1 392m</span>
                  <span className="text-[10px] text-gray-500 uppercase">Altitude</span>
                </div>
                <div className="p-3 bg-[#f7f8f7] rounded-xl border border-gray-200/60">
                  <span className="font-display text-lg font-bold text-gray-900 block">Hybride</span>
                  <span className="text-[10px] text-gray-500 uppercase">Pelouse</span>
                </div>
              </div>

              <Link href="/calendrier" className="btn-green inline-block mt-4 text-xs">RÉSERVER MES BILLETS POUR LE PROCHAIN MATCH &rarr;</Link>
            </div>

            <div className="lg:col-span-6">
              <div className="grid grid-cols-1 gap-4">
                <img src="/stade3.jpg" alt="Stade - angle 1" className="w-full h-36 object-cover rounded-2xl shadow-sm border border-gray-100" />
                <img src="/stade4.jpg" alt="Stade - angle 2" className="w-full h-36 object-cover rounded-2xl shadow-sm border border-gray-100" />
              </div>
            </div>
          </div>
        </section>

        {/* Remaining content (stats, trophies, organigramme) - kept minimal here */}

      </div>

    </div>
  );
}
