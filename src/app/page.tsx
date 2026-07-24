import Link from "next/link";
import { SellerImageTool } from "@/components/SellerImageTool";
import { JsonLd, homeJsonLd } from "@/components/JsonLd";
import { GUIDES } from "@/lib/guides/data";

export default function Home() {
  return (
    <main className="flex flex-col">
      <JsonLd data={homeJsonLd()} />
      <SellerImageTool />

      <section className="mx-auto w-full max-w-6xl px-4 pb-16 sm:px-6 lg:px-8">
        <div className="rounded-2xl border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-950 p-6 sm:p-8">
          <h2 className="text-xl font-semibold text-zinc-900 dark:text-zinc-100">
            플랫폼별 이미지 규격 가이드
          </h2>
          <p className="mt-2 text-sm text-zinc-600 dark:text-zinc-400">
            각 플랫폼의 최신 상품 이미지 규격, 자주 하는 실수, 검수 통과 팁을
            정리했습니다.
          </p>
          <div className="mt-5 grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
            {GUIDES.map((g) => (
              <Link
                key={g.slug}
                href={`/guide/${g.slug}`}
                className="group rounded-lg border border-zinc-200 dark:border-zinc-800 p-4 hover:border-emerald-500"
              >
                <div className="text-sm font-semibold text-zinc-900 dark:text-zinc-100 group-hover:text-emerald-600">
                  {g.h1}
                </div>
                <div className="mt-1 line-clamp-2 text-xs text-zinc-600 dark:text-zinc-400">
                  {g.description}
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>
    </main>
  );
}
