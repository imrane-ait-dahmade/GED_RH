'use client';

import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { motion } from 'framer-motion';
import { useAuth } from '@/hooks/useAuth';

const schema = z.object({
  email: z.string().min(1, 'Email requis').email('Email invalide'),
  password: z.string().min(1, 'Mot de passe requis'),
});

type FormData = z.infer<typeof schema>;

const cardVariants = {
  hidden: { opacity: 0, y: 24, scale: 0.98 },
  show: {
    opacity: 1,
    y: 0,
    scale: 1,
    transition: { type: 'spring', damping: 25, stiffness: 300 },
  },
};

const itemVariants = {
  hidden: { opacity: 0, x: -12 },
  show: (i: number) => ({
    opacity: 1,
    x: 0,
    transition: { delay: 0.1 + i * 0.05 },
  }),
};

export default function LoginPage() {
  const { login, isLoading: authLoading, error: authError, clearError } = useAuth();

  const {
    register,
    handleSubmit,
    setError,
    formState: { errors, isSubmitting },
  } = useForm<FormData>({
    resolver: zodResolver(schema),
    defaultValues: { email: '', password: '' },
  });

  async function onSubmit(data: FormData) {
    clearError();
    try {
      await login(data);
    } catch (err) {
      setError('root', {
        message: err instanceof Error ? err.message : 'Erreur de connexion',
      });
    }
  }

  const loading = authLoading || isSubmitting;

  return (
    <motion.div
      variants={cardVariants}
      initial="hidden"
      animate="show"
      className="rounded-2xl border border-white/10 bg-white/5 p-8 shadow-2xl backdrop-blur-xl"
    >
      <motion.div
        variants={itemVariants}
        custom={0}
        className="mb-8 text-center"
      >
        <h1 className="text-2xl font-bold tracking-tight text-white">
          GED RH
        </h1>
        <p className="mt-1 text-sm text-surface-400">
          Gestion Électronique des Documents
        </p>
      </motion.div>

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-6" noValidate>
        <motion.div variants={itemVariants} custom={1}>
          <label
            htmlFor="email"
            className="mb-1.5 block text-sm font-medium text-surface-300"
          >
            Email
          </label>
          <input
            id="email"
            {...register('email')}
            type="email"
            autoComplete="email"
            placeholder="vous@entreprise.com"
            disabled={loading}
            className="w-full rounded-xl border border-white/10 bg-white/5 px-4 py-3 text-white placeholder-surface-500 transition-all duration-200 focus:border-brand-500 focus:bg-white/10 focus:outline-none focus:ring-2 focus:ring-brand-500/30 disabled:opacity-70"
            aria-invalid={Boolean(errors.email)}
          />
          {errors.email && (
            <motion.p
              initial={{ opacity: 0, y: -4 }}
              animate={{ opacity: 1, y: 0 }}
              className="mt-1.5 text-sm text-red-400"
              role="alert"
            >
              {errors.email.message}
            </motion.p>
          )}
        </motion.div>

        <motion.div variants={itemVariants} custom={2}>
          <label
            htmlFor="password"
            className="mb-1.5 block text-sm font-medium text-surface-300"
          >
            Mot de passe
          </label>
          <input
            id="password"
            {...register('password')}
            type="password"
            autoComplete="current-password"
            placeholder="••••••••"
            disabled={loading}
            className="w-full rounded-xl border border-white/10 bg-white/5 px-4 py-3 text-white placeholder-surface-500 transition-all duration-200 focus:border-brand-500 focus:bg-white/10 focus:outline-none focus:ring-2 focus:ring-brand-500/30 disabled:opacity-70"
            aria-invalid={Boolean(errors.password)}
          />
          {errors.password && (
            <motion.p
              initial={{ opacity: 0, y: -4 }}
              animate={{ opacity: 1, y: 0 }}
              className="mt-1.5 text-sm text-red-400"
              role="alert"
            >
              {errors.password.message}
            </motion.p>
          )}
        </motion.div>

        {(errors.root?.message || authError) && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="rounded-lg bg-red-500/10 px-4 py-2 text-sm text-red-400"
            role="alert"
          >
            {errors.root?.message ?? authError}
          </motion.div>
        )}

        <motion.div variants={itemVariants} custom={3}>
          <motion.button
            type="submit"
            disabled={loading}
            whileHover={!loading ? { scale: 1.02 } : undefined}
            whileTap={!loading ? { scale: 0.98 } : undefined}
            className="w-full rounded-xl bg-brand-500 py-3.5 font-semibold text-white shadow-lg shadow-brand-500/25 transition-colors hover:bg-brand-600 disabled:cursor-not-allowed disabled:opacity-50"
          >
            {loading ? (
              <span className="inline-flex items-center gap-2">
                <motion.span
                  animate={{ rotate: 360 }}
                  transition={{ repeat: Infinity, duration: 1, ease: 'linear' }}
                  className="h-4 w-4 rounded-full border-2 border-white/30 border-t-white"
                />
                Connexion...
              </span>
            ) : (
              'Se connecter'
            )}
          </motion.button>
        </motion.div>
      </form>
    </motion.div>
  );
}
