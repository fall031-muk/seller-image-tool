import type { MetadataRoute } from "next";
import { SITE } from "@/lib/site";
import { INDEXED_GUIDES } from "@/lib/guides/data";
import { BLOG_POSTS } from "@/lib/blog/data";

// output: "export" 에서 파일 규약 라우트는 정적으로 못박아야 한다.
export const dynamic = "force-static";

export default function sitemap(): MetadataRoute.Sitemap {
  const now = new Date();
  return [
    {
      url: `${SITE.url}/`,
      lastModified: now,
      changeFrequency: "weekly",
      priority: 1.0,
    },
    {
      url: `${SITE.url}/split`,
      lastModified: now,
      changeFrequency: "weekly",
      priority: 0.9,
    },
    {
      url: `${SITE.url}/guide`,
      lastModified: now,
      changeFrequency: "weekly",
      priority: 0.8,
    },
    ...INDEXED_GUIDES.map((g) => ({
      url: `${SITE.url}/guide/${g.slug}`,
      lastModified: new Date(g.updatedAt),
      changeFrequency: "monthly" as const,
      priority: 0.7,
    })),
    {
      url: `${SITE.url}/blog`,
      lastModified: now,
      changeFrequency: "weekly" as const,
      priority: 0.6,
    },
    ...BLOG_POSTS.map((p) => ({
      url: `${SITE.url}/blog/${p.slug}`,
      lastModified: new Date(p.updatedAt),
      changeFrequency: "monthly" as const,
      priority: 0.6,
    })),
    {
      url: `${SITE.url}/about`,
      lastModified: now,
      changeFrequency: "monthly" as const,
      priority: 0.5,
    },
    {
      url: `${SITE.url}/contact`,
      lastModified: now,
      changeFrequency: "monthly" as const,
      priority: 0.4,
    },
    {
      url: `${SITE.url}/privacy`,
      lastModified: now,
      changeFrequency: "yearly" as const,
      priority: 0.3,
    },
    {
      url: `${SITE.url}/terms`,
      lastModified: now,
      changeFrequency: "yearly" as const,
      priority: 0.3,
    },
  ];
}
