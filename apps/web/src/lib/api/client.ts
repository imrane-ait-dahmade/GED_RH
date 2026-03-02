import env from '@/config/env';
import { useAuthStore } from '@/stores/auth-store';
import { useTenantStore } from '@/stores/tenant-store';
import { refreshApi, normalizeRole } from '@/features/auth/api';
import type { User } from '@/stores/auth-store';
import { setAccessTokenCookie, clearAccessTokenCookie } from '@/lib/auth/cookies';

export interface ApiError {
  message: string;
  statusCode: number;
}

export async function getAuthHeaders(): Promise<HeadersInit> {
  const token = useAuthStore.getState().accessToken;
  const orgId = useTenantStore.getState().currentOrganizationId;
  const headers: Record<string, string> = {
    'Content-Type': 'application/json',
  };
  if (token) headers['Authorization'] = `Bearer ${token}`;
  if (orgId) headers['X-Organization-Id'] = orgId;
  return headers;
}

async function tryRefresh(): Promise<boolean> {
  const { setRefreshing, setAuth, clearAuth } = useAuthStore.getState();
  if (useAuthStore.getState().isRefreshing) return false;
  setRefreshing(true);
  try {
    const data = await refreshApi();
    const user: User = data.user ?? useAuthStore.getState().user!;
    setAuth(data.accessToken, {
      ...user,
      role: normalizeRole(user.role),
    });
    setAccessTokenCookie(data.accessToken, data.expiresIn);
    return true;
  } catch {
    clearAuth();
    clearAccessTokenCookie();
    if (typeof window !== 'undefined') window.location.href = '/login';
    return false;
  } finally {
    setRefreshing(false);
  }
}

export async function apiClient<T>(
  path: string,
  options: RequestInit = {}
): Promise<T> {
  const baseUrl = env.NEXT_PUBLIC_API_URL.replace(/\/$/, '');
  const url = path.startsWith('http') ? path : `${baseUrl}${path.startsWith('/') ? path : '/' + path}`;

  const doFetch = async (headers: HeadersInit): Promise<Response> => {
    return fetch(url, {
      ...options,
      headers: { ...headers, ...(options.headers as Record<string, string>) },
    });
  };

  let headers = await getAuthHeaders();
  let res = await doFetch(headers);

  if (res.status === 401) {
    const refreshed = await tryRefresh();
    if (refreshed) {
      headers = await getAuthHeaders();
      res = await doFetch(headers);
    }
    if (res.status === 401) throw new Error('Non autorisé');
  }

  if (!res.ok) {
    const err: ApiError = {
      message: ((await res.json().catch(() => ({}))) as { message?: string })?.message ?? res.statusText,
      statusCode: res.status,
    };
    throw err;
  }
  if (res.status === 204) return undefined as T;
  return res.json() as Promise<T>;
}
