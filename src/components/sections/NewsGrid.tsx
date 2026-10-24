'use client';

import Image from 'next/image';
import Link from 'next/link';
import { ArrowRight, Newspaper } from 'lucide-react';
import { useApiResource } from '@/lib/use-api-resource';
import { DataState } from '@/components/ui/DataState';
import { DATA_FRESHNESS_MS } from '@/constants/data-freshness';

interface NewsGridProps {
  articles?: any[];
}

export default function NewsGrid({ articles }: NewsGridProps) {
  const resource = useApiResource<any[]>('/api/articles', { staleAfterMs: DATA_FRESHNESS_MS.articles });
  const items = articles ?? resource.data ?? [];

  if (!items || items.length === 0) {
    return (
      <section className="max-w-7xl px-3 py-10 sm:px-4 sm:py-12 md:px-6 lg:px-8">
        <DataState
          status={articles ? articles.length ? 'ok' : 'empty' : resource.status}
          error={resource.error}
          onRetry={resource.retry}
          updatedAt={resource.updatedAt}
          emptyMessage="Aucune actualité pour le moment. Revenez bientôt."
          skeleton={<div className="h-64 animate-pulse rounded-xl bg-white" />}
        >
          <div className="rounded-2xl border border-gray-200 bg-white p-8 text-center shadow-sm">
            <Newspaper className="mx-auto h-6 w-6 text-[#008751]" />
            <p className="mt-3 text-sm text-gray-600">Aucune actualité pour le moment. Revenez bientôt.</p>
          </div>
        </DataState>
      </section>
    );
  }

  const featureArticle = items[0];
  const secondaryArticleA = items[1];
  const secondaryArticleB = items[2];
  const sideArticles = items.slice(3);

  const getCover = (art: any) => art?.coverImage || art?.cover?.url || null;

  return (
    <section className="max-w-7xl mx-auto px-3 sm:px-4 md:px-6 lg:px-8 py-10 sm:py-12 md:py-16">
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-4 sm:gap-5 md:gap-6">
        {/* Main Featured Article */}
        {featureArticle && (
          <div className="lg:col-span-4">
            <Link
              href={`/actualites/${featureArticle.slug || featureArticle.id}`}
              className="group relative block h-[500px] overflow-hidden border-4 border-[color:var(--nfc-green-light)] bg-black shadow-lg transition-transform duration-300 hover:-translate-y-1"
            >
              <div className="absolute inset-0">
                {getCover(featureArticle) && <Image
                  src={getCover(featureArticle)}
                  alt={featureArticle.title || 'Actualité NFC'}
                  fill
                  sizes="(max-width: 1024px) 100vw, 33vw"
                  className="object-cover transition-transform duration-500 group-hover:scale-105"
                />}
              </div>

              <div className="absolute inset-0 bg-gradient-to-t from-black via-black/60 to-transparent" />

              <div className="absolute left-4 top-4 z-10 inline-flex items-center gap-2 bg-[color:var(--nfc-green)] px-3 py-2 text-[10px] font-display font-extrabold uppercase tracking-[0.18em] text-[color:var(--nfc-white)]">
                <span className="flex h-5 w-5 items-center justify-center border border-[color:var(--nfc-green-light)] bg-[color:var(--nfc-dark)] text-[9px]">
                  NFC
                </span>
                {featureArticle.category || 'Club'}
              </div>

              <div className="absolute bottom-6 left-6 right-6 z-10 bg-white/96 p-4 shadow-md">
                <div className="mb-2 text-[10px] font-bold uppercase tracking-[0.14em] text-gray-500">
                  {featureArticle.category || 'ACTUALITÉ'}
                </div>

                <h3 className="font-display text-xl sm:text-2xl font-extrabold uppercase leading-tight text-gray-900">
                  {featureArticle.title}
                </h3>

                {featureArticle.summary && (
                  <p className="mt-2 text-xs text-gray-600 line-clamp-2">
                    {featureArticle.summary}
                  </p>
                )}

                <div className="mt-4 inline-flex items-center gap-2 text-[11px] font-display font-bold uppercase text-[color:var(--nfc-green)]">
                  Lire la suite
                  <ArrowRight className="h-3.5 w-3.5" />
                </div>
              </div>
            </Link>
          </div>
        )}

        {/* Secondary Articles */}
        <div className={featureArticle ? 'lg:col-span-5 space-y-6' : 'lg:col-span-12 space-y-6'}>
          {[secondaryArticleA, secondaryArticleB].filter(Boolean).map((article) => (
            <Link
              key={article.id || article.slug}
              href={`/actualites/${article.slug || article.id}`}
              className="group flex overflow-hidden border-l-4 border-[color:var(--nfc-green)] bg-white shadow-md transition-transform duration-300 hover:-translate-y-1"
            >
              <div className="relative w-2/5 min-h-[240px]">
                {getCover(article) && <Image
                  src={getCover(article)}
                  alt={article.title || 'Actualité NFC'}
                  fill
                  sizes="(max-width: 1024px) 100vw, 20vw"
                  className="object-cover"
                />}
                <div className="absolute inset-0 bg-gradient-to-r from-[#0c130e]/70 via-[#0c130e]/30 to-transparent" />
                <div className="absolute inset-0 flex items-center justify-center gap-3 text-white">
                  <span className="font-display text-lg font-extrabold">NFC</span>
                  <span className="text-xs font-bold uppercase tracking-widest">VS</span>
                  <span className="font-display text-lg font-extrabold">{article.category || 'CLUB'}</span>
                </div>
              </div>

              <div className="w-3/5 p-5">
                <div className="mb-2 text-[10px] font-bold uppercase tracking-[0.18em] text-[color:var(--nfc-green)]">
                  {article.category || 'ACTUALITÉ'}
                </div>

                <h3 className="font-display text-base sm:text-lg font-extrabold uppercase leading-tight text-gray-900">
                  {article.title}
                </h3>

                {article.summary && (
                  <p className="mt-2 text-xs text-gray-600 line-clamp-3">
                    {article.summary}
                  </p>
                )}
              </div>
            </Link>
          ))}
        </div>

        {/* Side Articles */}
        {sideArticles.length > 0 && (
          <div className="lg:col-span-3">
            <div className="space-y-4">
              {sideArticles.slice(0, 3).map((item) => (
                <Link
                  key={item.id || item.slug}
                  href={`/actualites/${item.slug || item.id}`}
                  className="group block overflow-hidden border border-gray-200 bg-white shadow-sm transition-transform duration-300 hover:-translate-y-1"
                >
                  <div className="relative h-28 w-full">
                    {getCover(item) && <Image
                      src={getCover(item)}
                      alt={item.title || 'Actualité NFC'}
                      fill
                      sizes="(max-width: 1024px) 100vw, 20vw"
                      className="object-cover transition-transform duration-500 group-hover:scale-105"
                    />}
                    <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent" />
                    <span className="absolute left-3 top-3 inline-block bg-[color:var(--nfc-green)] px-2 py-1 text-[9px] font-bold uppercase tracking-[0.14em] text-[color:var(--nfc-white)]">
                      {item.category || 'CLUB'}
                    </span>
                  </div>

                  <div className="p-4">
                    {item.createdAt && (
                      <p className="text-[10px] uppercase tracking-[0.12em] text-gray-500">
                        {new Date(item.createdAt).toLocaleDateString('fr-FR', {
                          day: 'numeric',
                          month: 'short',
                          year: 'numeric',
                        })}
                      </p>
                    )}
                    <h4 className="mt-2 font-display text-sm font-extrabold uppercase leading-tight text-gray-900 transition-colors group-hover:text-[color:var(--nfc-green)] line-clamp-3">
                      {item.title}
                    </h4>
                  </div>
                </Link>
              ))}
            </div>
          </div>
        )}
      </div>
    </section>
  );
}
