import { PageHeader } from '@/components/ui/PageHeader';

export default function MembrePage() {
  return (
    <div className="space-y-8 bg-[color:var(--nfc-bg)] pb-16">
      <PageHeader
        tag="ESPACE SUPPORTER"
        title="ESPACE"
        titleHighlight="MEMBRE"
        description="Les adhésions et services aux supporters seront présentés dès que leurs modalités auront été confirmées par le club."
        backgroundImageUrl="/cover man pic.jpg"
      />
      <section className="mx-auto max-w-3xl rounded-2xl border border-gray-100 bg-white p-6 text-center shadow-sm sm:p-10">
        <h2 className="font-display text-xl font-bold uppercase text-gray-900">Service en préparation</h2>
        <p className="mt-3 text-sm leading-relaxed text-gray-600">
          Aucun tarif, avantage ou compte membre n’est actuellement publié. Les informations officielles seront ajoutées après validation.
        </p>
      </section>
    </div>
  );
}
