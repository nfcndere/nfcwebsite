import type { ReactNode } from 'react';
import type { ApiStatus } from '@/lib/use-api-resource';
import { getResourceView } from '@/lib/resource-state';

export function DataState({
  status,
  children,
  skeleton,
  emptyMessage = 'Aucune donnée disponible pour le moment.',
  error,
  onRetry,
  updatedAt,
}: {
  status: ApiStatus;
  children?: ReactNode;
  skeleton?: ReactNode;
  emptyMessage?: string;
  error?: string | null;
  onRetry?: () => void;
  updatedAt?: string | null;
}) {
  const view = getResourceView(status);
  if (view === 'skeleton') {
    return skeleton ? (
      <div role="status" aria-live="polite">
        <span className="sr-only">Chargement des données…</span>
        <span aria-hidden="true">{skeleton}</span>
      </div>
    ) : <p role="status" aria-live="polite">Chargement…</p>;
  }
  if (view === 'error') {
    return (
      <div role="alert" aria-live="polite" className="rounded-xl border border-rose-200 bg-rose-50 p-4 text-sm text-rose-800">
        <p>{error || 'Impossible de charger les données. Vérifiez votre connexion.'}</p>
        {onRetry && <button type="button" onClick={onRetry} className="mt-2 font-bold underline">Réessayer</button>}
      </div>
    );
  }
  if (view === 'empty') return <p role="status" aria-live="polite" className="py-6 text-center text-sm text-gray-600">{emptyMessage}</p>;

  return (
    <>
      {status === 'stale' && (
        <p role="status" aria-live="polite" className="mb-3 rounded-lg bg-amber-50 px-3 py-2 text-xs text-amber-900">
          Dernière mise à jour : {updatedAt ? new Date(updatedAt).toLocaleString('fr-FR', { timeZone: 'Africa/Douala' }) : 'date inconnue'}. Ces données peuvent ne plus être à jour.
        </p>
      )}
      {status === 'partial' && <p role="status" aria-live="polite" className="mb-3 text-xs font-semibold text-amber-800">Données à vérifier.</p>}
      {children}
    </>
  );
}
