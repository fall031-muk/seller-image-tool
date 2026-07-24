export type BackgroundMode = "white" | "transparent" | "blur" | "original";

export type PlatformSpec = {
  id: string;
  name: string;
  imageType: "main" | "detail" | "thumbnail";
  width: number;
  height: number;
  format: "jpeg" | "png" | "webp";
  quality: number;
  background: BackgroundMode;
  maxFileSizeKB?: number;
  note?: string;
};

export type Platform = {
  id: string;
  name: string;
  color: string;
  specs: PlatformSpec[];
  docsUrl?: string;
};

// NOTE: 각 플랫폼의 최신 규격은 반드시 셀러센터 공식 문서에서 재확인 필요.
// 아래는 2024~2025년 기준 일반적으로 알려진 규격.
export const PLATFORMS: Platform[] = [
  {
    id: "smartstore",
    name: "네이버 스마트스토어",
    color: "#03C75A",
    docsUrl: "https://sell.smartstore.naver.com/",
    specs: [
      {
        id: "smartstore-main",
        name: "대표 이미지",
        imageType: "main",
        width: 1000,
        height: 1000,
        format: "jpeg",
        quality: 0.9,
        background: "white",
        maxFileSizeKB: 20 * 1024,
        note: "정사각형, 흰색 배경 권장",
      },
      {
        id: "smartstore-thumb",
        name: "썸네일",
        imageType: "thumbnail",
        width: 640,
        height: 640,
        format: "jpeg",
        quality: 0.85,
        background: "white",
      },
    ],
  },
  {
    id: "coupang",
    name: "쿠팡",
    color: "#F73B4B",
    docsUrl: "https://wing.coupang.com/",
    specs: [
      {
        id: "coupang-main",
        name: "대표 이미지",
        imageType: "main",
        width: 500,
        height: 500,
        format: "jpeg",
        quality: 0.9,
        background: "white",
        note: "500x500 이상, 정사각형",
      },
      {
        id: "coupang-detail",
        name: "상세 이미지",
        imageType: "detail",
        width: 780,
        height: 780,
        format: "jpeg",
        quality: 0.9,
        background: "white",
      },
    ],
  },
  {
    id: "11st",
    name: "11번가",
    color: "#FF0038",
    specs: [
      {
        id: "11st-main",
        name: "대표 이미지",
        imageType: "main",
        width: 600,
        height: 600,
        format: "jpeg",
        quality: 0.9,
        background: "white",
      },
    ],
  },
  {
    id: "gmarket",
    name: "지마켓/옥션",
    color: "#00A650",
    specs: [
      {
        id: "gmarket-main",
        name: "대표 이미지",
        imageType: "main",
        width: 600,
        height: 600,
        format: "jpeg",
        quality: 0.9,
        background: "white",
      },
    ],
  },
  {
    id: "musinsa",
    name: "무신사",
    color: "#000000",
    specs: [
      {
        id: "musinsa-main",
        name: "대표 이미지 (세로형)",
        imageType: "main",
        width: 1000,
        height: 1333,
        format: "jpeg",
        quality: 0.92,
        background: "white",
        note: "세로형 3:4 비율, 브랜드 톤 심사 있음",
      },
    ],
  },
  {
    id: "kakao",
    name: "카카오톡 스토어",
    color: "#FEE500",
    specs: [
      {
        id: "kakao-main",
        name: "대표 이미지",
        imageType: "main",
        width: 1000,
        height: 1000,
        format: "jpeg",
        quality: 0.9,
        background: "white",
      },
    ],
  },
  {
    id: "instagram",
    name: "인스타그램 (피드)",
    color: "#E4405F",
    specs: [
      {
        id: "instagram-feed",
        name: "정사각 피드",
        imageType: "main",
        width: 1080,
        height: 1080,
        format: "jpeg",
        quality: 0.92,
        background: "white",
      },
      {
        id: "instagram-portrait",
        name: "세로 피드",
        imageType: "main",
        width: 1080,
        height: 1350,
        format: "jpeg",
        quality: 0.92,
        background: "white",
      },
    ],
  },
  {
    id: "ohou",
    name: "오늘의집",
    color: "#35C5F0",
    specs: [
      {
        id: "ohou-main",
        name: "상품 대표",
        imageType: "main",
        width: 850,
        height: 850,
        format: "jpeg",
        quality: 0.9,
        background: "white",
        note: "홈/리빙 스타일 컷 권장",
      },
      {
        id: "ohou-detail",
        name: "상세 이미지 폭",
        imageType: "detail",
        width: 750,
        height: 750,
        format: "jpeg",
        quality: 0.9,
        background: "white",
      },
    ],
  },
  {
    id: "ably",
    name: "에이블리",
    color: "#FF3E5B",
    specs: [
      {
        id: "ably-main",
        name: "대표 이미지",
        imageType: "main",
        width: 750,
        height: 750,
        format: "jpeg",
        quality: 0.9,
        background: "white",
        note: "여성 패션, 모델 컷 강조",
      },
    ],
  },
  {
    id: "zigzag",
    name: "지그재그",
    color: "#FA5252",
    specs: [
      {
        id: "zigzag-main",
        name: "대표 이미지",
        imageType: "main",
        width: 1000,
        height: 1000,
        format: "jpeg",
        quality: 0.9,
        background: "white",
      },
    ],
  },
  {
    id: "ssg",
    name: "SSG.com",
    color: "#F4501E",
    specs: [
      {
        id: "ssg-main",
        name: "대표 이미지",
        imageType: "main",
        width: 1000,
        height: 1000,
        format: "jpeg",
        quality: 0.9,
        background: "white",
      },
    ],
  },
  {
    id: "lotteon",
    name: "롯데온",
    color: "#EF3A3A",
    specs: [
      {
        id: "lotteon-main",
        name: "대표 이미지",
        imageType: "main",
        width: 1000,
        height: 1000,
        format: "jpeg",
        quality: 0.9,
        background: "white",
      },
    ],
  },
  {
    id: "wemakeprice",
    name: "위메프",
    color: "#F62F5E",
    specs: [
      {
        id: "wemakeprice-main",
        name: "대표 이미지",
        imageType: "main",
        width: 500,
        height: 500,
        format: "jpeg",
        quality: 0.9,
        background: "white",
      },
    ],
  },
];

export function getPlatformById(id: string): Platform | undefined {
  return PLATFORMS.find((p) => p.id === id);
}
