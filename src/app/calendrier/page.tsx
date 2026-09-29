'use client';

import React, { useState } from 'react';
import Image from 'next/image';
import { PageHeader } from '@/components/ui/PageHeader';
import { MATCHES_DATA } from '@/lib/mock-data';
import { MatchItem } from '@/types';
import { Calendar, MapPin, Trophy, Shield, Ticket, CheckCircle2, X } from 'lucide-react';

export default function CalendrierPage() {
  const [filterTab, setFilterTab] = useState<'TOUS' | 'A_VENIR' | 'TERMINES'>('TOUS');
  const [selectedMatch, setSelectedMatch] = useState<MatchItem | null>(null);
  const [isTicketModalOpen, setIsTicketModalOpen] = useState(false);
  const [ticketReserved, setTicketReserved] = useState(false);

  const filteredMatches = MATCHES_DATA.filter((match) => {
    if (filterTab === 'A_VENIR') return match.status === 'PROGRAMME';
    if (filterTab === 'TERMINES') return match.status === 'TERMINE';
    return true;
  });

  const handleReserveTicket = (e: React.FormEvent) => {
    e.preventDefault();
    setTicketReserved(true);
    setTimeout(() => {
      setTicketReserved(false);
      setIsTicketModalOpen(false);
    }, 3000);
  };

  return (
    <div className="bg-[#f7f8f7] text-[#1f2937] font-sans space-y-12 pb-20">

      {/* PAGE HERO HEADER WITH BACKGROUND IMAGE */}
      <PageHeader
        tag="MTN ELITE ONE & COUPE"
        title="CALENDRIER &"
        titleHighlight="RÉSULTATS"
        description="Suivez toutes les rencontres du Ngaoundéré Football Club, les scores en direct, les résumés et la billetterie officielle."
        backgroundImageUrl="https://images.unsplash.com/photo-1508098682722-e99c43a406b2?q=80&w=1600&auto=format&fit=crop"
        
        badgeContent={
          <div className="bg-[color:var(--nfc-dark)]/90 backdrop-blur-md p-6 rounded-2xl border border-white/10 text-center w-full lg:w-72 shadow-xl">
            <div className="relative w-14 h-14 rounded-full overflow-hidden ring-2 ring-[color:var(--nfc-green)] shadow-md mx-auto mb-2">
              <Image src="/logo.png" alt="NFC Crest" fill className="object-contain" />
            </div>
            <span className="badge-category badge-green text-[9px] mb-2 inline-block">BILLETTERIE DISPONIBLE</span>
            <h3 className="font-display text-base font-bold text-[color:var(--nfc-white)]">PROCHAIN DERBY</h3>
            <p className="text-xs text-gray-400 mt-1">NFC vs Cotonsport • Dim. 04 Oct</p>
          </div>
        }
      />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">

        {/* FILTER TABS */}
        <div className="flex justify-center gap-2 border-b border-gray-200 pb-4">
          {[
            { key: 'TOUS', label: 'Tous les Matchs' },
            { key: 'A_VENIR', label: 'Prochaines Affiches' },
            { key: 'TERMINES', label: 'Résultats Passés' },
          ].map(tab => (
            <button
              key={tab.key}
              onClick={() => setFilterTab(tab.key as any)}
              className={`px-5 py-2.5 rounded-xl text-xs font-display font-bold tracking-wider transition-all duration-200 ${
                filterTab === tab.key
                  ? 'bg-[color:var(--nfc-green)] text-[color:var(--nfc-white)] shadow-sm'
                  : 'bg-[color:var(--nfc-white)] text-gray-600 border border-gray-200 hover:border-[color:var(--nfc-green)] hover:text-[color:var(--nfc-green)]'
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>

        {/* MATCH CARDS LIST */}
        <div className="space-y-4">
          {filteredMatches.map((match) => {
            const isFinished = match.status === 'TERMINE';
            const isHome = match.homeTeam.includes('Ngaoundéré');

            return (
              <div
                key={match.id}
                className="bg-white rounded-2xl p-6 border border-gray-100 shadow-sm hover:shadow-md hover:-translate-y-0.5 transition-all duration-200 flex flex-col lg:flex-row items-center justify-between gap-6"
              >
                {/* Competition & Date */}
                <div className="flex flex-col items-center lg:items-start text-center lg:text-left space-y-2 w-full lg:w-48">
                  <span className={`badge-category ${isFinished ? 'badge-dark' : 'badge-green'}`}>
                    {match.competition}
                  </span>
                  <div className="mt-2 text-sm text-gray-500 flex items-center gap-2">
                    <Calendar className="w-4 h-4 text-[color:var(--nfc-green)]" />
                    <span>
                      {new Date(match.date).toLocaleDateString('fr-FR', {
                        weekday: 'short',
                        day: 'numeric',
                        month: 'short',
                      })}
                      {' • '}
                      {new Date(match.date).toLocaleTimeString('fr-FR', { hour: '2-digit', minute: '2-digit' })}
                    </span>
                  </div>
                  <div className="text-xs text-gray-400 flex items-center gap-1 mt-1">
                    <MapPin className="w-3 h-3" />
                    <span>{match.stadium}</span>
                  </div>
                </div>

                {/* Scoreboard */}
                <div className="flex items-center justify-center gap-6 sm:gap-12 flex-grow w-full">
                  {/* Home */}
                  <div className={`flex items-center gap-3 w-1/3 justify-end ${isHome ? 'font-bold text-[color:var(--nfc-green)]' : 'text-gray-700'}`}>
                    <span className="text-sm sm:text-base font-display text-right line-clamp-1">{match.homeTeam}</span>
                    <div className="w-10 h-10 rounded-full bg-[color:var(--nfc-green)]/10 text-[color:var(--nfc-green)] flex items-center justify-center shrink-0">
                      <Shield className="w-5 h-5" />
                    </div>
                  </div>

                  {/* Score / Time Box */}
                  <div className="px-5 py-2.5 bg-[#f7f8f7] rounded-xl border border-gray-200 text-center shrink-0 min-w-[100px]">
                    {isFinished ? (
                      <div className="text-xl sm:text-2xl font-extrabold text-[#0c130e] font-display">
                        {match.homeScore} - {match.awayScore}
                      </div>
                    ) : (
                      <div className="text-sm font-bold text-[color:var(--nfc-green)] font-mono">
                        {new Date(match.date).toLocaleTimeString('fr-FR', { hour: '2-digit', minute: '2-digit' })}
                      </div>
                    )}
                    <span className="text-[9px] font-extrabold uppercase tracking-widest text-gray-400 block mt-0.5 font-display">
                      {isFinished ? 'Terminé' : 'À venir'}
                    </span>
                  </div>

                  {/* Away */}
                  <div className={`flex items-center gap-3 w-1/3 justify-start ${!isHome ? 'font-bold text-[color:var(--nfc-green)]' : 'text-gray-700'}`}>
                    <div className="w-10 h-10 rounded-full bg-emerald-50 text-[color:var(--nfc-green)] flex items-center justify-center shrink-0">
                      <Shield className="w-4 h-4 text-[color:var(--nfc-green)]" />
                    </div>
                    <span className="text-sm sm:text-base font-display text-left line-clamp-1">{match.awayTeam}</span>
                  </div>
                </div>

                {/* Actions */}
                <div className="flex items-center gap-3 w-full lg:w-auto justify-center">
                  {!isFinished ? (
                    <button
                      className="btn-yellow text-xs px-4 py-2.5 flex items-center gap-1.5"
                      onClick={() => {
                        setSelectedMatch(match);
                        setIsTicketModalOpen(true);
                      }}
                    >
                      <Ticket className="w-4 h-4" />
                      RÉSERVER BILLET
                    </button>
                  ) : (
                    <button
                      className="btn-dark text-xs px-4 py-2.5"
                      onClick={() => setSelectedMatch(match)}
                    >
                      RÉSUMÉ DU MATCH
                    </button>
                  )}
                </div>
              </div>
            );
          })}
        </div>

      </div>

      {/* TICKET MODAL */}
      {isTicketModalOpen && selectedMatch && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4 animate-fade-in">
          <div className="bg-white rounded-2xl max-w-lg w-full p-6 space-y-5 shadow-2xl animate-fade-in-up">

            <div className="flex items-center justify-between border-b border-gray-100 pb-3">
              <h3 className="font-display font-bold text-gray-900 text-sm">
                RÉSERVATION BILLETTERIE NGAOUNDÉRÉ FC
              </h3>
              <button onClick={() => setIsTicketModalOpen(false)} className="p-1 rounded-lg hover:bg-gray-100 text-gray-500">
                <X className="w-5 h-5" />
              </button>
            </div>

            {ticketReserved ? (
              <div className="text-center py-8 space-y-3">
                <CheckCircle2 className="w-14 h-14 text-[#008751] mx-auto animate-bounce" />
                <h3 className="text-xl font-display font-bold text-gray-900">RÉSERVATION CONFIRMÉE !</h3>
                <p className="text-xs text-gray-500">
                  Votre pass numérique à présenter à l'entrée du Stade Municipal vous a été transmis par SMS / WhatsApp.
                </p>
              </div>
            ) : (
              <form onSubmit={handleReserveTicket} className="space-y-4">
                <div className="p-4 bg-[#f7f8f7] rounded-xl border border-gray-200 text-xs text-gray-600 space-y-1 font-mono">
                  <p><strong className="text-gray-900">Rencontre :</strong> {selectedMatch.homeTeam} vs {selectedMatch.awayTeam}</p>
                  <p><strong className="text-gray-900">Stade :</strong> {selectedMatch.stadium}</p>
                  <p><strong className="text-gray-900">Date :</strong> {new Date(selectedMatch.date).toLocaleString('fr-FR')}</p>
                </div>

                <div className="space-y-1">
                  <label className="text-xs font-bold text-gray-700 uppercase font-display">Nom Complet *</label>
                  <input type="text" required placeholder="Ex: Ousmane Bello" className="form-input" />
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div className="space-y-1">
                    <label className="text-xs font-bold text-gray-700 uppercase font-display">Téléphone (WhatsApp) *</label>
                    <input type="tel" required placeholder="+237 6..." className="form-input" />
                  </div>
                  <div className="space-y-1">
                    <label className="text-xs font-bold text-gray-700 uppercase font-display">Tribune *</label>
                    <select className="form-input">
                      <option>Tribune Populaire (1 000 FCFA)</option>
                      <option>Tribune Couverte (2 500 FCFA)</option>
                      <option>Tribune VIP (5 000 FCFA)</option>
                    </select>
                  </div>
                </div>

                <button type="submit" className="btn-yellow w-full py-3 text-xs justify-center font-bold">
                  VALIDER MA RÉSERVATION &rarr;
                </button>
              </form>
            )}

          </div>
        </div>
      )}

    </div>
  );
}
