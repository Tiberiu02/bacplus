import {
  downloadFile,
  findStorageZone,
  listFiles,
  uploadFile,
} from "../infra/cdn/bunny";
import fs from "fs";

async function main() {
  console.log("Starting migration");

  const siiir = JSON.parse(
    fs.readFileSync(".next/cache/db-query/institutii.json", "utf-8")
  ) as {
    cod_siiir?: string;
    sigla?: string;
    sigla_lg?: string;
    sigla_xs?: string;
    id: string;
  }[];

  const storageZone = await findStorageZone("bacplus-assets");
  if (!storageZone) {
    throw new Error("Storage zone not found");
  }

  const siiirWithSigla = siiir.filter((i) => i.sigla && i.cod_siiir);

  // sort by id
  siiirWithSigla.sort((a, b) => {
    if (a.id < b.id) {
      return -1;
    }
    if (a.id > b.id) {
      return 1;
    }
    return 0;
  });

  let fails = [];

  for (let ix = 290; ix < siiirWithSigla.length; ix++) {
    const i = siiirWithSigla[ix];
    if (!i || !i.cod_siiir || !i.sigla) {
      continue;
    }
    if (i.sigla) {
      try {
        const file = await downloadFile(
          `sigle/original/${i.sigla}`,
          storageZone
        );
        const ext = i.sigla.split(".").pop();
        await uploadFile(
          `/institutii/${i.cod_siiir}/sigla.${ext}`,
          file,
          storageZone
        );
      } catch (e) {
        console.error(`Failed to upload ${i.cod_siiir} - original - ${e}`);
        fails.push([i.id, "original"]);
      }
    }
    if (i.sigla_xs == "da") {
      try {
        const file = await downloadFile(`sigle/xs/${i.id}.webp`, storageZone);
        await uploadFile(
          `/institutii/${i.cod_siiir}/sigla-xs.webp`,
          file,
          storageZone
        );
      } catch (e) {
        console.error(`Failed to upload ${i.cod_siiir} - xs - ${e}`);
        fails.push([i.id, "xs"]);
      }
    }
    if (i.sigla_lg == "da") {
      try {
        const file = await downloadFile(`sigle/lg/${i.id}.webp`, storageZone);
        await uploadFile(
          `/institutii/${i.cod_siiir}/sigla-lg.webp`,
          file,
          storageZone
        );
      } catch (e) {
        console.error(`Failed to upload ${i.cod_siiir} - lg - ${e}`);
        fails.push([i.id, "lg"]);
      }
    }
    console.log(
      `Uploaded ${i.cod_siiir} (${ix}/${siiirWithSigla.length}) - ${
        i.id
      } --- fails: ${JSON.stringify(fails)}`
    );
  }
}

main();
