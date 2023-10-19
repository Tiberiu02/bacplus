import type { MetadataRoute } from "next";
import { JUDETE } from "~/data/coduriJudete";
import { ultimulAnBac, ultimulAnEn } from "~/data/dbQuery";
import { env } from "~/env.mjs";

export default function sitemap(): MetadataRoute.Sitemap {
  const pages = [
    "/",
    `/top_licee/${ultimulAnBac}`,
    ...JUDETE.map((judet) => `/top_licee/${ultimulAnBac}/${judet.nume}`),
    `/top_scoli/${ultimulAnEn}`,
    ...JUDETE.map((judet) => `/top_scoli/${ultimulAnEn}/${judet.nume}`),
  ];

  return pages.map((page) => ({
    url: env.WEBSITE_URL + page,
  }));
}
