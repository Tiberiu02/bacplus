import type { MetadataRoute } from "next";
import { JUDETE } from "~/data/coduriJudete";
import { query } from "~/data/dbQuery";
import { env } from "~/env.mjs";

export default function sitemap(): MetadataRoute.Sitemap {
  const pages = [
    "/",
    "/contact",
    "/download",
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
    ...query.scoli.map((scoala) => `/scoala/${scoala.id_scoala}`),
    ...JUDETE.map((judet) => `/judet/${judet.nume}`),
  ];

  return pages.map((page) => ({
    url: env.WEBSITE_URL + page,
    lastModified: new Date(),
  }));
}
