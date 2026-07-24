import Script from "next/script";

/**
 * AdSense Auto Ads 로더.
 *
 * 활성화 방법:
 *   1. https://adsense.google.com 에서 사이트 등록 후 Publisher ID 발급
 *      (형식: ca-pub-XXXXXXXXXXXXXXXX)
 *   2. Vercel 환경변수 NEXT_PUBLIC_ADSENSE_CLIENT 에 값 설정
 *   3. 재배포 시 자동으로 스크립트 로드됨
 */
export function AdSenseLoader() {
  const client = process.env.NEXT_PUBLIC_ADSENSE_CLIENT;
  if (!client) return null;

  return (
    <Script
      id="adsense-loader"
      async
      strategy="afterInteractive"
      src={`https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=${client}`}
      crossOrigin="anonymous"
    />
  );
}
