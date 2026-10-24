'use client';

import React, { useState } from 'react';
import Image from 'next/image';
import { PageHeader } from '@/components/ui/PageHeader';
import { SectionTag } from '@/components/ui/SectionTag';
import { MatchItem } from '@/types';
import { Calendar, MapPin, Shield, Ticket, X, ChevronRight, Clock, MessageCircle } from 'lucide-react';
import { useApiResource } from '@/lib/use-api-resource';
import { DataState } from '@/components/ui/DataState';
import { getMatchState } from '@/lib/match-state';
import { DATA_FRESHNESS_MS } from '@/constants/data-freshness';

const WHATSAPP_BILLETTERIE = process.env.NEXT_PUBLIC_WHATSAPP_BILLETTERIE;

function MatchCard({
  match,
  onTicket,
  onResume,
}: {
  match: MatchItem;
  onTicket: (m: MatchItem) => void;
  onResume: (m: MatchItem) => void;
}) {
  const matchState = getMatchState(match, new Date());
  const isFinished = matchState === 'FINISHED';

  const dateObj = new Date(match.date);
  const formattedDate = dateObj
    .toLocaleDateString('fr-FR', { weekday: 'long', day: 'numeric', month: 'long', year: 'numeric', timeZone: 'Africa/Douala' })
    .toUpperCase();
  const formattedTime = dateObj.toLocaleTimeString('fr-FR', { hour: '2-digit', minute: '2-digit', timeZone: 'Africa/Douala' });

  // Extrait la compétition et la journée
  const parts = (match.competition || '').split('-');
  const competitionTitle = parts[0]?.trim().toUpperCase() || 'COMPÉTITION NON COMMUNIQUÉE';
  const matchDayText = parts[1]?.trim().toUpperCase() || '';

  return (
    <div className="bg-white border-y-2 border-y-[color:var(--nfc-yellow)] border-x border-gray-100 shadow-sm hover:shadow-md transition-all duration-300 rounded-xl overflow-hidden mb-4">
      {/* Date Header Centré */}
      <div className="pt-3 pb-1 text-center border-b border-gray-50 bg-[#fafafa]/60">
        <span className="font-display font-extrabold text-[11px] sm:text-xs text-gray-700 tracking-wider">
          {formattedDate}
        </span>
      </div>

      {/* Main Bar Content */}
      <div className="p-4 sm:p-5 flex flex-col lg:flex-row items-center justify-between gap-4 sm:gap-6">
        
        {/* Left Column: Competition & Journée */}
        <div className="flex flex-col items-center lg:items-start text-center lg:text-left shrink-0 lg:w-1/4">
          <span className="font-display font-extrabold text-xs text-gray-900 tracking-wide uppercase">
            {competitionTitle}
          </span>
          <span className="font-display text-xs font-bold text-[#008751] underline underline-offset-4 decoration-2 mt-0.5 cursor-pointer hover:text-[#00623b]">
            {matchDayText}
          </span>
        </div>

        {/* Center Column: Teams + Time Pill + Stadium */}
        <div className="flex flex-col items-center flex-grow w-full lg:w-2/4">
          <div className="flex items-center justify-center gap-2 sm:gap-4 w-full">
            {/* Home Team */}
            <div className="flex items-center justify-end gap-2.5 w-5/12 text-right">
              <span className="font-display font-extrabold text-xs sm:text-sm text-gray-900 uppercase tracking-tight truncate">
                {match.homeTeam}
              </span>
              <div className="w-8 h-8 sm:w-10 sm:h-10 rounded-full bg-[#008751]/10 border border-[#008751]/20 flex items-center justify-center shrink-0 shadow-xs">
                {match.homeLogo ? (
                  <img src={match.homeLogo} alt={match.homeTeam} className="w-6 h-6 object-contain" />
                ) : (
                  <Shield className="w-4 h-4 sm:w-5 sm:h-5 text-[#008751]" />
                )}
              </div>
            </div>

            {/* Time / Score Pill */}
            <div className="bg-[color:var(--nfc-yellow)] text-[#0c130e] font-display font-extrabold text-sm sm:text-lg px-4 sm:px-6 py-2 sm:py-2.5 rounded-2xl shadow-sm shrink-0 flex items-center justify-center min-w-[85px] sm:min-w-[105px] border border-amber-300">
              {isFinished ? (
                <span>{match.homeScore} - {match.awayScore}</span>
              ) : (
                <span>{formattedTime}</span>
              )}
            </div>

            {/* Away Team */}
            <div className="flex items-center justify-start gap-2.5 w-5/12 text-left">
              <div className="w-8 h-8 sm:w-10 sm:h-10 rounded-full bg-gray-100 border border-gray-200 flex items-center justify-center shrink-0 shadow-xs">
                {match.awayLogo ? (
                  <img src={match.awayLogo} alt={match.awayTeam} className="w-6 h-6 object-contain" />
                ) : (
                  <Shield className="w-4 h-4 sm:w-5 sm:h-5 text-gray-500" />
                )}
              </div>
              <span className="font-display font-extrabold text-xs sm:text-sm text-gray-900 uppercase tracking-tight truncate">
                {match.awayTeam}
              </span>
            </div>
          </div>

          {/* Sub Info (Stadium & Channel/Ligue) */}
          <div className="mt-2 text-center">
            <span className="text-[10px] font-display font-bold uppercase text-gray-400 tracking-wider">
              {match.stadium || 'Stade non communiqué'}
            </span>
          </div>
        </div>

        {/* Right Column: CTA Action */}
        <div className="flex items-center justify-center lg:justify-end shrink-0 lg:w-1/4 mt-2 lg:mt-0">
          {matchState === 'UPCOMING' && WHATSAPP_BILLETTERIE ? (
            <button
              onClick={() => onTicket(match)}
              className="font-display font-extrabold text-xs text-[#008751] uppercase tracking-wider underline underline-offset-4 decoration-2 hover:text-[#005c37] transition-colors py-1 px-2"
            >
              ACHETER UNE PLACE
            </button>
          ) : isFinished && (match.homeScore !== null && match.homeScore !== undefined) && (match.awayScore !== null && match.awayScore !== undefined) ? (
            <button
              onClick={() => onResume(match)}
              className="font-display font-extrabold text-xs text-[#0c130e] uppercase tracking-wider underline underline-offset-4 decoration-2 hover:text-[#008751] transition-colors py-1 px-2"
            >
              RÉSUMÉ DU MATCH
            </button>
          ) : null}
        </div>

      </div>
    </div>
  );
}

export default function CalendrierPage() {
  const [filterTab, setFilterTab] = useState<'TOUS' | 'A_VENIR' | 'TERMINES'>('TOUS');
  const { data: matches = [], status, error, retry, updatedAt } = useApiResource<MatchItem[]>('/api/matches', {
    staleAfterMs: DATA_FRESHNESS_MS.matches,
  });
  const [selectedMatch, setSelectedMatch] = useState<MatchItem | null>(null);
  const [isTicketModalOpen, setIsTicketModalOpen] = useState(false);
  const [isResumeModalOpen, setIsResumeModalOpen] = useState(false);

  const [ticketForm, setTicketForm] = useState({
    nomComplet: '',
    telephone: '',
    tribune: 'Tribune Populaire (1 000 FCFA)',
    nbPlaces: '1',
  });

  const filteredMatches = matches.filter((match) => {
    if (filterTab === 'A_VENIR') return match.status === 'PROGRAMME' && new Date(match.date).getTime() > Date.now();
    if (filterTab === 'TERMINES') return match.status === 'TERMINE';
    return true;
  });

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

    if (!WHATSAPP_BILLETTERIE) return;
    window.open(`https://wa.me/${WHATSAPP_BILLETTERIE}?text=${message}`, '_blank');
    setIsTicketModalOpen(false);
  };

  return (
    <div className="bg-[#f7f8f7] text-[#1f2937] font-sans space-y-6 sm:space-y-12 pb-16">

      

      <div className="max-w-7xl mx-auto px-3 sm:px-6 lg:px-8 space-y-6 sm:space-y-8">

        {/* ONGLETS FILTRE */}
        <div className="flex flex-wrap justify-center gap-1.5 border-b border-gray-200 pb-3">
          {[
            { key: 'TOUS', label: 'Tous les Matchs' },
            { key: 'A_VENIR', label: 'Prochaines Affiches' },
            { key: 'TERMINES', label: 'Résultats Passés' },
          ].map((tab) => (
            <button
              key={tab.key}
              onClick={() => setFilterTab(tab.key as any)}
              className={`px-3 py-2 sm:px-5 sm:py-2.5 text-[11px] sm:text-xs font-display font-bold tracking-wider transition-all duration-200 ${
                filterTab === tab.key
                  ? 'bg-[#008751] text-white shadow-sm'
                  : 'bg-white text-gray-600 border border-gray-200 hover:border-[#008751] hover:text-[#008751]'
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>

        {/* LISTE DES MATCHS */}
        <div className="space-y-3 sm:space-y-4">
          <SectionTag label={`${filteredMatches.length} match${filteredMatches.length > 1 ? 's' : ''} affiché${filteredMatches.length > 1 ? 's' : ''}`} />
          <DataState
            status={status}
            error={error}
            onRetry={retry}
            updatedAt={updatedAt}
            emptyMessage="Aucun match publié pour le moment."
            skeleton={<div className="h-40 animate-pulse rounded-xl bg-white" />}
          >
            {filteredMatches.length > 0 ? (
              <div className="space-y-2.5 sm:space-y-3">
                {filteredMatches.map((match) => (
                  <MatchCard
                    key={match.id}
                    match={match}
                    onTicket={(m) => { setSelectedMatch(m); setIsTicketModalOpen(true); }}
                    onResume={(m) => { setSelectedMatch(m); setIsResumeModalOpen(true); }}
                  />
                ))}
              </div>
            ) : <p role="status" className="py-6 text-center text-sm text-gray-600">Aucun match dans cette catégorie.</p>}
          </DataState>
        </div>

        {/* INFOS BILLETTERIE */}
        {WHATSAPP_BILLETTERIE && (
        <div className="bg-[#0c130e] text-white p-4 sm:p-6 rounded-2xl flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-[#008751]/20 flex items-center justify-center rounded-xl shrink-0">
              <MessageCircle className="w-5 h-5 text-[#008751]" />
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
            className="btn-yellow text-xs shrink-0 flex items-center gap-2 py-2.5 px-4"
          >
            <MessageCircle className="w-4 h-4" />
            CONTACTER LA BILLETTERIE
          </a>
        </div>
        )}

      </div>

      {/* MODALS */}
      {isTicketModalOpen && selectedMatch && (
        <div
          className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-3 animate-fade-in"
          onClick={() => setIsTicketModalOpen(false)}
        >
          <div
            className="bg-white max-w-lg w-full p-4 sm:p-6 space-y-4 rounded-xl shadow-2xl animate-fade-in-up"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center justify-between border-b border-gray-100 pb-3">
              <div>
                <span className="section-tag">BILLETTERIE OFFICIELLE</span>
                <h3 className="font-display font-bold text-gray-900 text-sm">
                  RÉSERVATION NFC — STADE MUNICIPAL
                </h3>
              </div>
              <button onClick={() => setIsTicketModalOpen(false)} className="p-1 hover:bg-gray-100 text-gray-500">
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="p-3 bg-[#f7f8f7] border border-gray-200 text-xs text-gray-600 space-y-1 font-mono rounded-lg">
              <p><strong className="text-gray-900">Rencontre :</strong> {selectedMatch.homeTeam} vs {selectedMatch.awayTeam}</p>
              <p><strong className="text-gray-900">Stade :</strong> {selectedMatch.stadium}</p>
              <p><strong className="text-gray-900">Date :</strong> {new Date(selectedMatch.date).toLocaleString('fr-FR', { timeZone: 'Africa/Douala' })}</p>
            </div>

            <form onSubmit={handleTicketSubmit} className="space-y-3">
              <div className="space-y-1">
                <label className="text-xs font-bold text-gray-700 uppercase font-display">Nom Complet *</label>
                <input
                  type="text"
                  required
                  placeholder="Ex: Ousmane Bello"
                  className="form-input text-xs"
                  value={ticketForm.nomComplet}
                  onChange={(e) => setTicketForm((p) => ({ ...p, nomComplet: e.target.value }))}
                />
              </div>

              <div className="grid grid-cols-2 gap-2">
                <div className="space-y-1">
                  <label className="text-xs font-bold text-gray-700 uppercase font-display">WhatsApp *</label>
                  <input
                    type="tel"
                    required
                    placeholder="+237 6..."
                    className="form-input text-xs"
                    value={ticketForm.telephone}
                    onChange={(e) => setTicketForm((p) => ({ ...p, telephone: e.target.value }))}
                  />
                </div>
                <div className="space-y-1">
                  <label className="text-xs font-bold text-gray-700 uppercase font-display">Places *</label>
                  <select
                    className="form-input text-xs"
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
                  className="form-input text-xs"
                  value={ticketForm.tribune}
                  onChange={(e) => setTicketForm((p) => ({ ...p, tribune: e.target.value }))}
                >
                  <option>Tribune Populaire</option>
                  <option>Tribune Couverte</option>
                  <option>Tribune VIP</option>
                </select>
              </div>

              <button
                type="submit"
                className="btn-yellow w-full py-2.5 text-xs justify-center font-bold flex items-center gap-2 mt-2"
              >
                <MessageCircle className="w-4 h-4" />
                CONTINUER SUR WHATSAPP &rarr;
              </button>
            </form>
          </div>
        </div>
      )}

      {isResumeModalOpen && selectedMatch && (
        <div
          className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-3 animate-fade-in"
          onClick={() => setIsResumeModalOpen(false)}
        >
          <div
            className="bg-white max-w-lg w-full p-4 sm:p-6 shadow-2xl animate-fade-in-up space-y-4 rounded-xl"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center justify-between border-b border-gray-100 pb-3">
              <h3 className="font-display font-bold text-gray-900 text-sm">RÉSUMÉ DU MATCH</h3>
              <button onClick={() => setIsResumeModalOpen(false)} className="p-1 hover:bg-gray-100 text-gray-500">
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="bg-[#0c130e] text-white p-4 text-center space-y-2 rounded-lg">
              <p className="text-xs text-gray-400 font-mono">{selectedMatch.competition}</p>
              <div className="font-display text-xl font-extrabold">
                <span>{selectedMatch.homeTeam}</span>
                <span className="mx-3 text-[color:var(--nfc-yellow)]">{selectedMatch.homeScore} - {selectedMatch.awayScore}</span>
                <span>{selectedMatch.awayTeam}</span>
              </div>
            </div>

            {selectedMatch.summary && (
              <p className="text-xs text-gray-600 leading-relaxed">{selectedMatch.summary}</p>
            )}

            <button onClick={() => setIsResumeModalOpen(false)} className="btn-dark w-full text-xs py-2 justify-center">
              FERMER
            </button>
          </div>
        </div>
      )}

    </div>
  );
}
