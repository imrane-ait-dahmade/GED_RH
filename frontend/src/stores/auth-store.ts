import { create } from 'zustand';
import type { Role } from '@/config/constants';

export interface User {
  id: string;
  email: string;
  name: string;
  role: Role;
}

interface AuthState {
  /** Access token en mémoire uniquement (pas de persist pour limiter l'exposition) */
  accessToken: string | null;
  user: User | null;
  /** En cours de refresh (éviter boucles) */
  isRefreshing: boolean;
  setAuth: (token: string, user: User) => void;
  setAccessToken: (token: string | null) => void;
  clearAuth: () => void;
  isAuthenticated: () => boolean;
  setRefreshing: (v: boolean) => void;
}

export const useAuthStore = create<AuthState>((set, get) => ({
  accessToken: null,
  user: null,
  isRefreshing: false,
  setAuth: (accessToken, user) => set({ accessToken, user }),
  setAccessToken: (token) => set({ accessToken: token }),
  clearAuth: () => set({ accessToken: null, user: null }),
  isAuthenticated: () => Boolean(get().accessToken && get().user),
  setRefreshing: (v) => set({ isRefreshing: v }),
}));
