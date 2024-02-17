'use client';

import { useState } from 'react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import {
  // loggerLink,
  unstable_httpBatchStreamLink
} from '@trpc/client';
import { createTRPCReact } from '@trpc/react-query';

import { type AppRouter } from '~/server/root';
import { getUrl, transformer } from './shared';

/**
 * Use this function in client components
 */
export const trpc = createTRPCReact<AppRouter>({});

type TRPCProviderProps = {
  children: React.ReactNode;
  headers: Headers;
};

export function TRPCReactProvider(props: TRPCProviderProps) {
  const [queryClient] = useState(() => new QueryClient({}));
  const [trpcClient] = useState(() =>
    trpc.createClient({
      transformer,
      links: [
        // loggerLink({
        //   enabled: (op) =>
        //     process.env.NODE_ENV === 'development' ||
        //     (op.direction === 'down' && op.result instanceof Error)
        // }),
        unstable_httpBatchStreamLink({
          url: getUrl(),
          headers() {
            const heads = new Map(props.headers);
            heads.set('x-trpc-source', 'client');
            return Object.fromEntries(heads);
          }
        })
      ]
    })
  );

  return (
    <QueryClientProvider client={queryClient}>
      <trpc.Provider client={trpcClient} queryClient={queryClient}>
        {props.children}
      </trpc.Provider>
    </QueryClientProvider>
  );
}
