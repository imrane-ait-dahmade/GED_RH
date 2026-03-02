/**
 * Gestion des cookies auth côté client (access token pour le middleware).
 * Le refresh token doit être en httpOnly (défini par le backend).
 */

import {
  AUTH_COOKIE_NAME,
  ACCESS_TOKEN_COOKIE_MAX_AGE,
  AUTH_COOKIE_MAX_AGE_FALLBACK,
} from '@/config/auth';

export function setAccessTokenCookie(token: string, expiresInSeconds?: number): void {
  if (typeof document === 'undefined') return;
  const maxAge = expiresInSeconds ?? ACCESS_TOKEN_COOKIE_MAX_AGE;
  const secure = typeof window !== 'undefined' && window.location.protocol === 'https:';
  const securePart = secure ? '; Secure' : '';
  document.cookie = `${AUTH_COOKIE_NAME}=${encodeURIComponent(token)}; path=/; max-age=${Math.min(maxAge, AUTH_COOKIE_MAX_AGE_FALLBACK)}; SameSite=Lax${securePart}`;
}

export function clearAccessTokenCookie(): void {
  if (typeof document === 'undefined') return;
  document.cookie = `${AUTH_COOKIE_NAME}=; path=/; max-age=0`;
}
