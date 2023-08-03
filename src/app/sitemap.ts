import type { MetadataRoute } from "next";
import { JUDETE } from "~/data/coduriJudete";
import { aniBac, aniEn, queryLicee, queryScoli } from "~/data/dbQuery";
import { env } from "~/env.mjs";

export default function sitemap(): MetadataRoute.Sitemap {
  const pages = [
    "/",
    "/contact",
    "/download",
    ...aniBac.flatMap((an) => [
      `/top_licee/${an}`,
      ...JUDETE.map((judet) => `/top_licee/${an}/${judet.nume}`),
    ]),
    ...aniEn.flatMap((an) => [
      `/top_scoli/${an}`,
      ...JUDETE.map((judet) => `/top_scoli/${an}/${judet.nume}`),
    ]),
    ...aniBac.map((an) => `/top_judete/${an}`),
    ...queryLicee.map((liceu) => `/liceu/${liceu.id_liceu}`),
    ...queryScoli.map((scoala) => `/scoala/${scoala.id_scoala}`),
    ...JUDETE.map((judet) => `/judet/${judet.nume}`),
  ];

  return pages.map((page) => ({
    url: env.WEBSITE_URL + page,
    lastModified: new Date(),
  }));
}
