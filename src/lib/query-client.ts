import { QueryClient } from '@tanstack/react-query';

export function createQueryClient() {
  return new QueryClient({
    defaultOptions: {
      queries: { staleTime: 30_000, gcTime: 300_000, retry: 2 },
      // Side effects must opt into retries only after proving idempotency.
      mutations: { retry: false },
    },
  });
}
