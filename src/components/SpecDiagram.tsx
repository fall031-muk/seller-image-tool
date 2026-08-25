import type { PlatformSpec } from "@/lib/platforms/specs";

/**
 * 규격 데이터를 실제 비례로 그리는 SVG 다이어그램 모음.
 *
 * 상품 이미지 규격은 숫자만 나열하면 1000×1000 과 1000×1333 의 차이가
 * 얼마나 되는지 감이 오지 않는다. 여기서는 specs.ts 의 실제 수치를 그대로
 * 써서 비율·여백·표시 크기를 눈으로 비교할 수 있게 그린다.
 *
 * - 외부 이미지 자산 없이 SVG 로만 그린다.
 * - 라이트/다크 모두에서 읽히도록 Tailwind 클래스로 색을 준다.
 * - 도형만으로 정보가 갇히지 않도록 각 그림 아래에 설명 문장을 함께 둔다.
 */

const FRAME_STROKE = "stroke-zinc-400 dark:stroke-zinc-500";
const FRAME_FILL = "fill-white dark:fill-zinc-900";
const PAD_FILL = "fill-amber-100 dark:fill-amber-950/50";
const PAD_STROKE = "stroke-amber-400 dark:stroke-amber-600";
const CROP_FILL = "fill-rose-100 dark:fill-rose-950/50";
const CROP_STROKE = "stroke-rose-400 dark:stroke-rose-600";
const LABEL = "fill-zinc-600 dark:fill-zinc-400";
const LABEL_STRONG = "fill-zinc-900 dark:fill-zinc-100";

/** 상품을 대신하는 단순 실루엣. 크롭·여백 차이가 눈에 보이도록 세로로 길쭉하다. */
function ProductGlyph({
  x,
  y,
  w,
  h,
}: {
  x: number;
  y: number;
  w: number;
  h: number;
}) {
  // 주어진 박스(x,y,w,h) 안에 3:4 비례의 상품을 중앙 배치한다.
  const bodyW = w * 0.46;
  const bodyH = h * 0.62;
  const bx = x + (w - bodyW) / 2;
  const by = y + (h - bodyH) / 2 + h * 0.06;
  const capW = bodyW * 0.34;
  const capH = h * 0.12;
  return (
    <g aria-hidden="true">
      <rect
        x={bx + (bodyW - capW) / 2}
        y={by - capH}
        width={capW}
        height={capH}
        rx={capW * 0.25}
        className="fill-emerald-400 dark:fill-emerald-600"
      />
      <rect
        x={bx}
        y={by}
        width={bodyW}
        height={bodyH}
        rx={bodyW * 0.16}
        className="fill-emerald-500 dark:fill-emerald-500"
      />
      <rect
        x={bx + bodyW * 0.16}
        y={by + bodyH * 0.28}
        width={bodyW * 0.68}
        height={bodyH * 0.22}
        rx={2}
        className="fill-white/70 dark:fill-zinc-900/50"
      />
    </g>
  );
}

function Figure({
  caption,
  children,
}: {
  caption: string;
  children: React.ReactNode;
}) {
  return (
    <figure className="mt-4 rounded-lg border border-zinc-200 dark:border-zinc-800 bg-zinc-50 dark:bg-zinc-900/40 p-4">
      {children}
      <figcaption className="mt-3 text-xs leading-relaxed text-zinc-600 dark:text-zinc-400">
        {caption}
      </figcaption>
    </figure>
  );
}

/**
 * 한 플랫폼이 요구하는 규격들을 서로 같은 축척으로 나란히 그린다.
 * 정사각 하나뿐이면 비교 대상이 없으므로 1000×1000 기준선을 함께 보여준다.
 */
export function PlatformFrameDiagram({
  specs,
  platformName,
}: {
  specs: PlatformSpec[];
  platformName: string;
}) {
  const items = specs.map((s) => ({
    label: s.name,
    w: s.width,
    h: s.height,
  }));

  const maxDim = Math.max(...items.flatMap((i) => [i.w, i.h]));
  const BOX = 150; // 가장 큰 변이 차지할 픽셀
  const scale = BOX / maxDim;
  const gap = 34;
  const padX = 12;
  const topPad = 26;
  const bottomPad = 34;

  const drawn = items.map((i) => ({
    ...i,
    dw: i.w * scale,
    dh: i.h * scale,
  }));
  const totalW =
    padX * 2 +
    drawn.reduce((a, d) => a + d.dw, 0) +
    gap * Math.max(0, drawn.length - 1);
  const maxH = Math.max(...drawn.map((d) => d.dh));
  const totalH = topPad + maxH + bottomPad;

  // 누적 좌표를 렌더 중 변수 재할당 없이 순수하게 계산한다(항목 수가 3개 안팎).
  const positioned = drawn.map((d, i) => ({
    ...d,
    x: padX + drawn.slice(0, i).reduce((sum, prev) => sum + prev.dw + gap, 0),
    y: topPad + (maxH - d.dh),
  }));

  const ratios = items
    .map((i) => `${i.label} ${i.w}×${i.h}`)
    .join(", ");

  return (
    <Figure
      caption={`${platformName}이(가) 요구하는 규격을 같은 축척으로 그린 그림입니다. 각 사각형의 실제 비율과 상대적인 크기 차이를 그대로 반영했습니다. (${ratios})`}
    >
      <svg
        viewBox={`0 0 ${totalW} ${totalH}`}
        className="h-auto w-full"
        role="img"
        aria-label={`${platformName} 이미지 규격 비교: ${ratios}`}
      >
        {positioned.map((d, i) => (
          <g key={i}>
            <rect
              x={d.x}
              y={d.y}
              width={d.dw}
              height={d.dh}
              rx={3}
              className={`${FRAME_FILL} ${FRAME_STROKE}`}
              strokeWidth={1.5}
            />
            <ProductGlyph x={d.x} y={d.y} w={d.dw} h={d.dh} />
            <text
              x={d.x + d.dw / 2}
              y={d.y - 8}
              textAnchor="middle"
              className={`${LABEL_STRONG} text-[10px]`}
              fontSize={10}
              fontWeight={600}
            >
              {d.label}
            </text>
            <text
              x={d.x + d.dw / 2}
              y={topPad + maxH + 16}
              textAnchor="middle"
              className={`${LABEL} text-[10px]`}
              fontSize={10}
            >
              {d.w}×{d.h}
            </text>
            <text
              x={d.x + d.dw / 2}
              y={topPad + maxH + 28}
              textAnchor="middle"
              className={`${LABEL} text-[9px]`}
              fontSize={9}
            >
              {d.w === d.h
                ? "1:1"
                : `${(d.w / d.h).toFixed(2)}:1`}
            </text>
          </g>
        ))}
      </svg>
    </Figure>
  );
}

/**
 * 정사각 원본을 목표 규격에 넣을 때 생기는 여백과, 대신 크롭했을 때
 * 잘려나가는 영역을 나란히 보여준다. 세로형 플랫폼에서 특히 중요하다.
 */
export function FitVsCropDiagram({
  width,
  height,
  sourceLabel = "정사각 원본 (1:1)",
  targetLabel,
}: {
  width: number;
  height: number;
  sourceLabel?: string;
  targetLabel: string;
}) {
  const BOX = 130;
  const targetRatio = width / height;
  // 목표 프레임 그리기 크기
  const tW = targetRatio >= 1 ? BOX : BOX * targetRatio;
  const tH = targetRatio >= 1 ? BOX / targetRatio : BOX;

  // 정사각 원본을 contain 으로 넣었을 때
  const containSide = Math.min(tW, tH);
  const cx = (tW - containSide) / 2;
  const cy = (tH - containSide) / 2;

  // cover 로 채웠을 때 원본이 차지하는 크기(프레임 밖으로 넘침)
  const coverSide = Math.max(tW, tH);
  const vx = (tW - coverSide) / 2;
  const vy = (tH - coverSide) / 2;

  const padX = 14;
  const topPad = 24;
  const bottomPad = 30;
  const gap = 54;
  const totalW = padX * 2 + tW * 2 + gap;
  const totalH = topPad + Math.max(tH, coverSide) + bottomPad;
  const leftX = padX;
  const rightX = padX + tW + gap;
  const frameY = topPad + (Math.max(tH, coverSide) - tH) / 2;

  const isSquareTarget = Math.abs(targetRatio - 1) < 0.01;

  return (
    <Figure
      caption={
        isSquareTarget
          ? `${sourceLabel}을 ${targetLabel}(${width}×${height})에 넣는 경우입니다. 두 비율이 같아 여백도 잘림도 생기지 않습니다.`
          : `왼쪽은 ${sourceLabel}을 ${targetLabel}(${width}×${height}) 프레임에 비율을 유지한 채 넣은 결과로, 노란 부분이 흰색으로 채워지는 여백입니다. 오른쪽은 여백 없이 채우려고 크롭한 결과로, 붉은 부분이 잘려나갑니다. 상품 전체 형태를 보여줘야 하면 왼쪽, 화면을 꽉 채우는 것이 관례인 카테고리라면 오른쪽이 적합합니다.`
      }
    >
      <svg
        viewBox={`0 0 ${totalW} ${totalH}`}
        className="h-auto w-full"
        role="img"
        aria-label={`${sourceLabel}을 ${targetLabel} ${width}×${height} 규격에 맞출 때의 여백과 크롭 비교`}
      >
        {/* 왼쪽: 여백 채우기 */}
        <g>
          <rect
            x={leftX}
            y={frameY}
            width={tW}
            height={tH}
            rx={3}
            className={`${PAD_FILL} ${PAD_STROKE}`}
            strokeWidth={1.5}
          />
          <rect
            x={leftX + cx}
            y={frameY + cy}
            width={containSide}
            height={containSide}
            className={`${FRAME_FILL} ${FRAME_STROKE}`}
            strokeWidth={1}
          />
          <ProductGlyph
            x={leftX + cx}
            y={frameY + cy}
            w={containSide}
            h={containSide}
          />
          <text
            x={leftX + tW / 2}
            y={frameY - 8}
            textAnchor="middle"
            className={`${LABEL_STRONG}`}
            fontSize={10}
            fontWeight={600}
          >
            여백 채우기
          </text>
          <text
            x={leftX + tW / 2}
            y={frameY + tH + 16}
            textAnchor="middle"
            className={LABEL}
            fontSize={9}
          >
            상품이 잘리지 않음
          </text>
        </g>

        {/* 오른쪽: 크롭 */}
        <g>
          <rect
            x={rightX + vx}
            y={frameY + vy}
            width={coverSide}
            height={coverSide}
            className={`${CROP_FILL} ${CROP_STROKE}`}
            strokeWidth={1}
            strokeDasharray="3 2"
          />
          <ProductGlyph
            x={rightX + vx}
            y={frameY + vy}
            w={coverSide}
            h={coverSide}
          />
          <rect
            x={rightX}
            y={frameY}
            width={tW}
            height={tH}
            rx={3}
            className={`fill-none ${FRAME_STROKE}`}
            strokeWidth={2}
          />
          <text
            x={rightX + tW / 2}
            y={frameY - 8}
            textAnchor="middle"
            className={LABEL_STRONG}
            fontSize={10}
            fontWeight={600}
          >
            크롭
          </text>
          <text
            x={rightX + tW / 2}
            y={frameY + tH + 16}
            textAnchor="middle"
            className={LABEL}
            fontSize={9}
          >
            바깥쪽이 잘려나감
          </text>
        </g>
      </svg>
    </Figure>
  );
}

/**
 * 규격상 크기와 구매자가 검색 결과에서 실제로 보는 크기를 함께 그린다.
 * "크게 만들었는데 왜 안 보이지" 를 설명하는 그림.
 */
export function SearchGridScaleDiagram({
  width,
  height,
  platformName,
}: {
  width: number;
  height: number;
  platformName: string;
}) {
  const ratio = width / height;
  const FULL = 132; // 규격 원본을 나타내는 크기
  const fw = ratio >= 1 ? FULL : FULL * ratio;
  const fh = ratio >= 1 ? FULL / ratio : FULL;

  // 모바일 목록에서 한 칸이 차지하는 실제 폭(약 180px)을 같은 축척으로 환산
  const REAL_DISPLAY_PX = 180;
  const shrink = REAL_DISPLAY_PX / width;
  const sw = fw * shrink;
  const sh = fh * shrink;

  const padX = 14;
  const topPad = 24;
  const bottomPad = 32;
  const gap = 48;
  const totalW = padX * 2 + fw + gap + sw;
  const totalH = topPad + Math.max(fh, sh) + bottomPad;

  return (
    <Figure
      caption={`왼쪽은 ${platformName} 규격대로 만든 ${width}×${height} 이미지이고, 오른쪽은 같은 이미지가 모바일 검색 목록에서 실제로 표시되는 대략적인 크기(약 ${REAL_DISPLAY_PX}px 폭)를 같은 축척으로 줄여 그린 것입니다. 큰 화면에서 보기 좋게 만든 이미지가 목록에서는 이만큼 작아지므로, 작업 중간에 축소해서 확인하는 습관이 필요합니다.`}
    >
      <svg
        viewBox={`0 0 ${totalW} ${totalH}`}
        className="h-auto w-full"
        role="img"
        aria-label={`${width}×${height} 규격 이미지와 모바일 목록 표시 크기 비교`}
      >
        <g>
          <rect
            x={padX}
            y={topPad}
            width={fw}
            height={fh}
            rx={3}
            className={`${FRAME_FILL} ${FRAME_STROKE}`}
            strokeWidth={1.5}
          />
          <ProductGlyph x={padX} y={topPad} w={fw} h={fh} />
          <text
            x={padX + fw / 2}
            y={topPad - 8}
            textAnchor="middle"
            className={LABEL_STRONG}
            fontSize={10}
            fontWeight={600}
          >
            규격 원본
          </text>
          <text
            x={padX + fw / 2}
            y={topPad + fh + 16}
            textAnchor="middle"
            className={LABEL}
            fontSize={9}
          >
            {width}×{height}
          </text>
        </g>

        <g>
          <rect
            x={padX + fw + gap}
            y={topPad + (fh - sh)}
            width={sw}
            height={sh}
            rx={2}
            className={`${FRAME_FILL} ${FRAME_STROKE}`}
            strokeWidth={1}
          />
          <ProductGlyph
            x={padX + fw + gap}
            y={topPad + (fh - sh)}
            w={sw}
            h={sh}
          />
          <text
            x={padX + fw + gap + sw / 2}
            y={topPad - 8}
            textAnchor="middle"
            className={LABEL_STRONG}
            fontSize={10}
            fontWeight={600}
          >
            목록 표시
          </text>
          <text
            x={padX + fw + gap + sw / 2}
            y={topPad + fh + 16}
            textAnchor="middle"
            className={LABEL}
            fontSize={9}
          >
            약 {REAL_DISPLAY_PX}px
          </text>
        </g>
      </svg>
    </Figure>
  );
}

/**
 * 여러 플랫폼이 쓰는 비율이 사실 몇 종류 안 된다는 것을 한눈에 보여준다.
 * "대부분 정사각형" 이라는 주장을 글이 아니라 그림으로 뒷받침하는 용도.
 */
export function RatioFamilyDiagram({
  families,
}: {
  families: { ratioLabel: string; w: number; h: number; platforms: string[] }[];
}) {
  const BOX = 118;
  const padX = 14;
  const topPad = 24;
  const gap = 42;

  const drawn = families.map((f) => {
    const r = f.w / f.h;
    return {
      ...f,
      dw: r >= 1 ? BOX : BOX * r,
      dh: r >= 1 ? BOX / r : BOX,
    };
  });
  const maxH = Math.max(...drawn.map((d) => d.dh));
  // 플랫폼 이름 줄 수에 따라 아래 여백 확보
  const maxNameLines = Math.max(...drawn.map((d) => d.platforms.length));
  const bottomPad = 30 + maxNameLines * 11;
  const totalW =
    padX * 2 + drawn.reduce((a, d) => a + d.dw, 0) + gap * (drawn.length - 1);
  const totalH = topPad + maxH + bottomPad;

  // 누적 좌표를 렌더 중 변수 재할당 없이 순수하게 계산한다(항목 수가 3개 안팎).
  const positioned = drawn.map((d, i) => ({
    ...d,
    x: padX + drawn.slice(0, i).reduce((sum, prev) => sum + prev.dw + gap, 0),
    y: topPad + (maxH - d.dh),
  }));

  const summary = families
    .map((f) => `${f.ratioLabel}: ${f.platforms.join(", ")}`)
    .join(" / ");

  return (
    <Figure
      caption={`13개 플랫폼이 사용하는 비율은 실제로 ${families.length}종류뿐입니다. 각 사각형은 실제 비율대로 그렸습니다. ${summary}`}
    >
      <svg
        viewBox={`0 0 ${totalW} ${totalH}`}
        className="h-auto w-full"
        role="img"
        aria-label={`플랫폼별 이미지 비율 계열 비교. ${summary}`}
      >
        {positioned.map((d, i) => (
          <g key={i}>
            <rect
              x={d.x}
              y={d.y}
              width={d.dw}
              height={d.dh}
              rx={3}
              className={`${FRAME_FILL} ${FRAME_STROKE}`}
              strokeWidth={1.5}
            />
            <ProductGlyph x={d.x} y={d.y} w={d.dw} h={d.dh} />
            <text
              x={d.x + d.dw / 2}
              y={d.y - 8}
              textAnchor="middle"
              className={LABEL_STRONG}
              fontSize={11}
              fontWeight={600}
            >
              {d.ratioLabel}
            </text>
            {d.platforms.map((name, j) => (
              <text
                key={j}
                x={d.x + d.dw / 2}
                y={topPad + maxH + 16 + j * 11}
                textAnchor="middle"
                className={LABEL}
                fontSize={9}
              >
                {name}
              </text>
            ))}
          </g>
        ))}
      </svg>
    </Figure>
  );
}
