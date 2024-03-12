import fs from "fs";
import path from "path";

const folder = "/etc/letsencrypt/live/api.bacplus.ro/";

export const sslPrivateKey = fs.readFileSync(path.join(folder, "privkey.pem"));
export const sslCertificate = fs.readFileSync(
  path.join(folder, "fullchain.pem")
);
