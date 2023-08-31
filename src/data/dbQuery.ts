import { prisma } from "~/server/db";
import { computeAllQueries } from "~/data/cacheQuery";

const queryFunctions = {
  bac: () =>
    prisma.bac.groupBy({
      by: ["id_liceu", "an", "id_judet"],
      _count: {
        _all: true,
        my_medie: true, // only set when valid candidate
      },
      _avg: {
        my_medie: true,
      },
    }),
  bacJudete: () =>
    prisma.bac.groupBy({
      by: ["an", "id_judet"],
      _count: {
        _all: true,
        my_medie: true, // only set when valid candidate
      },
      _avg: {
        my_medie: true,
      },
    }),
  bacNational: () =>
    prisma.bac.groupBy({
      by: ["an"],
      _count: {
        _all: true,
        my_medie: true, // only set when valid candidate
      },
      _avg: {
        my_medie: true,
      },
    }),
  en: () =>
    prisma.en.groupBy({
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
    }),
  enJudete: () =>
    prisma.en.groupBy({
      by: ["an", "id_judet"],
      _count: {
        _all: true,
      },
      _avg: {
        medie_en: true,
      },
    }),
  enNational: () =>
    prisma.en.groupBy({
      by: ["an"],
      _count: {
        _all: true,
      },
      _avg: {
        medie_en: true,
      },
    }),
  gender: () =>
    prisma.bac.groupBy({
      by: ["id_liceu", "sex"],
      _count: {
        _all: true,
      },
    }),
  promovatiBac: () =>
    prisma.bac.groupBy({
      by: ["id_liceu", "an", "id_judet"],
      _count: {
        _all: true,
      },
      where: {
        rezultat: "REUSIT",
      },
    }),
  promovatiBacJudete: () =>
    prisma.bac.groupBy({
      by: ["an", "id_judet"],
      _count: {
        _all: true,
      },
      where: {
        rezultat: "REUSIT",
      },
    }),
  promovatiBacNational: () =>
    prisma.bac.groupBy({
      by: ["an"],
      _count: {
        _all: true,
      },
      where: {
        rezultat: "REUSIT",
      },
    }),
  limbiMaterneBac: () =>
    prisma.bac.groupBy({
      by: ["an", "id_liceu", "limba_materna"],
      _count: {
        _all: true,
      },
    }),
  limbiMaterneBacJudete: () =>
    prisma.bac.groupBy({
      by: ["an", "id_judet", "limba_materna"],
      _count: {
        _all: true,
      },
    }),
  limbiMaterneBacNational: () =>
    prisma.bac.groupBy({
      by: ["an", "limba_materna"],
      _count: {
        _all: true,
      },
    }),
  limbiMaterneEn: () =>
    prisma.en.groupBy({
      by: ["an", "id_scoala", "limba_materna"],
      _count: {
        _all: true,
      },
    }),
  limbiStraineBac: () =>
    prisma.bac.groupBy({
      by: ["an", "id_liceu", "limba_moderna"],
      _count: {
        _all: true,
      },
    }),
  limbiStraineBacJudete: () =>
    prisma.bac.groupBy({
      by: ["an", "id_judet", "limba_moderna"],
      _count: {
        _all: true,
      },
    }),
  limbiStraineBacNational: () =>
    prisma.bac.groupBy({
      by: ["an", "limba_moderna"],
      _count: {
        _all: true,
      },
    }),
  specializariBac: () =>
    prisma.bac.groupBy({
      by: ["an", "id_liceu", "specializare"],
      _count: {
        _all: true,
      },
    }),
  mediiAdmLicee: () =>
    prisma.en.groupBy({
      by: ["repartizat_id_liceu", "an"],
      _min: {
        medie_adm: true,
      },
    }),
  licee: () =>
    prisma.licee.findMany({
      select: {
        id_liceu: true,
        nume_liceu: true,
        website: true,
        address: true,
      },
    }),
  scoli: () =>
    prisma.scoli.findMany({
      select: {
        id_scoala: true,
        nume_scoala: true,
      },
    }),
  scoliCuElevi: () =>
    prisma.en.groupBy({
      by: ["id_scoala"],
    }),
  aniBac: () =>
    prisma.bac.findMany({
      select: { an: true },
      distinct: ["an"],
      orderBy: { an: "desc" },
    }),
  aniAdm: () =>
    prisma.en.findMany({
      select: { an: true },
      distinct: ["an"],
      orderBy: { an: "desc" },
      where: {
        repartizat_id_liceu: {
          not: null,
        },
      },
    }),
  aniEn: () =>
    prisma.en.findMany({
      select: { an: true },
      distinct: ["an"],
      orderBy: { an: "desc" },
    }),
};

export const query = await computeAllQueries(queryFunctions);

if (!query.aniBac[0]) {
  throw new Error("No data found in BAC table");
}

if (!query.aniEn[0]) {
  throw new Error("No data found in EN table");
}

export const ultimulAnBac = query.aniBac[0].an;
export const ultimulAnEn = query.aniEn[0].an;
