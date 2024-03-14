import { createEnv } from "@t3-oss/env-nextjs";
import { z } from "zod";

export const env = createEnv({
  /**
   * Specify your server-side environment variables schema here. This way you can ensure the app
   * isn't built with invalid env vars.
   */
  server: {
    DATABASE_URL: z.string().url(),
    DB_DOWNLOAD_URL: z.string().url(),
    WEBSITE_URL: z.string().url(),
    INFRA_KEY: z.string().min(24),
    JWT_SECRET: z.string().min(24),
  },

  /**
   * Specify your client-side environment variables schema here. This way you can ensure the app
   * isn't built with invalid env vars. To expose them to the client, prefix them with
   * `NEXT_PUBLIC_`.
   */
  client: {
    // NEXT_PUBLIC_CLIENTVAR: z.string().min(1),
    NEXT_PUBLIC_GA_MEASUREMENT_ID: z.string(),
    NEXT_PUBLIC_TRPC_API_URL: z.string().url(),
  },

  /**
   * You can't destruct `process.env` as a regular object in the Next.js edge runtimes (e.g.
   * middlewares) or client-side so we need to destruct manually.
   */
  runtimeEnv: {
    DATABASE_URL: process.env.DATABASE_URL,
    NEXT_PUBLIC_GA_MEASUREMENT_ID: process.env.NEXT_PUBLIC_GA_MEASUREMENT_ID,
    DB_DOWNLOAD_URL: process.env.DB_DOWNLOAD_URL,
    INFRA_KEY: process.env.INFRA_KEY,
    JWT_SECRET: process.env.JWT_SECRET,
    WEBSITE_URL: process.env.WEBSITE_URL,
    NEXT_PUBLIC_TRPC_API_URL: process.env.NEXT_PUBLIC_TRPC_API_URL,
  },
  /**
   * Run `build` or `dev` with `SKIP_ENV_VALIDATION` to skip env validation.
   * This is especially useful for Docker builds.
   */
  skipValidation: !!process.env.SKIP_ENV_VALIDATION,
});
