import { prisma } from "../src/server/prisma";
import {
  downloadFile,
  findStorageZone,
  listFiles,
  uploadFile,
} from "../infra/cdn/bunny";
import fs from "fs";
import crypto from "crypto";

async function main() {
  console.log("Starting migration");

  // const siiir = JSON.parse(
  //   fs.readFileSync(".next/cache/db-query/institutii.json", "utf-8")
  // ) as {
  //   cod_siiir?: string;
  //   sigla: boolean;
  //   sigla_lg: boolean;
  //   sigla_xs: boolean;
  // }[];

  const institutii = await prisma.institutii.findMany({});

  console.log("Loaded siiir");
  console.log(institutii.length);
  console.log(institutii[0]);

  const storageZone = await findStorageZone("bacplus-assets");
  if (!storageZone) {
    throw new Error("Storage zone not found");
  }

  const files = await listFiles(storageZone, "/institutii/");
  console.log(files.length);
  console.log(files[0]);
  const folders = files.map((f) => f.ObjectName);
  for (const f of folders) {
    if (!institutii.find((i) => f == i.cod_siiir)) {
      console.log(`Unexpected ${f}`);
    }
  }

  // const institutiiWithSigla = institutii.filter(
  //   (i) => i.cod_siiir && i.sigla_file_type
  // );
  // for (let ix = 0; ix < institutiiWithSigla.length; ix++) {
  //   const i = institutiiWithSigla[ix];
  //   if (!i) continue;

  //   console.log(i.nume, i.sigla_file);

  //   await prisma.edit_logs.create({
  //     data: {
  //       institution_id: i.cod_siiir,
  //       timestamp: i.last_updated
  //         ? new Date(Number(i.last_updated))
  //         : new Date(),
  //       author_id: i.last_author,
  //       field_name: "sigla",
  //       old_value: null,
  //       new_value: i.sigla_file,
  //     },
  //   });

  //   console.log(`Updated ${ix}/${institutiiWithSigla.length} - ${i.nume}`);

  //   // return;
  // }
  // for (let ix = 0; ix < institutiiWithSigla.length; ix++) {
  //   const i = institutiiWithSigla[ix];
  //   if (!i) continue;

  //   const filePath = `/institutii/${i.cod_siiir}/sigla.${i.sigla_file_type}`;
  //   const file = await downloadFile(filePath, storageZone);

  //   const hash = crypto.createHash("sha1");
  //   hash.setEncoding("hex");
  //   hash.write(file);
  //   hash.end();

  //   const sha1sum = hash.read();

  //   console.log(`SHA1: ${sha1sum} for ${i.nume} (${i.cod_siiir})`);

  //   const targetFilePath = `/files/${sha1sum}.${i.sigla_file_type}`;
  //   await uploadFile(targetFilePath, file, storageZone);

  //   await prisma.institutii.update({
  //     where: {
  //       cod_siiir: i.cod_siiir,
  //     },
  //     data: {
  //       sigla_file: `${sha1sum}.${i.sigla_file_type}`,
  //     },
  //   });

  //   console.log(
  //     `Uploaded ${ix}/${institutiiWithSigla.length} - ${i.nume} (${i.cod_siiir})`
  //   );
  // }

  // const siiirWithSigla = siiir.filter((i) => i.sigla && i.cod_siiir);

  // // sort by id
  // siiirWithSigla.sort((a, b) => {
  //   if (a.id < b.id) {
  //     return -1;
  //   }
  //   if (a.id > b.id) {
  //     return 1;
  //   }
  //   return 0;
  // });

  // let fails = [];

  // for (let ix = 290; ix < siiirWithSigla.length; ix++) {
  //   const i = siiirWithSigla[ix];
  //   if (!i || !i.cod_siiir || !i.sigla) {
  //     continue;
  //   }
  //   if (i.sigla) {
  //     try {
  //       const file = await downloadFile(
  //         `sigle/original/${i.sigla}`,
  //         storageZone
  //       );
  //       const ext = i.sigla.split(".").pop();
  //       await uploadFile(
  //         `/institutii/${i.cod_siiir}/sigla.${ext}`,
  //         file,
  //         storageZone
  //       );
  //     } catch (e) {
  //       console.error(`Failed to upload ${i.cod_siiir} - original - ${e}`);
  //       fails.push([i.id, "original"]);
  //     }
  //   }
  //   if (i.sigla_xs == "da") {
  //     try {
  //       const file = await downloadFile(`sigle/xs/${i.id}.webp`, storageZone);
  //       await uploadFile(
  //         `/institutii/${i.cod_siiir}/sigla-xs.webp`,
  //         file,
  //         storageZone
  //       );
  //     } catch (e) {
  //       console.error(`Failed to upload ${i.cod_siiir} - xs - ${e}`);
  //       fails.push([i.id, "xs"]);
  //     }
  //   }
  //   if (i.sigla_lg == "da") {
  //     try {
  //       const file = await downloadFile(`sigle/lg/${i.id}.webp`, storageZone);
  //       await uploadFile(
  //         `/institutii/${i.cod_siiir}/sigla-lg.webp`,
  //         file,
  //         storageZone
  //       );
  //     } catch (e) {
  //       console.error(`Failed to upload ${i.cod_siiir} - lg - ${e}`);
  //       fails.push([i.id, "lg"]);
  //     }
  //   }
  //   console.log(
  //     `Uploaded ${i.cod_siiir} (${ix}/${siiirWithSigla.length}) - ${
  //       i.id
  //     } --- fails: ${JSON.stringify(fails)}`
  //   );
  // }
}

main();
