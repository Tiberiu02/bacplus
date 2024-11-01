import { publicProcedure } from "../trpc";
import { z } from "zod";
import jwt from "jsonwebtoken";
import { JWT_SECRET } from "../app";

export const loginRouter = publicProcedure
  .input(z.object({ email: z.string(), password: z.string() }))
  .query(async ({ input, ctx }) => {
    const user = await ctx.prisma.users.findFirst({
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

    const token = jwt.sign(
      { id: user.id, email: user.email, name: user.name },
      JWT_SECRET
    );

    return {
      error: null,
      user: {
        email: user.email,
        name: user.name,
        token: token,
      },
    };
  });
