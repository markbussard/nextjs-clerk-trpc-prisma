import { headers } from 'next/headers';
import {
  // loggerLink,
  createTRPCProxyClient,
  unstable_httpBatchStreamLink
} from '@trpc/client';

import { type AppRouter } from '~/server/root';
import { getUrl, transformer } from './shared';

/**
 * Use this function in server components
 */
export const trpc = createTRPCProxyClient<AppRouter>({
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
        const heads = new Map(headers());
        heads.set('x-trpc-source', 'server');
        return Object.fromEntries(heads);
      }
    })
  ]
});
