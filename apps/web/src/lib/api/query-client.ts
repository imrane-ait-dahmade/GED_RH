import { QueryClient } from '@tanstack/react-query';

/** Délais par défaut (ms) */
const STALE_TIME = 60 * 1000; // 1 min
const GC_TIME = 5 * 60 * 1000; // 5 min (ex-cacheTime)
const RETRY = 2;

function makeQueryClient(): QueryClient {
  return new QueryClient({
    defaultOptions: {
      queries: {
        staleTime: STALE_TIME,
        gcTime: GC_TIME,
        retry: RETRY,
        refetchOnWindowFocus: false,
      },
      mutations: {
        retry: false,
      },
    },
  });
}

let browserQueryClient: QueryClient | undefined;

/**
 * Client React Query partagé (côté client).
 * Côté serveur : une nouvelle instance par requête pour éviter les fuites.
 */
export function getQueryClient(): QueryClient {
  if (typeof window === 'undefined') {
    return makeQueryClient();
  }
  if (!browserQueryClient) {
    browserQueryClient = makeQueryClient();
  }
  return browserQueryClient;
}
