import type { Metadata } from "next";
import Link from "next/link";
import { BLOG_POSTS } from "@/lib/blog/data";
import { JsonLd, breadcrumbJsonLd } from "@/components/JsonLd";
import { SITE } from "@/lib/site";

export const metadata: Metadata = {
  title: "블로그",
  description:
    "이커머스 셀러의 상품 이미지 작업을 줄여주는 팁과 도구 활용법을 정리한 블로그입니다.",
  alternates: { canonical: "/blog" },
};

export default function BlogIndexPage() {
  return (
    <main className="mx-auto w-full max-w-5xl px-4 py-10 sm:px-6 lg:px-8">
      <JsonLd
        data={breadcrumbJsonLd([
          { name: "홈", url: `${SITE.url}/` },
          { name: "블로그", url: `${SITE.url}/blog` },
        ])}
      />
      <header className="mb-8">
        <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-zinc-900 dark:text-zinc-50">
          블로그
        </h1>
        <p className="mt-2 text-sm text-zinc-600 dark:text-zinc-400">
          이커머스 셀러의 상품 이미지 작업을 줄여주는 팁과 도구 활용법을
          정리합니다.
        </p>
      </header>

      <ul className="grid gap-4 sm:grid-cols-2">
        {BLOG_POSTS.map((post) => (
          <li
            key={post.slug}
            className="rounded-lg border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-950 p-5 hover:border-emerald-500"
          >
            <Link href={`/blog/${post.slug}`}>
              <h2 className="text-lg font-semibold text-zinc-900 dark:text-zinc-100">
                {post.title}
              </h2>
              <p className="mt-2 text-sm text-zinc-600 dark:text-zinc-400 line-clamp-3">
                {post.description}
              </p>
              <div className="mt-3 flex items-center justify-between text-xs">
                <span className="text-zinc-500">{post.publishedAt}</span>
                <span className="text-emerald-600 dark:text-emerald-400">
                  더 읽기 →
                </span>
              </div>
            </Link>
          </li>
        ))}
      </ul>
    </main>
  );
}
