'use client';

import { useCallback, useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { useAuthStore } from '@/stores/auth-store';
import { setAccessTokenCookie, clearAccessTokenCookie } from '@/lib/auth/cookies';
import {
  loginApi,
  refreshApi,
  logoutApi,
  normalizeRole,
  type LoginPayload,
} from '@/features/auth/api';

export interface UseAuthReturn {
  user: ReturnType<typeof useAuthStore.getState>['user'];
  accessToken: string | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  error: string | null;
  login: (payload: LoginPayload) => Promise<void>;
  logout: () => Promise<void>;
  refresh: () => Promise<void>;
  clearError: () => void;
}

/**
 * Hook central d'authentification.
 * - État : user, token, loading, error
 * - Actions : login, logout, refresh
 * - Au montage : tente un refresh si pas de user (session restaurée via cookie httpOnly)
 */
export function useAuth(): UseAuthReturn {
  const router = useRouter();
  const user = useAuthStore((s) => s.user);
  const accessToken = useAuthStore((s) => s.accessToken);
  const setAuth = useAuthStore((s) => s.setAuth);
  const clearAuth = useAuthStore((s) => s.clearAuth);
  const setRefreshing = useAuthStore((s) => s.setRefreshing);

  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const refresh = useCallback(async () => {
    setRefreshing(true);
    try {
      const data = await refreshApi();
      const u = data.user ?? useAuthStore.getState().user!;
      setAuth(data.accessToken, { ...u, role: normalizeRole(u.role) });
      setAccessTokenCookie(data.accessToken, data.expiresIn);
    } finally {
      setRefreshing(false);
    }
  }, [setAuth, setRefreshing]);

  useEffect(() => {
    let cancelled = false;
    if (user && accessToken) {
      setIsLoading(false);
      return;
    }
    refreshApi()
      .then((data) => {
        if (cancelled) return;
        const u = data.user ?? useAuthStore.getState().user!;
        setAuth(data.accessToken, { ...u, role: normalizeRole(u.role) });
        setAccessTokenCookie(data.accessToken, data.expiresIn);
        if (typeof window !== 'undefined' && window.location.pathname === '/login') {
          router.replace('/dashboard');
        }
      })
      .catch(() => {
        if (!cancelled) clearAuth();
      })
      .finally(() => {
        if (!cancelled) setIsLoading(false);
      });
    return () => {
      cancelled = true;
    };
  }, [router, setAuth, clearAuth]);

  const login = useCallback(
    async (payload: LoginPayload) => {
      setError(null);
      try {
        const res = await loginApi(payload);
        setAuth(res.accessToken, {
          ...res.user,
          role: normalizeRole(res.user.role),
        });
        setAccessTokenCookie(res.accessToken, res.expiresIn);
        router.push('/dashboard');
        router.refresh();
      } catch (e) {
        const msg = e instanceof Error ? e.message : 'Erreur de connexion';
        setError(msg);
        throw e;
      }
    },
    [setAuth, router]
  );

  const logout = useCallback(async () => {
    setError(null);
    await logoutApi();
    clearAuth();
    clearAccessTokenCookie();
    router.push('/login');
    router.refresh();
    if (typeof window !== 'undefined') window.location.href = '/login';
  }, [clearAuth, router]);

  const clearError = useCallback(() => setError(null), []);

  return {
    user,
    accessToken,
    isAuthenticated: Boolean(user && accessToken),
    isLoading,
    error,
    login,
    logout,
    refresh,
    clearError,
  };
}
