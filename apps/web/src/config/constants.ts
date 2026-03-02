/** Rôles utilisateur alignés avec le backend */
export const ROLES = {
  ADMIN_RH: 'ADMIN_RH',
  RH: 'RH',
  MANAGER: 'MANAGER',
} as const;

export type Role = (typeof ROLES)[keyof typeof ROLES];

/** Routes accessibles par rôle (exemple) */
export const ROLE_ROUTES: Record<Role, string[]> = {
  [ROLES.ADMIN_RH]: ['/parametres', '/dashboard', '/offres', '/candidats', '/documents', '/entretiens', '/formulaires'],
  [ROLES.RH]: ['/dashboard', '/offres', '/candidats', '/documents', '/entretiens', '/formulaires'],
  [ROLES.MANAGER]: ['/dashboard', '/offres', '/candidats', '/entretiens'],
};

export function canAccessRoute(role: Role, pathname: string): boolean {
  const allowed = ROLE_ROUTES[role];
  if (!allowed) return false;
  return allowed.some((route) => pathname === route || pathname.startsWith(route + '/'));
}
