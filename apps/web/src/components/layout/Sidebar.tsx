'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { motion } from 'framer-motion';
import type { Role } from '@/config/constants';
import { ADMIN_ONLY_ROLES } from '@/config/roles';
import { useAuthStore } from '@/stores/auth-store';
import { useUIStore } from '@/stores/ui-store';

const NAV: { href: string; label: string; roles?: Role[] }[] = [
  { href: '/dashboard', label: 'Dashboard' },
  { href: '/offres', label: 'Offres d\'emploi' },
  { href: '/candidats', label: 'Candidats' },
  { href: '/documents', label: 'Documents' },
  { href: '/entretiens', label: 'Entretiens' },
  { href: '/formulaires', label: 'Formulaires' },
  { href: '/parametres', label: 'Paramètres', roles: ADMIN_ONLY_ROLES },
];

const itemVariants = {
  hidden: { opacity: 0, x: -8 },
  show: (i: number) => ({
    opacity: 1,
    x: 0,
    transition: { delay: i * 0.03, duration: 0.2 },
  }),
};

export function Sidebar() {
  const pathname = usePathname();
  const role = useAuthStore((s) => s.user?.role);
  const sidebarOpen = useUIStore((s) => s.sidebarOpen);

  const visibleNav = NAV.filter(
    (item) => !item.roles || (role && item.roles.includes(role))
  );

  return (
    <motion.aside
      initial={false}
      animate={{ width: sidebarOpen ? 256 : 72 }}
      transition={{ type: 'spring', damping: 25, stiffness: 300 }}
      className="flex shrink-0 flex-col border-r border-surface-200 bg-surface-50 dark:border-surface-700 dark:bg-surface-900/50"
    >
      <nav className="flex flex-col gap-0.5 p-3">
        {visibleNav.map((item, i) => {
          const isActive =
            pathname === item.href || pathname.startsWith(item.href + '/');
          return (
            <motion.div
              key={item.href}
              variants={itemVariants}
              initial="hidden"
              animate="show"
              custom={i}
            >
              <Link href={item.href} className="block">
                <motion.span
                  className={`flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium transition-colors ${
                    isActive
                      ? 'bg-brand-500 text-white shadow-md shadow-brand-500/25'
                      : 'text-surface-600 hover:bg-surface-200 hover:text-surface-900 dark:text-surface-400 dark:hover:bg-surface-700 dark:hover:text-surface-100'
                  }`}
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                >
                  <span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-lg bg-current opacity-80">
                    {item.label.charAt(0)}
                  </span>
                  {sidebarOpen && <span>{item.label}</span>}
                </motion.span>
              </Link>
            </motion.div>
          );
        })}
      </nav>
    </motion.aside>
  );
}
