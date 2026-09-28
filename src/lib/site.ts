/**
 * 사이트의 정식 URL. canonical, sitemap, robots, JSON-LD 가 전부 이 값을
 * 기준으로 만들어지므로 배포 도메인과 반드시 일치해야 한다.
 *
 * 1. NEXT_PUBLIC_SITE_URL — 직접 지정할 때(커스텀 도메인 등)
 * 2. URL — Netlify 가 빌드 시 사이트 대표 주소로 자동 주입한다
 * 3. localhost — 로컬 개발용 폴백
 *
 * 도메인을 바꿔도 코드를 고칠 필요가 없도록 환경변수에서 읽는다.
 */
function resolveSiteUrl(): string {
  const raw = process.env.NEXT_PUBLIC_SITE_URL ?? process.env.URL;
  if (!raw) return "http://localhost:3000";
  // 끝의 슬래시가 붙어 오면 `${SITE.url}/` 조합에서 `//` 가 된다.
  return raw.replace(/\/+$/, "");
}

export const SITE = {
  name: "셀러 이미지 변환기",
  shortName: "셀러 이미지 변환기",
  url: resolveSiteUrl(),
  description:
    "상품 이미지 하나로 스마트스토어, 쿠팡, 11번가, 무신사, 카카오톡스토어, 인스타그램 등 각 플랫폼 규격에 맞춘 이미지를 한 번에 만드세요. 100% 브라우저에서 처리되어 이미지가 서버에 올라가지 않습니다.",
  keywords: [
    "스마트스토어 이미지 규격",
    "쿠팡 상품 이미지",
    "네이버 스마트스토어 사진",
    "무신사 상품 이미지",
    "이미지 리사이즈",
    "이미지 변환",
    "상품 이미지 만들기",
    "셀러 도구",
    "이커머스 이미지",
    "온라인 판매 이미지",
  ],
  locale: "ko_KR",
  /** 실명 대신 역할로 표기한다. schema.org Person 의 name 으로도 쓰인다. */
  author: "셀러 이미지 변환기 운영자",
  /** 이 사이트의 조언이 어떤 경험에서 나왔는지 밝히는 한 줄. */
  authorBio: "개발 경력 5년차 · LMS · 커머스 서비스 개발",
} as const;

export function absoluteUrl(path = "/"): string {
  return `${SITE.url}${path.startsWith("/") ? path : `/${path}`}`;
}
