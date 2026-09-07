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
        <div className="mt-4 space-y-4 text-sm sm:text-base leading-relaxed text-zinc-700 dark:text-zinc-300">
          <p>
            상품 이미지 작업은 판매와 직접 이어지는 일인데도, 막상 찾아보면
            &lsquo;정사각형으로 만드세요&rsquo; 수준에서 끝나는 글이
            대부분입니다. 정작 셀러가 막히는 지점은 그다음입니다. 세로형
            원본을 정사각형에 넣으면 양옆에 여백이 생기는데 이걸 흰색으로
            채워야 하는지 잘라야 하는지, 상세페이지가 왜 업로드 도중에
            거부되는지, 플랫폼 두 곳에 같은 상품을 올릴 때 이미지를 두 벌
            만들어야 하는지 같은 것들입니다.
          </p>
          <p>
            이 블로그는 그런 실무 지점을 하나씩 다룹니다. 규격 숫자 자체는{" "}
            <Link
              href="/guide"
              className="font-semibold text-emerald-600 hover:underline"
            >
              규격 비교표
            </Link>
            에 정리해두었으니, 여기서는 그 숫자가 왜 그렇게 정해졌고 실제
            작업에서 무엇을 바꾸는지를 씁니다.
          </p>
        </div>
      </header>

      <section className="mb-10 rounded-lg border border-zinc-200 dark:border-zinc-800 bg-zinc-50 dark:bg-zinc-900/40 p-5">
        <h2 className="text-base font-semibold text-zinc-900 dark:text-zinc-100">
          글을 쓸 때 지키는 것
        </h2>
        <ul className="mt-3 space-y-2 text-sm leading-relaxed text-zinc-700 dark:text-zinc-300">
          <li>
            <strong className="text-zinc-900 dark:text-zinc-100">
              직접 확인한 것만 씁니다.
            </strong>{" "}
            플랫폼 규격은 공식 페이지를 함께 링크하고 확인한 날짜를 남깁니다.
            확인하지 못한 값은 확인하지 못했다고 밝힙니다.
          </li>
          <li>
            <strong className="text-zinc-900 dark:text-zinc-100">
              협찬이나 대가를 받고 쓰지 않습니다.
            </strong>{" "}
            특정 플랫폼이나 제품을 추천하는 대가를 받은 글은 없습니다.
          </li>
          <li>
            <strong className="text-zinc-900 dark:text-zinc-100">
              채우기 위한 글은 쓰지 않습니다.
            </strong>{" "}
            같은 틀에 이름만 바꿔 여러 편을 찍어내는 대신, 쓸 내용이 생겼을
            때만 올립니다. 글 수가 적은 이유입니다.
          </li>
        </ul>
      </section>

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
