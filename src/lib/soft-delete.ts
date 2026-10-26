/**
 * Suppression logique (Article, Match, Player).
 * Toute lecture publique doit inclure `NOT_DELETED` dans son filtre `where`.
 */
export const NOT_DELETED = { deletedAt: null } as const;

/** Filtre public des articles : publiés et non supprimés. */
export function publicArticleWhere<T extends Record<string, unknown>>(extra: T = {} as T) {
  return { ...extra, published: true, deletedAt: null };
}

/** Ajoute le filtre de suppression logique à un `where` existant. */
export function withNotDeleted<T extends Record<string, unknown>>(where: T = {} as T) {
  return { ...where, deletedAt: null };
}
