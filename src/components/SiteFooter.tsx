import Link from "next/link";
import { GUIDES } from "@/lib/guides/data";
import { BLOG_POSTS } from "@/lib/blog/data";
import { SITE } from "@/lib/site";

export function SiteFooter() {
  return (
    <footer className="mt-16 border-t border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-950">
      <div className="mx-auto grid w-full max-w-6xl gap-8 px-4 py-10 sm:grid-cols-2 lg:grid-cols-4 sm:px-6 lg:px-8">
        <div>
          <div className="text-sm font-semibold text-zinc-900 dark:text-zinc-100">
            {SITE.name}
          </div>
          <p className="mt-2 text-xs text-zinc-600 dark:text-zinc-400">
            상품 이미지 한 장으로 여러 플랫폼 규격에 맞춘 이미지를 브라우저 안에서
            바로 만들 수 있는 무료 도구입니다.
          </p>
        </div>
        <div>
          <div className="text-xs font-semibold uppercase tracking-wider text-zinc-500">
            도구
          </div>
          <ul className="mt-2 space-y-1 text-sm">
            <li>
              <Link
                href="/"
                className="text-zinc-700 dark:text-zinc-300 hover:text-emerald-600"
              >
                플랫폼 규격 변환
              </Link>
            </li>
            <li>
              <Link
                href="/split"
                className="text-zinc-700 dark:text-zinc-300 hover:text-emerald-600"
              >
                상세페이지 이미지 분할
              </Link>
            </li>
          </ul>
        </div>
        <div>
          <div className="text-xs font-semibold uppercase tracking-wider text-zinc-500">
            규격 가이드
          </div>
          <ul className="mt-2 space-y-1 text-sm">
            {GUIDES.map((g) => (
              <li key={g.slug}>
                <Link
                  href={`/guide/${g.slug}`}
                  className="text-zinc-700 dark:text-zinc-300 hover:text-emerald-600"
                >
                  {g.h1}
                </Link>
              </li>
            ))}
          </ul>
        </div>
        <div>
          <div className="text-xs font-semibold uppercase tracking-wider text-zinc-500">
            블로그
          </div>
          <ul className="mt-2 space-y-1 text-sm">
            {BLOG_POSTS.map((p) => (
              <li key={p.slug}>
                <Link
                  href={`/blog/${p.slug}`}
                  className="text-zinc-700 dark:text-zinc-300 hover:text-emerald-600"
                >
                  {p.title}
                </Link>
              </li>
            ))}
          </ul>
        </div>
      </div>
      <div className="border-t border-zinc-200 dark:border-zinc-800">
        <div className="mx-auto flex w-full max-w-6xl flex-col sm:flex-row items-start sm:items-center justify-between gap-3 px-4 py-4 sm:px-6 lg:px-8">
          <span className="text-xs text-zinc-500">
            © {new Date().getFullYear()} {SITE.name}
          </span>
          <div className="flex items-center gap-4 text-xs text-zinc-500">
            <Link href="/about" className="hover:text-emerald-600">
              소개
            </Link>
            <Link href="/contact" className="hover:text-emerald-600">
              문의
            </Link>
            <Link href="/privacy" className="hover:text-emerald-600">
              개인정보처리방침
            </Link>
            <Link href="/terms" className="hover:text-emerald-600">
              이용약관
            </Link>
            <span>플랫폼 규격은 참고용</span>
          </div>
        </div>
      </div>
    </footer>
  );
}
