import express from "express";
import { spawn, exec } from "child_process";
import dotenv from "dotenv";
dotenv.config();

const INFRA_KEY = process.env.INFRA_KEY;

if (!INFRA_KEY) {
  console.error("INFRA_KEY is not set");
  process.exit(1);
}

function execCmd(program: string, args: string[]) {
  return new Promise<void>((resolve, reject) => {
    const proc = spawn(program, args, {
      stdio: "inherit",
      env: process.env,
      shell: true,
    });
    // proc.stdout?.on("data", (data) => {
    //   console.log(data.toString());
    // });
    // proc.stderr?.on("data", (data) => {
    //   console.error(data.toString());
    // });
    proc.on("exit", (code) => {
      if (code === 0) {
        resolve();
      } else {
        reject(new Error(`Exit code: ${code}`));
      }
    });
  });
}

const server = express();

server.use("/", express.json());

server.post("/pull-and-deploy", async (req, res) => {
  const { key } = req.body;
  if (key === INFRA_KEY) {
    console.log(new Date(), "Updating app...");

    await execCmd("git", ["pull"]);
    await execCmd("npm", ["install"]);
    await execCmd("npm", ["run", "build"]);
    await execCmd("npx", ["ts-node", "infra/cdn/deploy.ts"]);
    await execCmd("npx", [
      "ts-node",
      "infra/backend/deploy.ts",
      "bacplus-test",
    ]);

    res.send("App updated");
  } else {
    console.log(new Date(), "Invalid key");
    res.status(403).send("Invalid key");
  }
});

server.listen(6167, () => {
  console.log("CI-CD server is running at http://localhost:6167");
});