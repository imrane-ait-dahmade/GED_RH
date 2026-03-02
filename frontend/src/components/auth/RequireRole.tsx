'use client';

import { motion } from 'framer-motion';
import { useAuthStore } from '@/stores/auth-store';
import { canAccessRoute, type Role } from '@/config/constants';

interface RequireRoleProps {
  children: React.ReactNode;
  roles: Role[];
  pathname?: string;
}

/**
 * Restreint l'accès au contenu selon le rôle et la route.
 */
export function RequireRole({ children, roles, pathname }: RequireRoleProps) {
  const user = useAuthStore((s) => s.user);
  const role = user?.role;

  if (!role) {
    return (
      <div className="flex min-h-[40vh] items-center justify-center">
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="flex flex-col items-center gap-3"
        >
          <motion.div
            animate={{ rotate: 360 }}
            transition={{ repeat: Infinity, duration: 1, ease: 'linear' }}
            className="h-8 w-8 rounded-full border-2 border-brand-500/30 border-t-brand-500"
          />
          <p className="text-surface-500">Chargement...</p>
        </motion.div>
      </div>
    );
  }

  if (!roles.includes(role)) {
    return (
      <motion.div
        initial={{ opacity: 0, y: 8 }}
        animate={{ opacity: 1, y: 0 }}
        className="flex min-h-[40vh] items-center justify-center"
      >
        <p className="rounded-xl bg-red-500/10 px-4 py-2 text-red-600 dark:text-red-400">
          Accès refusé : rôle insuffisant.
        </p>
      </motion.div>
    );
  }

  if (pathname && !canAccessRoute(role, pathname)) {
    return (
      <motion.div
        initial={{ opacity: 0, y: 8 }}
        animate={{ opacity: 1, y: 0 }}
        className="flex min-h-[40vh] items-center justify-center"
      >
        <p className="rounded-xl bg-red-500/10 px-4 py-2 text-red-600 dark:text-red-400">
          Vous n&apos;avez pas accès à cette section.
        </p>
      </motion.div>
    );
  }

  return <>{children}</>;
}
