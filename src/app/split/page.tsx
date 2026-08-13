import type { Metadata } from "next";
import Link from "next/link";
import { DetailImageSplitter } from "@/components/DetailImageSplitter";
import { JsonLd, faqJsonLd } from "@/components/JsonLd";

export const metadata: Metadata = {
  title: "상세페이지 이미지 자동 분할 — 쿠팡 30,000px 제한 대응",
  description:
    "긴 상세페이지 이미지를 세로 최대 높이 기준으로 자동 분할합니다. 쿠팡·스마트스토어 업로드 세로 제한 이슈를 한 번에 해결하세요. 브라우저 안에서만 처리되어 안전합니다.",
  alternates: { canonical: "/split" },
  openGraph: {
    title: "상세페이지 이미지 자동 분할",
    description:
      "긴 상세페이지 이미지를 최대 높이 기준으로 자동 분할. 쿠팡 30,000px 제한 대응.",
    url: "/split",
  },
};

const SPLIT_FAQS = [
  {
    q: "왜 상세페이지 이미지를 나눠야 하나요?",
    a: "여러 플랫폼이 이미지 한 장의 세로 길이에 상한을 두고 있습니다. 쿠팡은 30,000px를 넘으면 업로드가 거부되고, 다른 플랫폼도 파일 용량 제한 때문에 사실상 비슷한 한계가 생깁니다. 기획전 형태로 길게 제작한 상세페이지가 이 선을 넘는 경우가 많습니다.",
  },
  {
    q: "분할하면 화질이 떨어지나요?",
    a: "원본 해상도를 그대로 유지한 채 자르기 때문에 분할 자체로 인한 손실은 없습니다. 다만 저장 형식과 품질 설정에 따라 압축 손실은 발생하므로, 텍스트가 많은 상세페이지라면 품질을 90% 이상으로 잡는 것을 권장합니다.",
  },
  {
    q: "조각당 높이는 얼마로 잡는 게 좋나요?",
    a: "3,000px 안팎이 무난합니다. 너무 짧게 자르면 조각 수가 늘어 업로드가 번거롭고, 너무 길면 로딩이 느려지는 원래 문제로 돌아갑니다. 플랫폼 제한에 걸리지 않으면서 관리 가능한 개수가 나오는 지점을 찾으면 됩니다.",
  },
  {
    q: "여러 상품을 한 번에 처리할 수 있나요?",
    a: "가능합니다. 여러 상품의 상세페이지를 한 번에 올리면 상품별 폴더로 정리된 하나의 ZIP으로 내려받을 수 있습니다.",
  },
  {
    q: "잘린 위치가 어색하면 어떻게 하나요?",
    a: "이 도구는 지정한 높이를 기준으로 일정하게 자릅니다. 문장 중간이나 상품 사진 한가운데가 잘려 어색하다면, 높이 값을 조금씩 바꿔가며 결과 미리보기를 확인해 경계가 자연스러운 지점을 찾는 방법이 있습니다.",
  },
  {
    q: "이미지가 서버로 전송되나요?",
    a: "전송되지 않습니다. 분할은 브라우저 안에서만 처리되며, 파일이 외부로 나가지 않습니다.",
  },
];

export default function SplitPage() {
  return (
    <main className="flex flex-col">
      <JsonLd data={faqJsonLd(SPLIT_FAQS)} />
      <DetailImageSplitter />

      <section className="mx-auto w-full max-w-6xl px-4 pb-16 sm:px-6 lg:px-8">
        <div className="rounded-2xl border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-950 p-6 sm:p-8">
          <h2 className="text-xl font-semibold text-zinc-900 dark:text-zinc-100">
            상세페이지가 업로드되지 않는 이유
          </h2>
          <div className="mt-3 space-y-4 text-sm sm:text-base leading-relaxed text-zinc-700 dark:text-zinc-300">
            <p>
              상세페이지를 공들여 만들고 업로드하려는데 &lsquo;이미지 세로
              크기가 최대 30,000픽셀을 초과합니다&rsquo; 같은 오류가 뜨는
              경우가 있습니다. 기획전 형태로 상품 설명, 사이즈 표, 후기,
              배송 안내까지 한 장에 이어붙이면 세로 길이가 수만 픽셀에 쉽게
              도달하기 때문입니다.
            </p>
            <p>
              플랫폼이 이런 제한을 두는 이유는 브라우저가 이미지를 화면에
              그리기 위해 압축을 푼 상태로 메모리에 올려야 하기 때문입니다.
              폭 780px에 세로 5만 픽셀짜리 이미지 한 장은 압축을 풀면 상당한
              메모리를 차지하고, 그 전부를 내려받기 전까지는 화면에 아무것도
              보이지 않습니다. 사양이 낮은 기기에서는 페이지가 멈추거나
              이미지가 아예 표시되지 않는 일도 생깁니다.
            </p>
            <p>
              그래서 상세페이지는 여러 장으로 나눠 이어 붙이는 방식이 표준이
              되었습니다. 위쪽 조각부터 순서대로 표시되기 때문에 구매자가
              체감하는 로딩 속도가 빨라지고, 이미 지나간 부분은 브라우저가
              메모리에서 정리할 수 있습니다.
            </p>
          </div>
        </div>
      </section>

      <section className="mx-auto w-full max-w-6xl px-4 pb-16 sm:px-6 lg:px-8">
        <div className="rounded-2xl border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-950 p-6 sm:p-8">
          <h2 className="text-xl font-semibold text-zinc-900 dark:text-zinc-100">
            사용 방법
          </h2>
          <ol className="mt-4 space-y-4 text-sm sm:text-base leading-relaxed text-zinc-700 dark:text-zinc-300">
            <li>
              <strong className="text-zinc-900 dark:text-zinc-100">
                1. 긴 상세페이지 이미지를 올립니다.
              </strong>{" "}
              여러 상품을 한 번에 올려도 됩니다. 상품별로 폴더가 나뉘어
              정리됩니다.
            </li>
            <li>
              <strong className="text-zinc-900 dark:text-zinc-100">
                2. 조각당 최대 높이를 정합니다.
              </strong>{" "}
              특별한 이유가 없다면 3,000px가 무난합니다. 조각 수와 조각당
              길이는 서로 맞바꾸는 관계라, 관리 가능한 개수가 나오는 선에서
              정하면 됩니다.
            </li>
            <li>
              <strong className="text-zinc-900 dark:text-zinc-100">
                3. 출력 폭을 맞춥니다.
              </strong>{" "}
              쿠팡 상세는 780px, 스마트스토어 상세는 860px가 표준입니다. 원본
              폭을 그대로 유지할 수도 있습니다.
            </li>
            <li>
              <strong className="text-zinc-900 dark:text-zinc-100">
                4. 결과를 확인하고 ZIP으로 받습니다.
              </strong>{" "}
              파일명에 순번이 자릿수를 맞춰 들어가기 때문에, 파일 탐색기에서도
              업로드해야 할 순서대로 정렬됩니다.
            </li>
          </ol>
        </div>
      </section>

      <section className="mx-auto w-full max-w-6xl px-4 pb-16 sm:px-6 lg:px-8">
        <div className="rounded-2xl border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-950 p-6 sm:p-8">
          <h2 className="text-xl font-semibold text-zinc-900 dark:text-zinc-100">
            나눠 올릴 때 알아두면 좋은 것
          </h2>
          <div className="mt-3 space-y-4 text-sm sm:text-base leading-relaxed text-zinc-700 dark:text-zinc-300">
            <p>
              <strong className="text-zinc-900 dark:text-zinc-100">
                조각의 폭은 반드시 통일하세요.
              </strong>{" "}
              폭이 1px이라도 다르면 스크롤할 때 이미지 경계에 미세한 단차가
              생깁니다. 한 장씩 보면 모르지만 이어 붙여놓으면 눈에 띕니다.
            </p>
            <p>
              <strong className="text-zinc-900 dark:text-zinc-100">
                텍스트가 많은 조각은 압축을 덜 하세요.
              </strong>{" "}
              JPEG 압축은 색이 급격히 바뀌는 경계에서 손실이 두드러집니다.
              사진은 품질을 낮춰도 잘 티가 나지 않지만, 글자는 같은 설정에서
              테두리가 지저분해집니다. 표나 안내 문구가 많은 상세페이지라면
              품질을 조금 높게 잡는 편이 안전합니다.
            </p>
            <p>
              <strong className="text-zinc-900 dark:text-zinc-100">
                수정할 가능성이 높은 부분은 조각을 분리해두세요.
              </strong>{" "}
              가격, 이벤트 기간, 사은품 안내처럼 자주 바뀌는 정보가 다른
              내용과 같은 조각에 들어 있으면 매번 그 조각 전체를 다시 만들어야
              합니다. 이런 정보는 별도 조각으로 떼어두면 교체가 훨씬
              간단해집니다.
            </p>
            <p>
              <strong className="text-zinc-900 dark:text-zinc-100">
                원본은 통짜로 보관하세요.
              </strong>{" "}
              분할 결과물만 남기면 나중에 플랫폼 규격이 바뀌었을 때 다시
              나눌 기준 파일이 없습니다. 통짜 원본을 보관해두고 필요할 때마다
              다시 분할하는 방식이 안전합니다.
            </p>
          </div>
        </div>
      </section>

      <section className="mx-auto w-full max-w-6xl px-4 pb-16 sm:px-6 lg:px-8">
        <div className="rounded-2xl border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-950 p-6 sm:p-8">
          <h2 className="text-xl font-semibold text-zinc-900 dark:text-zinc-100">
            자주 묻는 질문
          </h2>
          <dl className="mt-4 divide-y divide-zinc-200 dark:divide-zinc-800 rounded-lg border border-zinc-200 dark:border-zinc-800">
            {SPLIT_FAQS.map((f, i) => (
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
          <p className="mt-4 text-sm text-zinc-600 dark:text-zinc-400">
            플랫폼별 상세페이지 폭과 대표 이미지 규격은{" "}
            <Link
              href="/guide"
              className="font-semibold text-emerald-600 hover:underline"
            >
              규격 비교표
            </Link>
            에서 한 번에 확인할 수 있습니다.
          </p>
        </div>
      </section>
    </main>
  );
}
