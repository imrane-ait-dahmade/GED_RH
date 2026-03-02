/**
 * Configuration centralisée de l'authentification.
 * Stockage sécurisé : access token en mémoire, refresh via cookie httpOnly (côté backend).
 */

/** Cookie lu par le middleware pour vérifier la présence d'une session */
export const AUTH_COOKIE_NAME = 'ged-rh-token';

/** Cookie refresh (httpOnly, posé par le backend) — le frontend envoie juste credentials: 'include' */
export const REFRESH_COOKIE_NAME = 'ged-rh-refresh';

/** Durée du cookie access token côté client (secondes) — court pour limiter la fenêtre d'exposition */
export const ACCESS_TOKEN_COOKIE_MAX_AGE = 900; // 15 min

/** Durée max du cookie pour le middleware quand on n'a pas d'info du backend */
export const AUTH_COOKIE_MAX_AGE_FALLBACK = 86400;

/**
 * Vérifie qu'une chaîne a la forme d'un JWT (3 parties base64url).
 * Ne valide pas la signature (rôle du backend).
 */
export function looksLikeJwt(value: string): boolean {
  if (!value || typeof value !== 'string') return false;
  const parts = value.split('.');
  return parts.length === 3 && parts.every((p) => p.length > 0);
}

/** Chemins publics (pas de redirection si déjà connecté) */
export const PUBLIC_PATHS = ['/login', '/forgot-password'] as const;

/** Préfixes de routes protégées par le middleware */
export const PROTECTED_PATH_PREFIXES = ['/dashboard', '/offres', '/candidats', '/documents', '/entretiens', '/formulaires', '/parametres'] as const;
