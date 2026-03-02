'use client';

import Link from 'next/link';
import { motion } from 'framer-motion';
import { useAuth } from '@/hooks/useAuth';
import { useUIStore } from '@/stores/ui-store';
import { OrgSwitcher } from './OrgSwitcher';

export function Header() {
  const { user, logout } = useAuth();
  const { sidebarOpen, toggleSidebar } = useUIStore();

  async function handleLogout() {
    await logout();
  }

  return (
    <motion.header
      initial={{ y: -16, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.3 }}
      className="flex h-16 shrink-0 items-center justify-between border-b border-surface-200 bg-white px-6 shadow-sm dark:border-surface-700 dark:bg-surface-900/80"
    >
      <div className="flex items-center gap-4">
        <motion.button
          type="button"
          onClick={toggleSidebar}
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          className="rounded-lg p-2 text-surface-600 hover:bg-surface-100 hover:text-surface-900 dark:text-surface-400 dark:hover:bg-surface-700 dark:hover:text-surface-100"
          aria-label={sidebarOpen ? 'Réduire le menu' : 'Ouvrir le menu'}
        >
          <svg
            className="h-5 w-5"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            {sidebarOpen ? (
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M11 19l-7-7 7-7M18 19l-7-7 7-7"
              />
            ) : (
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M4 6h16M4 12h16M4 18h16"
              />
            )}
          </svg>
        </motion.button>
        <Link href="/dashboard" className="flex items-center gap-2">
          <motion.span
            className="text-lg font-bold tracking-tight text-brand-600 dark:text-brand-400"
            whileHover={{ scale: 1.02 }}
          >
            GED RH
          </motion.span>
        </Link>
      </div>

      <div className="flex items-center gap-4">
        <OrgSwitcher />
        <div className="flex items-center gap-3 border-l border-surface-200 pl-4 dark:border-surface-700">
          <span className="text-sm text-surface-600 dark:text-surface-400">
            {user?.name ?? user?.email}
          </span>
          <motion.button
            type="button"
            onClick={handleLogout}
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            className="rounded-lg bg-surface-100 px-3 py-1.5 text-sm font-medium text-surface-700 transition-colors hover:bg-surface-200 dark:bg-surface-700 dark:text-surface-200 dark:hover:bg-surface-600"
          >
            Déconnexion
          </motion.button>
        </div>
      </div>
    </motion.header>
  );
}
