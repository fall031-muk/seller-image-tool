import Link from "next/link";
import { SellerImageTool } from "@/components/SellerImageTool";
import { JsonLd, homeJsonLd, faqJsonLd } from "@/components/JsonLd";
import { INDEXED_GUIDES } from "@/lib/guides/data";

const HOME_FAQS = [
  {
    q: "업로드한 상품 이미지가 서버에 저장되나요?",
    a: "저장되지 않습니다. 이 도구는 이미지를 서버로 전송하지 않고, 브라우저의 Canvas API와 WebAssembly로 사용자의 기기 안에서만 처리합니다. 페이지를 닫으면 처리 중이던 이미지도 함께 사라지므로, 아직 공개하지 않은 신상품 사진도 안심하고 다룰 수 있습니다.",
  },
  {
    q: "회원가입이나 설치가 필요한가요?",
    a: "필요 없습니다. 브라우저에서 페이지를 열고 이미지를 올리면 바로 사용할 수 있습니다. 프로그램 설치나 로그인 절차가 없습니다.",
  },
  {
    q: "한 번에 몇 장까지 변환할 수 있나요?",
    a: "장수에 정해진 제한은 없지만, 모든 처리가 사용자 기기에서 이뤄지므로 성능은 기기 사양에 따라 달라집니다. 수십 장 단위로 나눠 처리하면 대부분의 환경에서 안정적으로 동작합니다.",
  },
  {
    q: "변환하면 화질이 떨어지나요?",
    a: "원본보다 작은 크기로 줄이는 경우에는 육안으로 구분되는 손실이 거의 없습니다. 반대로 원본보다 큰 규격으로 변환하면 확대 과정에서 화질이 떨어지므로, 가능한 한 큰 원본을 사용하는 것이 좋습니다. JPEG 품질은 50~100% 사이에서 직접 조절할 수 있습니다.",
  },
  {
    q: "여백은 어떻게 채워지나요?",
    a: "원본 비율을 유지한 채 목표 규격의 프레임 안에 배치하고, 남는 영역을 흰색으로 채웁니다. 상품이 잘리지 않기 때문에 형태 전체를 보여줘야 하는 카테고리에 적합합니다. 흰색 대신 투명 배경이나 원본 유지도 선택할 수 있습니다.",
  },
  {
    q: "상세페이지 이미지가 너무 길어서 업로드가 안 됩니다.",
    a: "쿠팡을 비롯한 여러 플랫폼이 이미지 세로 길이에 상한을 두고 있습니다. 상세페이지 이미지 분할 도구에서 조각당 최대 높이를 지정하면 긴 이미지를 여러 장으로 자동 분할하고, 순서가 유지되는 파일명으로 내려받을 수 있습니다.",
  },
];

export default function Home() {
  return (
    <main className="flex flex-col">
      <JsonLd data={homeJsonLd()} />
      <JsonLd data={faqJsonLd(HOME_FAQS)} />
      <SellerImageTool />

      <section className="mx-auto w-full max-w-6xl px-4 pb-16 sm:px-6 lg:px-8">
        <div className="rounded-2xl border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-950 p-6 sm:p-8">
          <h2 className="text-xl font-semibold text-zinc-900 dark:text-zinc-100">
            상품 하나를 여러 채널에 올릴 때 생기는 일
          </h2>
          <div className="mt-3 space-y-4 text-sm sm:text-base leading-relaxed text-zinc-700 dark:text-zinc-300">
            <p>
              상품 사진 한 장을 촬영하고 나면 실제 작업은 그때부터 시작됩니다.
              스마트스토어는 정사각형 1000×1000, 쿠팡은 대표 이미지와 상세
              이미지의 규격이 각각 다르고, 무신사는 세로 3:4 비율을 요구합니다.
              여기에 인스타그램 광고용 세로 컷까지 더하면 상품 하나당 만들어야
              하는 파일이 대여섯 개로 늘어납니다. 상품이 50개면 파일은 300개가
              되고, 이 작업을 포토샵에서 한 장씩 처리하면 하루가 그대로
              사라집니다.
            </p>
            <p>
              더 번거로운 것은 이 작업이 창의적인 판단을 요구하지 않는다는
              점입니다. 리사이즈, 여백 채우기, 워터마크 삽입, 파일명 정리는
              규칙이 한 번 정해지면 그대로 반복되는 기계적인 절차입니다. 이
              도구는 그 규칙을 저장해두고 여러 이미지에 한 번에 적용하기 위해
              만들었습니다.
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
                1. 원본 이미지를 올립니다.
              </strong>{" "}
              드래그하거나 클릭해서 여러 장을 한 번에 선택할 수 있습니다.
              가능하면 긴 변 기준 2000px 이상의 원본을 쓰세요. 큰 이미지를
              줄이는 것은 손실이 거의 없지만, 작은 이미지를 키우면 반드시
              화질이 떨어집니다.
            </li>
            <li>
              <strong className="text-zinc-900 dark:text-zinc-100">
                2. 변환할 플랫폼을 고릅니다.
              </strong>{" "}
              선택한 플랫폼의 규격이 자동으로 적용됩니다. 여러 개를 동시에
              선택하면 한 번의 변환으로 모든 규격의 결과물이 만들어집니다.
            </li>
            <li>
              <strong className="text-zinc-900 dark:text-zinc-100">
                3. 필요하면 고급 옵션을 설정합니다.
              </strong>{" "}
              배경 제거, 텍스트·로고 워터마크, JPEG 품질, 파일명 규칙을 조절할
              수 있습니다. 자주 쓰는 조합은 프리셋으로 저장해두면 다음 방문
              때 한 번의 클릭으로 불러올 수 있습니다.
            </li>
            <li>
              <strong className="text-zinc-900 dark:text-zinc-100">
                4. 결과를 ZIP으로 내려받습니다.
              </strong>{" "}
              플랫폼별 폴더로 정리된 상태로 압축되기 때문에, 셀러센터에 올릴
              때 어떤 파일이 어느 채널용인지 헷갈리지 않습니다.
            </li>
          </ol>
        </div>
      </section>

      <section className="mx-auto w-full max-w-6xl px-4 pb-16 sm:px-6 lg:px-8">
        <div className="rounded-2xl border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-950 p-6 sm:p-8">
          <h2 className="text-xl font-semibold text-zinc-900 dark:text-zinc-100">
            이미지가 서버로 올라가지 않는 이유
          </h2>
          <div className="mt-3 space-y-4 text-sm sm:text-base leading-relaxed text-zinc-700 dark:text-zinc-300">
            <p>
              대부분의 온라인 이미지 편집 서비스는 파일을 서버로 업로드해
              처리한 뒤 결과를 돌려줍니다. 편리하지만, 아직 공개하지 않은
              신상품 사진이나 촬영 원본을 외부 서버에 올린다는 뜻이기도 합니다.
            </p>
            <p>
              이 도구는 그 과정을 브라우저 안으로 옮겼습니다. 리사이즈와 여백
              채우기, 워터마크 합성은 브라우저에 내장된 Canvas API로 처리하고,
              배경 제거는 WebAssembly로 컴파일된 모델을 브라우저에서 직접
              실행합니다. 이미지 데이터가 네트워크를 타지 않기 때문에, 처음
              페이지를 불러온 뒤에는 인터넷 연결이 끊겨도 변환이 동작합니다.
            </p>
            <p>
              대신 처리 속도는 서버가 아니라 사용자의 기기 성능에 따라
              결정됩니다. 특히 배경 제거는 모델을 처음 내려받는 데 시간이
              걸리고 연산량도 많아, 사양이 낮은 기기에서는 다소 느릴 수
              있습니다.
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
            {HOME_FAQS.map((f, i) => (
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
        </div>
      </section>

      <section className="mx-auto w-full max-w-6xl px-4 pb-16 sm:px-6 lg:px-8">
        <div className="rounded-2xl border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-950 p-6 sm:p-8">
          <h2 className="text-xl font-semibold text-zinc-900 dark:text-zinc-100">
            플랫폼별 이미지 규격 가이드
          </h2>
          <p className="mt-2 text-sm text-zinc-600 dark:text-zinc-400">
            각 플랫폼의 최신 상품 이미지 규격, 자주 하는 실수, 검수 통과 팁을
            정리했습니다. 13개 플랫폼 규격을 한 번에 비교하려면{" "}
            <Link
              href="/guide"
              className="font-semibold text-emerald-600 hover:underline"
            >
              전체 비교표
            </Link>
            를 확인하세요.
          </p>
          <div className="mt-5 grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
            {INDEXED_GUIDES.map((g) => (
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
