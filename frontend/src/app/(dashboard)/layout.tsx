'use client';

import { usePathname } from 'next/navigation';
import { motion } from 'framer-motion';
import { RequireRole } from '@/components/auth/RequireRole';
import { Header, Sidebar } from '@/components/layout';
import { DASHBOARD_ROLES } from '@/config/roles';

const mainVariants = {
  hidden: { opacity: 0 },
  show: {
    opacity: 1,
    transition: { staggerChildren: 0.05 },
  },
};

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();

  return (
    <RequireRole roles={DASHBOARD_ROLES} pathname={pathname ?? ''}>
      <div className="flex h-screen flex-col overflow-hidden bg-surface-50 dark:bg-surface-950">
        <Header />
        <div className="flex flex-1 overflow-hidden">
          <Sidebar />
          <motion.main
            variants={mainVariants}
            initial="hidden"
            animate="show"
            className="flex-1 overflow-auto p-6"
          >
            {children}
          </motion.main>
        </div>
      </div>
    </RequireRole>
  );
}
