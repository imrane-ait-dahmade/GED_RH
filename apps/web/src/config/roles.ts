import type { Role } from './constants';

/** Libellés des rôles pour l'affichage */
export const ROLE_LABELS: Record<Role, string> = {
  ADMIN_RH: 'Administrateur RH',
  RH: 'RH',
  MANAGER: 'Manager',
};

/** Rôles ayant accès à la section Paramètres */
export const ADMIN_ONLY_ROLES: Role[] = ['ADMIN_RH'];

/** Rôles pouvant accéder au dashboard (tous les rôles authentifiés) */
export const DASHBOARD_ROLES: Role[] = ['ADMIN_RH', 'RH', 'MANAGER'];

export function getRoleLabel(role: Role): string {
  return ROLE_LABELS[role] ?? role;
}
