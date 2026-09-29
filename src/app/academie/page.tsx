'use client';

import React, { useState } from 'react';
import Image from 'next/image';
import { PageHeader } from '@/components/ui/PageHeader';
import { Shield, GraduationCap, Award, BookOpen, CheckCircle, Star } from 'lucide-react';

export default function AcademiePage() {
  const [formSubmitted, setFormSubmitted] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setFormSubmitted(true);
  };

  return (
    <div className="bg-[color:var(--nfc-bg)] text-[color:var(--nfc-text)] font-sans space-y-12 pb-20">

      {/* PAGE HERO HEADER WITH BACKGROUND IMAGE */}
      <PageHeader
        tag="CENTRE DE FORMATION AGRÉÉ • ADAMAOUA"
        title="L'ACADÉMIE DU"
        titleHighlight="NGAOUNDÉRÉ FC"
        description="Reconnue pour la qualité de sa formation sportive et éducative, l'Académie du NFC prépare les talents de demain avec un encadrement professionnel d'élite."
        backgroundImageUrl="/cover img accdemie.jpg"
        
        badgeContent={
          <div className="bg-[color:var(--nfc-dark)]/90 backdrop-blur-md p-6 rounded-2xl border border-white/10 text-center w-full lg:w-72 shadow-xl">
            <div className="relative w-14 h-14 rounded-full overflow-hidden ring-2 ring-[color:var(--nfc-green)] shadow-md mx-auto mb-2">
              <Image src="/logo.png" alt="NFC Crest" fill className="object-contain" />
            </div>
            <h3 className="font-display text-base font-bold text-white">LABEL 5 ÉTOILES</h3>
            <p className="text-xs text-gray-400 mt-1">Agrément officiel FECAFOOT</p>
          </div>
        }
      >
        <div className="flex flex-wrap gap-3 pt-2">
          <a href="#formulaire-detection" className="btn-yellow text-xs">
            S'INSCRIRE AUX DÉTECTIONS
          </a>
          <a href="#projet" className="btn-dark text-xs">
            BROCHURE PÉDAGOGIQUE
          </a>
        </div>
      </PageHeader>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12">

        {/* GREEN STATS BANNER */}
        <section className=" text-white rounded-2xl p-8 shadow-lg grid grid-cols-1 md:grid-cols-3 gap-6 text-center divide-y md:divide-y-0 md:divide-x divide-[color:var(--nfc-green)]/60">
          <div className="py-2">
            <span className="font-display text-3xl sm:text-4xl font-extrabold text-[color:var(--nfc-yellow)]">85+</span>
            <p className="text-xs text-[color:var(--nfc-surface)] uppercase font-display font-bold mt-1">Joueurs devenus professionnels</p>
          </div>
          <div className="py-2">
            <span className="font-display text-3xl sm:text-4xl font-extrabold text-[color:var(--nfc-dark)]">4</span>
            <p className="text-xs text-[color:var(--nfc-surface)] uppercase font-display font-bold mt-1">Pôles de formation (U6 à U20)</p>
          </div>
          <div className="py-2">
            <span className="font-display text-3xl sm:text-4xl font-extrabold text-[color:var(--nfc-yellow)] flex items-center justify-center gap-1">
              5 <Star className="w-6 h-6 fill-current text-[color:var(--nfc-yellow)]" />
            </span>
            <p className="text-xs text-[color:var(--nfc-surface)] uppercase font-display font-bold mt-1">Agrément Cursus Élite FECAFOOT</p>
          </div>
        </section>

        {/* LE TRIPLE PROJET SECTION */}
        <section id="projet" className="space-y-6">
          <div className="text-center space-y-1 max-w-xl mx-auto">
            <span className="section-tag">NOTRE PHILOSOPHIE</span>
            <h2 className="font-display text-3xl font-extrabold text-gray-900 uppercase">LE TRIPLE PROJET NFC</h2>
            <p className="text-xs text-gray-500">
              Former des athlètes complets capables de réussir sur le terrain et dans la vie.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="bg-[color:var(--nfc-white)] rounded-2xl border-t-4 border-[color:var(--nfc-green)] border-x border-b border-gray-100 p-7 shadow-sm space-y-3 transition-all duration-300 hover:shadow-md hover:-translate-y-1">
                <div className="w-10 h-10 rounded-xl bg-[color:var(--nfc-green)]/10 text-[color:var(--nfc-green)] flex items-center justify-center">
                <Award className="w-5 h-5" />
              </div>
              <h3 className="font-display text-lg font-bold text-gray-900">EXCELLENCE SPORTIVE</h3>
              <p className="text-xs text-gray-500 leading-relaxed">
                Séances tactiques quotidiennes, préparation physique individualisée et participation aux championnats nationaux de jeunes.
              </p>
            </div>

            <div className="bg-white rounded-2xl border-t-4 border-[#008751] border-x border-b border-gray-100 p-7 shadow-sm space-y-3 transition-all duration-300 hover:shadow-md hover:-translate-y-1">
              <div className="w-10 h-10 rounded-xl bg-[#008751]/10 text-[#008751] flex items-center justify-center">
                <BookOpen className="w-5 h-5" />
              </div>
              <h3 className="font-display text-lg font-bold text-gray-900">ÉTUDES & SCOLARITÉ</h3>
              <p className="text-xs text-gray-500 leading-relaxed">
                Scolarité aménagée avec nos lycées partenaires de Ngaoundéré. Soutien scolaire obligatoire et préparation aux diplômes.
              </p>
            </div>

            <div className="bg-white rounded-2xl border-t-4 border-[#008751] border-x border-b border-gray-100 p-7 shadow-sm space-y-3 transition-all duration-300 hover:shadow-md hover:-translate-y-1">
              <div className="w-10 h-10 rounded-xl bg-[#008751]/10 text-[#008751] flex items-center justify-center">
                <GraduationCap className="w-5 h-5" />
              </div>
              <h3 className="font-display text-lg font-bold text-gray-900">CITOYENNETÉ & VALEURS</h3>
              <p className="text-xs text-gray-500 leading-relaxed">
                Apprentissage du respect, de la discipline, de la vie en communauté et sensibilisation au secourisme et au civisme.
              </p>
            </div>
          </div>
        </section>

        {/* PÔLES DE FORMATION GRID */}
        <section className="space-y-6">
          <div className="border-b border-gray-200 pb-3">
            <span className="section-tag">PARCOURS DU JOUEUR</span>
            <h2 className="font-display text-3xl font-extrabold text-gray-900 uppercase">LES PÔLES DE FORMATION</h2>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            <div className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm space-y-3 transition-all duration-300 hover:shadow-md">
              <span className="badge-category badge-outline">U6 À U11</span>
              <h3 className="font-display font-bold text-gray-900 text-base">ÉCOLE DE FOOTBALL</h3>
              <p className="text-xs text-gray-500 leading-relaxed">
                Apprentissage des gestes psychomoteurs de base et initiation ludique à la passion du ballon.
              </p>
            </div>

            <div className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm space-y-3 transition-all duration-300 hover:shadow-md">
              <span className="badge-category badge-green">U12 À U15</span>
              <h3 className="font-display font-bold text-gray-900 text-base">PRÉ-FORMATION</h3>
              <p className="text-xs text-gray-500 leading-relaxed">
                Perfectionnement technique, compréhension tactique du jeu et début de la préparation athlétique.
              </p>
            </div>

            <div className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm space-y-3 transition-all duration-300 hover:shadow-md">
              <span className="badge-category badge-green">U16 À U19</span>
              <h3 className="font-display font-bold text-gray-900 text-base">FORMATION</h3>
              <p className="text-xs text-gray-500 leading-relaxed">
                Exigence de la compétition nationale, travail d'intensité et préparation au statut de professionnel.
              </p>
            </div>

            <div className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm space-y-3 transition-all duration-300 hover:shadow-md">
              <span className="badge-category badge-green">U20 & RÉSERVE</span>
              <h3 className="font-display font-bold text-gray-900 text-base">POST-FORMATION</h3>
              <p className="text-xs text-gray-500 leading-relaxed">
                Tremplin vers l'équipe fanion du NFC ou des clubs partenaires en Europe et en Afrique.
              </p>
            </div>
          </div>
        </section>

        {/* CANDIDATURE FORM */}
        <section id="formulaire-detection" className="max-w-3xl mx-auto pt-4">
            <div className="bg-[color:var(--nfc-white)] rounded-2xl border-t-8 border-[color:var(--nfc-green)] border-x border-b border-gray-100 p-8 sm:p-10 shadow-xl space-y-6">

            <div className="text-center space-y-1">
              <span className="section-tag">CANDIDATURE EN LIGNE</span>
              <h2 className="font-display text-2xl sm:text-3xl font-extrabold text-gray-900 uppercase">
                INSCRIPTIONS & DÉTECTIONS 2025-2026
              </h2>
              <p className="text-xs text-gray-500">
                Remplissez le formulaire ci-dessous pour inscrire votre enfant aux journées de détection officielle.
              </p>
            </div>

            {formSubmitted ? (
                <div className="bg-[color:var(--nfc-green)] text-white p-8 rounded-2xl text-center space-y-3 animate-fade-in">
                <CheckCircle className="w-12 h-12 text-[color:var(--nfc-yellow)] mx-auto" />
                <h3 className="font-display text-xl font-bold">CANDIDATURE ENREGISTRÉE !</h3>
                <p className="text-xs text-emerald-100">
                  Notre secrétariat technique vous contactera par téléphone sous 48h pour vous communiquer la convocation officielle.
                </p>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="space-y-1">
                    <label className="text-xs font-bold text-gray-700 uppercase font-display">Nom du Joueur *</label>
                    <input type="text" required placeholder="Ex: Bello" className="form-input" />
                  </div>

                  <div className="space-y-1">
                    <label className="text-xs font-bold text-gray-700 uppercase font-display">Prénom du Joueur *</label>
                    <input type="text" required placeholder="Ex: Ibrahim" className="form-input" />
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                  <div className="space-y-1">
                    <label className="text-xs font-bold text-gray-700 uppercase font-display">Date de Naissance *</label>
                    <input type="date" required className="form-input" />
                  </div>

                  <div className="space-y-1">
                    <label className="text-xs font-bold text-gray-700 uppercase font-display">Catégorie *</label>
                    <select className="form-input">
                      <option>U13 (2013-2014)</option>
                      <option>U15 (2011-2012)</option>
                      <option>U17 (2009-2010)</option>
                      <option>U20 (2006-2008)</option>
                    </select>
                  </div>

                  <div className="space-y-1">
                    <label className="text-xs font-bold text-gray-700 uppercase font-display">Poste Préférentiel *</label>
                    <select className="form-input">
                      <option>Gardien de But</option>
                      <option>Défenseur Central / Latéral</option>
                      <option>Milieu de Terrain</option>
                      <option>Attaquant / Ailier</option>
                    </select>
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="space-y-1">
                    <label className="text-xs font-bold text-gray-700 uppercase font-display">Nom du Tuteur / Parent *</label>
                    <input type="text" required placeholder="Nom complet du responsable" className="form-input" />
                  </div>

                  <div className="space-y-1">
                    <label className="text-xs font-bold text-gray-700 uppercase font-display">Téléphone (WhatsApp) *</label>
                    <input type="tel" required placeholder="+237 6..." className="form-input" />
                  </div>
                </div>

                <button type="submit" className="btn-green w-full py-3.5 text-center text-xs font-bold mt-4 justify-center">
                  SOUMETTRE MA CANDIDATURE AUX DÉTECTIONS &rarr;
                </button>
              </form>
            )}

          </div>
        </section>

        {/* ACADEMY IMAGES */}
        <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="rounded-2xl overflow-hidden">
              <img src="/accademi pic.jpg" alt="Académie NFC" className="w-full h-64 object-cover rounded-2xl shadow-sm" />
            </div>
            <div className="rounded-2xl overflow-hidden">
              <img src="/cover img equipe.jpg" alt="Équipe Académie" className="w-full h-64 object-cover rounded-2xl shadow-sm" />
            </div>
          </div>
        </section>

      </div>

    </div>
  );
}
