'use client';

import React, { useState } from 'react';
import { Play, X } from 'lucide-react';

interface VideoPlayerProps {
  /** URL YouTube ou Vimeo (embed) */
  videoUrl: string;
  /** Image de couverture affichée avant la lecture */
  thumbnailUrl: string;
  /** Titre de la vidéo */
  title: string;
  /** Badge de catégorie (ex: "GRAND FORMAT") */
  badge?: string;
  /** Contexte affiché sous le titre (ex: "Immersion session d'entraînement") */
  context?: string;
  className?: string;
}

/**
 * Composant VideoPlayer NFC
 * Affiche une miniature cliquable qui ouvre la vidéo en lecture directe (iframe) dans une modal.
 * Le lien vidéo est passé via les props depuis le mock/data.
 */
export default function VideoPlayer({
  videoUrl,
  thumbnailUrl,
  title,
  badge = 'GRAND FORMAT',
  context = "Immersion session d'entraînement",
  className = '',
}: VideoPlayerProps) {
  const [isPlaying, setIsPlaying] = useState(false);

  return (
    <>
      {/* Miniature cliquable */}
      <div
        className={`relative group rounded-xl overflow-hidden cursor-pointer ${className}`}
        onClick={() => setIsPlaying(true)}
      >
        <img
          src={thumbnailUrl}
          alt={title}
          className="w-full h-80 object-cover opacity-80 group-hover:opacity-70 transition-opacity duration-300"
        />

        {/* Bouton Play centré */}
        <div className="absolute inset-0 flex items-center justify-center">
          <div className="w-16 h-16 rounded-full bg-[color:var(--nfc-green)] text-white flex items-center justify-center shadow-2xl group-hover:scale-110 transition-transform duration-300">
            <Play className="w-8 h-8 fill-current ml-1" />
          </div>
        </div>

        {/* Overlay bas avec badge et titre */}
        <div className="absolute bottom-0 inset-x-0 p-5 bg-gradient-to-t from-black via-black/80 to-transparent">
          <span className="badge-category badge-green text-[9px] mb-1">{badge}</span>
          <h3 className="font-display text-base font-bold text-white leading-tight">{title}</h3>
          {context && (
            <p className="text-xs text-gray-300 mt-1">{context}</p>
          )}
        </div>
      </div>

      {/* Modal de lecture vidéo */}
      {isPlaying && (
        <div
          className="fixed inset-0 z-[100] bg-black/90 backdrop-blur-sm flex items-center justify-center p-4 animate-fade-in"
          onClick={() => setIsPlaying(false)}
        >
          <div
            className="relative w-full max-w-4xl"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Bouton fermer */}
            <button
              onClick={() => setIsPlaying(false)}
              className="absolute -top-12 right-0 text-white hover:text-[color:var(--nfc-green)] transition-colors flex items-center gap-2 font-display text-sm"
            >
              <X className="w-5 h-5" /> FERMER
            </button>

            {/* Iframe vidéo */}
            <div className="relative aspect-video w-full bg-black">
              <iframe
                src={`${videoUrl}?autoplay=1&rel=0`}
                title={title}
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                allowFullScreen
                className="w-full h-full"
              />
            </div>

            {/* Info sous la vidéo */}
            <div className="mt-3 px-2">
              <p className="text-white font-display font-bold text-sm">{title}</p>
              {context && <p className="text-gray-400 text-xs mt-0.5">{context}</p>}
            </div>
          </div>
        </div>
      )}
    </>
  );
}
