import { UserRole } from '@prisma/client';
import { initTRPC, TRPCError } from '@trpc/server';
import superjson from 'superjson';
import { ZodError } from 'zod';

import { type Context } from './context';

/**
 * INITIALIZATION
 *
 * This is where the tRPC API is initialized, connecting the context and transformer. We also parse
 * ZodErrors so that we can get typesafety on the frontend if a procedure fails due to validation
 * errors on the backend.
 *
 * @see https://trpc.io/docs/server/routers
 */
const t = initTRPC.context<Context>().create({
  transformer: superjson,
  errorFormatter({ shape, error }) {
    return {
      ...shape,
      data: {
        ...shape.data,
        zodError: error.cause instanceof ZodError ? error.cause.flatten() : null
      }
    };
  }
});

/**
 * Any new routers and sub-routers should be created via this function.
 *
 * @see https://trpc.io/docs/router
 */
export const createTRPCRouter = t.router;

/**
 * Procedures are how we fetch and mutate data, as well as for creating subscriptions.
 *
 * @see https://trpc.io/docs/server/procedures
 */
export const publicProcedure = t.procedure;

/**
 * We can define middlewares that can be run before a specific procedure is executed.
 *
 * @see https://trpc.io/docs/server/middlewares
 */
const enforceUserIsAuthed = t.middleware(({ ctx, next }) => {
  if (!ctx.user) {
    throw new TRPCError({ code: 'UNAUTHORIZED' });
  }
  return next({
    ctx: {
      user: { ...ctx.user }
    }
  });
});

const enforceUserIsAdmin = enforceUserIsAuthed.unstable_pipe(
  async ({ ctx, next }) => {
    if (ctx.user.role !== UserRole.ADMIN) {
      throw new TRPCError({
        code: 'UNAUTHORIZED',
        message: 'You must be an admin to invoke this request'
      });
    }

    return next({
      ctx: {
        user: { ...ctx.user }
      }
    });
  }
);

export const protectedProcedure = t.procedure.use(enforceUserIsAuthed);
export const adminProcedure = t.procedure.use(enforceUserIsAdmin);
