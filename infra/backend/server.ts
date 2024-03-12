import { createExpressMiddleware } from "@trpc/server/adapters/express";
import express, { type Handler } from "express";
import dotenv from "dotenv";
import cors from "cors";
dotenv.config();

const INFRA_KEY = process.env.INFRA_KEY;

if (!INFRA_KEY) {
  console.error("INFRA_KEY is not set");
  process.exit(1);
}

const appServer = express();

let trpcMiddleware: Handler;

appServer.use(cors());

appServer.use("/", (req, res, next) => {
  if (trpcMiddleware) {
    trpcMiddleware(req, res, next);
  } else {
    next();
  }
});

appServer.listen(443, () => {
  console.log("Server is running at http://localhost:443");
});

const controlServer = express();

controlServer.use("/update-app", express.json());

controlServer.post("/update-app", (req, res) => {
  const { app, key } = req.body;
  if (key === INFRA_KEY) {
    const { appRouter, createExpressContext } = eval(app);
    trpcMiddleware = createExpressMiddleware({
      router: appRouter,
      createContext: createExpressContext,
    });
    console.log(new Date(), "App updated");
    res.send("App updated");
  } else {
    console.log(new Date(), "Invalid key");
    res.status(403).send("Invalid key");
  }
});

controlServer.listen(3012, () => {
  console.log("Control server is running at http://localhost:3012");
});
