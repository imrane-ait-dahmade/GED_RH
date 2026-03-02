import type { Role } from './constants';

/**
 * Permissions métier (alignées backend).
 * RBAC : chaque rôle a un ensemble de permissions.
 */
export const PERMISSIONS = {
  DASHBOARD_VIEW: 'DASHBOARD_VIEW',
  OFFERS_READ: 'OFFERS_READ',
  OFFERS_WRITE: 'OFFERS_WRITE',
  CANDIDATES_READ: 'CANDIDATES_READ',
  CANDIDATES_WRITE: 'CANDIDATES_WRITE',
  DOCUMENTS_READ: 'DOCUMENTS_READ',
  DOCUMENTS_WRITE: 'DOCUMENTS_WRITE',
  INTERVIEWS_READ: 'INTERVIEWS_READ',
  INTERVIEWS_WRITE: 'INTERVIEWS_WRITE',
  FORMS_READ: 'FORMS_READ',
  FORMS_WRITE: 'FORMS_WRITE',
  SETTINGS_READ: 'SETTINGS_READ',
  SETTINGS_WRITE: 'SETTINGS_WRITE',
  USERS_MANAGE: 'USERS_MANAGE',
} as const;

export type Permission = (typeof PERMISSIONS)[keyof typeof PERMISSIONS];

export const ROLE_PERMISSIONS: Record<Role, Permission[]> = {
  ADMIN_RH: [
    'DASHBOARD_VIEW', 'OFFERS_READ', 'OFFERS_WRITE', 'CANDIDATES_READ', 'CANDIDATES_WRITE',
    'DOCUMENTS_READ', 'DOCUMENTS_WRITE', 'INTERVIEWS_READ', 'INTERVIEWS_WRITE',
    'FORMS_READ', 'FORMS_WRITE', 'SETTINGS_READ', 'SETTINGS_WRITE', 'USERS_MANAGE',
  ],
  RH: [
    'DASHBOARD_VIEW', 'OFFERS_READ', 'OFFERS_WRITE', 'CANDIDATES_READ', 'CANDIDATES_WRITE',
    'DOCUMENTS_READ', 'DOCUMENTS_WRITE', 'INTERVIEWS_READ', 'INTERVIEWS_WRITE',
    'FORMS_READ', 'FORMS_WRITE',
  ],
  MANAGER: [
    'DASHBOARD_VIEW', 'OFFERS_READ', 'CANDIDATES_READ', 'INTERVIEWS_READ', 'INTERVIEWS_WRITE',
  ],
};

export function hasPermission(role: Role, permission: Permission): boolean {
  return ROLE_PERMISSIONS[role]?.includes(permission) ?? false;
}

export function hasAnyPermission(role: Role, permissions: Permission[]): boolean {
  return permissions.some((p) => hasPermission(role, p));
}
