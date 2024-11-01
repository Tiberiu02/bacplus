import { router } from "./trpc";
import type { CreateExpressContextOptions } from "@trpc/server/adapters/express";
import { prisma } from "./prisma";
import { z } from "zod";
import jwt from "jsonwebtoken";
import { env } from "../env.js"; // todo: fix TS paths is webpack bundler (deploy.ts)
import { FetchCreateContextFnOptions } from "@trpc/server/adapters/fetch";
import { sigleRouter } from "./app/sigle";
import { loginRouter } from "./app/login";
import { statsRouter } from "./app/stats";
import { photosRouter } from "./app/photos";

const User = z.object({
  id: z.string(),
  email: z.string(),
  name: z.string(),
});

export type Context = {
  user?: z.infer<typeof User>;
  prisma: typeof prisma;
};

export const JWT_SECRET = env.JWT_SECRET;

export const createExpressContext = ({
  req,
  res,
}: CreateExpressContextOptions): Context => {
  const token = req.headers.authorization?.split(" ")[1];

  if (token) {
    const user = User.parse(jwt.verify(token, JWT_SECRET));

    return {
      user,
      prisma,
    };
  }

  return { prisma };
};

export const createFetchContext = ({
  req,
}: FetchCreateContextFnOptions): Context => {
  const token = req.headers.get("authorization")?.split(" ")[1];

  if (token) {
    const user = User.parse(jwt.verify(token, JWT_SECRET));

    return {
      user,
      prisma,
    };
  }

  return { prisma };
};

export const appRouter = router({
  login: loginRouter,
  stats: statsRouter,
  sigle: sigleRouter,
  photos: photosRouter,
});

// Export type router type signature,
// NOT the router itself.
export type AppRouter = typeof appRouter;
