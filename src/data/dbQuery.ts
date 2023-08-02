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

export const queryEn = await prisma.en.groupBy({
  by: ["id_scoala", "an", "id_judet"],
  _count: {
    _all: true,
  },
  _avg: {
    lr_final: true,
    ma_final: true,
    lm_final: true,
    medie_abs: true,
    medie_en: true,
  },
});

export const queryBacJudete = await prisma.bac.groupBy({
  by: ["an", "id_judet"],
  _count: {
    _all: true,
    my_medie: true, // only set when valid candidate
  },
  _avg: {
    my_medie: true,
  },
});

export const queryEnJudete = await prisma.en.groupBy({
  by: ["an", "id_judet"],
  _count: {
    _all: true,
  },
  _avg: {
    medie_en: true,
  },
});

export const queryGender = await prisma.bac.groupBy({
  by: ["id_liceu", "sex"],
  _count: {
    _all: true,
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

export const queryLimbiMaterneBac = await prisma.bac.groupBy({
  by: ["an", "id_liceu", "limba_materna"],
  _count: {
    _all: true,
  },
});

export const queryLimbiStraineBac = await prisma.bac.groupBy({
  by: ["an", "id_liceu", "limba_moderna"],
  _count: {
    _all: true,
  },
});

export const querySpecializariBac = await prisma.bac.groupBy({
  by: ["an", "id_liceu", "specializare"],
  _count: {
    _all: true,
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
    website: true,
    address: true,
  },
});

export const queryScoli = await prisma.scoli.findMany({
  select: {
    id_scoala: true,
    nume_scoala: true,
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
