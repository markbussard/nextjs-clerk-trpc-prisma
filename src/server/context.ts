import { auth, clerkClient } from '@clerk/nextjs';
import { UserRole, type User } from '@prisma/client';
import { type FetchCreateContextFnOptions } from '@trpc/server/adapters/fetch';

import { db } from './db';

interface CreateInnerTRPCContextOptions {
  user: User | null;
  headers: Headers;
}

/**
 * This helper generates the "internals" for a tRPC context.
 *
 * Examples of things it can be used for:
 * - testing, so we dont have to mock Next.js' req/res
 * - trpc's `createSSGHelpers` where we don't have req/res
 *
 */
function createInnerTRPCContext(opts: CreateInnerTRPCContextOptions) {
  return {
    db,
    user: opts.user
  };
}

/**
 * This is the actual context used in our routers. It will be used prior
 * to each request that goes through the tRPC endpoint
 *
 * @see https://trpc.io/docs/context#inner-and-outer-context
 *
 */
export async function createTRPCContext(opts: FetchCreateContextFnOptions) {
  const { userId, sessionClaims } = auth();
  let user: User | null = null;
  if (userId) {
    try {
      user = await db.user.findUnique({ where: { authId: userId } });
      if (!user && sessionClaims) {
        const clerkUser = await clerkClient.users.getUser(userId);
        user = await db.user.create({
          data: {
            authId: userId,
            email: sessionClaims.primaryEmail,
            firstName: clerkUser.firstName,
            lastName: clerkUser.lastName,
            role: UserRole.USER
          }
        });
      }
    } catch (e: unknown) {
      console.log('error fetching user', e);
    }
  }
  const innerTRPCContext = createInnerTRPCContext({
    user,
    headers: opts.req.headers
  });
  return {
    ...innerTRPCContext,
    req: opts.req
  };
}

export type Context = Awaited<ReturnType<typeof createTRPCContext>>;
