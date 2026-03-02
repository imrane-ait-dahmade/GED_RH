/**
 * Décodage du payload JWT côté client/SSR (lecture seule).
 * La vérification de signature reste côté backend.
 */

export interface JwtPayload {
  sub?: string;
  email?: string;
  role?: string;
  exp?: number;
  iat?: number;
  [key: string]: unknown;
}

/**
 * Décode le payload d'un JWT sans vérifier la signature.
 * Utilisable en SSR pour lire role/exp (affichage, protection basique).
 */
export function decodeJwtPayload(token: string): JwtPayload | null {
  try {
    const parts = token.split('.');
    if (parts.length !== 3) return null;
    const payload = parts[1];
    if (!payload) return null;
    const decoded = atob(payload.replace(/-/g, '+').replace(/_/g, '/'));
    return JSON.parse(decoded) as JwtPayload;
  } catch {
    return null;
  }
}

/** Vérifie si le JWT est expiré (marge 60s). */
export function isJwtExpired(token: string, marginSeconds = 60): boolean {
  const payload = decodeJwtPayload(token);
  if (!payload?.exp) return true;
  return Date.now() / 1000 >= payload.exp - marginSeconds;
}
