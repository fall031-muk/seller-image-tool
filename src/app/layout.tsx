import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
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
  title: "셀러 이미지 변환기 — 스마트스토어/쿠팡/무신사 규격 자동 변환",
  description:
    "상품 이미지 하나로 스마트스토어, 쿠팡, 11번가, 무신사 등 각 플랫폼 규격에 맞춘 이미지를 한 번에 만드세요. 100% 브라우저에서 처리되어 이미지가 서버에 올라가지 않습니다.",
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
      <body className="min-h-full flex flex-col">{children}</body>
    </html>
  );
}
