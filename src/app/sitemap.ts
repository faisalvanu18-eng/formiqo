import type { MetadataRoute } from "next";
import { siteConfig } from "@/config/site";
import { allForms, getCurrentVersion } from "@/data/registry";

/**
 * Static sitemap. Indexable content only — search and any user-specific pages
 * are excluded (they are marked noindex and are not listed here).
 */
export const dynamic = "force-static";

export default function sitemap(): MetadataRoute.Sitemap {
  const base = siteConfig.url;
  const now = new Date();

  const staticPages: MetadataRoute.Sitemap = [
    { url: `${base}/`, lastModified: now, changeFrequency: "weekly", priority: 1 },
    { url: `${base}/forms/`, lastModified: now, changeFrequency: "weekly", priority: 0.9 },
    { url: `${base}/tools/`, lastModified: now, changeFrequency: "monthly", priority: 0.7 },
    { url: `${base}/about/`, lastModified: now, changeFrequency: "yearly", priority: 0.4 },
    { url: `${base}/contact/`, lastModified: now, changeFrequency: "yearly", priority: 0.3 },
    { url: `${base}/privacy-policy/`, lastModified: now, changeFrequency: "yearly", priority: 0.3 },
    { url: `${base}/terms/`, lastModified: now, changeFrequency: "yearly", priority: 0.3 },
    { url: `${base}/disclaimer/`, lastModified: now, changeFrequency: "yearly", priority: 0.3 },
    { url: `${base}/report-error/`, lastModified: now, changeFrequency: "yearly", priority: 0.3 },
  ];

  const formPages: MetadataRoute.Sitemap = allForms.map((form) => {
    const version = getCurrentVersion(form.versions);
    return {
      url: `${base}/forms/${form.slug}/`,
      lastModified: version.lastVerified ? new Date(version.lastVerified) : now,
      changeFrequency: "monthly",
      priority: 0.8,
    };
  });

  return [...staticPages, ...formPages];
}
