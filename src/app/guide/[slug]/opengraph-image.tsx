import { ImageResponse } from "next/og";
import { GUIDES, getGuideBySlug } from "@/lib/guides/data";
import { getPlatformById } from "@/lib/platforms/specs";

export const alt = "플랫폼 상품 이미지 규격 가이드";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

export function generateStaticParams() {
  return GUIDES.map((g) => ({ slug: g.slug }));
}

export default async function OGImage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const guide = getGuideBySlug(slug);
  const platform = guide ? getPlatformById(guide.platformId) : undefined;
  const title = guide?.h1 ?? "플랫폼 이미지 규격 가이드";
  const platformName = platform?.name ?? "";
  const platformColor = platform?.color ?? "#059669";

  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          justifyContent: "space-between",
          background: "#ffffff",
          padding: "72px",
          fontFamily: "system-ui, sans-serif",
        }}
      >
        <div style={{ display: "flex", flexDirection: "column", gap: 32 }}>
          <div
            style={{
              display: "flex",
              alignItems: "center",
              gap: 16,
              fontSize: 26,
              color: "#525b7a",
            }}
          >
            <div
              style={{
                width: 16,
                height: 16,
                borderRadius: 8,
                background: platformColor,
                display: "flex",
              }}
            />
            <span style={{ display: "flex" }}>{platformName} · 규격 가이드</span>
          </div>
          <div
            style={{
              fontSize: 64,
              fontWeight: 800,
              lineHeight: 1.15,
              color: "#0f172a",
              display: "flex",
            }}
          >
            {title}
          </div>
          <div
            style={{
              fontSize: 26,
              color: "#475569",
              maxWidth: 960,
              lineHeight: 1.4,
              display: "flex",
            }}
          >
            대표이미지 · 상세페이지 · 썸네일 규격과 자주 하는 실수를 정리한 무료
            가이드
          </div>
        </div>

        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "flex-end",
          }}
        >
          <div
            style={{
              display: "flex",
              alignItems: "center",
              gap: 14,
              fontSize: 22,
              color: "#334155",
              fontWeight: 700,
            }}
          >
            <div
              style={{
                width: 40,
                height: 40,
                borderRadius: 10,
                background:
                  "linear-gradient(135deg, #10b981 0%, #06b6d4 100%)",
                display: "flex",
              }}
            />
            <span style={{ display: "flex" }}>셀러 이미지 변환기</span>
          </div>
          <div
            style={{
              display: "flex",
              padding: "10px 22px",
              background: "#0f172a",
              color: "#ffffff",
              borderRadius: 999,
              fontSize: 22,
              fontWeight: 600,
            }}
          >
            지금 무료로 변환하기 →
          </div>
        </div>
      </div>
    ),
    { ...size },
  );
}
