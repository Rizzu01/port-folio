import type { MetadataRoute } from "next";

export default function sitemap(): MetadataRoute.Sitemap {
  return [
    {
      url: "https://creativerizz.in/",
      changeFrequency: "monthly",
      priority: 1,
    },
  ];
}
