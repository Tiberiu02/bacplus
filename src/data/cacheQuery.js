/**
 * All queries are cached in .next/cache/db-query to avoid recomputation on every Fast Refresh during development.
 * This is a JS file with .d.ts file in order to avoid runtime type checking of the cached queries.
 */

import path from "path";
import { promises as fs } from "fs";

const cacheDir = path.join(process.cwd(), ".next", "cache", "db-query");

async function computeQuery(key, f) {
  const cachePath = path.join(cacheDir, key + ".json");

  try {
    const cached = await fs.readFile(cachePath, "utf-8");
    return JSON.parse(cached);
  } catch (e) {
    const result = await f();
    await fs.mkdir(cacheDir, { recursive: true });
    await fs.writeFile(
      cachePath,
      JSON.stringify(result, (_, v) =>
        typeof v === "bigint" ? v.toString() : v
      )
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
