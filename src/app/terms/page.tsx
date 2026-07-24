import type { Metadata } from "next";
import { SITE } from "@/lib/site";

export const metadata: Metadata = {
  title: "이용약관",
  description: `${SITE.name} 이용약관`,
  alternates: { canonical: "/terms" },
  robots: { index: true, follow: true },
};

const LAST_UPDATED = "2026-07-24";

export default function TermsPage() {
  return (
    <main className="mx-auto w-full max-w-3xl px-4 py-10 sm:px-6 lg:px-8">
      <header className="mb-6">
        <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-zinc-900 dark:text-zinc-50">
          이용약관
        </h1>
        <p className="mt-2 text-sm text-zinc-500">최종 업데이트: {LAST_UPDATED}</p>
      </header>

      <div className="prose prose-zinc dark:prose-invert max-w-none text-sm sm:text-base leading-relaxed">
        <h2>1. 서비스 개요</h2>
        <p>
          {SITE.name}(이하 “서비스”)는 이커머스 셀러가 상품 이미지를 각
          플랫폼 규격에 맞춰 브라우저 안에서 무료로 변환·분할할 수 있도록 하는
          도구입니다.
        </p>

        <h2>2. 이용료</h2>
        <p>
          서비스의 기본 기능은 무료로 제공됩니다. 향후 유료 기능이 추가될 수 있으며,
          유료 기능이 도입될 경우 사전에 명확히 고지됩니다.
        </p>

        <h2>3. 이용자의 책임</h2>
        <ul>
          <li>
            이용자는 본 서비스를 통해 처리하는 이미지에 대해 저작권 등 필요한
            모든 권리를 보유해야 합니다.
          </li>
          <li>
            이용자는 서비스를 이용하여 타인의 권리를 침해하거나 위법한 목적으로
            사용해서는 안 됩니다.
          </li>
          <li>
            자동화된 방법으로 서비스에 과도한 부하를 가하는 행위는 금지됩니다.
          </li>
        </ul>

        <h2>4. 플랫폼 규격 정보</h2>
        <p>
          서비스가 제공하는 각 이커머스 플랫폼(스마트스토어, 쿠팡, 무신사 등)의
          이미지 규격 정보는 공개된 자료를 기반으로 정리된 참고용입니다.{" "}
          <strong>규격은 각 플랫폼 정책에 따라 변경될 수 있으며</strong>, 최종
          업로드 전 각 플랫폼 셀러센터의 공식 가이드를 확인하시기 바랍니다.
        </p>

        <h2>5. 책임의 제한</h2>
        <ul>
          <li>
            서비스는 “있는 그대로(as-is)” 제공되며, 서비스 결과물의 완벽함이나
            특정 목적 적합성을 보증하지 않습니다.
          </li>
          <li>
            서비스 이용으로 인해 발생한 직·간접적 손해(플랫폼 심사 반려,
            매출 손실 등)에 대해 서비스 운영자는 법이 허용하는 최대 범위에서
            책임을 지지 않습니다.
          </li>
          <li>
            AI 배경 제거 등 실험적 기능은 결과가 보장되지 않으며, 상업적 사용
            전 반드시 결과물을 검토하시기 바랍니다.
          </li>
        </ul>

        <h2>6. 서비스 변경 및 중단</h2>
        <p>
          서비스 운영자는 사전 고지 없이 서비스의 일부 또는 전부를 변경·중단할
          수 있으며, 이로 인한 손해에 대해 책임을 지지 않습니다.
        </p>

        <h2>7. 준거법</h2>
        <p>
          본 약관은 대한민국 법령에 따라 해석되며, 서비스 이용과 관련된 분쟁이
          발생할 경우 관련 법령 및 관례에 따릅니다.
        </p>

        <h2>8. 변경 사항</h2>
        <p>
          본 약관이 변경될 경우 본 페이지 상단의 최종 업데이트 날짜가 함께
          갱신됩니다. 중요한 변경 사항은 별도의 방식으로 안내될 수 있습니다.
        </p>
      </div>
    </main>
  );
}
