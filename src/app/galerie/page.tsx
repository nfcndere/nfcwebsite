'use client';

import React, { useState, useEffect } from 'react';
import { PageHeader } from '@/components/ui/PageHeader';
import { SectionTag } from '@/components/ui/SectionTag';
import { GALLERY_DATA } from '@/lib/mock-data';
import { MediaItem } from '@/types';
import { Image as ImageIcon, Video, Maximize2, CloudUpload, X, Play } from 'lucide-react';
import Image from 'next/image';

export default function GaleriePage() {
  const [filterAlbum, setFilterAlbum] = useState<string>('TOUS');
  const [selectedMedia, setSelectedMedia] = useState<MediaItem | null>(null);
  const [mediaList, setMediaList] = useState<any[]>(GALLERY_DATA);

  const albums = ['TOUS', 'Saison 2025-2026', 'Entraînements', 'Académie', 'Ferveur Supporters'];

  useEffect(() => {
    async function fetchMedia() {
      try {
        const res = await fetch('/api/galerie');
        if (res.ok) {
          const data = await res.json();
          if (Array.isArray(data) && data.length > 0) {
            const formatted = data.map((item: any) => ({
              id: item.id,
              url: item.url,
              type: item.mediaType || 'IMAGE',
              title: item.title || 'Média NFC',
              album: item.album || 'Galerie Officielle',
              playerName: item.player ? `${item.player.firstName} ${item.player.lastName}` : null,
              createdAt: new Date(item.createdAt).toLocaleDateString('fr-FR', { day: 'numeric', month: 'short', year: 'numeric' }),
            }));
            setMediaList(formatted);
          }
        }
      } catch (error) {
        console.warn('Utilisation du fallback local pour la galerie');
      }
    }
    fetchMedia();
  }, []);

  const filteredMedia = mediaList.filter((item) => {
    if (filterAlbum === 'TOUS') return true;
    return item.album === filterAlbum;
  });

  return (
    <div className="bg-[#f7f8f7] text-[#1f2937] font-sans space-y-6 sm:space-y-12 pb-16">

      <PageHeader
        tag="MÉDIATHÈQUE NFC"
        title="GALERIE"
        titleHighlight="PHOTOS & VIDÉOS"
        description="Revivez les temps forts, les célébrations et les moments coulisses du Ngaoundéré Football Club en images."
        backgroundImageUrl="/galerie baneer (1).jpg"
        badgeContent={
          <div className="bg-[#0c130e]/90 backdrop-blur-md p-4 sm:p-6 rounded-2xl border border-white/10 text-center w-full lg:w-72 shadow-xl">
            <div className="relative w-12 h-12 sm:w-14 sm:h-14 rounded-full overflow-hidden ring-2 ring-[#008751] shadow-md mx-auto mb-2">
              <Image src="/logo.png" alt="NFC Crest" fill className="object-contain" />
            </div>
            <span className="badge-category badge-green text-[9px] mb-2 inline-block font-bold">HAUTE DÉFINITION</span>
            <h3 className="font-display text-base sm:text-lg font-extrabold text-white">{mediaList.length} MÉDIAS DISPONIBLES</h3>
            <p className="text-xs text-[color:var(--nfc-yellow)] mt-1 font-mono">Photos & Vidéos Officielles</p>
          </div>
        }
      />

      <div className="max-w-7xl mx-auto px-3 sm:px-6 lg:px-8 space-y-6 sm:space-y-10">
        <SectionTag label="Galerie photos & vidéos" />

        <div className="flex flex-wrap gap-1.5 sm:gap-2">
          {albums.map((album) => (
            <button
              key={album}
              onClick={() => setFilterAlbum(album)}
              className={`px-3 py-1.5 sm:px-4 sm:py-2 text-[11px] sm:text-xs font-display font-bold tracking-wider transition-all duration-200 ${
                filterAlbum === album
                  ? 'bg-[#008751] text-white shadow-sm'
                  : 'bg-white text-gray-600 border border-gray-200 hover:border-[#008751] hover:text-[#008751]'
              }`}
            >
              {album}
            </button>
          ))}
        </div>

        <div className="columns-1 sm:columns-2 lg:columns-3 gap-4 sm:gap-6">
          {filteredMedia.map((item) => (
            <div
              key={item.id}
              onClick={() => setSelectedMedia(item)}
              className="mb-4 sm:mb-6 break-inside-avoid bg-white overflow-hidden group cursor-pointer border border-gray-100 shadow-sm hover:shadow-lg hover:-translate-y-1 transition-all duration-300 rounded-xl"
            >
              <div className="relative w-full bg-gray-100 overflow-hidden">
                <img
                  src={item.url}
                  alt={item.title}
                  className="w-full h-auto object-cover group-hover:scale-105 transition-transform duration-500"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-transparent to-transparent" />

                <div className="absolute top-2.5 left-2.5">
                  <span className="badge-category badge-green flex items-center gap-1 text-[9px]">
                    {item.type === 'VIDEO' ? <Video className="w-3 h-3 inline" /> : <ImageIcon className="w-3 h-3 inline" />}
                    {item.album}
                  </span>
                </div>

                {item.playerName && (
                  <div className="absolute top-2.5 right-2.5">
                    <span className="badge-category badge-green text-[8px]">👤 {item.playerName}</span>
                  </div>
                )}

                {item.type === 'VIDEO' && (
                  <div className="absolute inset-0 flex items-center justify-center">
                    <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-full bg-[#008751] flex items-center justify-center opacity-85 group-hover:opacity-100 group-hover:scale-110 transition-all duration-200 shadow-lg">
                      <Play className="w-5 h-5 text-white fill-current ml-0.5" />
                    </div>
                  </div>
                )}

                {item.type === 'IMAGE' && (
                  <div className="absolute top-2.5 right-2.5 p-1.5 bg-white/90 text-gray-600 opacity-0 group-hover:opacity-100 transition-opacity duration-200 rounded-md">
                    <Maximize2 className="w-3.5 h-3.5" />
                  </div>
                )}

                <div className="absolute bottom-0 inset-x-0 p-3 sm:p-4">
                  <h4 className="text-xs sm:text-sm font-display font-bold text-white line-clamp-1">{item.title}</h4>
                  <p className="text-[10px] text-gray-300 mt-0.5">{item.createdAt}</p>
                </div>
              </div>
            </div>
          ))}
        </div>

        <div className="bg-white border border-gray-100 p-4 sm:p-6 rounded-2xl flex flex-col sm:flex-row items-center justify-between gap-3 shadow-sm">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 sm:w-10 sm:h-10 bg-[#008751]/10 flex items-center justify-center rounded-xl shrink-0">
              <CloudUpload className="w-4 h-4 sm:w-5 sm:h-5 text-[#008751]" />
            </div>
            <div>
              <h4 className="font-display font-bold text-gray-900 text-xs sm:text-sm">HÉBERGEMENT MÉDIAS VIA CLOUDINARY</h4>
              <p className="text-[11px] text-gray-500 mt-0.5">Images et vidéos optimisées et délivrées à haute vitesse via CDN.</p>
            </div>
          </div>
          <span className="badge-category badge-outline text-[9px] shrink-0">Cloudinary CDN · Actif</span>
        </div>

      </div>

      {selectedMedia && (
        <div
          className="fixed inset-0 z-50 bg-black/85 backdrop-blur-sm flex items-center justify-center p-3 animate-fade-in"
          onClick={() => setSelectedMedia(null)}
        >
          <div
            className="bg-white max-w-3xl w-full rounded-2xl overflow-hidden shadow-2xl animate-fade-in-up"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center justify-between px-4 py-3 border-b border-gray-100">
              <h3 className="font-display font-bold text-gray-900 text-xs sm:text-sm truncate">{selectedMedia.title}</h3>
              <button
                onClick={() => setSelectedMedia(null)}
                className="p-1 hover:bg-gray-100 text-gray-500 transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

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

            <div className="flex justify-between items-center text-[11px] text-gray-500 px-4 py-3 border-t border-gray-100">
              <div className="flex items-center gap-3">
                <span>Album : <strong className="text-[#008751]">{selectedMedia.album}</strong></span>
                {selectedMedia.playerName && (
                  <span>Joueur : <strong className="text-[#008751]">{selectedMedia.playerName}</strong></span>
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
