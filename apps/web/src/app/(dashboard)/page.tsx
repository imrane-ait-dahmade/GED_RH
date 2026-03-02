'use client';

import Link from 'next/link';
import { motion } from 'framer-motion';

const container = {
  hidden: { opacity: 0 },
  show: {
    opacity: 1,
    transition: { staggerChildren: 0.08 },
  },
};

const item = {
  hidden: { opacity: 0, y: 12 },
  show: { opacity: 1, y: 0 },
};

const cards = [
  {
    title: 'Offres d\'emploi',
    desc: 'Publier et gérer les offres',
    href: '/offres',
    color: 'from-brand-500 to-brand-700',
    delay: 0,
  },
  {
    title: 'Candidats',
    desc: 'Suivi des candidatures',
    href: '/candidats',
    color: 'from-surface-600 to-surface-800',
    delay: 1,
  },
  {
    title: 'Documents',
    desc: 'GED et statut OCR',
    href: '/documents',
    color: 'from-emerald-500 to-emerald-700',
    delay: 2,
  },
  {
    title: 'Entretiens',
    desc: 'Planification et suivi',
    href: '/entretiens',
    color: 'from-amber-500 to-amber-700',
    delay: 3,
  },
];

export default function DashboardPage() {
  return (
    <motion.div
      variants={container}
      initial="hidden"
      animate="show"
      className="space-y-8"
    >
      <motion.div variants={item}>
        <h1 className="text-3xl font-bold tracking-tight text-surface-900 dark:text-surface-100">
          Dashboard RH
        </h1>
        <p className="mt-1 text-surface-600 dark:text-surface-400">
          Bienvenue sur la plateforme GED RH. Accédez aux modules ci-dessous.
        </p>
      </motion.div>

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {cards.map((card, i) => (
          <Link key={card.href} href={card.href}>
          <motion.div
            variants={item}
            initial="hidden"
            animate="show"
            whileHover={{ y: -4, transition: { duration: 0.2 } }}
            whileTap={{ scale: 0.98 }}
            className={`group relative block overflow-hidden rounded-2xl bg-gradient-to-br ${card.color} p-6 text-white shadow-lg transition-shadow hover:shadow-xl`}
          >
            <div className="relative z-10">
              <h2 className="text-lg font-semibold">{card.title}</h2>
              <p className="mt-1 text-sm text-white/80">{card.desc}</p>
            </div>
            <motion.span
              className="absolute -right-4 -top-4 block h-24 w-24 rounded-full bg-white/10"
              initial={false}
              whileHover={{ scale: 1.2 }}
            />
          </motion.div>
        </Link>
        ))}
      </div>
    </motion.div>
  );
}
