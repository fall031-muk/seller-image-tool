import type { Metadata } from "next";
import Link from "next/link";
import { INDEXED_GUIDES } from "@/lib/guides/data";
import { PLATFORMS, SPECS_VERIFIED_AT } from "@/lib/platforms/specs";
import { RatioFamilyDiagram } from "@/components/SpecDiagram";
import { JsonLd, breadcrumbJsonLd, faqJsonLd } from "@/components/JsonLd";
import { SITE } from "@/lib/site";

export const metadata: Metadata = {
  title: "플랫폼별 상품 이미지 규격 총정리 — 13개 쇼핑몰 비교표",
  description:
    "네이버 스마트스토어, 쿠팡, 11번가, 지마켓·옥션, 무신사, 카카오톡 스토어, 오늘의집, 에이블리, 지그재그, SSG.com, 롯데온, 위메프, 인스타그램까지 13개 플랫폼의 상품 이미지 크기·비율·배경·파일 형식을 한 표로 비교하고, 규격을 맞출 때 실무에서 지켜야 할 기준을 정리했습니다.",
  keywords: [
    "상품 이미지 규격",
    "쇼핑몰 이미지 크기",
    "플랫폼별 이미지 규격 비교",
    "이커머스 이미지 사이즈",
    "오픈마켓 대표이미지 규격",
  ],
  alternates: { canonical: "/guide" },
};

const BG_LABEL: Record<string, string> = {
  white: "흰색",
  transparent: "투명",
  blur: "블러",
  original: "원본",
};

const HUB_FAQS = [
  {
    q: "모든 플랫폼에 쓸 수 있는 하나의 이미지 규격이 있나요?",
    a: "완전히 하나로 통일하기는 어렵습니다. 다만 1000×1000 이상의 정사각형 흰색 배경 이미지를 원본으로 준비해두면 이 표의 정사각형 계열 플랫폼 대부분을 축소만으로 커버할 수 있습니다. 예외는 세로형을 쓰는 무신사(3:4)와 인스타그램 세로 피드(4:5)로, 이 둘은 별도 프레임이 필요합니다.",
  },
  {
    q: "원본은 어느 정도 해상도로 보관해야 하나요?",
    a: "표에 있는 가장 큰 규격보다 넉넉하게, 긴 변 기준 2000px 이상으로 보관하기를 권장합니다. 축소는 화질 손실이 거의 없지만 확대는 반드시 화질이 떨어지므로, 원본을 크게 유지하고 채널별로 축소해 쓰는 방식이 안전합니다.",
  },
  {
    q: "JPEG, PNG, WebP 중 무엇으로 저장해야 하나요?",
    a: "상품 사진처럼 색이 연속적으로 변하는 이미지는 JPEG가 파일 크기 대비 품질이 가장 좋습니다. 로고나 도형처럼 색 경계가 뚜렷하거나 배경 투명이 필요하면 PNG를 씁니다. WebP는 같은 품질에서 파일이 더 작지만, 셀러센터 업로드 단계에서 형식을 제한하는 플랫폼이 있어 대표이미지는 JPEG가 가장 안전합니다.",
  },
  {
    q: "JPEG 품질은 몇 %로 저장하는 게 좋나요?",
    a: "85~92% 구간이 실무 기준입니다. 이 구간 아래로 내려가면 상품 경계와 그라데이션에 뭉개짐이 눈에 띄고, 95% 이상은 파일 크기만 커질 뿐 육안으로 구분되는 개선이 거의 없습니다.",
  },
  {
    q: "정사각형이 아닌 원본은 잘라야 하나요, 여백을 채워야 하나요?",
    a: "카테고리에 따라 다릅니다. 생활용품·가전처럼 상품 전체 형태를 보여줘야 하는 경우에는 여백을 채워 원본 비율을 지키는 편이 낫고, 패션처럼 화면을 꽉 채운 컷이 관례인 카테고리에서는 크롭이 자연스럽습니다. 이 사이트의 변환 도구는 기본적으로 비율을 유지한 채 흰색 여백을 채우는 방식을 씁니다.",
  },
  {
    q: "표에 있는 규격은 언제 기준인가요?",
    a: `각 플랫폼 셀러센터의 공개 자료와 실무에서 통용되는 기준을 정리한 값이며, 최종 확인일은 ${SPECS_VERIFIED_AT}입니다. 이 페이지의 '공식 출처' 목록에서 각 플랫폼 원문을 직접 확인하실 수 있습니다. 플랫폼 정책은 예고 없이 바뀔 수 있으므로 중요한 등록 작업 전에는 원문을 함께 확인하시기 바랍니다.`,
  },
];

const hubJsonLd = {
  "@context": "https://schema.org",
  "@type": "Article",
  headline: "플랫폼별 상품 이미지 규격 총정리 — 13개 쇼핑몰 비교표",
  description: metadata.description,
  url: `${SITE.url}/guide`,
  inLanguage: "ko",
  author: { "@type": "Person", name: SITE.author, description: SITE.authorBio },
  publisher: { "@type": "Organization", name: SITE.name, url: SITE.url },
};

/**
 * 흔히 쓰는 비율에 근사 매칭한다. 1000×1333 처럼 정수비가 딱 떨어지지 않는
 * 실제 규격을 "1000:1333" 이 아니라 "3:4" 로 읽히게 하기 위함.
 */
const COMMON_RATIOS: { label: string; value: number }[] = [
  { label: "1:1 정사각", value: 1 },
  { label: "4:5 세로형", value: 4 / 5 },
  { label: "3:4 세로형", value: 3 / 4 },
  { label: "2:3 세로형", value: 2 / 3 },
  { label: "9:16 세로형", value: 9 / 16 },
  { label: "4:3 가로형", value: 4 / 3 },
  { label: "16:9 가로형", value: 16 / 9 },
];

function ratioLabelFor(width: number, height: number): string {
  const r = width / height;
  const hit = COMMON_RATIOS.find((c) => Math.abs(r - c.value) < 0.01);
  return hit ? hit.label : `${r.toFixed(2)}:1`;
}

/** 실제 스펙 데이터에서 비율 계열을 뽑아낸다. 표와 그림이 어긋나지 않도록. */
function buildRatioFamilies() {
  const map = new Map<
    string,
    { ratioLabel: string; w: number; h: number; platforms: Set<string> }
  >();

  for (const platform of PLATFORMS) {
    for (const spec of platform.specs) {
      const ratioLabel = ratioLabelFor(spec.width, spec.height);
      const entry = map.get(ratioLabel) ?? {
        ratioLabel,
        w: spec.width,
        h: spec.height,
        platforms: new Set<string>(),
      };
      entry.platforms.add(platform.name);
      map.set(ratioLabel, entry);
    }
  }

  return [...map.values()]
    .sort((a, b) => b.w / b.h - a.w / a.h)
    .map((e) => ({
      ratioLabel: e.ratioLabel,
      w: e.w,
      h: e.h,
      platforms: [...e.platforms],
    }));
}

export default function GuideIndexPage() {
  return (
    <main className="mx-auto w-full max-w-5xl px-4 py-10 sm:px-6 lg:px-8">
      <JsonLd
        data={breadcrumbJsonLd([
          { name: "홈", url: `${SITE.url}/` },
          { name: "규격 가이드", url: `${SITE.url}/guide` },
        ])}
      />
      <JsonLd data={hubJsonLd} />
      <JsonLd data={faqJsonLd(HUB_FAQS)} />

      <header className="mb-8">
        <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-zinc-900 dark:text-zinc-50">
          플랫폼별 상품 이미지 규격 총정리
        </h1>
        <p className="mt-4 text-sm sm:text-base leading-relaxed text-zinc-700 dark:text-zinc-300">
          상품 하나를 여러 채널에 올리는 셀러에게 가장 소모적인 작업이 채널마다
          다른 이미지 규격을 맞추는 일입니다. 어떤 곳은 정사각형을 요구하고,
          어떤 곳은 세로형을 표준으로 쓰며, 최소 해상도와 권장 배경색도 제각각
          입니다. 이 페이지는 국내 주요 쇼핑몰 13곳의 상품 이미지 규격을 하나의
          표로 모으고, 표를 실제 작업에 옮길 때 알아야 할 기준을 정리한
          문서입니다.
        </p>
      </header>

      <section className="mb-10">
        <h2 className="text-xl font-semibold text-zinc-900 dark:text-zinc-100">
          13개 플랫폼 이미지 규격 비교표
        </h2>
        <p className="mt-2 text-sm text-zinc-600 dark:text-zinc-400">
          같은 플랫폼이라도 대표 이미지와 상세 이미지의 규격이 다릅니다. 아래
          표는 이미지 종류별로 행을 나눠 정리했습니다.
        </p>

        <div className="mt-4 overflow-x-auto rounded-lg border border-zinc-200 dark:border-zinc-800">
          <table className="w-full min-w-[640px] text-sm">
            <thead className="bg-zinc-50 dark:bg-zinc-900 text-xs uppercase tracking-wider text-zinc-500">
              <tr>
                <th className="px-3 py-2 text-left">플랫폼</th>
                <th className="px-3 py-2 text-left">이미지 종류</th>
                <th className="px-3 py-2 text-left">권장 크기</th>
                <th className="px-3 py-2 text-left">비율</th>
                <th className="px-3 py-2 text-left">형식</th>
                <th className="px-3 py-2 text-left">배경</th>
              </tr>
            </thead>
            <tbody>
              {PLATFORMS.flatMap((platform) =>
                platform.specs.map((s, i) => {
                  const ratio = ratioLabelFor(s.width, s.height).split(" ")[0];
                  return (
                    <tr
                      key={s.id}
                      className="border-t border-zinc-200 dark:border-zinc-800"
                    >
                      <td className="px-3 py-2 font-medium text-zinc-900 dark:text-zinc-100">
                        {i === 0 ? platform.name : ""}
                      </td>
                      <td className="px-3 py-2 text-zinc-700 dark:text-zinc-300">
                        {s.name}
                      </td>
                      <td className="px-3 py-2 text-zinc-700 dark:text-zinc-300 tabular-nums">
                        {s.width}×{s.height}
                      </td>
                      <td className="px-3 py-2 text-zinc-700 dark:text-zinc-300">
                        {ratio}
                      </td>
                      <td className="px-3 py-2 uppercase text-zinc-700 dark:text-zinc-300">
                        {s.format}
                      </td>
                      <td className="px-3 py-2 text-zinc-700 dark:text-zinc-300">
                        {BG_LABEL[s.background] ?? s.background}
                      </td>
                    </tr>
                  );
                }),
              )}
            </tbody>
          </table>
        </div>
        <p className="mt-3 text-xs text-zinc-500">
          최종 확인 {SPECS_VERIFIED_AT} · 플랫폼 정책은 예고 없이 바뀔 수
          있습니다. 아래 &lsquo;공식 출처&rsquo; 목록에서 각 플랫폼의 원문을
          직접 확인하실 수 있습니다.
        </p>
      </section>

      <section className="mb-10">
        <h2 className="text-xl font-semibold text-zinc-900 dark:text-zinc-100">
          표에서 읽어야 할 세 가지
        </h2>
        <RatioFamilyDiagram families={buildRatioFamilies()} />
        <div className="mt-3 space-y-4 text-sm sm:text-base leading-relaxed text-zinc-700 dark:text-zinc-300">
          <p>
            <strong className="text-zinc-900 dark:text-zinc-100">
              첫째, 대부분이 정사각형입니다.
            </strong>{" "}
            13개 플랫폼 중 세로형을 표준으로 쓰는 곳은 무신사(3:4)와 인스타그램
            세로 피드(4:5) 정도입니다. 나머지는 모두 1:1이므로, 정사각형 원본
            하나를 잘 만들어두면 크기만 줄여 대부분의 채널을 커버할 수 있습니다.
            반대로 세로형 채널에 정사각 이미지를 그대로 올리면 위아래 여백이
            생겨 다른 상품보다 작아 보이는 손해를 봅니다.
          </p>
          <p>
            <strong className="text-zinc-900 dark:text-zinc-100">
              둘째, 최소 크기가 아니라 최대 크기에 맞춰야 합니다.
            </strong>{" "}
            표에서 가장 큰 값은 인스타그램의 1080px, 스마트스토어·지그재그 등의
            1000px입니다. 500×500으로 만든 이미지를 1080px 채널에 올리면 확대
            과정에서 흐려지지만, 1080px 원본을 500px로 줄이는 것은 손실이 거의
            없습니다. 작업은 항상 가장 큰 규격을 기준으로 하고 아래로 줄이는
            방향이어야 합니다.
          </p>
          <p>
            <strong className="text-zinc-900 dark:text-zinc-100">
              셋째, 흰색 배경은 규정이라기보다 노출 전략입니다.
            </strong>{" "}
            대부분의 플랫폼이 흰색 배경을 &lsquo;권장&rsquo;할 뿐 강제하지는
            않습니다. 그럼에도 흰색을 쓰는 이유는 검색 결과 화면에서 여러 상품이
            격자로 나열될 때 배경이 통일된 상품이 더 정돈되어 보이기 때문입니다.
            다만 가구·인테리어(오늘의집)나 패션(무신사·에이블리)처럼 사용 맥락을
            보여주는 스타일 컷이 관례인 카테고리도 있으므로, 해당 카테고리
            상위 노출 상품들의 이미지 스타일을 먼저 살펴보는 편이 좋습니다.
          </p>
        </div>
      </section>

      <section className="mb-10">
        <h2 className="text-xl font-semibold text-zinc-900 dark:text-zinc-100">
          채널 확장 시 이미지 관리 순서
        </h2>
        <ol className="mt-3 space-y-3 text-sm sm:text-base leading-relaxed text-zinc-700 dark:text-zinc-300">
          <li>
            <strong className="text-zinc-900 dark:text-zinc-100">
              1. 원본을 한 벌만 관리합니다.
            </strong>{" "}
            상품당 긴 변 2000px 이상, 무손실 또는 고품질 JPEG로 촬영 원본을
            보관합니다. 채널별 결과물을 원본처럼 취급하기 시작하면, 나중에
            규격이 바뀌었을 때 어느 파일이 진짜 원본인지 알 수 없게 됩니다.
          </li>
          <li>
            <strong className="text-zinc-900 dark:text-zinc-100">
              2. 배경과 구도를 원본 단계에서 정리합니다.
            </strong>{" "}
            배경 제거나 밝기 보정은 원본에서 한 번만 해두면 모든 채널 결과물에
            그대로 반영됩니다. 채널별 파일을 만든 뒤에 보정하면 같은 작업을
            채널 수만큼 반복하게 됩니다.
          </li>
          <li>
            <strong className="text-zinc-900 dark:text-zinc-100">
              3. 채널별 변환은 마지막에, 일괄로 처리합니다.
            </strong>{" "}
            리사이즈·여백 채우기·워터마크·파일명 정리는 규칙이 정해지면 기계적인
            작업입니다. 상품 수가 늘어날수록 이 단계를 수동으로 하는 비용이
            급격히 커지므로, 규칙을 한 번 저장해두고 반복 적용하는 방식이
            좋습니다.
          </li>
          <li>
            <strong className="text-zinc-900 dark:text-zinc-100">
              4. 파일명 규칙을 먼저 정합니다.
            </strong>{" "}
            상품코드를 파일명에 넣어두면 나중에 상품이 수백 개로 늘어도 어떤
            파일이 어떤 상품의 것인지 바로 찾을 수 있습니다. 채널명과 이미지
            종류까지 파일명에 담아두면 대량 등록 시 실수를 크게 줄일 수
            있습니다.
          </li>
        </ol>
      </section>

      <section className="mb-10">
        <h2 className="text-xl font-semibold text-zinc-900 dark:text-zinc-100">
          플랫폼별 상세 가이드
        </h2>
        <p className="mt-2 text-sm text-zinc-600 dark:text-zinc-400">
          각 플랫폼의 반려 사유, 검수 기준, 카테고리별 관례를 더 자세히
          정리했습니다.
        </p>
        <ul className="mt-4 grid gap-4 sm:grid-cols-2">
          {INDEXED_GUIDES.map((g) => (
            <li
              key={g.slug}
              className="rounded-lg border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-950 p-5 hover:border-emerald-500"
            >
              <Link href={`/guide/${g.slug}`}>
                <h3 className="text-lg font-semibold text-zinc-900 dark:text-zinc-100">
                  {g.h1}
                </h3>
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

        <p className="mt-4 text-sm leading-relaxed text-zinc-600 dark:text-zinc-400">
          상세 가이드는 실무에서 반려 사례와 검수 기준을 충분히 확인한 위
          플랫폼에 한해 작성합니다. 나머지 플랫폼은 같은 형식의 문서를
          찍어내는 대신, 이 페이지 상단 비교표에서 규격만 정확히 다룹니다.
        </p>
      </section>

      <section className="mb-10">
        <h2 className="text-xl font-semibold text-zinc-900 dark:text-zinc-100">
          공식 출처
        </h2>
        <p className="mt-2 text-sm leading-relaxed text-zinc-600 dark:text-zinc-400">
          위 표의 수치는 각 플랫폼 셀러센터의 공개 자료와 실무에서 통용되는
          기준을 정리한 값입니다. 판매자가 원문을 직접 확인할 수 있도록 공식
          페이지를 함께 싣습니다. 공식 판매자 채널을 확인하지 못한 플랫폼은
          링크를 넣지 않았습니다.
        </p>
        <ul className="mt-4 grid gap-2 sm:grid-cols-2">
          {PLATFORMS.filter((p) => p.officialUrl).map((p) => (
            <li key={p.id}>
              <a
                href={p.officialUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-baseline justify-between gap-3 rounded-lg border border-zinc-200 dark:border-zinc-800 px-3 py-2 text-sm hover:border-emerald-500"
              >
                <span className="font-medium text-zinc-900 dark:text-zinc-100">
                  {p.name}
                </span>
                <span className="text-xs text-emerald-600 dark:text-emerald-400">
                  {p.officialLabel} ↗
                </span>
              </a>
            </li>
          ))}
        </ul>
      </section>

      <section className="mb-10">
        <h2 className="text-xl font-semibold text-zinc-900 dark:text-zinc-100">
          자주 묻는 질문
        </h2>
        <dl className="mt-4 divide-y divide-zinc-200 dark:divide-zinc-800 rounded-lg border border-zinc-200 dark:border-zinc-800">
          {HUB_FAQS.map((f, i) => (
            <div key={i} className="p-4">
              <dt className="text-sm font-semibold text-zinc-900 dark:text-zinc-100">
                Q. {f.q}
              </dt>
              <dd className="mt-2 text-sm leading-relaxed text-zinc-700 dark:text-zinc-300">
                {f.a}
              </dd>
            </div>
          ))}
        </dl>
      </section>

      <div className="rounded-lg bg-emerald-50 dark:bg-emerald-950/30 p-5">
        <div className="text-sm font-medium text-zinc-900 dark:text-zinc-100">
          위 규격에 맞춘 이미지를 바로 만들어보세요
        </div>
        <p className="mt-1 text-sm text-zinc-600 dark:text-zinc-400">
          원본 한 장을 올리면 선택한 플랫폼 규격에 맞춰 한 번에 변환됩니다.
          이미지는 브라우저 안에서만 처리됩니다.
        </p>
        <Link
          href="/"
          className="mt-3 inline-block text-sm font-semibold text-emerald-700 dark:text-emerald-400 hover:underline"
        >
          이미지 변환 도구로 이동 →
        </Link>
      </div>
    </main>
  );
}
