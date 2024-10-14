import crypto from "crypto";

export function computeHash(file: Buffer): Promise<string> {
  const hash = crypto.createHash("sha1");
  hash.setEncoding("hex");
  hash.write(file);
  hash.end();

  return hash.read() as Promise<string>;
}
