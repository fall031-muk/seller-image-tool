import type { Metadata } from "next";
import { SITE } from "@/lib/site";

export const metadata: Metadata = {
  title: "개인정보처리방침",
  description: `${SITE.name}은 사용자의 이미지를 서버로 전송하지 않고 브라우저 안에서만 처리합니다. 수집·저장하는 정보와 처리 방침을 안내합니다.`,
  alternates: { canonical: "/privacy" },
  robots: { index: true, follow: true },
};

const LAST_UPDATED = "2026-07-24";

export default function PrivacyPage() {
  return (
    <main className="mx-auto w-full max-w-3xl px-4 py-10 sm:px-6 lg:px-8">
      <header className="mb-6">
        <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-zinc-900 dark:text-zinc-50">
          개인정보처리방침
        </h1>
        <p className="mt-2 text-sm text-zinc-500">최종 업데이트: {LAST_UPDATED}</p>
      </header>

      <div className="prose prose-zinc dark:prose-invert max-w-none text-sm sm:text-base leading-relaxed">
        <p>
          {SITE.name}(이하 “서비스”)은 이용자의 개인정보를 소중히 여기며, 최소한의
          정보만을 수집·이용합니다. 본 방침은 서비스 이용 시 수집·처리되는
          정보와 그 목적을 안내합니다.
        </p>

        <h2>1. 이미지 처리 방식</h2>
        <p>
          서비스에서 사용자가 업로드하는 이미지는{" "}
          <strong>어떠한 형태로도 서버에 전송되거나 저장되지 않습니다.</strong>{" "}
          모든 이미지 처리(리사이즈, 배경 제거, 워터마크, 분할 등)는 사용자의
          브라우저 내에서 JavaScript · WebAssembly 로 수행됩니다.
        </p>

        <h2>2. 수집하는 정보</h2>
        <ul>
          <li>
            <strong>익명 이용 통계</strong>: 페이지뷰, 방문 경로, 브라우저/OS
            정보 등 개인을 식별할 수 없는 형태의 통계 데이터를 Vercel Analytics 를
            통해 수집합니다. IP 주소는 저장되지 않거나 익명화됩니다.
          </li>
          <li>
            <strong>광고 관련 정보 (Google AdSense 활성화 시)</strong>: Google
            AdSense 가 활성화된 경우, 광고 개인화를 위해 Google 이 쿠키와
            디바이스 식별자를 사용할 수 있습니다.
          </li>
        </ul>

        <h2>3. 수집하지 않는 정보</h2>
        <ul>
          <li>업로드된 이미지 파일</li>
          <li>이미지에서 추출된 데이터 (EXIF 등)</li>
          <li>회원가입 없이 사용하므로 이름, 이메일, 연락처를 수집하지 않습니다.</li>
        </ul>

        <h2>4. 쿠키 사용</h2>
        <p>
          서비스는 필수 쿠키(사이트 정상 동작) 및 익명 분석 쿠키를 사용합니다.
          Google AdSense 활성화 시 광고 개인화 쿠키가 추가로 사용될 수 있으며,
          이용자는 <a href="https://adssettings.google.com" target="_blank" rel="noopener noreferrer">Google 광고 설정</a> 에서 개인화 광고를 끌 수 있습니다.
        </p>

        <h2>5. 제3자 서비스</h2>
        <ul>
          <li>
            <strong>Vercel</strong> — 웹사이트 호스팅 및 익명 분석
          </li>
          <li>
            <strong>Google AdSense</strong> — 광고 게재 (활성화 시)
          </li>
          <li>
            <strong>@imgly/background-removal</strong> — 브라우저 내 AI 모델
            (외부 서버 통신 없음)
          </li>
        </ul>

        <h2>6. 데이터 보관 기간</h2>
        <p>
          서비스는 이미지 파일을 저장하지 않으므로 보관 기간이 존재하지
          않습니다. 익명 통계는 Vercel 정책에 따라 최대 90일간 보관됩니다.
        </p>

        <h2>7. 이용자 권리</h2>
        <p>
          이용자는 언제든지 브라우저에서 쿠키를 삭제하거나 광고 개인화를
          비활성화할 수 있습니다. 별도로 저장된 개인정보가 없으므로 삭제 요청을
          별도로 처리할 필요가 없습니다.
        </p>

        <h2>8. 문의</h2>
        <p>
          개인정보 처리와 관련한 문의는 GitHub 저장소{" "}
          <a href="https://github.com/fall031-muk/seller-image-tool/issues" target="_blank" rel="noopener noreferrer">
            이슈
          </a>{" "}
          를 통해 남겨주세요.
        </p>

        <h2>9. 변경 이력</h2>
        <p>
          본 방침이 변경될 경우 본 페이지 상단의 최종 업데이트 날짜가 함께
          갱신됩니다.
        </p>
      </div>
    </main>
  );
}
