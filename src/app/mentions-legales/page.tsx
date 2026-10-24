import { PageHeader } from '@/components/ui/PageHeader';

export default function MentionsLegalesPage() {
  return (
    <div className="space-y-8 pb-16">
      <PageHeader
        tag="INFORMATIONS LÉGALES"
        title="MENTIONS"
        titleHighlight="LÉGALES"
        description="Informations légales et données de confidentialité du site ngaounderefc.cm."
        backgroundImageUrl="/galerie%20baneer%20(1).jpg"
      />
      <section className="mx-auto max-w-4xl space-y-5 px-4 text-sm leading-relaxed text-gray-700">
        <p className="rounded-lg border border-amber-200 bg-amber-50 p-4 text-amber-900" role="status">
          Cette page doit être complétée par le responsable légal du club avant la mise en ligne.
        </p>
        <h2 className="font-display text-lg font-bold text-gray-900">Éditeur du site</h2>
        <p>Ngaoundéré Football Club. Adresse du siège, responsable de publication et coordonnées : informations à compléter.</p>
        <h2 className="font-display text-lg font-bold text-gray-900">Hébergement</h2>
        <p>Nom et coordonnées de l’hébergeur : informations à compléter.</p>
        <h2 className="font-display text-lg font-bold text-gray-900">Données personnelles</h2>
        <p>Les formulaires du site recueillent des informations pour traiter les demandes adressées au club. La durée de conservation, les coordonnées du responsable de traitement et les modalités d’exercice des droits doivent être précisées par le club.</p>
        <h2 className="font-display text-lg font-bold text-gray-900">Cookies</h2>
        <p>Informations relatives aux cookies : à compléter selon les services effectivement activés sur le site.</p>
      </section>
    </div>
  );
}
