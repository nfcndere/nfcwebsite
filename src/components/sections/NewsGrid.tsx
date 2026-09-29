import Image from 'next/image';
import Link from 'next/link';
import { ArrowRight } from 'lucide-react';
import { NEWS_DATA } from '@/lib/mock-data';

const [featureArticle, secondaryArticleA, secondaryArticleB, ...sideArticles] = NEWS_DATA;

export default function NewsGrid() {
  return (
    <section className="max-w-7xl mx-auto px-3 sm:px-4 md:px-6 lg:px-8 py-10 sm:py-12 md:py-16">
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-4 sm:gap-5 md:gap-6">
        <div className="lg:col-span-4">
          <Link href={`/actualites/${featureArticle.slug}`} className="group relative block h-[500px] overflow-hidden border-4 border-[color:var(--nfc-green-light)] bg-black shadow-lg transition-transform duration-300 hover:-translate-y-1">
            <div className="absolute inset-0">
              <Image
                src={featureArticle.coverImage}
                alt={featureArticle.title}
                fill
                sizes="(max-width: 1024px) 100vw, 33vw"
                className="object-cover transition-transform duration-500 group-hover:scale-105"
              />
            </div>

            <div className="absolute inset-0 bg-gradient-to-t from-black via-black/60 to-transparent" />

            <div className="absolute left-4 top-4 z-10 inline-flex items-center gap-2 bg-[color:var(--nfc-green)] px-3 py-2 text-[10px] font-display font-extrabold uppercase tracking-[0.18em] text-[color:var(--nfc-white)]">
              <span className="flex h-5 w-5 items-center justify-center border border-[color:var(--nfc-green-light)] bg-[color:var(--nfc-dark)] text-[9px]">
                NFC
              </span>
              Club
            </div>

            <div className="absolute bottom-6 left-6 right-6 z-10 bg-white/96 p-4 shadow-md">
              <div className="mb-2 text-[10px] font-bold uppercase tracking-[0.14em] text-gray-500">
                {featureArticle.category}
              </div>

              <h3 className="font-display text-xl sm:text-2xl font-extrabold uppercase leading-tight text-gray-900">
                {featureArticle.title}
              </h3>

              <p className="mt-2 text-xs text-gray-600 line-clamp-2">
                {featureArticle.summary}
              </p>

              <div className="mt-4 inline-flex items-center gap-2 text-[11px] font-display font-bold uppercase text-[color:var(--nfc-green)]">
                Lire la suite
                <ArrowRight className="h-3.5 w-3.5" />
              </div>
            </div>
          </Link>
        </div>

        <div className="lg:col-span-5 space-y-6">
          {[secondaryArticleA, secondaryArticleB].map((article) => (
            <Link key={article.id} href={`/actualites/${article.slug}`} className="group flex overflow-hidden border-l-4 border-[color:var(--nfc-green)] bg-white shadow-md transition-transform duration-300 hover:-translate-y-1">
              <div className="relative w-2/5 min-h-[240px]">
                <Image
                  src={article.coverImage}
                  alt={article.title}
                  fill
                  sizes="(max-width: 1024px) 100vw, 20vw"
                  className="object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-r from-[#0c130e]/70 via-[#0c130e]/30 to-transparent" />
                <div className="absolute inset-0 flex items-center justify-center gap-3 text-white">
                  <span className="font-display text-lg font-extrabold">NFC</span>
                  <span className="text-xs font-bold uppercase tracking-widest">VS</span>
                  <span className="font-display text-lg font-extrabold">{article.category}</span>
                </div>
              </div>

              <div className="w-3/5 p-5">
                <div className="mb-2 text-[10px] font-bold uppercase tracking-[0.18em] text-[color:var(--nfc-green)]">
                  {article.category}
                </div>

                <h3 className="font-display text-base sm:text-lg font-extrabold uppercase leading-tight text-gray-900">
                  {article.title}
                </h3>

                <p className="mt-2 text-xs text-gray-600 line-clamp-3">
                  {article.summary}
                </p>
              </div>
            </Link>
          ))}
        </div>

        <div className="lg:col-span-3">
          <div className="space-y-4">
            {sideArticles.slice(0, 3).map((item) => (
              <Link
                key={item.id}
                href={`/actualites/${item.slug}`}
                className="group block overflow-hidden border border-gray-200 bg-white shadow-sm transition-transform duration-300 hover:-translate-y-1"
              >
                <div className="relative h-28 w-full">
                  <Image
                    src={item.coverImage}
                    alt={item.title}
                    fill
                    sizes="(max-width: 1024px) 100vw, 20vw"
                    className="object-cover transition-transform duration-500 group-hover:scale-105"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent" />
                  <span className="absolute left-3 top-3 inline-block bg-[color:var(--nfc-green)] px-2 py-1 text-[9px] font-bold uppercase tracking-[0.14em] text-[color:var(--nfc-white)]">
                    {item.category}
                  </span>
                </div>

                <div className="p-4">
                  <p className="text-[10px] uppercase tracking-[0.12em] text-gray-500">
                    {new Date(item.createdAt).toLocaleDateString('fr-FR', {
                      day: 'numeric',
                      month: 'short',
                      year: 'numeric',
                    })}
                  </p>
                  <h4 className="mt-2 font-display text-sm font-extrabold uppercase leading-tight text-gray-900 transition-colors group-hover:text-[color:var(--nfc-green)] line-clamp-3">
                    {item.title}
                  </h4>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
