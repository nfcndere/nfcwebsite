'use client';

import { DataState } from '@/components/ui/DataState';
import { DATA_FRESHNESS_MS } from '@/constants/data-freshness';
import { getSafeExternalUrl } from '@/lib/public-links';
import { useApiResource } from '@/lib/use-api-resource';

type Partner = {
  id: string;
  name: string;
  link: string | null;
  logoUrl: string | null;
};

export default function Partners() {
  const resource = useApiResource<Partner[]>('/api/partners', {
    staleAfterMs: DATA_FRESHNESS_MS.partners,
  });

  return (
    <section className="bg-white py-16 sm:py-20 lg:py-24">
      <div className="mx-auto max-w-5xl space-y-10 px-4 sm:px-6 lg:px-8">
        <div className="text-center">
          <span className="mb-2 block text-[11px] font-display font-bold uppercase tracking-[0.25em] text-[#008751]">
            Nos partenaires
          </span>
          <h2 className="font-display text-3xl font-extrabold uppercase tracking-tight text-gray-900 sm:text-4xl">
            Ils nous accompagnent dans notre aventure
          </h2>
        </div>

        <DataState
          status={resource.status}
          error={resource.error}
          onRetry={resource.retry}
          updatedAt={resource.updatedAt}
          emptyMessage="Les partenaires officiels seront publiés prochainement."
          skeleton={<div className="h-24 animate-pulse rounded-xl bg-gray-100" />}
        >
          <div className="flex flex-wrap items-center justify-center gap-x-10 gap-y-10">
            {(resource.data ?? []).map((partner) => {
              const link = getSafeExternalUrl(partner.link);
              const content = (
                <div className="flex min-h-20 items-center justify-center">
                  {partner.logoUrl ? (
                    <img src={partner.logoUrl} alt={partner.name} className="max-h-24 max-w-60 object-contain" />
                  ) : (
                    <span className="font-display text-sm font-bold uppercase text-gray-700">{partner.name}</span>
                  )}
                </div>
              );
              return link ? (
                <a key={partner.id} href={link} target="_blank" rel="noopener noreferrer" aria-label={`Visiter le site de ${partner.name}`}>
                  {content}
                </a>
              ) : <div key={partner.id}>{content}</div>;
            })}
          </div>
        </DataState>
      </div>
    </section>
  );
}
