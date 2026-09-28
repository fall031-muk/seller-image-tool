import type { MetadataRoute } from "next";
import { SITE } from "@/lib/site";

// output: "export" 에서 파일 규약 라우트는 정적으로 못박아야 한다.
export const dynamic = "force-static";

export default function robots(): MetadataRoute.Robots {
  return {
    rules: [
      {
        userAgent: "*",
        allow: "/",
      },
    ],
    sitemap: `${SITE.url}/sitemap.xml`,
    host: SITE.url,
  };
}
