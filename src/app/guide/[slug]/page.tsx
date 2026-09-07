import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { GUIDES, INDEXED_GUIDES, getGuideBySlug } from "@/lib/guides/data";
import { getPlatformById, SPECS_VERIFIED_AT } from "@/lib/platforms/specs";
import {
  PlatformFrameDiagram,
  FitVsCropDiagram,
  SearchGridScaleDiagram,
} from "@/components/SpecDiagram";
import {
  JsonLd,
  articleJsonLd,
  faqJsonLd,
  breadcrumbJsonLd,
} from "@/components/JsonLd";
import { SITE } from "@/lib/site";

type Params = { slug: string };

export function generateStaticParams(): Params[] {
  return GUIDES.map((g) => ({ slug: g.slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<Params>;
}): Promise<Metadata> {
  const { slug } = await params;
  const guide = getGuideBySlug(slug);
  if (!guide) return {};
  return {
    title: guide.title,
    description: guide.description,
    keywords: guide.keywords,
    alternates: { canonical: `/guide/${guide.slug}` },
    openGraph: {
      type: "article",
      title: guide.title,
      description: guide.description,
      url: `${SITE.url}/guide/${guide.slug}`,
    },
    twitter: {
      card: "summary_large_image",
      title: guide.title,
      description: guide.description,
    },
  };
}

export default async function GuidePage({
  params,
}: {
  params: Promise<Params>;
}) {
  const { slug } = await params;
  const guide = getGuideBySlug(slug);
  if (!guide) notFound();

  const platform = getPlatformById(guide.platformId);
  const mainSpec =
    platform?.specs.find((s) => s.imageType === "main") ?? platform?.specs[0];

  return (
    <main className="mx-auto w-full max-w-3xl px-4 py-10 sm:px-6 lg:px-8">
      <JsonLd
        data={breadcrumbJsonLd([
          { name: "홈", url: `${SITE.url}/` },
          { name: "규격 가이드", url: `${SITE.url}/guide` },
          { name: guide.h1, url: `${SITE.url}/guide/${guide.slug}` },
        ])}
      />
      <JsonLd
        data={articleJsonLd({
          title: guide.title,
          description: guide.description,
          slug: guide.slug,
          updatedAt: guide.updatedAt,
        })}
      />
      <JsonLd data={faqJsonLd(guide.faqs)} />

      <nav className="mb-4 text-xs text-zinc-500">
        <Link href="/" className="hover:text-emerald-600">
          홈
        </Link>
        <span className="mx-2">/</span>
        <Link href="/guide" className="hover:text-emerald-600">
          규격 가이드
        </Link>
        {platform && (
          <>
            <span className="mx-2">/</span>
            <span className="text-zinc-700 dark:text-zinc-300">
              {platform.name}
            </span>
          </>
        )}
      </nav>

      <article className="prose prose-zinc dark:prose-invert max-w-none">
        <header className="not-prose mb-8">
          <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-zinc-900 dark:text-zinc-50">
            {guide.h1}
          </h1>
          <div className="mt-3 flex flex-wrap items-center gap-x-3 gap-y-1 text-xs text-zinc-500">
            <span>{SITE.authorBio}</span>
            <span aria-hidden="true">·</span>
            <span>최종 업데이트 {guide.updatedAt}</span>
            <span aria-hidden="true">·</span>
            <span>규격 확인 {SPECS_VERIFIED_AT}</span>
          </div>
          <p className="mt-4 text-sm sm:text-base text-zinc-700 dark:text-zinc-300 leading-relaxed">
            {guide.intro}
          </p>
        </header>

        {guide.sections.map((section, i) => (
          <section key={i} className="not-prose mb-8">
            <h2 className="text-xl font-semibold text-zinc-900 dark:text-zinc-100">
              {section.heading}
            </h2>
            <div className="mt-3 space-y-3 text-sm sm:text-base text-zinc-700 dark:text-zinc-300 leading-relaxed">
              {section.body.map((p, j) => (
                <p key={j}>{p}</p>
              ))}
            </div>
            {section.spec && section.spec.length > 0 && (
              <div className="mt-4 overflow-hidden rounded-lg border border-zinc-200 dark:border-zinc-800">
                <table className="w-full text-sm">
                  <thead className="bg-zinc-50 dark:bg-zinc-900 text-xs uppercase tracking-wider text-zinc-500">
                    <tr>
                      <th className="px-3 py-2 text-left">규격명</th>
                      <th className="px-3 py-2 text-left">크기</th>
                      <th className="px-3 py-2 text-left">형식</th>
                      <th className="px-3 py-2 text-left">배경</th>
                    </tr>
                  </thead>
                  <tbody>
                    {section.spec.map((s) => (
                      <tr
                        key={s.id}
                        className="border-t border-zinc-200 dark:border-zinc-800"
                      >
                        <td className="px-3 py-2 text-zinc-900 dark:text-zinc-100">
                          {s.name}
                        </td>
                        <td className="px-3 py-2 text-zinc-700 dark:text-zinc-300">
                          {s.width}×{s.height}
                        </td>
                        <td className="px-3 py-2 text-zinc-700 dark:text-zinc-300 uppercase">
                          {s.format}
                        </td>
                        <td className="px-3 py-2 text-zinc-700 dark:text-zinc-300">
                          {s.background === "white"
                            ? "흰색"
                            : s.background === "transparent"
                              ? "투명"
                              : s.background === "blur"
                                ? "블러"
                                : "원본"}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
            {section.spec && section.spec.length > 0 && platform && (
              <PlatformFrameDiagram
                specs={section.spec}
                platformName={platform.name}
              />
            )}
          </section>
        ))}

        {mainSpec && platform && (
          <section className="not-prose mb-8">
            <h2 className="text-xl font-semibold text-zinc-900 dark:text-zinc-100">
              규격을 눈으로 확인하기
            </h2>
            <p className="mt-3 text-sm sm:text-base leading-relaxed text-zinc-700 dark:text-zinc-300">
              {platform.name} 대표 규격 {mainSpec.width}×{mainSpec.height}를
              같은 축척으로 그린 그림입니다.
            </p>
            <FitVsCropDiagram
              width={mainSpec.width}
              height={mainSpec.height}
              targetLabel={`${platform.name} ${mainSpec.name}`}
            />
            <SearchGridScaleDiagram
              width={mainSpec.width}
              height={mainSpec.height}
              platformName={platform.name}
            />
          </section>
        )}

        {platform?.officialUrl && (
          <section className="not-prose mb-8 rounded-lg border border-zinc-200 dark:border-zinc-800 bg-zinc-50 dark:bg-zinc-900/40 p-5">
            <h2 className="text-base font-semibold text-zinc-900 dark:text-zinc-100">
              공식 출처에서 직접 확인하기
            </h2>
            <p className="mt-2 text-sm leading-relaxed text-zinc-700 dark:text-zinc-300">
              {SPECS_VERIFIED_AT} 기준입니다. 등록 전 원문을 함께 확인하세요.
            </p>
            <a
              href={platform.officialUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="mt-3 inline-flex items-center gap-1.5 text-sm font-semibold text-emerald-700 dark:text-emerald-400 hover:underline"
            >
              {platform.officialLabel ?? platform.name} ↗
            </a>
          </section>
        )}

        <section className="not-prose mt-10">
          <h2 className="text-xl font-semibold text-zinc-900 dark:text-zinc-100">
            자주 묻는 질문
          </h2>
          <dl className="mt-4 divide-y divide-zinc-200 dark:divide-zinc-800 rounded-lg border border-zinc-200 dark:border-zinc-800">
            {guide.faqs.map((f, i) => (
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

        <section className="not-prose mt-10 rounded-xl bg-gradient-to-br from-emerald-500 to-teal-600 p-6 text-white">
          <div className="text-lg font-semibold">
            지금 바로 {platform?.name ?? "플랫폼"} 규격 이미지 만들기
          </div>
          <p className="mt-1 text-sm text-emerald-50">
            원본 이미지 하나만 업로드하면 위 규격에 맞춘 이미지를 자동으로
            생성합니다. 브라우저에서만 처리되어 안전합니다.
          </p>
          <Link
            href="/"
            className="mt-4 inline-flex items-center gap-2 rounded-lg bg-white px-4 py-2 text-sm font-semibold text-emerald-700 hover:bg-emerald-50"
          >
            이미지 변환 도구로 이동 →
          </Link>
        </section>

        <section className="not-prose mt-10">
          <h2 className="text-xl font-semibold text-zinc-900 dark:text-zinc-100">
            다른 플랫폼 가이드
          </h2>
          <ul className="mt-3 grid gap-2 sm:grid-cols-2">
            {INDEXED_GUIDES.filter((g) => g.slug !== guide.slug).map((g) => (
              <li key={g.slug}>
                <Link
                  href={`/guide/${g.slug}`}
                  className="block rounded-lg border border-zinc-200 dark:border-zinc-800 p-3 text-sm hover:border-emerald-500"
                >
                  <div className="font-semibold text-zinc-900 dark:text-zinc-100">
                    {g.h1}
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
