import type { MetadataRoute } from "next";
import { JUDETE } from "~/data/coduriJudete";
import { env } from "~/env.js";

export default function sitemap(): MetadataRoute.Sitemap {
  const pages = [
    "/",
    `/top-licee`,
    ...JUDETE.map((judet) => `/top-licee/${judet.nume}`),
    `/top-scoli`,
    ...JUDETE.map((judet) => `/top-scoli/${judet.nume}`),
  ];

  return pages.map((page) => ({
    url: env.WEBSITE_URL + page,
  }));
}
