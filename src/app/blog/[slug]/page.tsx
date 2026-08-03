import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { BLOG_POSTS, getBlogPostBySlug } from "@/lib/blog/data";
import { JsonLd, blogPostJsonLd, breadcrumbJsonLd, faqJsonLd } from "@/components/JsonLd";
import { SITE } from "@/lib/site";

type Params = { slug: string };

export function generateStaticParams(): Params[] {
  return BLOG_POSTS.map((p) => ({ slug: p.slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<Params>;
}): Promise<Metadata> {
  const { slug } = await params;
  const post = getBlogPostBySlug(slug);
  if (!post) return {};
  return {
    title: post.title,
    description: post.description,
    keywords: post.keywords,
    alternates: { canonical: `/blog/${post.slug}` },
    openGraph: {
      type: "article",
      title: post.title,
      description: post.description,
      url: `${SITE.url}/blog/${post.slug}`,
    },
    twitter: {
      card: "summary_large_image",
      title: post.title,
      description: post.description,
    },
  };
}

export default async function BlogPostPage({
  params,
}: {
  params: Promise<Params>;
}) {
  const { slug } = await params;
  const post = getBlogPostBySlug(slug);
  if (!post) notFound();

  return (
    <main className="mx-auto w-full max-w-3xl px-4 py-10 sm:px-6 lg:px-8">
      <JsonLd
        data={breadcrumbJsonLd([
          { name: "홈", url: `${SITE.url}/` },
          { name: "블로그", url: `${SITE.url}/blog` },
          { name: post.title, url: `${SITE.url}/blog/${post.slug}` },
        ])}
      />
      <JsonLd
        data={blogPostJsonLd({
          title: post.title,
          description: post.description,
          slug: post.slug,
          publishedAt: post.publishedAt,
          updatedAt: post.updatedAt,
        })}
      />
      {post.faqs && post.faqs.length > 0 && (
        <JsonLd data={faqJsonLd(post.faqs)} />
      )}

      <nav className="mb-4 text-xs text-zinc-500">
        <Link href="/" className="hover:text-emerald-600">
          홈
        </Link>
        <span className="mx-2">/</span>
        <Link href="/blog" className="hover:text-emerald-600">
          블로그
        </Link>
      </nav>

      <article className="prose prose-zinc dark:prose-invert max-w-none">
        <header className="not-prose mb-8">
          <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-zinc-900 dark:text-zinc-50">
            {post.title}
          </h1>
          <div className="mt-2 text-xs text-zinc-500">
            {post.publishedAt} 게시
          </div>
          <p className="mt-4 text-sm sm:text-base text-zinc-700 dark:text-zinc-300 leading-relaxed">
            {post.intro}
          </p>
        </header>

        {post.sections.map((section, i) => (
          <section key={i} className="not-prose mb-8">
            <h2 className="text-xl font-semibold text-zinc-900 dark:text-zinc-100">
              {section.heading}
            </h2>
            {section.paragraphs && (
              <div className="mt-3 space-y-3 text-sm sm:text-base text-zinc-700 dark:text-zinc-300 leading-relaxed">
                {section.paragraphs.map((p, j) => (
                  <p key={j}>{p}</p>
                ))}
              </div>
            )}
            {section.bullets && (
              <ul className="mt-3 list-disc space-y-2 pl-5 text-sm sm:text-base text-zinc-700 dark:text-zinc-300 leading-relaxed">
                {section.bullets.map((b, j) => (
                  <li key={j}>{b}</li>
                ))}
              </ul>
            )}
            {section.orderedList && (
              <ol className="mt-3 list-decimal space-y-2 pl-5 text-sm sm:text-base text-zinc-700 dark:text-zinc-300 leading-relaxed">
                {section.orderedList.map((s, j) => (
                  <li key={j}>{s}</li>
                ))}
              </ol>
            )}
            {section.table && (
              <div className="mt-4 overflow-hidden rounded-lg border border-zinc-200 dark:border-zinc-800">
                <table className="w-full text-sm">
                  <thead className="bg-zinc-50 dark:bg-zinc-900 text-xs uppercase tracking-wider text-zinc-500">
                    <tr>
                      {section.table.headers.map((h, j) => (
                        <th key={j} className="px-3 py-2 text-left">
                          {h}
                        </th>
                      ))}
                    </tr>
                  </thead>
                  <tbody>
                    {section.table.rows.map((row, j) => (
                      <tr
                        key={j}
                        className="border-t border-zinc-200 dark:border-zinc-800"
                      >
                        {row.map((cell, k) => (
                          <td
                            key={k}
                            className="px-3 py-2 text-zinc-700 dark:text-zinc-300"
                          >
                            {cell}
                          </td>
                        ))}
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
            {section.code && (
              <pre className="mt-4 overflow-x-auto rounded-lg bg-zinc-900 p-4 text-xs text-zinc-100">
                <code>{section.code}</code>
              </pre>
            )}
          </section>
        ))}

        {post.faqs && post.faqs.length > 0 && (
          <section className="not-prose mt-10">
            <h2 className="text-xl font-semibold text-zinc-900 dark:text-zinc-100">
              자주 묻는 질문
            </h2>
            <dl className="mt-4 divide-y divide-zinc-200 dark:divide-zinc-800 rounded-lg border border-zinc-200 dark:border-zinc-800">
              {post.faqs.map((f, i) => (
                <div key={i} className="p-4">
                  <dt className="text-sm font-semibold text-zinc-900 dark:text-zinc-100">
                    Q. {f.q}
                  </dt>
                  <dd className="mt-2 text-sm text-zinc-700 dark:text-zinc-300 leading-relaxed">
                    {f.a}
                  </dd>
                </div>
              ))}
            </dl>
          </section>
        )}

        <section className="not-prose mt-10 rounded-xl bg-gradient-to-br from-emerald-500 to-teal-600 p-6 text-white">
          <div className="text-lg font-semibold">지금 바로 사용해보세요</div>
          <p className="mt-1 text-sm text-emerald-50">
            원본 이미지만 업로드하면 브라우저에서 바로 결과물을 만들어줍니다.
          </p>
          <Link
            href={post.ctaHref}
            className="mt-4 inline-flex items-center gap-2 rounded-lg bg-white px-4 py-2 text-sm font-semibold text-emerald-700 hover:bg-emerald-50"
          >
            {post.ctaLabel}
          </Link>
        </section>

        <section className="not-prose mt-10">
          <h2 className="text-xl font-semibold text-zinc-900 dark:text-zinc-100">
            다른 글 보기
          </h2>
          <ul className="mt-3 grid gap-2 sm:grid-cols-2">
            {BLOG_POSTS.filter((p) => p.slug !== post.slug).map((p) => (
              <li key={p.slug}>
                <Link
                  href={`/blog/${p.slug}`}
                  className="block rounded-lg border border-zinc-200 dark:border-zinc-800 p-3 text-sm hover:border-emerald-500"
                >
                  <div className="font-semibold text-zinc-900 dark:text-zinc-100">
                    {p.title}
                  </div>
                </Link>
              </li>
            ))}
          </ul>
        </section>
      </article>
    </main>
  );
}
