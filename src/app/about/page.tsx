import type { Metadata } from "next";
import Link from "next/link";
import { SITE } from "@/lib/site";
import { SPECS_VERIFIED_AT, PLATFORMS } from "@/lib/platforms/specs";
import { JsonLd } from "@/components/JsonLd";

export const metadata: Metadata = {
  title: "소개",
  description: `${SITE.name}을 만든 이유와 서비스 운영 방식을 소개합니다. 이커머스 셀러의 반복적인 이미지 규격 작업을 줄이기 위해 만든 무료 브라우저 기반 도구입니다.`,
  alternates: { canonical: "/about" },
  robots: { index: true, follow: true },
};

const aboutJsonLd = {
  "@context": "https://schema.org",
  "@type": "AboutPage",
  name: `${SITE.name} 소개`,
  url: `${SITE.url}/about`,
  inLanguage: "ko",
  about: {
    "@type": "Organization",
    name: SITE.name,
    url: SITE.url,
  },
};

export default function AboutPage() {
  return (
    <main className="mx-auto w-full max-w-3xl px-4 py-10 sm:px-6 lg:px-8">
      <JsonLd data={aboutJsonLd} />
      <header className="mb-6">
        <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-zinc-900 dark:text-zinc-50">
          소개
        </h1>
        <p className="mt-2 text-sm text-zinc-500">
          {SITE.name}을 만든 이유와 운영 방식
        </p>
      </header>

      <div className="prose prose-zinc dark:prose-invert max-w-none text-sm sm:text-base leading-relaxed">
        <h2>왜 이 도구를 만들었나요</h2>
        <p>
          온라인 셀러라면 상품 하나를 등록할 때마다 스마트스토어, 쿠팡,
          11번가, 무신사처럼 서로 다른 이미지 규격에 맞춰 사진을 일일이
          리사이즈하고 배경을 정리하는 작업을 반복하게 됩니다. 플랫폼마다
          권장 해상도, 비율, 배경색 기준이 조금씩 달라서 포토샵으로 매번
          새로 작업하거나, 규격을 놓쳐 상품 등록이 반려되는 경우도 흔합니다.
        </p>
        <p>
          {SITE.name}은 이 반복 작업을 줄이기 위해 만든 개인 프로젝트입니다.
          원본 이미지 한 장을 올리면 여러 플랫폼이 요구하는 규격에 맞춘
          결과물을 한 번에 만들어주는 것을 목표로 하고 있습니다.
        </p>

        <h2>만든 사람</h2>
        <p>
          개발 경력 5년차로, LMS(학습관리시스템)와 커머스 서비스의 백엔드를
          주로 개발해 왔습니다. 커머스 쪽 일을 하면서 상품 등록 과정을 가까이서
          볼 기회가 많았는데, 셀러들이 이미지 규격을 맞추는 데 쓰는 시간이
          생각보다 훨씬 길다는 점이 계속 눈에 걸렸습니다. 리사이즈와 여백
          채우기처럼 규칙만 정해지면 기계가 할 수 있는 일을 사람이 한 장씩
          반복하고 있었기 때문입니다.
        </p>
        <p>
          이 사이트는 그 반복 작업을 줄여보려고 만든 개인 프로젝트입니다.
          이미지 처리 로직을 직접 구현하면서 플랫폼별 규격 차이를 하나씩
          정리했고, 그 과정에서 알게 된 내용을 가이드 문서로 함께 공개하고
          있습니다.
        </p>

        <h2>규격 정보를 다루는 원칙</h2>
        <p>
          이 사이트가 제공하는 규격 수치는 각 플랫폼 셀러센터의 공개 자료와
          실제 상품 등록 과정에서 통용되는 실무 기준을 정리한 값입니다.
          현재 기준 최종 확인일은 {SPECS_VERIFIED_AT}이며, 가이드 문서마다
          이 날짜와 함께 해당 플랫폼의 공식 페이지 링크를 표기하고 있습니다.
        </p>
        <ul>
          <li>
            <strong>출처를 함께 밝힙니다</strong> — 현재{" "}
            {PLATFORMS.filter((p) => p.officialUrl).length}개 플랫폼에 대해
            판매자가 원문을 직접 확인할 수 있는 공식 페이지를 링크하고
            있습니다. 공식 판매자 채널을 확인하지 못한 플랫폼은 링크를 넣지
            않았습니다.
          </li>
          <li>
            <strong>정책 변경 가능성을 숨기지 않습니다</strong> — 플랫폼
            규격은 예고 없이 바뀝니다. 이 사이트의 정보만 믿고 등록하기보다,
            중요한 작업 전에는 공식 페이지를 함께 확인하시기를 권합니다.
          </li>
          <li>
            <strong>잘못된 정보는 제보받아 고칩니다</strong> — 규격이 실제와
            다르다면 <Link href="/contact">문의 페이지</Link>로 알려주세요.
            확인 후 수정하고 최종 확인일을 갱신합니다.
          </li>
        </ul>

        <h2>운영 방식</h2>
        <ul>
          <li>
            <strong>브라우저 안에서만 처리</strong> — 업로드한 이미지는
            서버로 전송되지 않고 사용자의 브라우저 안에서 JavaScript와
            WebAssembly로 처리됩니다. 자세한 내용은{" "}
            <Link href="/privacy">개인정보처리방침</Link>에서 확인할 수
            있습니다.
          </li>
          <li>
            <strong>무료 제공</strong> — 기본 기능은 별도의 가입 없이 무료로
            제공됩니다.
          </li>
          <li>
            <strong>개인 운영 프로젝트</strong> — 1인이 만들고 운영하는
            서비스입니다. 광고 수익 외에 별도의 유료 모델은 두고 있지 않으며,
            특정 플랫폼이나 업체로부터 대가를 받고 작성한 콘텐츠는
            없습니다.
          </li>
        </ul>

        <h2>규격 가이드에 대한 안내</h2>
        <p>
          <Link href="/guide">플랫폼별 이미지 규격 가이드</Link>는 각
          플랫폼의 공개된 셀러센터 자료와 실제 상품 등록 과정에서 자주
          발생하는 반려 사례를 바탕으로 정리하고 있습니다. 플랫폼 정책은
          수시로 바뀔 수 있으므로, 실제 등록 전에는 항상 해당 플랫폼의
          최신 공식 가이드를 함께 확인하시길 권장합니다.
        </p>

        <h2>문의</h2>
        <p>
          서비스 이용 중 궁금한 점이나 개선 제안이 있다면{" "}
          <Link href="/contact">문의 페이지</Link>를 통해 언제든 연락해
          주세요.
        </p>
      </div>
    </main>
  );
}
