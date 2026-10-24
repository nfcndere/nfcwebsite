'use client';

import React, { useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { PageHeader } from '@/components/ui/PageHeader';
import {
  BookOpen, CheckCircle, Home, Users, Heart, Clock,
  ChevronRight, Send, Trophy, GraduationCap,
} from 'lucide-react';
import { useClubOverview } from '@/components/providers/ClubOverviewProvider';

// ─── Page ─────────────────────────────────────────────────────────────────────
export default function AcademiePage() {
  const [formSubmitted, setFormSubmitted] = useState(false);
  const [formLoading, setFormLoading] = useState(false);
  const [formError, setFormError] = useState('');
  const { data: overview } = useClubOverview();
  const [formData, setFormData] = useState({
    nomJoueur: '',
    prenomJoueur: '',
    dateNaissance: '',
    categorie: 'U13',
    poste: 'Gardien de But',
    nomTuteur: '',
    telephone: '',
    description: '',
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setFormLoading(true);
    setFormError('');
    try {
      const response = await fetch('/api/academie', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      });
      if (!response.ok) {
        const result = await response.json();
        throw new Error(result.message || result.error || 'Impossible d’enregistrer la candidature.');
      }
      setFormSubmitted(true);
    } catch (error) {
      setFormError(error instanceof Error ? error.message : 'Impossible de contacter le service.');
    } finally {
      setFormLoading(false);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    setFormData((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  return (
    <div className="bg-[#f7f8f7] text-[#1f2937] font-sans pb-20">

      {/* EN-TÊTE */}
      <PageHeader
        tag="CENTRE DE FORMATION • ADAMAOUA"
        title="L'ACADÉMIE DU"
        titleHighlight="NGAOUNDÉRÉ FC"
        description="L'Académie du Ngaoundéré FC présente son parcours de formation et recueille les candidatures des jeunes joueurs."
        backgroundImageUrl="/cover img accdemie.jpg"
        
      >
        <div className="flex flex-wrap gap-3 pt-2">
          <a href="#formulaire-detection" className="btn-yellow text-xs">S'INSCRIRE AUX DÉTECTIONS</a>
          <a href="#formation" className="btn-dark text-xs">EN SAVOIR PLUS</a>
        </div>
      </PageHeader>

      <div className="max-w-6xl mx-auto px-3 sm:px-6 lg:px-8 pt-8 sm:pt-10 space-y-12 sm:space-y-16">

        <section className="rounded-2xl border border-gray-100 bg-white p-6 shadow-sm">
          <p className="text-[10px] font-bold uppercase tracking-widest text-[#008751]">
            {overview?.season?.label ? `Saison ${overview.season.label}` : 'Saison non communiquée'}
          </p>
          <h2 className="mt-1 font-display text-xl font-extrabold uppercase text-gray-900">Encadrement technique & médical</h2>
          <p className="mt-2 text-sm text-gray-600">Les informations sur l’encadrement seront publiées lorsqu’elles auront été confirmées par le club.</p>
        </section>

        {/* ── L'INTERNAT ──────────────────────────────────────────── */}
        <section id="formation" className="grid grid-cols-1 lg:grid-cols-2 gap-10 items-center">
          <div className="overflow-hidden rounded-2xl border border-gray-100 shadow-sm">
            <img
              src="/accademie1.jpg"
              alt="Internat NFC"
              className="w-full h-72 sm:h-96 object-cover hover:scale-105 transition-transform duration-500"
            />
          </div>
          <div className="space-y-6">
            <div>
              <p className="text-[10px] uppercase font-bold tracking-widest text-[#008751] mb-1">Cadre de Vie</p>
              <h2 className="font-display text-xl sm:text-2xl font-extrabold text-gray-900 uppercase">L'Internat du NFC</h2>
            </div>
            <p className="text-sm text-gray-500 leading-relaxed">
              L'internat du Ngaoundéré FC est un foyer pédagogique où discipline, solidarité et ambition se conjuguent pour forger les caractères des futurs champions. Nos pensionnaires bénéficient d'un environnement sécurisé, encadré 24h/24.
            </p>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {[
                { icon: Home,  title: 'Hébergement',       desc: 'Chambres confortables et surveillance permanente.' },
                { icon: Heart, title: 'Nutrition Sportive', desc: 'Alimentation équilibrée et suivi diététique.' },
                { icon: Clock, title: 'Planning Structuré', desc: 'Entraînements, cours et récupération optimisés.' },
                { icon: Users, title: "Cohésion d'Équipe",  desc: 'Leadership et esprit de groupe développés au quotidien.' },
              ].map((item) => (
                <div key={item.title} className="flex items-start gap-3 bg-white p-4 border border-gray-100 rounded-xl hover:border-[#008751]/30 transition-colors">
                  <div className="w-8 h-8 rounded-lg bg-[#008751]/8 flex items-center justify-center shrink-0">
                    <item.icon className="w-4 h-4 text-[#008751]" />
                  </div>
                  <div>
                    <h4 className="font-display font-bold text-gray-900 text-xs">{item.title}</h4>
                    <p className="text-xs text-gray-500 leading-relaxed mt-0.5">{item.desc}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* ── PÔLES DE FORMATION ───────────────────────────────────── */}
        <section className="space-y-6">
          <div>
            <p className="text-[10px] uppercase font-bold tracking-widest text-[#008751] mb-1">Notre Système</p>
            <h2 className="font-display text-xl sm:text-2xl font-extrabold text-gray-900 uppercase">Pôles de Formation</h2>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {[
              { range: 'U6 – U11',      name: 'ÉCOLE DE FOOTBALL', desc: 'Apprentissage psychomoteur et initiation ludique.', accent: false },
              { range: 'U12 – U15',     name: 'PRÉ-FORMATION',     desc: 'Perfectionnement technique et préparation athlétique.', accent: true  },
              { range: 'U16 – U19',     name: 'FORMATION ÉLITE',   desc: 'Compétition nationale et préparation au professionnalisme.', accent: true  },
              { range: 'U20 & RÉSERVE', name: 'POST-FORMATION',    desc: "Tremplin vers l'équipe fanion ou les clubs partenaires.", accent: false },
            ].map((pole) => (
              <div key={pole.name} className={`bg-white p-6 border-t-2 border-x border-b border-gray-100 rounded-2xl shadow-sm space-y-2.5 hover:shadow-md transition-all ${pole.accent ? 'border-t-[#008751]' : 'border-t-gray-200'}`}>
                <span className="text-[9px] font-bold uppercase tracking-widest text-[#008751]">{pole.range}</span>
                <h3 className="font-display font-bold text-gray-900 text-sm">{pole.name}</h3>
                <p className="text-xs text-gray-500 leading-relaxed">{pole.desc}</p>
              </div>
            ))}
          </div>
        </section>

        {/* ── SCOLARITÉ ───────────────────────────────────────────── */}
        <section className="bg-[#0c130e] text-white rounded-2xl p-6 sm:p-12">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 items-center">
            <div className="space-y-6">
              <div>
                <p className="text-[10px] uppercase tracking-widest font-bold text-[#008751] mb-1">Cursus Intégré</p>
                <h2 className="font-display text-xl sm:text-2xl font-extrabold uppercase text-white">Football & Études : Les Deux à la Fois</h2>
              </div>
              <p className="text-sm text-gray-300 leading-relaxed">
              Les modalités d’accompagnement scolaire sont à préciser par le club.
              </p>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {[
                  { icon: BookOpen,      title: 'Parcours scolaire', desc: 'Informations sur l’organisation scolaire à confirmer par le club.' },
                  { icon: GraduationCap, title: 'Soutien Scolaire',   desc: 'Tutorat hebdomadaire et préparation aux examens nationaux.' },
                  { icon: Trophy,        title: "Bourse d'Excellence", desc: 'Prise en charge des frais scolaires pour les meilleurs élèves.' },
                  { icon: CheckCircle,   title: 'Suivi Individuel',   desc: 'Un référent scolaire attribué à chaque pensionnaire.' },
                ].map((item) => (
                  <div key={item.title} className="bg-white/5 border border-white/10 p-4 rounded-xl space-y-1.5">
                    <div className="flex items-center gap-2">
                      <item.icon className="w-4 h-4 text-[color:var(--nfc-yellow)]" />
                      <h4 className="font-display font-bold text-white text-xs">{item.title}</h4>
                    </div>
                    <p className="text-xs text-gray-400 leading-relaxed">{item.desc}</p>
                  </div>
                ))}
              </div>
            </div>
            <div className="overflow-hidden rounded-2xl border-4 border-white/10">
              <img src="/accademi pic.jpg" alt="Études et Football NFC" className="w-full h-72 sm:h-96 object-cover" />
            </div>
          </div>
        </section>

        {/* ── PROCESSUS DE DÉTECTION ───────────────────────────────── */}
        <section className="space-y-6">
          <div>
            <p className="text-[10px] uppercase font-bold tracking-widest text-[#008751] mb-1">Rejoindre l'Académie</p>
            <h2 className="font-display text-xl sm:text-2xl font-extrabold text-gray-900 uppercase">Processus de Détection</h2>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            {[
              { step: '01', title: 'CANDIDATURE',  desc: 'Remplissez le formulaire avec les informations du joueur et du tuteur.' },
              { step: '02', title: 'CONVOCATION',   desc: 'Notre service technique vous contacte sous 48h pour la date et lieu.' },
              { step: '03', title: 'DÉTECTION',     desc: 'Tests physiques, techniques et tactiques devant nos formateurs.' },
              { step: '04', title: 'INTÉGRATION',   desc: "Les joueurs retenus rejoignent le groupe de leur catégorie d'âge." },
            ].map((item) => (
              <div key={item.step} className="bg-white border border-gray-100 p-6 rounded-2xl space-y-2.5 relative overflow-hidden hover:shadow-md hover:border-[#008751]/30 transition-all">
                <span className="font-display text-6xl font-extrabold text-gray-100 absolute -top-3 -right-1 pointer-events-none select-none">{item.step}</span>
                <span className="font-display text-xs font-bold text-[#008751] relative z-10">{item.step}</span>
                <h4 className="font-display font-bold text-gray-900 text-sm relative z-10">{item.title}</h4>
                <p className="text-xs text-gray-500 leading-relaxed relative z-10">{item.desc}</p>
              </div>
            ))}
          </div>
        </section>

        {/* ── FORMULAIRE ───────────────────────────────────────────── */}
        <section id="formulaire-detection" className="max-w-3xl mx-auto">
          <div className="bg-white border-t-4 border-[#008751] border-x border-b border-gray-100 p-6 sm:p-10 rounded-2xl shadow-sm space-y-6">
            <div className="text-center space-y-1.5">
              <p className="text-[10px] uppercase font-bold tracking-widest text-[#008751]">Candidature en Ligne</p>
              <h2 className="font-display text-xl sm:text-2xl font-extrabold text-gray-900 uppercase">Inscriptions & détections {overview?.season?.label ?? ''}</h2>
              <p className="text-xs text-gray-500">Remplissez le formulaire. Notre service de détection vous contactera rapidement.</p>
            </div>

            {formSubmitted ? (
              <div className="bg-[#008751] text-white p-8 rounded-2xl text-center space-y-3">
                <CheckCircle className="w-12 h-12 text-[color:var(--nfc-yellow)] mx-auto" />
                <h3 className="font-display text-xl font-bold">CANDIDATURE ENREGISTRÉE !</h3>
                <p className="text-sm text-emerald-100 leading-relaxed">
                  Votre candidature a bien été transmise à notre service de détection. Vous serez contacté ultérieurement. Merci de votre confiance !
                </p>
              </div>
            ) : (
              <>
              {formError && <p role="alert" aria-live="polite" className="rounded-lg bg-rose-50 p-3 text-sm text-rose-700">{formError}</p>}
              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="space-y-1">
                    <label className="text-xs font-bold text-gray-700 uppercase font-display">Nom du Joueur *</label>
                    <input name="nomJoueur" type="text" required placeholder="Ex: Bello" className="form-input rounded-xl" value={formData.nomJoueur} onChange={handleChange} />
                  </div>
                  <div className="space-y-1">
                    <label className="text-xs font-bold text-gray-700 uppercase font-display">Prénom du Joueur *</label>
                    <input name="prenomJoueur" type="text" required placeholder="Ex: Ibrahim" className="form-input rounded-xl" value={formData.prenomJoueur} onChange={handleChange} />
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                  <div className="space-y-1">
                    <label className="text-xs font-bold text-gray-700 uppercase font-display">Date de Naissance *</label>
                    <input name="dateNaissance" type="date" required className="form-input rounded-xl" value={formData.dateNaissance} onChange={handleChange} />
                  </div>
                  <div className="space-y-1">
                    <label className="text-xs font-bold text-gray-700 uppercase font-display">Catégorie *</label>
                    <select name="categorie" className="form-input rounded-xl" value={formData.categorie} onChange={handleChange}>
                      <option>U13 (2013-2014)</option>
                      <option>U15 (2011-2012)</option>
                      <option>U17 (2009-2010)</option>
                      <option>U20 (2006-2008)</option>
                    </select>
                  </div>
                  <div className="space-y-1">
                    <label className="text-xs font-bold text-gray-700 uppercase font-display">Poste *</label>
                    <select name="poste" className="form-input rounded-xl" value={formData.poste} onChange={handleChange}>
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
                    <input name="nomTuteur" type="text" required placeholder="Nom complet du responsable" className="form-input rounded-xl" value={formData.nomTuteur} onChange={handleChange} />
                  </div>
                  <div className="space-y-1">
                    <label className="text-xs font-bold text-gray-700 uppercase font-display">Téléphone (WhatsApp) *</label>
                    <input name="telephone" type="tel" required placeholder="+237 6..." className="form-input rounded-xl" value={formData.telephone} onChange={handleChange} />
                  </div>
                </div>

                <div className="space-y-1">
                  <label className="text-xs font-bold text-gray-700 uppercase font-display">Motivations & Points Forts</label>
                  <textarea
                    name="description"
                    rows={4}
                    placeholder="Décrivez les points forts du joueur, ses motivations, son niveau actuel..."
                    className="form-input resize-none rounded-xl"
                    value={formData.description}
                    onChange={handleChange}
                  />
                </div>

                <button
                  type="submit"
                  disabled={formLoading}
                  className="btn-green w-full py-3.5 text-center text-xs font-bold mt-2 justify-center flex items-center gap-2 rounded-xl shadow-sm disabled:opacity-60"
                >
                  {formLoading ? 'ENVOI EN COURS...' : (<>SOUMETTRE MA CANDIDATURE <Send className="w-4 h-4" /></>)}
                </button>
              </form>
              </>
            )}
          </div>
        </section>

        {/* ── GALERIE ──────────────────────────────────────────────── */}
        <section className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="overflow-hidden rounded-2xl border border-gray-100 shadow-sm">
            <img src="/accademi pic.jpg" alt="Académie NFC" className="w-full h-60 sm:h-72 object-cover hover:scale-105 transition-transform duration-500" />
          </div>
          <div className="overflow-hidden rounded-2xl border border-gray-100 shadow-sm">
            <img src="/cover img equipe.jpg" alt="Équipe Académie" className="w-full h-60 sm:h-72 object-cover hover:scale-105 transition-transform duration-500" />
          </div>
        </section>

        {/* ── CTA ──────────────────────────────────────────────────── */}
        <div className="text-center space-y-3">
          <p className="text-sm text-gray-500">Des questions sur l'académie ?</p>
          <Link href="/le-club" className="btn-green text-xs inline-flex items-center gap-2 py-2.5 px-5 rounded-xl shadow-sm">
            EN SAVOIR PLUS SUR LE CLUB <ChevronRight className="w-4 h-4" />
          </Link>
        </div>

      </div>
    </div>
  );
}
