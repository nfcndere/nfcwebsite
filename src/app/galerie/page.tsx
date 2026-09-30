'use client';

import React, { useState } from 'react';
import { PageHeader } from '@/components/ui/PageHeader';
import { SectionTag } from '@/components/ui/SectionTag';
import { GALLERY_DATA } from '@/lib/mock-data';
import { MediaItem } from '@/types';
import { Image as ImageIcon, Video, Maximize2, CloudUpload, X, Play } from 'lucide-react';
import Image from 'next/image';

export default function GaleriePage() {
  const [filterAlbum, setFilterAlbum] = useState<string>('TOUS');
  const [selectedMedia, setSelectedMedia] = useState<MediaItem | null>(null);

  const albums = ['TOUS', 'Saison 2025-2026', 'Entraînements', 'Académie', 'Ferveur Supporters'];

  const filteredMedia = GALLERY_DATA.filter((item) => {
    if (filterAlbum === 'TOUS') return true;
    return item.album === filterAlbum;
  });

  return (
    <div className="bg-[#f7f8f7] text-[#1f2937] font-sans space-y-12 pb-20">

      {/* EN-TÊTE DE PAGE */}
      <PageHeader
        tag="MÉDIATHÈQUE NFC"
        title="GALERIE"
        titleHighlight="PHOTOS & VIDÉOS"
        description="Revivez les temps forts, les célébrations et les moments coulisses du Ngaoundéré Football Club en images."
        backgroundImageUrl="/galerie baneer (1).jpg"
        badgeContent={
          <div className="bg-[color:var(--nfc-dark)]/90 backdrop-blur-md p-6 border border-white/10 text-center w-full lg:w-72 shadow-xl">
            <div className="relative w-14 h-14 rounded-full overflow-hidden ring-2 ring-[color:var(--nfc-green)] shadow-md mx-auto mb-2">
              <Image src="/logo.png" alt="NFC Crest" fill className="object-contain" />
            </div>
            <span className="badge-category badge-green text-[9px] mb-2 inline-block font-bold">HAUTE DÉFINITION</span>
            <h3 className="font-display text-lg font-extrabold text-white">{GALLERY_DATA.length} MÉDIAS DISPONIBLES</h3>
            <p className="text-xs text-[color:var(--nfc-yellow)] mt-1 font-mono">Photos & Vidéos Officielles</p>
          </div>
        }
      />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-10">
        <SectionTag label="Galerie photos & vidéos" className="mb-8" />

        {/* FILTRES ALBUMS */}
        <div className="flex flex-wrap gap-2">
          {albums.map((album) => (
            <button
              key={album}
              onClick={() => setFilterAlbum(album)}
              className={`px-4 py-2 text-xs font-display font-bold tracking-wider transition-all duration-200 ${
                filterAlbum === album
                  ? 'bg-[color:var(--nfc-green)] text-white shadow-sm'
                  : 'bg-white text-gray-600 border border-gray-200 hover:border-[color:var(--nfc-green)] hover:text-[color:var(--nfc-green)]'
              }`}
            >
              {album}
            </button>
          ))}
        </div>

        {/* GRILLE MASONRY */}
        <div className="columns-1 sm:columns-2 lg:columns-3 gap-6">
          {filteredMedia.map((item) => (
            <div
              key={item.id}
              onClick={() => setSelectedMedia(item)}
              className="mb-6 break-inside-avoid bg-white overflow-hidden group cursor-pointer border border-gray-100 shadow-sm hover:shadow-lg hover:-translate-y-1 transition-all duration-300"
            >
              <div className="relative w-full bg-gray-100 overflow-hidden">
                <img
                  src={item.url}
                  alt={item.title}
                  className="w-full h-auto object-cover group-hover:scale-105 transition-transform duration-500"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-transparent to-transparent" />

                {/* Badge type */}
                <div className="absolute top-3 left-3">
                  <span className="badge-category badge-green flex items-center gap-1">
                    {item.type === 'VIDEO' ? <Video className="w-3 h-3 inline" /> : <ImageIcon className="w-3 h-3 inline" />}
                    {item.album}
                  </span>
                </div>

                {/* Badge joueur associé */}
                {item.playerName && (
                  <div className="absolute top-3 right-3">
                    <span className="badge-category badge-green text-[9px]">👤 {item.playerName}</span>
                  </div>
                )}

                {/* Icône play pour les vidéos */}
                {item.type === 'VIDEO' && (
                  <div className="absolute inset-0 flex items-center justify-center">
                    <div className="w-12 h-12 rounded-full bg-[color:var(--nfc-green)] flex items-center justify-center opacity-80 group-hover:opacity-100 group-hover:scale-110 transition-all duration-200">
                      <Play className="w-6 h-6 text-white fill-current ml-0.5" />
                    </div>
                  </div>
                )}

                {/* Expand icon */}
                {item.type === 'IMAGE' && (
                  <div className="absolute top-3 right-3 p-1.5 bg-white/90 text-gray-600 opacity-0 group-hover:opacity-100 transition-opacity duration-200">
                    <Maximize2 className="w-3.5 h-3.5" />
                  </div>
                )}

                {/* Titre */}
                <div className="absolute bottom-0 inset-x-0 p-4">
                  <h4 className="text-sm font-display font-bold text-white line-clamp-1">{item.title}</h4>
                  <p className="text-[10px] text-gray-300 mt-0.5">{item.createdAt}</p>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* INFO CDN */}
        <div className="bg-white border border-gray-100 p-6 flex flex-col sm:flex-row items-center justify-between gap-4 shadow-sm">
          <div className="flex items-center gap-4">
            <div className="w-10 h-10 bg-[color:var(--nfc-green)]/10 flex items-center justify-center shrink-0">
              <CloudUpload className="w-5 h-5 text-[color:var(--nfc-green)]" />
            </div>
            <div>
              <h4 className="font-display font-bold text-gray-900 text-sm">HÉBERGEMENT MÉDIAS VIA CLOUDINARY</h4>
              <p className="text-xs text-gray-500 mt-0.5">Images et vidéos optimisées et délivrées à haute vitesse via CDN.</p>
            </div>
          </div>
          <span className="badge-category badge-outline shrink-0">Cloudinary CDN · Actif</span>
        </div>

      </div>

      {/* LIGHTBOX / VISIONNEUSE */}
      {selectedMedia && (
        <div
          className="fixed inset-0 z-50 bg-black/85 backdrop-blur-sm flex items-center justify-center p-4 animate-fade-in"
          onClick={() => setSelectedMedia(null)}
        >
          <div
            className="bg-white max-w-3xl w-full overflow-hidden shadow-2xl animate-fade-in-up"
            onClick={(e) => e.stopPropagation()}
          >
            {/* En-tête modal */}
            <div className="flex items-center justify-between px-5 py-4 border-b border-gray-100">
              <h3 className="font-display font-bold text-gray-900 text-sm truncate">{selectedMedia.title}</h3>
              <button
                onClick={() => setSelectedMedia(null)}
                className="p-1.5 hover:bg-gray-100 text-gray-500 transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Contenu média */}
            <div className="relative bg-gray-50 max-h-[65vh] overflow-hidden">
              {selectedMedia.type === 'VIDEO' ? (
                <div className="relative aspect-video">
                  <iframe
                    src={selectedMedia.url}
                    title={selectedMedia.title}
                    allow="autoplay; fullscreen"
                    allowFullScreen
                    className="w-full h-full"
                  />
                </div>
              ) : (
                <img
                  src={selectedMedia.url}
                  alt={selectedMedia.title}
                  className="w-full h-auto max-h-[65vh] object-contain mx-auto"
                />
              )}
            </div>

            {/* Pied de modal */}
            <div className="flex justify-between items-center text-xs text-gray-500 px-5 py-3 border-t border-gray-100">
              <div className="flex items-center gap-3">
                <span>Album : <strong className="text-[color:var(--nfc-green)]">{selectedMedia.album}</strong></span>
                {selectedMedia.playerName && (
                  <span>Joueur : <strong className="text-[color:var(--nfc-green)]">{selectedMedia.playerName}</strong></span>
                )}
              </div>
              <span>Publié le : {selectedMedia.createdAt}</span>
            </div>
          </div>
        </div>
      )}

    </div>
  );
}
