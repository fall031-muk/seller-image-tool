export const SITE = {
  name: "셀러 이미지 변환기",
  shortName: "셀러 이미지 변환기",
  url: "https://seller-image-tool.vercel.app",
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
