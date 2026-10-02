"use client";

import React from "react";
import Link from "next/link";
import Image from "next/image";
import { PageHeader } from "@/components/ui/PageHeader";
import { TROPHEES_DATA, CLUB_INFO } from "@/lib/mock-data";
import {
  Shield, Trophy, Award, Crown, Sparkles,
  UserCheck, Flame, Briefcase, Medal, ChevronRight, User, Quote
} from "lucide-react";

// ─── Comité Directeur ─────────────────────────────────────────────────────────
const HOMMES_FORTS = [
  { badge: 'PRÉSIDENCE',      name: 'BEKONO NKOA WILDFRIED', role: 'Président du Club',     photo: null, highlight: true  },
  { badge: 'VICE-PRÉSIDENCE', name: 'ABDOU RAHIM',            role: 'Vice-Président',         photo: null, highlight: false },
  { badge: 'COORDINATION',    name: 'TCHAKOUTE ROGER',        role: 'Coordonnateur Général',  photo: null, highlight: false },
  { badge: 'DIR. TECHNIQUE',  name: 'NGUE NGUE NTEP',         role: 'Directeur Technique',    photo: null, highlight: false },
  { badge: 'DIR. SPORTIVE',   name: 'OMER TABA KOHLEUR',      role: 'Directeur Sportif',      photo: null, highlight: false },
  { badge: 'SECRÉTARIAT',     name: 'KOUETE NJIPAP Hilaire',  role: 'Secrétaire Général',     photo: null, highlight: false },
];

// ─── Trophy icon helper ────────────────────────────────────────────────────────
function getTrophyIcon(type: string) {
  if (type === 'COUPE') return Award;
  if (type === 'DISTINCTION') return Medal;
  return Trophy;
}

// ─── Person Card ──────────────────────────────────────────────────────────────
// Toutes les cartes utilisent la même icône User (neutre & uniforme)
function PersonCard({ person }: { person: typeof HOMMES_FORTS[0] }) {
  return (
    <div className={`bg-white rounded-2xl border p-6 flex flex-col items-center text-center gap-4 transition-all duration-200 hover:shadow-lg hover:-translate-y-1 ${person.highlight ? 'border-[#008751]/40 ring-1 ring-[#008751]/20 shadow-sm' : 'border-gray-100'}`}>
      {/* Avatar circle — même icône User pour tous */}
      <div className={`w-20 h-20 rounded-full flex items-center justify-center shrink-0 ${person.highlight ? 'bg-[#008751]/10' : 'bg-gray-100'}`}>
        {person.photo ? (
          <Image src={person.photo as string} alt={person.name} width={80} height={80} className="w-20 h-20 rounded-full object-cover" />
        ) : (
          <User className={`w-9 h-9 ${person.highlight ? 'text-[#008751]' : 'text-gray-400'}`} />
        )}
      </div>
      {/* Badge */}
      <span className="text-[9px] font-bold uppercase tracking-widest text-[#008751] bg-[#008751]/8 px-3 py-1 rounded-full">
        {person.badge}
      </span>
      {/* Name & Role */}
      <div className="space-y-1">
        <h4 className="font-display text-sm font-bold text-gray-900 leading-tight">{person.name}</h4>
        <p className="text-xs text-gray-500">{person.role}</p>
      </div>
    </div>
  );
}

// ─── Trophy Row ───────────────────────────────────────────────────────────────
function TrophyRow({ trophee }: { trophee: (typeof TROPHEES_DATA)[0] }) {
  const TIcon = getTrophyIcon(trophee.type);
  return (
    <div className="flex items-start gap-4 p-4 sm:p-5 rounded-xl border border-gray-100 bg-white hover:border-[#008751]/30 hover:shadow-sm transition-all duration-200">
      <div className="w-10 h-10 rounded-xl bg-[#008751]/8 flex items-center justify-center shrink-0">
        <TIcon className="w-5 h-5 text-[#008751]" />
      </div>
      <div className="flex-grow min-w-0">
        <div className="flex flex-wrap items-center gap-2 mb-1">
          <span className="text-[10px] font-bold text-[#008751] uppercase tracking-wide">{trophee.competition}</span>
          <span className="text-[10px] text-gray-400 font-mono">• {trophee.year}</span>
        </div>
        <h4 className="font-display font-bold text-gray-900 text-sm leading-snug">{trophee.title}</h4>
        <p className="text-xs text-gray-500 mt-0.5 leading-relaxed">{trophee.description}</p>
      </div>
      <span className="text-[9px] uppercase font-bold tracking-wider text-gray-400 shrink-0 hidden sm:block mt-1">{trophee.type}</span>
    </div>
  );
}

// ─── Page ─────────────────────────────────────────────────────────────────────
export default function LeClubPage() {
  const seniorTrophies = TROPHEES_DATA.filter((t) => !t.id.includes('jeunes'));
  const youthTrophies  = TROPHEES_DATA.filter((t) =>  t.id.includes('jeunes'));

  return (
    <div className="bg-[#f7f8f7] text-[#1f2937] font-sans pb-20">

      {/* EN-TÊTE */}
      <PageHeader
        tag="HISTOIRE, VALEURS & PALMARÈS"
        title="NGAOUNDÉRÉ FOOTBALL CLUB"
        titleHighlight="— L'ÉTOILE DE L'ADAMAOUA"
        description="Fondé en 2004 à Ngaoundéré, le NFC est un symbole culturel, un vecteur d'excellence sportive et la fierté de toute la région de l'Adamaoua."
        backgroundImageUrl="/back image le club.jpg"
        
      />

      <div className="max-w-6xl mx-auto px-3 sm:px-6 lg:px-8 pt-8 sm:pt-10 space-y-10 sm:space-y-14">

        {/* ── STATS BAR ──────────────────────────────────────────────── */}
        <section className="grid grid-cols-2 md:grid-cols-5 gap-px bg-gray-200 rounded-2xl overflow-hidden shadow-sm">
          {[
            { value: '2004',  label: 'Fondation',          green: true  },
            { value: '4',     label: 'Titres Séniors',     green: false },
            { value: '2',     label: 'Accessions Élite 2', green: true  },
            { value: '2',     label: 'Titres Jeunes 2023', green: false },
            { value: '1 000', label: 'Places au Stade',    green: true  },
          ].map((s) => (
            <div key={s.label} className="bg-white py-5 px-4 text-center">
              <span className={`font-display text-2xl sm:text-3xl font-extrabold block ${s.green ? 'text-[#008751]' : 'text-gray-900'}`}>{s.value}</span>
              <span className="text-[10px] uppercase font-bold tracking-wider text-gray-400 mt-0.5 block">{s.label}</span>
            </div>
          ))}
        </section>

        {/* ── HISTOIRE DU CLUB ──────────────────────────────────────── */}
        <section className="bg-white border border-gray-100 rounded-2xl shadow-sm p-6 sm:p-10">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
            {/* Texte */}
            <div className="lg:col-span-8 space-y-5">
              <div>
                <p className="text-[10px] uppercase font-bold tracking-widest text-[#008751] mb-1">Notre Histoire</p>
                <h2 className="font-display text-xl sm:text-2xl font-extrabold text-gray-900 uppercase">Un Club, Une Région, Une Âme</h2>
              </div>
              <p className="text-sm text-gray-600 leading-relaxed">
                Fondé en <strong>2004</strong> à Ngaoundéré, chef-lieu de la région de l'Adamaoua, le <strong>Ngaoundéré Football Club</strong> naît d'une ambition collective : donner à la région un club professionnel digne de sa fierté. Dès ses premières saisons, le club s'impose comme une force montante du football régional camerounais, enchaînant titres et montées.
              </p>
              <p className="text-sm text-gray-600 leading-relaxed">
                Grâce à sa politique de formation ambitieuse et à son <strong>académie agréée FECAFOOT</strong>, le NFC ne se contente pas de briller sur le terrain — il forge les champions de demain. Portée par ses supporters , l'Étoile de l'Adamaoua incarne la résilience, la passion et le génie du football camerounais du Nord.
              </p>

              {/* Citation */}
              <div className="flex items-start gap-3 border-l-4 border-[#008751] pl-4 py-1">
                <Quote className="w-5 h-5 text-[#008751] shrink-0 mt-0.5" />
                <blockquote className="text-sm italic text-gray-500 leading-relaxed">
                  "Ngaoundéré FC, c'est plus qu'un club. C'est l'identité sportive d'une région tout entière, un pont entre tradition et modernité au cœur de l'Adamaoua."
                </blockquote>
              </div>
            </div>

            {/* Piliers */}
            <div className="lg:col-span-4 space-y-3">
              {[
                { label: 'Ville',      value: 'Ngaoundéré, Adamaoua' },
                { label: 'Fondation',  value: '2004' },
                { label: 'Couleurs',   value: 'Vert & Blanc' },
                { label: 'Surnom',     value: "L'Étoile de l'Adamaoua" },
                { label: 'Stade',      value: 'Stade Municipal · 1 392m' },
                { label: 'Président',  value: 'Bekono Nkoa Wildfried' },
              ].map((item) => (
                <div key={item.label} className="flex items-center justify-between py-2.5 border-b border-gray-100 last:border-0">
                  <span className="text-[11px] uppercase font-bold text-gray-400 tracking-wider">{item.label}</span>
                  <span className="text-xs font-semibold text-gray-900 text-right">{item.value}</span>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* ── COMITÉ DIRECTEUR ─────────────────────────────────────── */}
        <section className="space-y-6">
          <div>
            <p className="text-[10px] uppercase font-bold tracking-widest text-[#008751] mb-1">Saison 2026-2027</p>
            <h2 className="font-display text-xl sm:text-2xl font-extrabold text-gray-900 uppercase">Le Comité Directeur</h2>
            <p className="text-xs text-gray-500 mt-1.5 max-w-2xl leading-relaxed">
              Six femmes et hommes engagés au service du Ngaoundéré FC, portant la vision stratégique du club pour la saison en cours.
            </p>
          </div>
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-4">
            {HOMMES_FORTS.map((man) => (
              <PersonCard key={man.name} person={man} />
            ))}
          </div>
        </section>

        {/* ── PALMARÈS SÉNIORS ─────────────────────────────────────── */}
        <section className="space-y-6">
          <div>
            <p className="text-[10px] uppercase font-bold tracking-widest text-[#008751] mb-1">Équipe Première</p>
            <h2 className="font-display text-xl sm:text-2xl font-extrabold text-gray-900 uppercase">Palmarès Officiel</h2>
          </div>
          <div className="space-y-3">
            {seniorTrophies.map((t) => (
              <TrophyRow key={t.id} trophee={t} />
            ))}
          </div>
        </section>

        {/* ── PALMARÈS JEUNES ──────────────────────────────────────── */}
        <section className="space-y-6">
          <div>
            <p className="text-[10px] uppercase font-bold tracking-widest text-[#008751] mb-1">Formation & Académie</p>
            <h2 className="font-display text-xl sm:text-2xl font-extrabold text-gray-900 uppercase">Titres des Équipes Jeunes</h2>
          </div>
          <div className="space-y-3">
            {youthTrophies.map((t) => (
              <TrophyRow key={t.id} trophee={t} />
            ))}
          </div>
        </section>

        {/* ── PHILOSOPHIE ────────────────────────────────────────────── */}
        <section className="bg-[#0c130e] text-white rounded-2xl p-6 sm:p-10">
          <div className="max-w-xl mx-auto text-center space-y-2 mb-8">
            <p className="text-[10px] uppercase tracking-widest font-bold text-[#008751]">Notre ADN</p>
            <h2 className="font-display text-xl sm:text-3xl font-extrabold uppercase">La Philosophie du Jeu</h2>
            <p className="text-xs text-gray-400 leading-relaxed italic">
              "Le jeu collectif, la générosité dans l'effort et la fierté de nos couleurs forment l'essence même du Ngaoundéré FC."
            </p>
          </div>
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
            {[
              { num: '01', title: 'INTENSITÉ', desc: 'Pressing haut et générosité physique sur le terrain.' },
              { num: '02', title: 'FORMATION', desc: "Confiance absolue aux jeunes talents de l'académie." },
              { num: '03', title: 'RESPECT',   desc: 'Discipline rigoureuse et exemplarité en dehors du pré.' },
              { num: '04', title: 'FERVEUR',   desc: 'Communion vibrante avec nos supporters à domicile.' },
            ].map((v) => (
              <div key={v.num} className="border border-white/10 rounded-xl p-4 space-y-1.5">
                <span className="font-display text-2xl font-extrabold text-[color:var(--nfc-yellow)]">{v.num}</span>
                <h4 className="font-display font-bold text-white text-xs">{v.title}</h4>
                <p className="text-[11px] text-gray-400 leading-relaxed">{v.desc}</p>
              </div>
            ))}
          </div>
        </section>

        {/* ── STADE ──────────────────────────────────────────────────── */}
        <section className="bg-white border border-gray-100 rounded-2xl overflow-hidden shadow-sm">
          <img src="/stade2.jpg" alt="Stade Municipal" className="w-full h-[260px] sm:h-[360px] object-cover" />
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 p-6 sm:p-10">
            <div className="space-y-4">
              <div>
                <p className="text-[10px] uppercase font-bold tracking-widest text-[#008751] mb-1">Notre Antre</p>
                <h2 className="font-display text-xl sm:text-2xl font-extrabold text-gray-900 uppercase">Stade Municipal de Ngaoundéré</h2>
              </div>
              <p className="text-xs sm:text-sm text-gray-500 leading-relaxed">
                Situé au quartier Baladji à Ngaoundéré, le Stade Municipal est l'enceinte emblématique où battent les cœurs des supporters des Vert et Blanc. À 1 392m d'altitude, c'est une forteresse réputée difficile pour tous les adversaires.
              </p>
              <div className="grid grid-cols-3 gap-3 text-center">
                {[
                  { value: '1 000',   label: 'Capacité',  green: false },
                  { value: '1 392m',  label: 'Altitude',  green: true  },
                  { value: 'Baladji', label: 'Quartier',  green: false },
                ].map((s) => (
                  <div key={s.label} className="bg-[#f7f8f7] border border-gray-200/60 rounded-xl py-3">
                    <span className={`font-display text-base font-bold block ${s.green ? 'text-[#008751]' : 'text-gray-900'}`}>{s.value}</span>
                    <span className="text-[9px] text-gray-500 uppercase font-mono">{s.label}</span>
                  </div>
                ))}
              </div>
              <Link href="/calendrier" className="btn-green inline-flex items-center gap-2 text-xs py-2.5 px-5 rounded-xl shadow-sm">
                RÉSERVER BILLETS <ChevronRight className="w-3.5 h-3.5" />
              </Link>
            </div>
            <div className="grid grid-cols-2 gap-3">
              <img src="/stade3.jpg" alt="Stade vue 1" className="w-full h-32 sm:h-40 object-cover rounded-xl border border-gray-100" />
              <img src="/stade4.jpg" alt="Stade vue 2" className="w-full h-32 sm:h-40 object-cover rounded-xl border border-gray-100" />
            </div>
          </div>
        </section>

      </div>
    </div>
  );
}
