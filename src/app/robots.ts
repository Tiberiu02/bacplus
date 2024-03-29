import type { MetadataRoute } from "next";
import { env } from "~/env.js";

export default function robots(): MetadataRoute.Robots {
  return {
    rules: {
      userAgent: "*",
      allow: "/",
    },
    sitemap: env.WEBSITE_URL + "/sitemap.xml",
  };
}
