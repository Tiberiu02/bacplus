import { publicProcedure, router } from "./trpc";
import type { CreateExpressContextOptions } from "@trpc/server/adapters/express";
import { prisma } from "./prisma";
import { z } from "zod";
import jwt from "jsonwebtoken";
import { env } from "~/env.js";

export type Context = Record<string, never>;

const JWT_SECRET = env.JWT_SECRET;

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
  login: publicProcedure
    .input(z.object({ email: z.string(), password: z.string() }))
    .query(async ({ input }) => {
      const user = await prisma.users.findFirst({
        where: {
          email: input.email,
        },
      });
      if (!user) {
        return {
          error: "Email invalid",
          user: null,
        };
      }
      if (user.password !== input.password) {
        return {
          error: "Parolă invalidă",
          user: null,
        };
      }
      console.log("signing token");
      const token = jwt.sign(
        { id: user.id, email: user.email, name: user.name },
        JWT_SECRET
      );
      console.log("token", token);
      return {
        error: null,
        user: {
          email: user.email,
          name: user.name,
          token: token,
        },
      };
    }),
});

// Export type router type signature,
// NOT the router itself.
export type AppRouter = typeof appRouter;
