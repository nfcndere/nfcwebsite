'use client';

import React, { useState } from 'react';
import { PageHeader } from '@/components/ui/PageHeader';
import { SectionTag } from '@/components/ui/SectionTag';
import { GALLERY_DATA } from '@/lib/mock-data';
import { MediaItem } from '@/types';
import { Image as ImageIcon, Video, Maximize2, CloudUpload, X } from 'lucide-react';
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

      {/* PAGE HERO HEADER WITH BACKGROUND IMAGE */}
      <PageHeader
        tag="MÉDIATHÈQUE NFC"
        title="GALERIE"
        titleHighlight="PHOTOS & VIDÉOS"
        description="Revivez les temps forts, les célébrations et les moments coulisses du Ngaoundéré Football Club en images."
        backgroundImageUrl="/galerie baneer (1).jpg"
        
        badgeContent={
          <div className="bg-[color:var(--nfc-dark)]/90 backdrop-blur-md p-6 rounded-2xl border border-white/10 text-center w-full lg:w-72 shadow-xl">
            <div className="relative w-14 h-14 rounded-full overflow-hidden ring-2 ring-[color:var(--nfc-green)] shadow-md mx-auto mb-2">
              <Image src="/logo.png" alt="NFC Crest" fill className="object-contain" />
            </div>
            <h3 className="font-display text-base font-bold text-white">HAUTE DÉFINITION</h3>
            <p className="text-xs text-gray-400 mt-1">Photos & Vidéos Officiennes</p>
          </div>
        }
      />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-10">
        <SectionTag label="Galerie photos & vidéos" className="mb-8" />

        {/* ALBUM FILTERS */}
        <div className="flex flex-wrap gap-2">
          {albums.map((album) => (
            <button
              key={album}
              onClick={() => setFilterAlbum(album)}
              className={`px-4 py-2 rounded-xl text-xs font-display font-bold tracking-wider transition-all duration-200 ${
                filterAlbum === album
                  ? 'bg-[#008751] text-white shadow-sm'
                  : 'bg-white text-gray-600 border border-gray-200 hover:border-[#008751] hover:text-[#008751]'
              }`}
            >
              {album}
            </button>
          ))}
        </div>

        {/* MEDIA MASONRY */}
        <div className="columns-1 sm:columns-2 lg:columns-3 gap-6">
          {filteredMedia.map((item) => (
            <div
              key={item.id}
              onClick={() => setSelectedMedia(item)}
              className="mb-6 break-inside-avoid bg-white rounded-2xl overflow-hidden group cursor-pointer border border-gray-100 shadow-sm hover:shadow-lg hover:-translate-y-1 transition-all duration-300"
            >
              <div className="relative w-full bg-gray-100 overflow-hidden">
                <img
                  src={item.url}
                  alt={item.title}
                  className="w-full h-auto object-cover group-hover:scale-105 transition-transform duration-500"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-transparent to-transparent" />

                {/* Type Badge */}
                <div className="absolute top-3 left-3">
                  <span className="badge-category badge-green flex items-center gap-1">
                    {item.type === 'VIDEO' ? <Video className="w-3 h-3 inline" /> : <ImageIcon className="w-3 h-3 inline" />}
                    {item.album}
                  </span>
                </div>

                {/* Expand Icon */}
                <div className="absolute top-3 right-3 p-1.5 bg-white/90 rounded-lg text-gray-600 opacity-0 group-hover:opacity-100 transition-opacity duration-200">
                  <Maximize2 className="w-3.5 h-3.5" />
                </div>

                {/* Title Overlay */}
                <div className="absolute bottom-0 inset-x-0 p-4">
                  <h4 className="text-sm font-display font-bold text-white line-clamp-1">{item.title}</h4>
                  <p className="text-[10px] text-gray-300 mt-0.5">{item.createdAt}</p>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* CDN INFO BANNER */}
        <div className="bg-white rounded-2xl border border-gray-100 p-6 flex flex-col sm:flex-row items-center justify-between gap-4 shadow-sm">
          <div className="flex items-center gap-4">
            <div className="w-10 h-10 rounded-xl bg-[#008751]/10 flex items-center justify-center shrink-0">
              <CloudUpload className="w-5 h-5 text-[#008751]" />
            </div>
            <div>
              <h4 className="font-display font-bold text-gray-900 text-sm">HÉBERGEMENT MÉDIAS VIA CLOUDINARY</h4>
              <p className="text-xs text-gray-500 mt-0.5">Images et vidéos optimisées et délivrées à haute vitesse via CDN.</p>
            </div>
          </div>
          <span className="badge-category badge-outline shrink-0">Cloudinary CDN · Actif</span>
        </div>

      </div>

      {/* LIGHTBOX MODAL */}
      {selectedMedia && (
        <div
          className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4 animate-fade-in"
          onClick={() => setSelectedMedia(null)}
        >
          <div
            className="bg-white rounded-2xl max-w-3xl w-full overflow-hidden shadow-2xl animate-fade-in-up"
            onClick={e => e.stopPropagation()}
          >
            {/* Modal Header */}
            <div className="flex items-center justify-between px-5 py-4 border-b border-gray-100">
              <h3 className="font-display font-bold text-gray-900 text-sm truncate">{selectedMedia.title}</h3>
              <button
                onClick={() => setSelectedMedia(null)}
                className="p-1.5 rounded-lg hover:bg-gray-100 text-gray-500 transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
            {/* Image */}
            <div className="relative bg-gray-50 max-h-[65vh] overflow-hidden">
              <img
                src={selectedMedia.url}
                alt={selectedMedia.title}
                className="w-full h-auto max-h-[65vh] object-contain mx-auto"
              />
            </div>
            {/* Modal Footer */}
            <div className="flex justify-between items-center text-xs text-gray-500 px-5 py-3 border-t border-gray-100">
              <span>Album : <strong className="text-[#008751]">{selectedMedia.album}</strong></span>
              <span>Publié le : {selectedMedia.createdAt}</span>
            </div>
          </div>
        </div>
      )}

    </div>
  );
}
