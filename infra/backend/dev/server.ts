import { createExpressMiddleware } from "@trpc/server/adapters/express";
import express from "express";
import dotenv from "dotenv";
import cors from "cors";
import { appRouter, createExpressContext } from "../../../src/server/app";
dotenv.config();

const appServer = express();

let trpcMiddleware = createExpressMiddleware({
  router: appRouter,
  createContext: createExpressContext,
});

appServer.use(cors());

appServer.use("/", trpcMiddleware);

appServer.listen(443, () => {
  console.log("Dev server is running at http://localhost:443");
});