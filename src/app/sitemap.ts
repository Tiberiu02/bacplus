import type { MetadataRoute } from "next";
import { JUDETE } from "~/data/coduriJudete";
import { query, ultimulAnBac, ultimulAnEn } from "~/data/dbQuery";
import { env } from "~/env.mjs";

export default function sitemap(): MetadataRoute.Sitemap {
  const pages = [
    "/",
    "/contact",
    ...query.aniBac.flatMap(({ an }) => [
      `/top_licee/${an}`,
      ...JUDETE.map((judet) => `/top_licee/${an}/${judet.nume}`),
    ]),
    ...query.aniEn.flatMap(({ an }) => [
      `/top_scoli/${an}`,
      ...JUDETE.map((judet) => `/top_scoli/${an}/${judet.nume}`),
    ]),
    ...query.aniBac.map(({ an }) => `/top_judete/${an}`),
    ...query.licee.map((liceu) => `/liceu/${liceu.id_liceu}`),
    ...query.scoliCuElevi.map((scoala) => `/scoala/${scoala.id_scoala}`),
  ];

  const importantPages = new Set([
    "/",
    `/top_licee/${ultimulAnBac}`,
    ...JUDETE.map((judet) => `/top_licee/${ultimulAnBac}/${judet.nume}`),
    `/top_scoli/${ultimulAnEn}`,
    ...JUDETE.map((judet) => `/top_scoli/${ultimulAnEn}/${judet.nume}`),
  ]);

  return pages.map((page) => ({
    url: env.WEBSITE_URL + page,
    priority: importantPages.has(page) ? 1 : 0.1,
  }));
}
