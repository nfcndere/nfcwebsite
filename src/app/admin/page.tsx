import Link from 'next/link';
import { PageHeader } from '@/components/ui/PageHeader';

export default function AdminPage() {
  return (
    <div className="min-h-screen space-y-8 bg-[#f7f8f7] pb-16">
      <PageHeader
        tag="PORTAIL D'ADMINISTRATION"
        title="ESPACE"
        titleHighlight="D'ADMINISTRATION"
        description="La gestion des contenus du club sera assurée par une application d'administration dédiée."
        backgroundImageUrl="/back image le club.jpg"
      />
      <section className="mx-auto max-w-3xl rounded-2xl border border-gray-100 bg-white p-6 text-center shadow-sm sm:p-10">
        <h2 className="font-display text-xl font-bold text-gray-900">Espace en préparation</h2>
        <p className="mt-3 text-sm leading-relaxed text-gray-600">
          Cet espace public ne permet pas de modifier les données du club. Les administrateurs pourront les gérer depuis l’outil dédié.
        </p>
        <Link href="/" className="btn-green mt-6 inline-flex px-5 py-3 text-xs">
          Retour au site
        </Link>
      </section>
    </div>
  );
}
