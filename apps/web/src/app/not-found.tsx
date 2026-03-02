import Link from 'next/link';

export default function NotFound() {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center gap-6 bg-surface-50 dark:bg-surface-950">
      <h1 className="text-3xl font-bold text-surface-900 dark:text-surface-100">
        404 — Page introuvable
      </h1>
      <p className="text-surface-600 dark:text-surface-400">
        La page demandée n&apos;existe pas ou a été déplacée.
      </p>
      <Link
        href="/"
        className="rounded-xl bg-brand-500 px-5 py-2.5 font-medium text-white shadow-lg shadow-brand-500/25 transition-colors hover:bg-brand-600"
      >
        Retour à l&apos;accueil
      </Link>
    </div>
  );
}
