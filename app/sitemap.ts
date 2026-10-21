import type { MetadataRoute } from "next";

const siteUrl = "https://creativerizz.in";

export default function sitemap(): MetadataRoute.Sitemap {
  const pages = [
    "",
    "/ui-ux-design",
    "/graphic-design",
    "/web-design",
    "/branding",
    "/fintech-crypto-design",
  ];

  return pages.map((page) => ({
    url: page ? `${siteUrl}${page}` : siteUrl,
    lastModified: new Date(),
    changeFrequency: page === "" ? "weekly" : "monthly",
    priority: page === "" ? 1 : 0.8,
  }));
}
