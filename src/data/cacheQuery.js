/**
 * All queries are cached in .next/cache/db-query to avoid recomputation on every Fast Refresh during development.
 * This is a JS file with .d.ts file in order to avoid runtime type checking of the cached queries.
 */

import path from "path";
import { promises as fs } from "fs";
import { Prisma } from "@prisma/client";

const cacheDir = path.join(process.cwd(), ".next", "cache", "db-query");

const DECIMAL_KEY = "D!$:";

async function computeQuery(key, f) {
  const cachePath = path.join(cacheDir, key + ".json");

  try {
    const cached = await fs.readFile(cachePath, "utf-8");
    return JSON.parse(cached, (_, v) => {
      if (typeof v === "string" && v.startsWith(DECIMAL_KEY)) {
        return Prisma.Decimal(parseFloat(v.slice(DECIMAL_KEY.length)));
      }
      return v;
    });
  } catch (e) {
    const result = await f();
    await fs.mkdir(cacheDir, { recursive: true });
    
    Prisma.Decimal.prototype.toJSON = function () {
      return DECIMAL_KEY + this.toNumber();
    }
    const serialized = JSON.stringify(result, (_, v) => {
      if (typeof v === "bigint") return v.toString();
      return v;
    });
    await fs.writeFile(
      cachePath,
      serialized
    );
    return result;
  }
}

export async function computeAllQueries(queryFunctions) {
  const obj = {};
  for (const [key, f] of Object.entries(queryFunctions)) {
    obj[key] = await computeQuery(key, f);
  }
  return obj;
}
