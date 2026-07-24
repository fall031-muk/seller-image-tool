import { ImageResponse } from "next/og";

export const alt = "셀러 이미지 변환기 — 스마트스토어/쿠팡/무신사 규격 자동 변환";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

export default function OGImage() {
  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          justifyContent: "center",
          background:
            "linear-gradient(135deg, #059669 0%, #0891b2 50%, #1e40af 100%)",
          color: "white",
          padding: "80px",
          fontFamily: "system-ui, sans-serif",
        }}
      >
        <div
          style={{
            fontSize: 28,
            opacity: 0.85,
            marginBottom: 24,
            letterSpacing: 2,
          }}
        >
          SELLER IMAGE TOOL
        </div>
        <div
          style={{
            fontSize: 68,
            fontWeight: 800,
            lineHeight: 1.15,
            marginBottom: 20,
            display: "flex",
          }}
        >
          상품 이미지 하나로
          <br />모든 플랫폼 규격 자동 변환
        </div>
        <div
          style={{
            fontSize: 28,
            opacity: 0.9,
            display: "flex",
            gap: 12,
            flexWrap: "wrap",
          }}
        >
          <span
            style={{
              padding: "4px 14px",
              background: "rgba(255,255,255,0.2)",
              borderRadius: 999,
              display: "flex",
            }}
          >
            스마트스토어
          </span>
          <span
            style={{
              padding: "4px 14px",
              background: "rgba(255,255,255,0.2)",
              borderRadius: 999,
              display: "flex",
            }}
          >
            쿠팡
          </span>
          <span
            style={{
              padding: "4px 14px",
              background: "rgba(255,255,255,0.2)",
              borderRadius: 999,
              display: "flex",
            }}
          >
            무신사
          </span>
          <span
            style={{
              padding: "4px 14px",
              background: "rgba(255,255,255,0.2)",
              borderRadius: 999,
              display: "flex",
            }}
          >
            11번가
          </span>
          <span
            style={{
              padding: "4px 14px",
              background: "rgba(255,255,255,0.2)",
              borderRadius: 999,
              display: "flex",
            }}
          >
            인스타
          </span>
        </div>
        <div
          style={{
            fontSize: 24,
            opacity: 0.85,
            marginTop: 32,
            display: "flex",
          }}
        >
          🔒 100% 브라우저에서 처리 · 이미지 서버 전송 없음
        </div>
      </div>
    ),
    { ...size },
  );
}
