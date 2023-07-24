import { prisma } from "~/server/db";

export const queryBac = await prisma.bac.groupBy({
  by: ["id_liceu", "an", "id_judet"],
  _count: {
    _all: true,
    my_medie: true, // only set when valid candidate
  },
  _avg: {
    my_medie: true,
  },
});

export const queryPromovatiBac = await prisma.bac.groupBy({
  by: ["id_liceu", "an", "id_judet"],
  _count: {
    _all: true,
  },
  where: {
    rezultat: "REUSIT",
  },
});

export const queryMediiAdmLicee = await prisma.en.groupBy({
  by: ["repartizat_id_liceu", "an"],
  _min: {
    medie_adm: true,
  },
});

export const queryLicee = await prisma.licee.findMany({
  select: {
    id_liceu: true,
    nume_liceu: true,
  },
});

export const aniBac = (
  await prisma.bac.findMany({
    select: { an: true },
    distinct: ["an"],
    orderBy: { an: "desc" },
  })
).map((result) => result.an);

export const aniAdm = (
  await prisma.en.findMany({
    select: { an: true },
    distinct: ["an"],
    orderBy: { an: "desc" },
    where: {
      repartizat_id_liceu: {
        not: null,
      },
    },
  })
).map((result) => result.an);

export const aniEn = (
  await prisma.en.findMany({
    select: { an: true },
    distinct: ["an"],
    orderBy: { an: "desc" },
  })
).map((result) => result.an);
