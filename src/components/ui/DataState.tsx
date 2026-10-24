import type { ReactNode } from 'react';
import type { ApiStatus } from '@/lib/use-api-resource';

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
  if (status === 'loading') return <>{skeleton ?? <p role="status">Chargement…</p>}</>;
  if (status === 'error') {
    return (
      <div role="alert" aria-live="polite" className="rounded-xl border border-rose-200 bg-rose-50 p-4 text-sm text-rose-800">
        <p>{error || 'Impossible de charger les données. Vérifiez votre connexion.'}</p>
        {onRetry && <button type="button" onClick={onRetry} className="mt-2 font-bold underline">Réessayer</button>}
      </div>
    );
  }
  if (status === 'empty') return <p role="status" aria-live="polite" className="py-6 text-center text-sm text-gray-600">{emptyMessage}</p>;

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
