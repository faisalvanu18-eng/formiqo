import type { MetadataRoute } from "next";
import { siteConfig } from "@/config/site";

export const dynamic = "force-static";

export default function robots(): MetadataRoute.Robots {
  return {
    rules: [
      {
        userAgent: "*",
        allow: "/",
        // Do not index search or any user-specific/generated pages.
        disallow: ["/search", "/search/"],
      },
    ],
    sitemap: `${siteConfig.url}/sitemap.xml`,
    host: siteConfig.url,
  };
}
