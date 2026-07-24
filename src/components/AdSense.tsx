import Script from "next/script";

/**
 * AdSense Auto Ads 로더.
 * Publisher ID 는 브라우저에 그대로 노출되는 공개 값이라 하드코딩해도 안전.
 * 필요 시 NEXT_PUBLIC_ADSENSE_CLIENT 환경변수로 오버라이드 가능.
 */
const DEFAULT_ADSENSE_CLIENT = "ca-pub-9260525121131483";

export function getAdSenseClient(): string | null {
  const client = process.env.NEXT_PUBLIC_ADSENSE_CLIENT ?? DEFAULT_ADSENSE_CLIENT;
  return client || null;
}

export function AdSenseLoader() {
  const client = getAdSenseClient();
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
