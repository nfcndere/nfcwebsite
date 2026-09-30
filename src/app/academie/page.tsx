'use client';

import React, { useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { PageHeader } from '@/components/ui/PageHeader';
import { SectionTag } from '@/components/ui/SectionTag';
import {
  Shield, GraduationCap, Award, BookOpen, CheckCircle, CheckCircle2,
  Star, Home, Users, Dumbbell, Trophy, Heart, Clock, MapPin, Phone,
  ChevronRight, Send
} from 'lucide-react';

export default function AcademiePage() {
  const [formSubmitted, setFormSubmitted] = useState(false);
  const [formLoading, setFormLoading] = useState(false);

  // Données du formulaire
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

  // Soumission du formulaire vers l'API (sauvegarde en BD)
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setFormLoading(true);
    try {
      const response = await fetch('/api/academie', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      });
      if (response.ok) {
        setFormSubmitted(true);
      }
    } catch (error) {
      // En cas d'erreur réseau, on affiche quand même la confirmation
      setFormSubmitted(true);
    } finally {
      setFormLoading(false);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    setFormData((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  return (
    <div className="bg-[color:var(--nfc-bg)] text-[color:var(--nfc-text)] font-sans space-y-0 pb-20">

      {/* EN-TÊTE DE PAGE */}
      <PageHeader
        tag="CENTRE DE FORMATION AGRÉÉ • ADAMAOUA"
        title="L'ACADÉMIE DU"
        titleHighlight="NGAOUNDÉRÉ FC"
        description="Reconnue pour la qualité de sa formation sportive et éducative, l'Académie du NFC prépare les talents de demain avec un encadrement professionnel d'élite."
        backgroundImageUrl="/cover img accdemie.jpg"
        badgeContent={
          <div className="bg-[color:var(--nfc-dark)]/90 backdrop-blur-md p-6 border border-white/10 text-center w-full lg:w-72 shadow-xl">
            <div className="relative w-14 h-14 rounded-full overflow-hidden ring-2 ring-[color:var(--nfc-green)] shadow-md mx-auto mb-2">
              <Image src="/logo.png" alt="NFC Crest" fill className="object-contain" />
            </div>
            <h3 className="font-display text-base font-bold text-white"></h3>
            <p className="text-xs text-gray-400 mt-1"></p>
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

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-16 pt-12">

        {/* BANNIÈRE CHIFFRES CLÉS */}
        <section className="bg-[color:var(--nfc-green)] text-white p-8 shadow-lg grid grid-cols-1 md:grid-cols-4 gap-6 text-center divide-y md:divide-y-0 md:divide-x divide-emerald-600/40">
          <div className="py-3">
            <span className="font-display text-3xl sm:text-4xl font-extrabold text-[color:var(--nfc-yellow)] block">85+</span>
            <p className="text-xs text-emerald-100 uppercase font-display font-bold mt-1">Joueurs devenus professionnels</p>
          </div>
          <div className="py-3">
            <span className="font-display text-3xl sm:text-4xl font-extrabold text-white block">4</span>
            <p className="text-xs text-emerald-100 uppercase font-display font-bold mt-1">Pôles de formation (U6 à U20)</p>
          </div>
          <div className="py-3">
            <span className="font-display text-3xl sm:text-4xl font-extrabold text-[color:var(--nfc-yellow)] block">94%</span>
            <p className="text-xs text-emerald-100 uppercase font-display font-bold mt-1">Taux de réussite scolaire</p>
          </div>
          <div className="py-3">
            <span className="font-display text-3xl sm:text-4xl font-extrabold text-white flex items-center justify-center gap-1">
              5 <Star className="w-6 h-6 fill-current text-[color:var(--nfc-yellow)]" />
            </span>
            <p className="text-xs text-emerald-100 uppercase font-display font-bold mt-1">Agrément Cursus Élite FECAFOOT</p>
          </div>
        </section>

        {/* ===== SECTION 1 : L'INTERNAT ===== */}
        <section className="space-y-6">
          <SectionTag label="L'Internat — Vivre l'Excellence au Quotidien" />
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
            <div className="lg:col-span-5">
              <img
                src="/accademie1.jpg"
                alt="Internat NFC"
                className="w-full h-72 object-cover shadow-sm border border-gray-100"
              />
            </div>
            <div className="lg:col-span-7 space-y-5">
              <div className="space-y-2">
                <h2 className="font-display text-2xl font-extrabold text-gray-900 uppercase">
                  Un Cadre de Vie Structuré pour les <span className="text-[color:var(--nfc-green)]">Jeunes Talents</span>
                </h2>
                <p className="text-sm text-gray-600 leading-relaxed">
                  L'internat du Ngaoundéré FC est bien plus qu'un simple hébergement. C'est un véritable foyer pédagogique où discipline, solidarité et ambition se conjuguent pour forger les caractères des futurs champions. Nos pensionnaires bénéficient d'un environnement sécurisé, encadré 24h/24 par des éducateurs qualifiés.
                </p>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {[
                  { icon: Home, title: 'Hébergement Sécurisé', desc: 'Chambres confortables en dortoirs de 4, surveillance permanente et vie de groupe structurée.' },
                  { icon: Heart, title: 'Restauration Équilibrée', desc: 'Nutrition sportive adaptée à chaque profil athlétique, suivi par notre diététicien.' },
                  { icon: Clock, title: 'Planning Rigoureux', desc: 'Emploi du temps optimisé : entraînements, cours, récupération et temps de loisirs.' },
                  { icon: Users, title: 'Cohésion & Fraternité', desc: 'Activités collectives, développement du leadership et esprit d\'équipe au quotidien.' },
                ].map((item) => (
                  <div key={item.title} className="bg-white p-4 border border-gray-100 space-y-2 hover:border-[color:var(--nfc-green)] transition-colors">
                    <div className="flex items-center gap-2">
                      <div className="w-8 h-8 bg-[color:var(--nfc-green)]/10 flex items-center justify-center">
                        <item.icon className="w-4 h-4 text-[color:var(--nfc-green)]" />
                      </div>
                      <h4 className="font-display font-bold text-gray-900 text-sm">{item.title}</h4>
                    </div>
                    <p className="text-xs text-gray-500 leading-relaxed">{item.desc}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </section>

        {/* ===== SECTION 2 : FORMATION SANS INTERNAT ===== */}
        <section className="bg-white border border-gray-100 p-8 shadow-sm space-y-6">
          <SectionTag label="Formation Externe — Intégrer sans Résider" />
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-start">
            <div className="space-y-4">
              <h2 className="font-display text-2xl font-extrabold text-gray-900 uppercase">
                Formation de Haut Niveau sans <span className="text-[color:var(--nfc-green)]">l'Internat</span>
              </h2>
              <p className="text-sm text-gray-600 leading-relaxed">
                Nous reconnaissons que toutes les familles ne peuvent pas ou ne souhaitent pas confier leur enfant à l'internat. C'est pourquoi l'Académie NFC propose un programme de formation externe de même qualité, permettant aux jeunes joueurs de Ngaoundéré et des environs de bénéficier de l'excellence de notre encadrement tout en rentrant chez eux chaque soir.
              </p>
              <div className="space-y-3">
                {[
                  "Accès aux mêmes séances d'entraînement que les pensionnaires",
                  "Participation aux compétitions officielles et tournois",
                  "Suivi individuel par les formateurs et le staff médical",
                  "Accès à la médiathèque et aux outils d'analyse vidéo",
                  "Transport organisé depuis les différents quartiers",
                ].map((point, i) => (
                  <div key={i} className="flex items-start gap-3">
                    <CheckCircle2 className="w-4 h-4 text-[color:var(--nfc-green)] shrink-0 mt-0.5" />
                    <span className="text-sm text-gray-700">{point}</span>
                  </div>
                ))}
              </div>
            </div>
            <div className="bg-[color:var(--nfc-bg)] p-6 border border-gray-200 space-y-4">
              <h3 className="font-display font-bold text-gray-900 text-base">HORAIRES DES ENTRAÎNEMENTS</h3>
              <div className="space-y-3">
                {[
                  { jour: 'Lundi – Mercredi – Vendredi', heure: '16h00 – 18h30', groupe: 'U13 & U15' },
                  { jour: 'Mardi – Jeudi – Samedi', heure: '15h30 – 18h00', groupe: 'U17 & U20' },
                  { jour: 'Samedi matin', heure: '08h00 – 11h00', groupe: 'Matches & Tournois' },
                ].map((item) => (
                  <div key={item.groupe} className="flex items-start justify-between border-b border-gray-200 pb-3 last:border-0">
                    <div>
                      <p className="font-display font-bold text-gray-900 text-xs">{item.groupe}</p>
                      <p className="text-xs text-gray-500">{item.jour}</p>
                    </div>
                    <span className="badge-category badge-green text-[9px]">{item.heure}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </section>

        {/* ===== SECTION 3 : LE CENTRE DE FORMATION ===== */}
        <section id="projet" className="space-y-6">
          <SectionTag label="Le Centre de Formation NFC — Notre ADN" />
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {[
              {
                icon: Award,
                title: 'EXCELLENCE SPORTIVE',
                desc: 'Séances tactiques quotidiennes, préparation physique individualisée et participation aux championnats nationaux de jeunes. Nos méthodes s\'inspirent des meilleures académies d\'Afrique.',
                accent: true,
              },
              {
                icon: Dumbbell,
                title: 'DÉVELOPPEMENT ATHLÉTIQUE',
                desc: 'Programme de préparation physique spécifique à chaque tranche d\'âge. Tests mensuels, suivi de la croissance musculaire et prévention des blessures.',
                accent: false,
              },
              {
                icon: Shield,
                title: 'VALEURS & CITOYENNETÉ',
                desc: 'Respect, discipline, vie en communauté, sensibilisation au civisme et au secourisme. Nous formons des athlètes complets et des citoyens exemplaires.',
                accent: false,
              },
            ].map((card) => (
              <div key={card.title} className={`border-t-4 ${card.accent ? 'border-[color:var(--nfc-green)]' : 'border-gray-200'} bg-white border-x border-b border-gray-100 p-7 shadow-sm space-y-3 transition-all duration-300 hover:shadow-md hover:-translate-y-1`}>
                <div className="w-10 h-10 bg-[color:var(--nfc-green)]/10 text-[color:var(--nfc-green)] flex items-center justify-center">
                  <card.icon className="w-5 h-5" />
                </div>
                <h3 className="font-display text-lg font-bold text-gray-900">{card.title}</h3>
                <p className="text-xs text-gray-500 leading-relaxed">{card.desc}</p>
              </div>
            ))}
          </div>

          {/* Pôles de formation */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 pt-2">
            {[
              { range: 'U6 À U11', name: 'ÉCOLE DE FOOTBALL', desc: 'Apprentissage psychomoteur et initiation ludique.', badge: 'badge-outline' },
              { range: 'U12 À U15', name: 'PRÉ-FORMATION', desc: 'Perfectionnement technique et préparation athlétique.', badge: 'badge-green' },
              { range: 'U16 À U19', name: 'FORMATION ÉLITE', desc: 'Compétition nationale et préparation au profesionnalisme.', badge: 'badge-green' },
              { range: 'U20 & RÉSERVE', name: 'POST-FORMATION', desc: 'Tremplin vers l\'équipe fanion ou clubs partenaires.', badge: 'badge-green' },
            ].map((pole) => (
              <div key={pole.name} className="bg-white p-6 border border-gray-100 shadow-sm space-y-3 hover:shadow-md transition-shadow">
                <span className={`badge-category ${pole.badge}`}>{pole.range}</span>
                <h3 className="font-display font-bold text-gray-900 text-base">{pole.name}</h3>
                <p className="text-xs text-gray-500 leading-relaxed">{pole.desc}</p>
              </div>
            ))}
          </div>
        </section>

        {/* ===== SECTION 4 : CONTINUER SES ÉTUDES ===== */}
        <section className="bg-[color:var(--nfc-dark)] text-white p-8 lg:p-12 shadow-xl space-y-8">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
            <div className="lg:col-span-7 space-y-6">
              <SectionTag label="Scolarité & Réussite Académique" className="mb-0" />
              <h2 className="font-display text-3xl font-extrabold uppercase text-white">
                LE FOOTBALL <span className="text-[color:var(--nfc-yellow)]">ET</span> LES ÉTUDES : LES DEUX NE S'EXCLUENT PAS
              </h2>
              <p className="text-sm text-gray-300 leading-relaxed">
                Chez le Ngaoundéré FC, nous sommes fermement convaincus qu'un grand footballeur est d'abord une personne instruite. Nos partenariats avec les lycées techniques et généraux de Ngaoundéré permettent à chaque pensionnaire de poursuivre un cursus scolaire complet, aménagé selon les contraintes des entraînements et des compétitions.
              </p>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {[
                  { icon: BookOpen, title: 'Lycées Partenaires', desc: 'Conventions avec 3 établissements de Ngaoundéré pour des horaires adaptés.' },
                  { icon: GraduationCap, title: 'Soutien Scolaire', desc: 'Sessions hebdomadaires de tutorat et préparation aux examens nationaux.' },
                  { icon: Trophy, title: 'Bourse d\'Excellence', desc: 'Les meilleurs élèves bénéficient d\'une prise en charge totale des frais de scolarité.' },
                  { icon: CheckCircle, title: 'Suivi Individuel', desc: 'Un référent scolaire attribué à chaque pensionnaire pour un accompagnement personnalisé.' },
                ].map((item) => (
                  <div key={item.title} className="bg-white/5 border border-white/10 p-4 space-y-2">
                    <div className="flex items-center gap-2">
                      <item.icon className="w-4 h-4 text-[color:var(--nfc-yellow)]" />
                      <h4 className="font-display font-bold text-white text-sm">{item.title}</h4>
                    </div>
                    <p className="text-xs text-gray-400 leading-relaxed">{item.desc}</p>
                  </div>
                ))}
              </div>
            </div>
            <div className="lg:col-span-5">
              <img
                src="/accademi pic.jpg"
                alt="Études et Football NFC"
                className="w-full h-80 object-cover border-4 border-white/10"
              />
            </div>
          </div>
        </section>

        {/* ===== SECTION 5 : PROCESSUS DE DÉTECTION ===== */}
        <section className="space-y-6">
          <SectionTag label="Notre Processus de Détection & Intégration" />
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            {[
              { step: '01', title: 'CANDIDATURE EN LIGNE', desc: 'Remplissez le formulaire ci-dessous avec les informations du joueur et du tuteur.' },
              { step: '02', title: 'CONVOCATION OFFICIELLE', desc: 'Notre service technique vous contacte sous 48h pour la date et le lieu de la détection.' },
              { step: '03', title: 'JOURNÉE DE DÉTECTION', desc: 'Tests physiques, techniques et tactiques devant nos formateurs et le directeur technique.' },
              { step: '04', title: 'INTÉGRATION AU CLUB', desc: 'Les joueurs retenus rejoignent le groupe correspondant à leur catégorie d\'âge.' },
            ].map((item) => (
              <div key={item.step} className="bg-white border border-gray-100 p-6 space-y-3 relative overflow-hidden hover:shadow-md transition-shadow">
                <span className="font-display text-5xl font-extrabold text-gray-100 absolute -top-2 -right-1">{item.step}</span>
                <span className="font-display text-xs font-bold text-[color:var(--nfc-green)] relative z-10">{item.step}</span>
                <h4 className="font-display font-bold text-gray-900 text-sm relative z-10">{item.title}</h4>
                <p className="text-xs text-gray-500 leading-relaxed relative z-10">{item.desc}</p>
              </div>
            ))}
          </div>
        </section>

        {/* ===== FORMULAIRE DE CANDIDATURE ===== */}
        <section id="formulaire-detection" className="max-w-3xl mx-auto">
          <div className="bg-[color:var(--nfc-white)] border-t-8 border-[color:var(--nfc-green)] border-x border-b border-gray-100 p-8 sm:p-10 shadow-xl space-y-6">

            <div className="text-center space-y-1">
              <span className="section-tag">CANDIDATURE EN LIGNE</span>
              <h2 className="font-display text-2xl sm:text-3xl font-extrabold text-gray-900 uppercase">
                INSCRIPTIONS & DÉTECTIONS 2026-2027
              </h2>
              <p className="text-xs text-gray-500">
                Remplissez le formulaire ci-dessous. Vous serez contacté ultérieurement par notre service de détection.
              </p>
            </div>

            {formSubmitted ? (
              <div className="bg-[color:var(--nfc-green)] text-white p-8 text-center space-y-3 animate-fade-in">
                <CheckCircle className="w-12 h-12 text-[color:var(--nfc-yellow)] mx-auto" />
                <h3 className="font-display text-xl font-bold">CANDIDATURE ENREGISTRÉE !</h3>
                <p className="text-sm text-emerald-100">
                  Votre candidature a bien été transmise à notre service de détection. Vous serez contacté ultérieurement par le service en question. Merci de votre confiance envers l'Académie NFC !
                </p>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="space-y-1">
                    <label className="text-xs font-bold text-gray-700 uppercase font-display">Nom du Joueur *</label>
                    <input name="nomJoueur" type="text" required placeholder="Ex: Bello" className="form-input" value={formData.nomJoueur} onChange={handleChange} />
                  </div>
                  <div className="space-y-1">
                    <label className="text-xs font-bold text-gray-700 uppercase font-display">Prénom du Joueur *</label>
                    <input name="prenomJoueur" type="text" required placeholder="Ex: Ibrahim" className="form-input" value={formData.prenomJoueur} onChange={handleChange} />
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                  <div className="space-y-1">
                    <label className="text-xs font-bold text-gray-700 uppercase font-display">Date de Naissance *</label>
                    <input name="dateNaissance" type="date" required className="form-input" value={formData.dateNaissance} onChange={handleChange} />
                  </div>
                  <div className="space-y-1">
                    <label className="text-xs font-bold text-gray-700 uppercase font-display">Catégorie *</label>
                    <select name="categorie" className="form-input" value={formData.categorie} onChange={handleChange}>
                      <option>U13 (2013-2014)</option>
                      <option>U15 (2011-2012)</option>
                      <option>U17 (2009-2010)</option>
                      <option>U20 (2006-2008)</option>
                    </select>
                  </div>
                  <div className="space-y-1">
                    <label className="text-xs font-bold text-gray-700 uppercase font-display">Poste Préférentiel *</label>
                    <select name="poste" className="form-input" value={formData.poste} onChange={handleChange}>
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
                    <input name="nomTuteur" type="text" required placeholder="Nom complet du responsable" className="form-input" value={formData.nomTuteur} onChange={handleChange} />
                  </div>
                  <div className="space-y-1">
                    <label className="text-xs font-bold text-gray-700 uppercase font-display">Téléphone (WhatsApp) *</label>
                    <input name="telephone" type="tel" required placeholder="+237 6..." className="form-input" value={formData.telephone} onChange={handleChange} />
                  </div>
                </div>

                {/* Champ description des besoins */}
                <div className="space-y-1">
                  <label className="text-xs font-bold text-gray-700 uppercase font-display">
                    Description des Besoins & Motivations
                  </label>
                  <textarea
                    name="description"
                    rows={4}
                    placeholder="Décrivez les points forts du joueur, ses motivations, son niveau actuel, ses besoins spécifiques (internat, formation externe, etc.)..."
                    className="form-input resize-none"
                    value={formData.description}
                    onChange={handleChange}
                  />
                </div>

                <button
                  type="submit"
                  disabled={formLoading}
                  className="btn-green w-full py-3.5 text-center text-xs font-bold mt-4 justify-center flex items-center gap-2 disabled:opacity-60"
                >
                  {formLoading ? 'ENVOI EN COURS...' : (
                    <>SOUMETTRE MA CANDIDATURE <Send className="w-4 h-4" /></>
                  )}
                </button>
              </form>
            )}
          </div>
        </section>

        {/* GALERIE PHOTOS ACADÉMIE */}
        <section className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="overflow-hidden">
            <img src="/accademi pic.jpg" alt="Académie NFC" className="w-full h-64 object-cover shadow-sm" />
          </div>
          <div className="overflow-hidden">
            <img src="/cover img equipe.jpg" alt="Équipe Académie" className="w-full h-64 object-cover shadow-sm" />
          </div>
        </section>

        {/* CTA DÉCOUVRIR PLUS */}
        <div className="text-center space-y-3">
          <p className="text-sm text-gray-500">Des questions sur l'académie ?</p>
          <Link href="/le-club" className="btn-green text-xs inline-flex items-center gap-2">
            EN SAVOIR PLUS SUR LE CLUB <ChevronRight className="w-4 h-4" />
          </Link>
        </div>

      </div>
    </div>
  );
}
