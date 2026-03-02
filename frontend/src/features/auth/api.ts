import env from '@/config/env';
import type { User } from '@/stores/auth-store';
import type { Role } from '@/config/constants';

export interface LoginPayload {
  email: string;
  password: string;
}

export interface LoginResponse {
  accessToken: string;
  refreshToken?: string;
  user: User;
  expiresIn?: number;
}

export interface RefreshResponse {
  accessToken: string;
  user?: User;
  expiresIn?: number;
}

const BASE = env.NEXT_PUBLIC_API_URL.replace(/\/$/, '');

/**
 * Login — ne pas logger les credentials.
 * Le backend peut renvoyer Set-Cookie pour le refresh token (httpOnly).
 */
export async function loginApi(payload: LoginPayload): Promise<LoginResponse> {
  const res = await fetch(`${BASE}/auth/login`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(payload),
    credentials: 'include',
  });
  if (!res.ok) {
    const err = await res.json().catch(() => ({}));
    throw new Error((err as { message?: string }).message ?? 'Connexion refusée');
  }
  return res.json() as Promise<LoginResponse>;
}

/**
 * Refresh — envoie le cookie httpOnly (refresh token) automatiquement.
 */
export async function refreshApi(): Promise<RefreshResponse> {
  const res = await fetch(`${BASE}/auth/refresh`, {
    method: 'POST',
    credentials: 'include',
    headers: { 'Content-Type': 'application/json' },
  });
  if (!res.ok) {
    throw new Error('Session expirée');
  }
  return res.json() as Promise<RefreshResponse>;
}

/**
 * Logout — invalide côté backend si endpoint existe.
 */
export async function logoutApi(): Promise<void> {
  try {
    await fetch(`${BASE}/auth/logout`, {
      method: 'POST',
      credentials: 'include',
    });
  } catch {
    // ignore
  }
}

/** Normalise le rôle renvoyé par l'API */
export function normalizeRole(role: string | undefined): Role {
  const allowed: Role[] = ['ADMIN_RH', 'RH', 'MANAGER'];
  if (role && allowed.includes(role as Role)) return role as Role;
  return 'RH';
}
