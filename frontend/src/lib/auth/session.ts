import { cookies } from 'next/headers';
import { AUTH_COOKIE_NAME } from '@/config/auth';
import { looksLikeJwt } from '@/config/auth';
import { decodeJwtPayload, isJwtExpired } from './jwt';
import type { Role } from '@/config/constants';
import { ROLES } from '@/config/constants';

export interface SessionUser {
  id: string;
  email: string;
  name: string;
  role: Role;
}

export interface GetSessionResult {
  user: SessionUser | null;
  accessToken: string | null;
  expired: boolean;
}

/**
 * Récupère la session côté serveur (SSR) à partir du cookie.
 * Ne vérifie pas la signature JWT (à faire côté backend).
 * Utilisable dans Server Components et Route Handlers.
 */
export async function getServerSession(): Promise<GetSessionResult> {
  const cookieStore = await cookies();
  const token = cookieStore.get(AUTH_COOKIE_NAME)?.value ?? null;
  if (!token || !looksLikeJwt(token)) {
    return { user: null, accessToken: null, expired: true };
  }
  const expired = isJwtExpired(token);
  const payload = decodeJwtPayload(token);
  if (!payload) {
    return { user: null, accessToken: null, expired: true };
  }
  const role =
    payload.role && Object.values(ROLES).includes(payload.role as Role)
      ? (payload.role as Role)
      : ROLES.RH;
  const user: SessionUser = {
    id: (payload.sub as string) ?? '',
    email: (payload.email as string) ?? '',
    name: (payload.name as string) ?? (payload.email as string) ?? '',
    role,
  };
  return { user, accessToken: token, expired };
}
