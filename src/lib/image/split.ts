import type { ProcessedImage } from "./process";

export type SplitOptions = {
  maxHeight: number;
  overlap: number; // 인접 조각 간 겹침 px
  format: "jpeg" | "png" | "webp";
  quality: number;
  outputWidth?: number; // undefined 시 원본 폭 유지
};

export const DEFAULT_SPLIT_OPTIONS: SplitOptions = {
  maxHeight: 3000,
  overlap: 0,
  format: "jpeg",
  quality: 0.9,
};

function stripExtension(name: string): string {
  const dot = name.lastIndexOf(".");
  return dot > 0 ? name.slice(0, dot) : name;
}

export async function splitTallImage(
  img: HTMLImageElement,
  originalName: string,
  options: SplitOptions,
): Promise<ProcessedImage[]> {
  const srcW = img.naturalWidth;
  const srcH = img.naturalHeight;
  const targetW = options.outputWidth ?? srcW;
  const scale = targetW / srcW;
  const scaledH = Math.round(srcH * scale);

  const maxH = Math.max(500, options.maxHeight);
  const overlap = Math.max(0, Math.min(options.overlap, maxH - 100));
  const step = maxH - overlap;

  if (scaledH <= maxH) {
    // 분할 불필요
    const single = await renderSlice(img, srcW, srcH, targetW, scaledH, 0, scaledH, options);
    return [
      buildProcessed(originalName, options, single, 1, 1, targetW, scaledH),
    ];
  }

  const parts: ProcessedImage[] = [];
  const total = Math.ceil((scaledH - overlap) / step);
  let index = 0;
  for (let y = 0; y < scaledH; y += step) {
    index += 1;
    const sliceH = Math.min(maxH, scaledH - y);
    const blob = await renderSlice(
      img,
      srcW,
      srcH,
      targetW,
      scaledH,
      y,
      sliceH,
      options,
    );
    parts.push(buildProcessed(originalName, options, blob, index, total, targetW, sliceH));
    if (y + sliceH >= scaledH) break;
  }
  return parts;
}

async function renderSlice(
  img: HTMLImageElement,
  srcW: number,
  srcH: number,
  targetW: number,
  scaledH: number,
  sliceYInScaled: number,
  sliceH: number,
  options: SplitOptions,
): Promise<Blob> {
  const canvas = document.createElement("canvas");
  canvas.width = targetW;
  canvas.height = sliceH;
  const ctx = canvas.getContext("2d");
  if (!ctx) throw new Error("Canvas 컨텍스트를 만들 수 없습니다");

  ctx.imageSmoothingEnabled = true;
  ctx.imageSmoothingQuality = "high";

  if (options.format === "jpeg") {
    ctx.fillStyle = "#ffffff";
    ctx.fillRect(0, 0, targetW, sliceH);
  }

  const scale = targetW / srcW;
  const srcY = sliceYInScaled / scale;
  const srcSliceH = sliceH / scale;

  ctx.drawImage(
    img,
    0,
    srcY,
    srcW,
    srcSliceH,
    0,
    0,
    targetW,
    sliceH,
  );

  const mime = `image/${options.format}`;
  return new Promise((resolve, reject) => {
    canvas.toBlob(
      (b) => (b ? resolve(b) : reject(new Error("Blob 생성 실패"))),
      mime,
      options.quality,
    );
  });
}

function buildProcessed(
  originalName: string,
  options: SplitOptions,
  blob: Blob,
  index: number,
  total: number,
  width: number,
  height: number,
): ProcessedImage {
  const ext = options.format === "jpeg" ? "jpg" : options.format;
  const base = stripExtension(originalName);
  const padded = String(index).padStart(String(total).length, "0");
  return {
    specId: `split-${padded}`,
    platformId: "split",
    fileName: `${base}__part_${padded}_of_${total}.${ext}`,
    blob,
    dataUrl: "",
    width,
    height,
    sizeBytes: blob.size,
  };
}
