import type { Metadata } from "next";
import { SITE } from "@/lib/site";

export const metadata: Metadata = {
  title: "문의",
  description: `${SITE.name} 이용 중 궁금한 점, 오류 신고, 개선 제안을 남길 수 있는 문의 채널을 안내합니다.`,
  alternates: { canonical: "/contact" },
  robots: { index: true, follow: true },
};

const CONTACT_EMAIL = "fall900802@gmail.com";

export default function ContactPage() {
  return (
    <main className="mx-auto w-full max-w-3xl px-4 py-10 sm:px-6 lg:px-8">
      <header className="mb-6">
        <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-zinc-900 dark:text-zinc-50">
          문의
        </h1>
        <p className="mt-2 text-sm text-zinc-500">
          서비스 이용 중 궁금한 점이나 제안을 남겨주세요
        </p>
      </header>

      <div className="prose prose-zinc dark:prose-invert max-w-none text-sm sm:text-base leading-relaxed">
        <p>
          {SITE.name}은 1인 개발자가 만들고 운영하는 서비스입니다. 아래
          채널을 통해 문의, 오류 신고, 기능 제안, 플랫폼 규격 정보 수정
          요청 등을 남겨주시면 확인 후 답변드립니다.
        </p>

        <h2>이메일</h2>
        <p>
          가장 빠른 문의 방법입니다. 아래 이메일로 연락해 주세요.
        </p>
        <p>
          <a
            href={`mailto:${CONTACT_EMAIL}`}
            className="font-semibold text-emerald-600 hover:underline"
          >
            {CONTACT_EMAIL}
          </a>
        </p>

        <h2>GitHub 이슈</h2>
        <p>
          버그 리포트나 기능 제안은 GitHub 저장소{" "}
          <a
            href="https://github.com/fall031-muk/seller-image-tool/issues"
            target="_blank"
            rel="noopener noreferrer"
          >
            이슈
          </a>
          로 남겨주셔도 됩니다.
        </p>

        <h2>이런 내용으로 문의해 주세요</h2>
        <ul>
          <li>이미지 변환 결과가 예상과 다르거나 오류가 발생하는 경우</li>
          <li>플랫폼 이미지 규격 정보가 최신 정책과 다른 경우</li>
          <li>새로운 플랫폼 규격 추가 요청</li>
          <li>기타 서비스 개선 제안</li>
        </ul>

        <p>보통 영업일 기준 2~3일 이내에 답변드리고 있습니다.</p>
      </div>
    </main>
  );
}
