'use client';

import React, { useState } from 'react';
import Image from 'next/image';
import { PageHeader } from '@/components/ui/PageHeader';
import { SectionTag } from '@/components/ui/SectionTag';
import { MATCHES_DATA } from '@/lib/mock-data';
import { MatchItem } from '@/types';
import { Calendar, MapPin, Shield, Ticket, X, ChevronRight, Clock, MessageCircle } from 'lucide-react';

// Numéro WhatsApp billetterie
const WHATSAPP_BILLETTERIE = '691216160';

// ===================================
// Carte Match — Design premium
// ===================================
function MatchCard({
  match,
  onTicket,
  onResume,
}: {
  match: MatchItem;
  onTicket: (m: MatchItem) => void;
  onResume: (m: MatchItem) => void;
}) {
  const isFinished = match.status === 'TERMINE';
  const isHome = match.homeTeam.toLowerCase().includes('ngaoundéré');

  // Résultat pour NFC
  const nfcWon =
    isFinished &&
    ((isHome && (match.homeScore ?? 0) > (match.awayScore ?? 0)) ||
      (!isHome && (match.awayScore ?? 0) > (match.homeScore ?? 0)));
  const draw =
    isFinished && match.homeScore === match.awayScore;

  const resultColor = nfcWon
    ? 'bg-[color:var(--nfc-green)]/10 border-[color:var(--nfc-green)]'
    : draw
    ? 'bg-amber-50 border-amber-400'
    : isFinished
    ? 'bg-rose-50 border-rose-400'
    : 'bg-white border-gray-200';

  const dateObj = new Date(match.date);

  return (
    <div className={`bg-white border-l-4 ${resultColor} border-y border-r border-gray-100 shadow-sm hover:shadow-md hover:-translate-y-0.5 transition-all duration-200`}>
      <div className="p-5 flex flex-col lg:flex-row items-center gap-5">

        {/* Colonne Date & Compétition */}
        <div className="flex flex-col items-center lg:items-start space-y-1 lg:w-48 text-center lg:text-left shrink-0">
          <span className={`badge-category ${isFinished ? 'badge-dark' : 'badge-green'} text-[9px]`}>
            {match.competition}
          </span>
          <div className="flex items-center gap-1.5 text-gray-600 text-xs mt-1">
            <Calendar className="w-3.5 h-3.5 text-[color:var(--nfc-green)]" />
            <span className="font-mono">
              {dateObj.toLocaleDateString('fr-FR', { weekday: 'short', day: 'numeric', month: 'short' })}
            </span>
          </div>
          <div className="flex items-center gap-1.5 text-gray-500 text-xs">
            <Clock className="w-3 h-3" />
            <span className="font-mono">
              {dateObj.toLocaleTimeString('fr-FR', { hour: '2-digit', minute: '2-digit' })}
            </span>
          </div>
          <div className="flex items-center gap-1 text-gray-400 text-[10px]">
            <MapPin className="w-3 h-3 shrink-0" />
            <span className="truncate max-w-[140px]">{match.stadium}</span>
          </div>
        </div>

        {/* Tableau de score */}
        <div className="flex items-center justify-center gap-4 sm:gap-10 flex-grow w-full">

          {/* Équipe domicile */}
          <div className={`flex flex-col items-end gap-1.5 w-1/3 ${isHome ? 'text-[color:var(--nfc-green)]' : 'text-gray-700'}`}>
            <div className="w-10 h-10 bg-[color:var(--nfc-green)]/10 flex items-center justify-center">
              <Shield className={`w-5 h-5 ${isHome ? 'text-[color:var(--nfc-green)]' : 'text-gray-400'}`} />
            </div>
            <span className="font-display font-bold text-xs sm:text-sm text-right leading-tight">
              {match.homeTeam}
            </span>
            {isHome && <span className="text-[9px] text-[color:var(--nfc-green)] font-display font-bold">DOMICILE</span>}
          </div>

          {/* Score / VS */}
          <div className="shrink-0 px-4 py-3 bg-[color:var(--nfc-dark)] text-center min-w-[80px]">
            {isFinished ? (
              <div className="font-display text-2xl font-extrabold text-white">
                {match.homeScore} <span className="text-gray-500">-</span> {match.awayScore}
              </div>
            ) : (
              <div className="font-display text-sm font-bold text-[color:var(--nfc-yellow)]">
                {dateObj.toLocaleTimeString('fr-FR', { hour: '2-digit', minute: '2-digit' })}
              </div>
            )}
            <span className="text-[8px] font-extrabold uppercase tracking-widest text-gray-400 block mt-0.5">
              {isFinished ? 'TERMINÉ' : 'À VENIR'}
            </span>
          </div>

          {/* Équipe extérieur */}
          <div className={`flex flex-col items-start gap-1.5 w-1/3 ${!isHome ? 'text-[color:var(--nfc-green)]' : 'text-gray-700'}`}>
            <div className="w-10 h-10 bg-gray-100 flex items-center justify-center">
              <Shield className={`w-5 h-5 ${!isHome ? 'text-[color:var(--nfc-green)]' : 'text-gray-400'}`} />
            </div>
            <span className="font-display font-bold text-xs sm:text-sm leading-tight">
              {match.awayTeam}
            </span>
            {!isHome && <span className="text-[9px] text-[color:var(--nfc-green)] font-display font-bold">NFC (EXTÉRIEUR)</span>}
          </div>
        </div>

        {/* Actions */}
        <div className="flex flex-col sm:flex-row gap-2 shrink-0">
          {!isFinished ? (
            <button
              onClick={() => onTicket(match)}
              className="btn-yellow text-xs px-4 py-2 flex items-center gap-1.5"
            >
              <Ticket className="w-4 h-4" />
              BILLETTERIE
            </button>
          ) : (
            <button
              onClick={() => onResume(match)}
              className="btn-dark text-xs px-4 py-2 flex items-center gap-1.5"
            >
              <ChevronRight className="w-4 h-4" />
              RÉSUMÉ
            </button>
          )}
        </div>
      </div>

      {/* Résumé optionnel en bas */}
      {isFinished && match.summary && (
        <div className="px-5 pb-4">
          <p className="text-[11px] text-gray-400 italic border-t border-gray-100 pt-3 leading-relaxed">
            {match.summary}
          </p>
        </div>
      )}
    </div>
  );
}

// ===================================
// PAGE CALENDRIER
// ===================================
export default function CalendrierPage() {
  const [filterTab, setFilterTab] = useState<'TOUS' | 'A_VENIR' | 'TERMINES'>('TOUS');
  const [selectedMatch, setSelectedMatch] = useState<MatchItem | null>(null);
  const [isTicketModalOpen, setIsTicketModalOpen] = useState(false);
  const [isResumeModalOpen, setIsResumeModalOpen] = useState(false);

  // Formulaire billetterie
  const [ticketForm, setTicketForm] = useState({
    nomComplet: '',
    telephone: '',
    tribune: 'Tribune Populaire (1 000 FCFA)',
    nbPlaces: '1',
  });

  const filteredMatches = MATCHES_DATA.filter((match) => {
    if (filterTab === 'A_VENIR') return match.status === 'PROGRAMME';
    if (filterTab === 'TERMINES') return match.status === 'TERMINE';
    return true;
  });

  // Redirection WhatsApp après soumission billetterie
  const handleTicketSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedMatch) return;

    const message = encodeURIComponent(
      `Bonjour, je souhaite réserver ${ticketForm.nbPlaces} billet(s) pour le match :\n` +
      `🏟 ${selectedMatch.homeTeam} vs ${selectedMatch.awayTeam}\n` +
      `📅 ${new Date(selectedMatch.date).toLocaleString('fr-FR')}\n` +
      `📍 ${selectedMatch.stadium}\n` +
      `🪑 Tribune : ${ticketForm.tribune}\n\n` +
      `Nom : ${ticketForm.nomComplet}\n` +
      `Téléphone : ${ticketForm.telephone}`
    );

    window.open(`https://wa.me/${WHATSAPP_BILLETTERIE}?text=${message}`, '_blank');
    setIsTicketModalOpen(false);
  };

  const nextMatch = MATCHES_DATA.find((m) => m.status === 'PROGRAMME') ?? MATCHES_DATA[0];

  return (
    <div className="bg-[#f7f8f7] text-[#1f2937] font-sans space-y-12 pb-20">

      {/* EN-TÊTE DE PAGE */}
      <PageHeader
        tag="LIGUE RÉGIONALE DE L'ADAMAOUA & COUPE"
        title="CALENDRIER &"
        titleHighlight="RÉSULTATS"
        description="Suivez toutes les rencontres du Ngaoundéré Football Club, les scores en direct, les résumés et la billetterie officielle."
        backgroundImageUrl="https://images.unsplash.com/photo-1508098682722-e99c43a406b2?q=80&w=1600&auto=format&fit=crop"
        badgeContent={
          <div className="bg-[color:var(--nfc-dark)]/90 backdrop-blur-md p-6 border border-white/10 text-center w-full lg:w-72 shadow-xl">
            <div className="relative w-14 h-14 rounded-full overflow-hidden ring-2 ring-[color:var(--nfc-green)] shadow-md mx-auto mb-2">
              <Image src="/logo.png" alt="NFC Crest" fill className="object-contain" />
            </div>
            <span className="badge-category badge-green text-[9px] mb-2 inline-block font-bold">PROCHAIN MATCH</span>
            <h3 className="font-display text-sm font-bold text-[color:var(--nfc-white)]">
              {nextMatch ? `${nextMatch.homeTeam} vs ${nextMatch.awayTeam}` : 'NGAOUNDÉRÉ FC'}
            </h3>
            <p className="text-xs text-[color:var(--nfc-yellow)] mt-1 font-mono">
              {nextMatch?.date ? new Date(nextMatch.date).toLocaleDateString('fr-FR', { day: 'numeric', month: 'long' }) : 'Adamaoua'}
            </p>
          </div>
        }
      />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">

        {/* ONGLETS FILTRE */}
        <div className="flex justify-center gap-2 border-b border-gray-200 pb-4">
          {[
            { key: 'TOUS', label: 'Tous les Matchs' },
            { key: 'A_VENIR', label: 'Prochaines Affiches' },
            { key: 'TERMINES', label: 'Résultats Passés' },
          ].map((tab) => (
            <button
              key={tab.key}
              onClick={() => setFilterTab(tab.key as any)}
              className={`px-5 py-2.5 text-xs font-display font-bold tracking-wider transition-all duration-200 ${
                filterTab === tab.key
                  ? 'bg-[color:var(--nfc-green)] text-[color:var(--nfc-white)] shadow-sm'
                  : 'bg-[color:var(--nfc-white)] text-gray-600 border border-gray-200 hover:border-[color:var(--nfc-green)] hover:text-[color:var(--nfc-green)]'
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>

        {/* LISTE DES MATCHS */}
        <div className="space-y-4">
          <SectionTag label={`${filteredMatches.length} match${filteredMatches.length > 1 ? 's' : ''} affiché${filteredMatches.length > 1 ? 's' : ''}`} />
          <div className="space-y-3">
            {filteredMatches.map((match) => (
              <MatchCard
                key={match.id}
                match={match}
                onTicket={(m) => { setSelectedMatch(m); setIsTicketModalOpen(true); }}
                onResume={(m) => { setSelectedMatch(m); setIsResumeModalOpen(true); }}
              />
            ))}
          </div>
        </div>

        {/* INFOS BILLETTERIE */}
        <div className="bg-[color:var(--nfc-dark)] text-white p-6 flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-4">
            <div className="w-10 h-10 bg-[color:var(--nfc-green)]/20 flex items-center justify-center shrink-0">
              <MessageCircle className="w-5 h-5 text-[color:var(--nfc-green)]" />
            </div>
            <div>
              <h4 className="font-display font-bold text-white text-sm">BILLETTERIE VIA WHATSAPP</h4>
              <p className="text-xs text-gray-400 mt-0.5">Réservez votre place directement par message. Réponse rapide garantie.</p>
            </div>
          </div>
          <a
            href={`https://wa.me/${WHATSAPP_BILLETTERIE}`}
            target="_blank"
            rel="noopener noreferrer"
            className="btn-yellow text-xs shrink-0 flex items-center gap-2"
          >
            <MessageCircle className="w-4 h-4" />
            CONTACTER LA BILLETTERIE
          </a>
        </div>

      </div>

      {/* ===== MODAL BILLETTERIE ===== */}
      {isTicketModalOpen && selectedMatch && (
        <div
          className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4 animate-fade-in"
          onClick={() => setIsTicketModalOpen(false)}
        >
          <div
            className="bg-white max-w-lg w-full p-6 space-y-5 shadow-2xl animate-fade-in-up"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center justify-between border-b border-gray-100 pb-3">
              <div>
                <span className="section-tag">BILLETTERIE OFFICIELLE</span>
                <h3 className="font-display font-bold text-gray-900 text-sm">
                  RÉSERVATION NFC — STADE MUNICIPAL
                </h3>
              </div>
              <button onClick={() => setIsTicketModalOpen(false)} className="p-1 hover:bg-gray-100 text-gray-500 transition-colors">
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Infos match */}
            <div className="p-4 bg-[#f7f8f7] border border-gray-200 text-xs text-gray-600 space-y-1 font-mono">
              <p><strong className="text-gray-900">Rencontre :</strong> {selectedMatch.homeTeam} vs {selectedMatch.awayTeam}</p>
              <p><strong className="text-gray-900">Stade :</strong> {selectedMatch.stadium}</p>
              <p><strong className="text-gray-900">Date :</strong> {new Date(selectedMatch.date).toLocaleString('fr-FR')}</p>
            </div>

            <form onSubmit={handleTicketSubmit} className="space-y-4">
              <div className="space-y-1">
                <label className="text-xs font-bold text-gray-700 uppercase font-display">Nom Complet *</label>
                <input
                  type="text"
                  required
                  placeholder="Ex: Ousmane Bello"
                  className="form-input"
                  value={ticketForm.nomComplet}
                  onChange={(e) => setTicketForm((p) => ({ ...p, nomComplet: e.target.value }))}
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-1">
                  <label className="text-xs font-bold text-gray-700 uppercase font-display">Téléphone (WhatsApp) *</label>
                  <input
                    type="tel"
                    required
                    placeholder="+237 6..."
                    className="form-input"
                    value={ticketForm.telephone}
                    onChange={(e) => setTicketForm((p) => ({ ...p, telephone: e.target.value }))}
                  />
                </div>
                <div className="space-y-1">
                  <label className="text-xs font-bold text-gray-700 uppercase font-display">Nb de Places *</label>
                  <select
                    className="form-input"
                    value={ticketForm.nbPlaces}
                    onChange={(e) => setTicketForm((p) => ({ ...p, nbPlaces: e.target.value }))}
                  >
                    {['1', '2', '3', '4', '5', '6+'].map((n) => (
                      <option key={n}>{n}</option>
                    ))}
                  </select>
                </div>
              </div>

              <div className="space-y-1">
                <label className="text-xs font-bold text-gray-700 uppercase font-display">Tribune *</label>
                <select
                  className="form-input"
                  value={ticketForm.tribune}
                  onChange={(e) => setTicketForm((p) => ({ ...p, tribune: e.target.value }))}
                >
                  <option>Tribune Populaire (1 000 FCFA)</option>
                  <option>Tribune Couverte (2 500 FCFA)</option>
                  <option>Tribune VIP (5 000 FCFA)</option>
                </select>
              </div>

              <button
                type="submit"
                className="btn-yellow w-full py-3 text-xs justify-center font-bold flex items-center gap-2"
              >
                <MessageCircle className="w-4 h-4" />
                CONTINUER SUR WHATSAPP &rarr;
              </button>
              <p className="text-center text-[10px] text-gray-400">
                Vous serez redirigé sur WhatsApp pour finaliser votre réservation.
              </p>
            </form>
          </div>
        </div>
      )}

      {/* ===== MODAL RÉSUMÉ MATCH ===== */}
      {isResumeModalOpen && selectedMatch && (
        <div
          className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4 animate-fade-in"
          onClick={() => setIsResumeModalOpen(false)}
        >
          <div
            className="bg-white max-w-lg w-full p-6 shadow-2xl animate-fade-in-up space-y-4"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center justify-between border-b border-gray-100 pb-3">
              <h3 className="font-display font-bold text-gray-900 text-sm">RÉSUMÉ DU MATCH</h3>
              <button onClick={() => setIsResumeModalOpen(false)} className="p-1 hover:bg-gray-100 text-gray-500">
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Score final */}
            <div className="bg-[color:var(--nfc-dark)] text-white p-5 text-center space-y-2">
              <p className="text-xs text-gray-400 font-mono">{selectedMatch.competition}</p>
              <div className="font-display text-2xl font-extrabold">
                <span>{selectedMatch.homeTeam}</span>
                <span className="mx-4 text-[color:var(--nfc-yellow)]">{selectedMatch.homeScore} - {selectedMatch.awayScore}</span>
                <span>{selectedMatch.awayTeam}</span>
              </div>
              <p className="text-xs text-gray-400 font-mono">
                {new Date(selectedMatch.date).toLocaleDateString('fr-FR', { weekday: 'long', day: 'numeric', month: 'long', year: 'numeric' })}
              </p>
            </div>

            {selectedMatch.summary && (
              <p className="text-sm text-gray-600 leading-relaxed">{selectedMatch.summary}</p>
            )}

            <button onClick={() => setIsResumeModalOpen(false)} className="btn-dark w-full text-xs py-2.5 justify-center">
              FERMER
            </button>
          </div>
        </div>
      )}

    </div>
  );
}
