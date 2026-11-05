import type { MetadataRoute } from "next";

const siteUrl = "https://creativerizz.in";

export default function sitemap(): MetadataRoute.Sitemap {
  const pages = [
    "",
    "/work",
    "/ui-ux-design",
    "/graphic-design",
    "/web-design",
    "/branding",
    "/fintech-crypto-design",
  ];

  return pages.map((page) => ({
    url: page ? `${siteUrl}${page}` : siteUrl,
    changeFrequency: page === "" ? "weekly" : "monthly",
    priority: page === "" ? 1 : page === "/work" ? 0.9 : 0.8,
  }));
}
