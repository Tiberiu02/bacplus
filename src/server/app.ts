import { publicProcedure, router } from "./trpc";
import type { CreateExpressContextOptions } from "@trpc/server/adapters/express";
import type { CreateNextContextOptions } from "@trpc/server/adapters/next";

export type Context = Record<string, never>;

export const createExpressContext = ({
  req,
  res,
}: CreateExpressContextOptions): Context => {
  return {};
};

export const appRouter = router({
  test: publicProcedure.query(() => {
    return {
      message: "Hello from the server! New deployment from CI/CD server!",
      time: new Date().toISOString(),
    };
  }),
});

// Export type router type signature,
// NOT the router itself.
export type AppRouter = typeof appRouter;
