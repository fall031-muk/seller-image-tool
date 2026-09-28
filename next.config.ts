import type { NextConfig } from "next";
import path from "node:path";

const nextConfig: NextConfig = {
  turbopack: {
    root: path.join(__dirname),
  },
  /**
   * 사이트 전체가 빌드 시점에 확정되는 정적 페이지다(서버 기능·ISR·이미지
   * 최적화 미사용). 정적 내보내기로 내면 호스팅 런타임에 의존하지 않는다.
   *
   * 주의: output: "export" 에서는 next.config 의 redirects() 가 동작하지
   * 않는다. 삭제한 가이드의 리다이렉트는 netlify.toml 로 옮겼다.
   */
  output: "export",
};

export default nextConfig;
