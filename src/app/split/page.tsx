import type { Metadata } from "next";
import { DetailImageSplitter } from "@/components/DetailImageSplitter";

export const metadata: Metadata = {
  title: "상세페이지 이미지 자동 분할 — 쿠팡 30,000px 제한 대응",
  description:
    "긴 상세페이지 이미지를 세로 최대 높이 기준으로 자동 분할합니다. 쿠팡·스마트스토어 업로드 세로 제한 이슈를 한 번에 해결하세요. 브라우저 안에서만 처리되어 안전합니다.",
  alternates: { canonical: "/split" },
  openGraph: {
    title: "상세페이지 이미지 자동 분할",
    description:
      "긴 상세페이지 이미지를 최대 높이 기준으로 자동 분할. 쿠팡 30,000px 제한 대응.",
    url: "/split",
  },
};

export default function SplitPage() {
  return (
    <main className="flex flex-col">
      <DetailImageSplitter />
    </main>
  );
}
