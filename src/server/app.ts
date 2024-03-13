import { publicProcedure, router } from "./trpc";
import type { CreateExpressContextOptions } from "@trpc/server/adapters/express";
import type { CreateNextContextOptions } from "@trpc/server/adapters/next";
import { prisma } from "./prisma";

export type Context = Record<string, never>;

export const createExpressContext = ({
  req,
  res,
}: CreateExpressContextOptions): Context => {
  return {};
};

export const appRouter = router({
  test: publicProcedure.query(async () => {
    const users = await prisma.users.findMany();
    return {
      message: "Hello from the server!",
      time: new Date().toISOString(),
      users,
    };
  }),
});

// Export type router type signature,
// NOT the router itself.
export type AppRouter = typeof appRouter;
