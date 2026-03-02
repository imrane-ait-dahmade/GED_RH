/**
 * Variables d'environnement typées (côté client).
 * Les variables NEXT_PUBLIC_* sont exposées au client.
 */
const env = {
  NEXT_PUBLIC_API_URL: process.env.NEXT_PUBLIC_API_URL ?? 'http://localhost:3000',
  NODE_ENV: process.env.NODE_ENV ?? 'development',
} as const;

export type Env = typeof env;
export default env;
