import { prisma } from "~/server/prisma";
import { computeAllQueries } from "~/data/cacheQuery";
import { groupBy } from "./groupBy";

const queryFunctions = {
  bac: () =>
    prisma.bac.groupBy({
      by: ["an", "unitate_siiir", "unitate_nume", "unitate_cod_judet"],
      _count: {
        _all: true,
        medie: true, // only set when valid candidate
      },
      _avg: {
        medie: true,
      },
      where: {
        promotie_anterioara: false,
      },
    }),
  en: () =>
    prisma.en.groupBy({
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
    prisma.bac.groupBy({
      by: ["unitate_siiir", "sex"],
      _count: {
        _all: true,
      },
    }),
  genderEn: () =>
    prisma.en.groupBy({
      by: ["unitate_siiir", "sex"],
      _count: {
        _all: true,
      },
    }),
  promovatiBac: () =>
    prisma.bac.groupBy({
      by: ["an", "unitate_siiir", "unitate_nume", "unitate_cod_judet"],
      _count: {
        _all: true,
      },
      where: {
        rezultat: "promovat",
        promotie_anterioara: false,
      },
    }),
  limbiMaterneBac: () =>
    prisma.bac.groupBy({
      by: ["an", "unitate_siiir", "limba_materna"],
      _count: {
        _all: true,
      },
      where: {
        promotie_anterioara: false,
      },
    }),
  limbiMaterneEn: () =>
    prisma.en.groupBy({
      by: ["an", "unitate_siiir", "limba_materna"],
      _count: {
        _all: true,
      },
    }),
  limbiStraineBac: () =>
    prisma.bac.groupBy({
      by: ["an", "unitate_siiir", "limba_moderna"],
      _count: {
        _all: true,
      },
      where: {
        promotie_anterioara: false,
      },
    }),
  specializariBac: () =>
    prisma.bac.groupBy({
      by: ["an", "unitate_siiir", "specializare"],
      _count: {
        _all: true,
      },
      where: {
        promotie_anterioara: false,
      },
    }),
  mediiAdmLicee: () =>
    prisma.en.groupBy({
      by: ["repartizat_liceu_siiir", "an"],
      _min: {
        medie_adm: true,
      },
    }),
  bacRomana: () =>
    prisma.bac.groupBy({
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
        promotie_anterioara: false,
      },
    }),
  bacLimbaMaterna: () =>
    prisma.bac.groupBy({
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
        promotie_anterioara: false,
      },
    }),
  bacDisciplineObligatorii: () =>
    prisma.bac.groupBy({
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
        promotie_anterioara: false,
      },
    }),
  bacDisciplineAlegere: () =>
    prisma.bac.groupBy({
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
        promotie_anterioara: false,
      },
    }),
  bacMedieClase: () =>
    prisma.bac.groupBy({
      by: ["an", "unitate_siiir", "clasa"],
      _avg: {
        medie: true,
      },
      _count: {
        _all: true,
      },
      where: {
        promotie_anterioara: false,
      },
    }),
  bacRomanaClase: () =>
    prisma.bac.groupBy({
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
        promotie_anterioara: false,
      },
    }),
  bacLimbaMaternaClase: () =>
    prisma.bac.groupBy({
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
        promotie_anterioara: false,
      },
    }),
  bacDisciplineObligatoriiClase: () =>
    prisma.bac.groupBy({
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
        promotie_anterioara: false,
      },
    }),
  bacDisciplineAlegereClase: () =>
    prisma.bac.groupBy({
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
        promotie_anterioara: false,
      },
    }),
  institutii: () => prisma.institutii.findMany(),
  institutiiBac: () =>
    prisma.bac.findMany({
      select: {
        unitate_siiir: true,
      },
      distinct: ["unitate_siiir"],
    }),
  institutiiEn: () =>
    prisma.en.findMany({
      select: {
        unitate_siiir: true,
      },
      distinct: ["unitate_siiir"],
    }),
  specializariAdm: () =>
    prisma.en.groupBy({
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
    prisma.en.groupBy({
      by: ["an", "unitate_cod_judet", "medie_adm"],
      _count: {
        _all: true,
      },
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
        repartizat_liceu_siiir: {
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
  siiir: () => prisma.siiir.findMany(),
  photos: () => prisma.photos.findMany(),
};

export const query = await computeAllQueries(queryFunctions);

export const photosBySchool = groupBy(query.photos, (p) => p.school_code);

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
  acc[i.cod_siiir] = i;
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
