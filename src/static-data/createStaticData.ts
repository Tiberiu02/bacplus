import type { StaticData } from "./staticData";
import { createHash } from "crypto";
import fs from "fs";

export function createStaticData<T>(
  data: T,
  minimalFirstLoadData: T
): StaticData<T> {
  const hash = createHash("sha256")
    .update(JSON.stringify(data))
    .digest("hex")
    .slice(0, 16);

  if (!fs.existsSync(`.next/static-data/${hash}.txt`)) {
    fs.mkdirSync(".next/static-data", { recursive: true });
    fs.writeFileSync(`.next/static-data/${hash}.txt`, JSON.stringify(data));
  }

  return {
    hash,
    sampleData: minimalFirstLoadData,
  };
}
