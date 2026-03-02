'use client';

import { useEffect } from 'react';
import { motion } from 'framer-motion';

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error(error);
  }, [error]);

  return (
    <div className="flex min-h-screen flex-col items-center justify-center gap-6 bg-surface-50 dark:bg-surface-950">
      <motion.div
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        className="flex flex-col items-center gap-4 text-center"
      >
        <h1 className="text-2xl font-bold text-surface-900 dark:text-surface-100">
          Une erreur est survenue
        </h1>
        <p className="max-w-md text-surface-600 dark:text-surface-400">
          {error.message}
        </p>
        <motion.button
          type="button"
          onClick={reset}
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          className="rounded-xl bg-brand-500 px-5 py-2.5 font-medium text-white shadow-lg shadow-brand-500/25 hover:bg-brand-600"
        >
          Réessayer
        </motion.button>
      </motion.div>
    </div>
  );
}
