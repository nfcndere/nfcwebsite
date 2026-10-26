import { PageHeader } from '@/components/ui/PageHeader';

export default function LeClubPage() {
  return (
    <div className="space-y-10 bg-[#f7f8f7] pb-20">
      <PageHeader
        tag="LE CLUB"
        title="NGAOUNDÉRÉ"
        titleHighlight="FOOTBALL CLUB"
        description="Les informations officielles sur l’histoire, les dirigeants et le palmarès du club seront publiées après validation."
        backgroundImageUrl="/back image le club.jpg"
      />
      <section className="mx-auto max-w-4xl rounded-2xl border border-gray-100 bg-white p-6 text-center shadow-sm sm:p-10">
        <h2 className="font-display text-xl font-bold uppercase text-gray-900">Informations en cours de validation</h2>
        <p className="mt-3 text-sm leading-relaxed text-gray-600">
          Les données historiques, les fonctions officielles et les distinctions seront ajoutées dès qu’elles auront été confirmées par le club.
        </p>
      </section>
    </div>
  );
}
