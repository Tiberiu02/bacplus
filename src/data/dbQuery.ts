import { prisma } from "~/server/prisma";
import { computeAllQueries } from "~/data/cacheQuery";

const queryFunctions = {
  bac: () =>
    prisma.bac_new.groupBy({
      by: ["an", "unitate_siiir", "unitate_nume", "unitate_cod_judet"],
      _count: {
        _all: true,
        medie: true, // only set when valid candidate
      },
      _avg: {
        medie: true,
      },
    }),
  en: () =>
    prisma.en_new.groupBy({
      by: ["an", "unitate_siiir", "unitate_nume", "unitate_cod_judet"],
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
  gender: () =>
    prisma.bac_new.groupBy({
      by: ["unitate_siiir", "sex"],
      _count: {
        _all: true,
      },
    }),
  promovatiBac: () =>
    prisma.bac_new.groupBy({
      by: ["an", "unitate_siiir", "unitate_nume", "unitate_cod_judet"],
      _count: {
        _all: true,
      },
      where: {
        rezultat: "promovat",
      },
    }),
  limbiMaterneBac: () =>
    prisma.bac_new.groupBy({
      by: ["an", "unitate_siiir", "limba_materna"],
      _count: {
        _all: true,
      },
    }),
  limbiMaterneEn: () =>
    prisma.en_new.groupBy({
      by: ["an", "unitate_siiir", "limba_materna"],
      _count: {
        _all: true,
      },
    }),
  limbiStraineBac: () =>
    prisma.bac_new.groupBy({
      by: ["an", "unitate_siiir", "limba_moderna"],
      _count: {
        _all: true,
      },
    }),
  specializariBac: () =>
    prisma.bac_new.groupBy({
      by: ["an", "unitate_siiir", "specializare"],
      _count: {
        _all: true,
      },
    }),
  mediiAdmLicee: () =>
    prisma.en_new.groupBy({
      by: ["repartizat_liceu_siiir", "an"],
      _min: {
        medie_adm: true,
      },
    }),
  bacRomana: () =>
    prisma.bac_new.groupBy({
      by: ["an", "unitate_siiir"],
      _avg: {
        lr_final: true,
      },
      _count: {
        _all: true,
      },
      where: {
        lr_final: {
          not: null,
        },
      },
    }),
  bacLimbaMaterna: () =>
    prisma.bac_new.groupBy({
      by: ["an", "unitate_siiir", "limba_materna"],
      _avg: {
        lm_final: true,
      },
      _count: {
        _all: true,
      },
      where: {
        lm_final: {
          not: null,
        },
        limba_materna: {
          not: null,
        },
      },
    }),
  bacDisciplineObligatorii: () =>
    prisma.bac_new.groupBy({
      by: ["an", "unitate_siiir", "disciplina_obligatorie"],
      _avg: {
        do_final: true,
      },
      _count: {
        _all: true,
      },
      where: {
        do_final: {
          not: null,
        },
      },
    }),
  bacDisciplineAlegere: () =>
    prisma.bac_new.groupBy({
      by: ["an", "unitate_siiir", "disciplina_alegere"],
      _avg: {
        da_final: true,
      },
      _count: {
        _all: true,
      },
      where: {
        da_final: {
          not: null,
        },
      },
    }),
  bacMedieClase: () =>
    prisma.bac_new.groupBy({
      by: ["an", "unitate_siiir", "clasa"],
      _avg: {
        medie: true,
      },
      _count: {
        _all: true,
      },
    }),
  bacRomanaClase: () =>
    prisma.bac_new.groupBy({
      by: ["an", "unitate_siiir", "clasa"],
      _avg: {
        lr_final: true,
      },
      _count: {
        _all: true,
      },
      where: {
        lr_final: {
          not: null,
        },
      },
    }),
  bacLimbaMaternaClase: () =>
    prisma.bac_new.groupBy({
      by: ["an", "unitate_siiir", "limba_materna", "clasa"],
      _avg: {
        lm_final: true,
      },
      _count: {
        _all: true,
      },
      where: {
        lm_final: {
          not: null,
        },
        limba_materna: {
          not: null,
        },
      },
    }),
  bacDisciplineObligatoriiClase: () =>
    prisma.bac_new.groupBy({
      by: ["an", "unitate_siiir", "disciplina_obligatorie", "clasa"],
      _avg: {
        do_final: true,
      },
      _count: {
        _all: true,
      },
      where: {
        do_final: {
          not: null,
        },
      },
    }),
  bacDisciplineAlegereClase: () =>
    prisma.bac_new.groupBy({
      by: ["an", "unitate_siiir", "disciplina_alegere", "clasa"],
      _avg: {
        da_final: true,
      },
      _count: {
        _all: true,
      },
      where: {
        da_final: {
          not: null,
        },
      },
    }),
  institutii: () => prisma.institutii.findMany(),
  institutiiBac: () =>
    prisma.bac_new.findMany({
      select: {
        unitate_siiir: true,
      },
      distinct: ["unitate_siiir"],
    }),
  institutiiEn: () =>
    prisma.en_new.findMany({
      select: {
        unitate_siiir: true,
      },
      distinct: ["unitate_siiir"],
    }),
  specializariAdm: () =>
    prisma.en_new.groupBy({
      by: ["an", "repartizat_liceu_siiir", "repartizat_specializare"],
      _count: {
        _all: true,
      },
      _min: {
        medie_adm: true,
      },
      where: {
        repartizat_liceu_siiir: {
          not: null,
        },
      },
    }),
  ierarhieAdm: () =>
    prisma.en_new.groupBy({
      by: ["an", "unitate_cod_judet", "medie_adm"],
      _count: {
        _all: true,
      },
    }),
  aniBac: () =>
    prisma.bac_new.findMany({
      select: { an: true },
      distinct: ["an"],
      orderBy: { an: "desc" },
    }),
  aniAdm: () =>
    prisma.en_new.findMany({
      select: { an: true },
      distinct: ["an"],
      orderBy: { an: "desc" },
      where: {
        repartizat_liceu_siiir: {
          not: null,
        },
      },
    }),
  aniEn: () =>
    prisma.en_new.findMany({
      select: { an: true },
      distinct: ["an"],
      orderBy: { an: "desc" },
    }),
  siiir: () => prisma.siiir_new.findMany(),
};

export const query = await computeAllQueries(queryFunctions);

if (!query.aniBac[0]) {
  throw new Error("No data found in BAC table");
}

if (!query.aniEn[0]) {
  throw new Error("No data found in EN table");
}

export const siiir = query.siiir.reduce((acc, s) => {
  acc[s.cod_siiir_unitate] = s;
  return acc;
}, {} as Record<string, (typeof query.siiir)[0]>);

export const institutii = query.institutii.reduce((acc, i) => {
  acc[i.cod_siiir ?? "null"] = i;
  return acc;
}, {} as Record<string, (typeof query.institutii)[0]>);

function appendInstitutionData<T extends { unitate_siiir: string | null }>(
  rows: T[]
) {
  return rows.map((row) => {
    const rowWithData = row as T & {
      siiirData?: (typeof siiir)[keyof typeof siiir];
      data?: (typeof institutii)[keyof typeof institutii];
    };
    rowWithData.siiirData = siiir[row.unitate_siiir ?? ""];
    rowWithData.data = institutii[row.unitate_siiir ?? ""];
    return rowWithData;
  });
}

export const bacData = appendInstitutionData(query.bac);
export const enData = appendInstitutionData(query.en);

export const ultimulAnBac = query.aniBac[0].an;
export const ultimulAnEn = query.aniEn[0].an;

export const institutiiBac = new Set(
  query.institutiiBac.map((i) => i.unitate_siiir)
);
export const institutiiEn = new Set(
  query.institutiiEn.map((i) => i.unitate_siiir)
);

export const licee = query.institutii.filter((i) =>
  institutiiBac.has(i.cod_siiir)
);
export const gimnazii = query.institutii.filter((i) =>
  institutiiEn.has(i.cod_siiir)
);
