import type { Metadata } from "next";
import Link from "next/link";
import { SITE } from "@/lib/site";
import { JsonLd } from "@/components/JsonLd";

export const metadata: Metadata = {
  title: "소개",
  description: `${SITE.name}을 만든 이유와 서비스 운영 방식을 소개합니다. 이커머스 셀러의 반복적인 이미지 규격 작업을 줄이기 위해 만든 무료 브라우저 기반 도구입니다.`,
  alternates: { canonical: "/about" },
  robots: { index: true, follow: true },
};

const aboutJsonLd = {
  "@context": "https://schema.org",
  "@type": "AboutPage",
  name: `${SITE.name} 소개`,
  url: `${SITE.url}/about`,
  inLanguage: "ko",
  about: {
    "@type": "Organization",
    name: SITE.name,
    url: SITE.url,
  },
};

export default function AboutPage() {
  return (
    <main className="mx-auto w-full max-w-3xl px-4 py-10 sm:px-6 lg:px-8">
      <JsonLd data={aboutJsonLd} />
      <header className="mb-6">
        <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-zinc-900 dark:text-zinc-50">
          소개
        </h1>
        <p className="mt-2 text-sm text-zinc-500">
          {SITE.name}을 만든 이유와 운영 방식
        </p>
      </header>

      <div className="prose prose-zinc dark:prose-invert max-w-none text-sm sm:text-base leading-relaxed">
        <h2>왜 이 도구를 만들었나요</h2>
        <p>
          온라인 셀러라면 상품 하나를 등록할 때마다 스마트스토어, 쿠팡,
          11번가, 무신사처럼 서로 다른 이미지 규격에 맞춰 사진을 일일이
          리사이즈하고 배경을 정리하는 작업을 반복하게 됩니다. 플랫폼마다
          권장 해상도, 비율, 배경색 기준이 조금씩 달라서 포토샵으로 매번
          새로 작업하거나, 규격을 놓쳐 상품 등록이 반려되는 경우도 흔합니다.
        </p>
        <p>
          {SITE.name}은 이 반복 작업을 줄이기 위해 만든 개인 프로젝트입니다.
          원본 이미지 한 장을 올리면 여러 플랫폼이 요구하는 규격에 맞춘
          결과물을 한 번에 만들어주는 것을 목표로 하고 있습니다.
        </p>

        <h2>운영 방식</h2>
        <ul>
          <li>
            <strong>브라우저 안에서만 처리</strong> — 업로드한 이미지는
            서버로 전송되지 않고 사용자의 브라우저 안에서 JavaScript와
            WebAssembly로 처리됩니다. 자세한 내용은{" "}
            <Link href="/privacy">개인정보처리방침</Link>에서 확인할 수
            있습니다.
          </li>
          <li>
            <strong>무료 제공</strong> — 기본 기능은 별도의 가입 없이 무료로
            제공됩니다.
          </li>
          <li>
            <strong>개인 운영 프로젝트</strong> — 1인 개발자가 만들고
            운영하는 서비스이며, 실제 셀러 업무 경험과 플랫폼 셀러센터
            공개 자료를 참고해 콘텐츠와 기능을 계속 보완하고 있습니다.
          </li>
        </ul>

        <h2>규격 가이드에 대한 안내</h2>
        <p>
          <Link href="/guide">플랫폼별 이미지 규격 가이드</Link>는 각
          플랫폼의 공개된 셀러센터 자료와 실제 상품 등록 과정에서 자주
          발생하는 반려 사례를 바탕으로 정리하고 있습니다. 플랫폼 정책은
          수시로 바뀔 수 있으므로, 실제 등록 전에는 항상 해당 플랫폼의
          최신 공식 가이드를 함께 확인하시길 권장합니다.
        </p>

        <h2>문의</h2>
        <p>
          서비스 이용 중 궁금한 점이나 개선 제안이 있다면{" "}
          <Link href="/contact">문의 페이지</Link>를 통해 언제든 연락해
          주세요.
        </p>
      </div>
    </main>
  );
}
