import { findStorageZone, listFiles } from "infra/cdn/bunny";
import { prisma } from "~/server/prisma";

async function main() {
  const institutii = await prisma.institutii.findMany();
  const storageZone = await findStorageZone("bacplus-assets");

  if (!storageZone) {
    throw new Error("Storage zone not found");
  }

  const sigle = {
    original: await listFiles(storageZone, "/sigle/original/"),
    lg: await listFiles(storageZone, "/sigle/lg/"),
    xs: await listFiles(storageZone, "/sigle/xs/"),
  };

  // console.log(institutii);

  for (const institutie of institutii) {
    const id = institutie.id;
    const sigla = sigle.original.find((file) => file.ObjectName.startsWith(id));
    const siglaLg = sigle.lg.find((file) => file.ObjectName.startsWith(id));
    const siglaXs = sigle.xs.find((file) => file.ObjectName.startsWith(id));

    console.log(id, !!sigla, !!siglaLg, !!siglaXs);

    if (sigla) {
      await prisma.institutii.update({
        where: {
          id,
        },
        data: {
          sigla: sigla.ObjectName,
          sigla_lg: siglaLg ? "da" : null,
          sigla_xs: siglaXs ? "da" : null,
        },
      });
    }
  }
}

main();
