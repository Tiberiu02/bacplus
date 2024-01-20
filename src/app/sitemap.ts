import type { MetadataRoute } from "next";
import { JUDETE } from "~/data/coduriJudete";
import { env } from "~/env.mjs";

export default function sitemap(): MetadataRoute.Sitemap {
  const pages = [
    "/",
    `/top_licee`,
    ...JUDETE.map((judet) => `/top_licee/${judet.nume}`),
    `/top_scoli`,
    ...JUDETE.map((judet) => `/top_scoli/${judet.nume}`),
  ];

  return pages.map((page) => ({
    url: env.WEBSITE_URL + page,
  }));
}
