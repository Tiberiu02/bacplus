import type { StaticData } from "./staticData";
import { createHash } from "crypto";
import fs from "fs";

const staticDataFolder = ".next/static/data";

export function createStaticData<T>(
  data: T,
  minimalFirstLoadData: T
): StaticData<T> {
  const hash = createHash("sha256")
    .update(JSON.stringify(data))
    .digest("hex")
    .slice(0, 16);

  if (!fs.existsSync(`${staticDataFolder}/${hash}.txt`)) {
    fs.mkdirSync(staticDataFolder, { recursive: true });
    fs.writeFileSync(`${staticDataFolder}/${hash}.txt`, JSON.stringify(data));
  }

  return {
    hash,
    sampleData: minimalFirstLoadData,
  };
}
