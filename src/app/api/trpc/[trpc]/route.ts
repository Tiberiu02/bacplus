import { fetchRequestHandler } from "@trpc/server/adapters/fetch";
import { appRouter, createFetchContext } from "~/server/app";

const handler = (req: Request) =>
  fetchRequestHandler({
    endpoint: "/api/trpc",
    req,
    router: appRouter,
    createContext: createFetchContext,
  });

export { handler as GET, handler as POST };
