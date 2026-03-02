'use client';

import { useMemo } from 'react';
import { useAuthStore } from '@/stores/auth-store';
import { hasPermission, hasAnyPermission, type Permission } from '@/config/permissions';

export function usePermissions() {
  const role = useAuthStore((s) => s.user?.role) ?? null;

  const can = useMemo(() => {
    return (permission: Permission) => (role ? hasPermission(role, permission) : false);
  }, [role]);

  const canAny = useMemo(() => {
    return (permissions: Permission[]) => (role ? hasAnyPermission(role, permissions) : false);
  }, [role]);

  return { role, can, canAny };
}
