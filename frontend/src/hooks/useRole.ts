'use client';

import { useMemo } from 'react';
import { useAuthStore } from '@/stores/auth-store';
import { canAccessRoute, type Role } from '@/config/constants';
import { getRoleLabel } from '@/config/roles';

export function useRole() {
  const user = useAuthStore((s) => s.user);
  const role = user?.role ?? null;

  const isAuthenticated = Boolean(user);
  const isAdmin = role === 'ADMIN_RH';

  const canAccess = useMemo(() => {
    return (pathname: string) => (role ? canAccessRoute(role, pathname) : false);
  }, [role]);

  const roleLabel = role ? getRoleLabel(role) : null;

  return {
    user,
    role,
    isAuthenticated,
    isAdmin,
    canAccess,
    roleLabel,
  };
}
