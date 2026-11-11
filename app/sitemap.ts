import type { MetadataRoute } from "next";

const siteUrl = "https://creativerizz.in";

export default function sitemap(): MetadataRoute.Sitemap {
  const pages = [
    { path: "", priority: 1, changeFrequency: "weekly" as const },
    { path: "/work", priority: 0.9, changeFrequency: "weekly" as const },
    { path: "/ui-ux-design", priority: 0.8, changeFrequency: "monthly" as const },
    { path: "/graphic-design", priority: 0.8, changeFrequency: "monthly" as const },
    { path: "/web-design", priority: 0.8, changeFrequency: "monthly" as const },
    { path: "/branding", priority: 0.7, changeFrequency: "monthly" as const },
    { path: "/fintech-crypto-design", priority: 0.7, changeFrequency: "monthly" as const },
    { path: "/privacy-policy", priority: 0.2, changeFrequency: "yearly" as const },
  ];

  return pages.map(({ path, priority, changeFrequency }) => ({
    url: path ? `${siteUrl}${path}` : siteUrl,
    changeFrequency,
    priority,
  }));
}
