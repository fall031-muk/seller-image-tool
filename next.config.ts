import type { NextConfig } from "next";
import path from "node:path";

/**
 * 플랫폼 이름만 바꾼 템플릿 복제에 가까워 삭제한 가이드들.
 * 해당 플랫폼 규격은 /guide 통합 비교표에서 계속 다룬다.
 */
const REMOVED_GUIDES = [
  "kakao-store-image-guide",
  "ohou-image-guide",
  "ably-image-guide",
  "zigzag-image-guide",
  "ssg-image-guide",
  "lotteon-image-guide",
  "wemakeprice-image-guide",
];

const nextConfig: NextConfig = {
  turbopack: {
    root: path.join(__dirname),
  },
  async redirects() {
    return REMOVED_GUIDES.map((slug) => ({
      source: `/guide/${slug}`,
      destination: "/guide",
      permanent: true,
    }));
  },
};

export default nextConfig;
