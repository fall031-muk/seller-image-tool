import type { Metadata, Viewport } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import { SITE } from "@/lib/site";
import { SiteHeader } from "@/components/SiteHeader";
import { SiteFooter } from "@/components/SiteFooter";
import { AdSenseLoader } from "@/components/AdSense";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  metadataBase: new URL(SITE.url),
  title: {
    default: `${SITE.name} — 스마트스토어/쿠팡/무신사 규격 자동 변환`,
    template: `%s | ${SITE.name}`,
  },
  description: SITE.description,
  keywords: [...SITE.keywords],
  authors: [{ name: SITE.author }],
  creator: SITE.author,
  alternates: {
    canonical: "/",
  },
  openGraph: {
    type: "website",
    locale: SITE.locale,
    url: SITE.url,
    siteName: SITE.name,
    title: `${SITE.name} — 상품 이미지 한 장으로 모든 플랫폼 규격 자동 변환`,
    description: SITE.description,
    // og 이미지는 app/opengraph-image.tsx 파일 컨벤션이 자동으로 붙인다.
  },
  twitter: {
    card: "summary_large_image",
    title: `${SITE.name} — 셀러용 이미지 자동 변환`,
    description: SITE.description,
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },
  verification: {
    // Search Console 속성별로 값이 다르다. 두 속성을 동시에 검증 상태로
    // 두어야 Vercel → Netlify 이전 중에 옛 URL 색인 삭제를 요청할 수 있다.
    google: [
      "1OidjJAqR96Fx60IkW3yNjZNQM1_YMgxlq7Gqb5Ko0w", // seller-image-tool.vercel.app
      "-QZSj1qRFTuqLpJ0glMw73dv_Lw0XpcEoWdGLEFyeOM", // seller-image-tool.netlify.app
    ],
    other: {
      // 네이버는 주소 변경 도구가 없어 새 사이트를 따로 등록한다.
      // 옛 사이트 등록을 유지해야 Yeti 가 옛 URL 의 301 을 확인한다.
      "naver-site-verification": [
        "21fe7004cf8b283e60520d04de671559e53859a9", // seller-image-tool.vercel.app
        "2650c6ec55cdc2cd1b694ef205c4ebe873f9e43a", // seller-image-tool.netlify.app
      ],
      "msvalidate.01": "50761763FEDF7CCC481261F2BC6DC4D6",
    },
  },
  category: "productivity",
};

export const viewport: Viewport = {
  themeColor: [
    { media: "(prefers-color-scheme: light)", color: "#ffffff" },
    { media: "(prefers-color-scheme: dark)", color: "#0a0a0a" },
  ],
  width: "device-width",
  initialScale: 1,
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="ko"
      className={`${geistSans.variable} ${geistMono.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col bg-zinc-50 dark:bg-zinc-950">
        <SiteHeader />
        <div className="flex-1">{children}</div>
        <SiteFooter />
        <AdSenseLoader />
      </body>
    </html>
  );
}
