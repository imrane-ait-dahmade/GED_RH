'use client';

import { usePermissions } from '@/hooks/usePermissions';
import type { Permission } from '@/config/permissions';

interface RequirePermissionProps {
  children: React.ReactNode;
  permission: Permission;
  fallback?: React.ReactNode;
}

/**
 * Affiche les enfants uniquement si l'utilisateur a la permission.
 */
export function RequirePermission({
  children,
  permission,
  fallback = null,
}: RequirePermissionProps) {
  const { can } = usePermissions();
  if (!can(permission)) return <>{fallback}</>;
  return <>{children}</>;
}
