import { userRouter } from './routers';
import { createTRPCRouter, publicProcedure } from './trpc';

export const appRouter = createTRPCRouter({
  health: publicProcedure.query(() => 'ok'),
  user: userRouter
});

export type AppRouter = typeof appRouter;
