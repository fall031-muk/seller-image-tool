import type { Metadata } from "next";
import Link from "next/link";
import { GUIDES } from "@/lib/guides/data";
import { JsonLd, breadcrumbJsonLd } from "@/components/JsonLd";
import { SITE } from "@/lib/site";

export const metadata: Metadata = {
  title: "이커머스 셀러를 위한 플랫폼별 상품 이미지 규격 가이드",
  description:
    "네이버 스마트스토어, 쿠팡, 무신사 등 주요 이커머스 플랫폼의 상품 이미지 규격과 자주 하는 실수, 검수 통과 팁을 정리한 가이드 모음입니다.",
  alternates: { canonical: "/guide" },
};

export default function GuideIndexPage() {
  return (
    <main className="mx-auto w-full max-w-5xl px-4 py-10 sm:px-6 lg:px-8">
      <JsonLd
        data={breadcrumbJsonLd([
          { name: "홈", url: `${SITE.url}/` },
          { name: "규격 가이드", url: `${SITE.url}/guide` },
        ])}
      />
      <header className="mb-8">
        <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-zinc-900 dark:text-zinc-50">
          플랫폼별 상품 이미지 규격 가이드
        </h1>
        <p className="mt-2 text-sm text-zinc-600 dark:text-zinc-400">
          이커머스 셀러가 자주 헷갈리는 이미지 규격을 플랫폼별로 정리했습니다.
          가이드 하단의 링크로 바로 규격에 맞는 이미지를 만들 수 있습니다.
        </p>
      </header>

      <ul className="grid gap-4 sm:grid-cols-2">
        {GUIDES.map((g) => (
          <li
            key={g.slug}
            className="rounded-lg border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-950 p-5 hover:border-emerald-500"
          >
            <Link href={`/guide/${g.slug}`}>
              <h2 className="text-lg font-semibold text-zinc-900 dark:text-zinc-100">
                {g.h1}
              </h2>
              <p className="mt-2 text-sm text-zinc-600 dark:text-zinc-400 line-clamp-3">
                {g.description}
              </p>
              <div className="mt-3 text-xs text-emerald-600 dark:text-emerald-400">
                가이드 보기 →
              </div>
            </Link>
          </li>
        ))}
      </ul>

      <div className="mt-8 rounded-lg bg-emerald-50 dark:bg-emerald-950/30 p-5">
        <div className="text-sm font-medium text-zinc-900 dark:text-zinc-100">
          바로 이미지 변환이 필요하시다면?
        </div>
        <Link
          href="/"
          className="mt-2 inline-block text-sm font-semibold text-emerald-700 dark:text-emerald-400 hover:underline"
        >
          이미지 변환 도구로 이동 →
        </Link>
      </div>
    </main>
  );
}
