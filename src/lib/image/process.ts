import type { PlatformSpec, BackgroundMode } from "@/lib/platforms/specs";

export type WatermarkPosition =
  | "bottom-right"
  | "bottom-left"
  | "bottom-center"
  | "top-right"
  | "top-left"
  | "center";

export type WatermarkOptions = {
  enabled: boolean;
  text: string;
  position: WatermarkPosition;
  opacity: number; // 0.0 ~ 1.0
  color: string;
  sizeRatio: number; // 캔버스 짧은 변 대비 폰트 크기 비율 (0.02 ~ 0.1)
  // 로고 이미지 워터마크
  imageDataUrl?: string;
  imageScale?: number; // 캔버스 짧은 변 대비 이미지 크기 비율 (0.05 ~ 0.4)
  imageOpacity?: number; // 0.0 ~ 1.0
};

export type FileNameOptions = {
  prefix: string;
  includeOriginalName: boolean;
  includeSpecId: boolean;
  includeDimensions: boolean;
};

export type ProcessOptions = {
  watermark: WatermarkOptions;
  fileName: FileNameOptions;
};

export const DEFAULT_OPTIONS: ProcessOptions = {
  watermark: {
    enabled: false,
    text: "",
    position: "bottom-right",
    opacity: 0.5,
    color: "#ffffff",
    sizeRatio: 0.04,
    imageDataUrl: undefined,
    imageScale: 0.15,
    imageOpacity: 0.7,
  },
  fileName: {
    prefix: "",
    includeOriginalName: true,
    includeSpecId: true,
    includeDimensions: true,
  },
};

export type ProcessedImage = {
  specId: string;
  platformId: string;
  fileName: string;
  blob: Blob;
  dataUrl: string;
  width: number;
  height: number;
  sizeBytes: number;
};

export async function loadImage(file: File): Promise<HTMLImageElement> {
  const url = URL.createObjectURL(file);
  try {
    const img = new Image();
    img.decoding = "async";
    await new Promise<void>((resolve, reject) => {
      img.onload = () => resolve();
      img.onerror = () => reject(new Error(`이미지를 불러올 수 없습니다: ${file.name}`));
      img.src = url;
    });
    return img;
  } finally {
    setTimeout(() => URL.revokeObjectURL(url), 0);
  }
}

function paintBackground(
  ctx: CanvasRenderingContext2D,
  width: number,
  height: number,
  mode: BackgroundMode,
  img?: HTMLImageElement,
) {
  if (mode === "transparent") return;
  if (mode === "white") {
    ctx.fillStyle = "#ffffff";
    ctx.fillRect(0, 0, width, height);
    return;
  }
  if (mode === "blur" && img) {
    ctx.filter = "blur(24px)";
    ctx.drawImage(img, 0, 0, width, height);
    ctx.filter = "none";
    return;
  }
}

function computeContainRect(
  imgW: number,
  imgH: number,
  targetW: number,
  targetH: number,
) {
  const scale = Math.min(targetW / imgW, targetH / imgH);
  const w = Math.round(imgW * scale);
  const h = Math.round(imgH * scale);
  const x = Math.round((targetW - w) / 2);
  const y = Math.round((targetH - h) / 2);
  return { x, y, w, h };
}

function computeWatermarkPosition(
  width: number,
  height: number,
  itemW: number,
  itemH: number,
  padding: number,
  position: WatermarkPosition,
): { x: number; y: number } {
  switch (position) {
    case "bottom-right":
      return { x: width - itemW - padding, y: height - itemH - padding };
    case "bottom-left":
      return { x: padding, y: height - itemH - padding };
    case "bottom-center":
      return { x: (width - itemW) / 2, y: height - itemH - padding };
    case "top-right":
      return { x: width - itemW - padding, y: padding };
    case "top-left":
      return { x: padding, y: padding };
    case "center":
      return { x: (width - itemW) / 2, y: (height - itemH) / 2 };
  }
}

function drawTextWatermark(
  ctx: CanvasRenderingContext2D,
  width: number,
  height: number,
  wm: WatermarkOptions,
) {
  if (!wm.text.trim()) return;

  const shortSide = Math.min(width, height);
  const fontPx = Math.max(10, Math.round(shortSide * wm.sizeRatio));
  const padding = Math.round(shortSide * 0.03);

  ctx.save();
  ctx.globalAlpha = Math.max(0, Math.min(1, wm.opacity));
  ctx.fillStyle = wm.color;
  ctx.font = `600 ${fontPx}px system-ui, -apple-system, "Segoe UI", Roboto, sans-serif`;
  ctx.textBaseline = "top";
  ctx.shadowColor = "rgba(0,0,0,0.4)";
  ctx.shadowBlur = Math.round(fontPx * 0.15);

  const textW = ctx.measureText(wm.text).width;
  const textH = fontPx;
  const { x, y } = computeWatermarkPosition(
    width,
    height,
    textW,
    textH,
    padding,
    wm.position,
  );

  ctx.fillText(wm.text, x, y);
  ctx.restore();
}

async function drawImageWatermark(
  ctx: CanvasRenderingContext2D,
  width: number,
  height: number,
  wm: WatermarkOptions,
) {
  if (!wm.imageDataUrl) return;
  const img = await loadImageFromSrc(wm.imageDataUrl);
  const shortSide = Math.min(width, height);
  const scale = Math.max(0.02, Math.min(0.5, wm.imageScale ?? 0.15));
  const targetW = Math.round(shortSide * scale);
  const ratio = img.naturalHeight / img.naturalWidth;
  const targetH = Math.round(targetW * ratio);
  const padding = Math.round(shortSide * 0.03);
  const { x, y } = computeWatermarkPosition(
    width,
    height,
    targetW,
    targetH,
    padding,
    wm.position,
  );

  ctx.save();
  ctx.globalAlpha = Math.max(0, Math.min(1, wm.imageOpacity ?? 0.7));
  ctx.drawImage(img, x, y, targetW, targetH);
  ctx.restore();
}

function loadImageFromSrc(src: string): Promise<HTMLImageElement> {
  return new Promise((resolve, reject) => {
    const img = new Image();
    img.onload = () => resolve(img);
    img.onerror = () => reject(new Error("워터마크 이미지 로드 실패"));
    img.src = src;
  });
}

async function applyWatermarks(
  ctx: CanvasRenderingContext2D,
  width: number,
  height: number,
  wm: WatermarkOptions,
) {
  if (!wm.enabled) return;
  await drawImageWatermark(ctx, width, height, wm);
  drawTextWatermark(ctx, width, height, wm);
}

function buildFileName(
  originalName: string,
  spec: PlatformSpec,
  options: FileNameOptions,
): string {
  const ext = spec.format === "jpeg" ? "jpg" : spec.format;
  const parts: string[] = [];
  if (options.prefix.trim()) parts.push(options.prefix.trim());
  if (options.includeOriginalName) parts.push(stripExtension(originalName));
  if (options.includeSpecId) parts.push(spec.id);
  if (options.includeDimensions) parts.push(`${spec.width}x${spec.height}`);
  const base = parts.length > 0 ? parts.join("_") : `image_${spec.id}`;
  return `${sanitizeFileName(base)}.${ext}`;
}

function sanitizeFileName(name: string): string {
  return name.replace(/[\\/:*?"<>|]/g, "-").replace(/\s+/g, "_");
}

export async function processImage(
  img: HTMLImageElement,
  originalName: string,
  spec: PlatformSpec,
  platformId: string,
  options: ProcessOptions = DEFAULT_OPTIONS,
): Promise<ProcessedImage> {
  const canvas = document.createElement("canvas");
  canvas.width = spec.width;
  canvas.height = spec.height;
  const ctx = canvas.getContext("2d");
  if (!ctx) throw new Error("Canvas 컨텍스트를 만들 수 없습니다");

  ctx.imageSmoothingEnabled = true;
  ctx.imageSmoothingQuality = "high";

  paintBackground(ctx, spec.width, spec.height, spec.background, img);

  const rect = computeContainRect(
    img.naturalWidth,
    img.naturalHeight,
    spec.width,
    spec.height,
  );
  ctx.drawImage(img, rect.x, rect.y, rect.w, rect.h);

  await applyWatermarks(ctx, spec.width, spec.height, options.watermark);

  const mime = `image/${spec.format}`;
  const blob = await new Promise<Blob>((resolve, reject) => {
    canvas.toBlob(
      (b) => (b ? resolve(b) : reject(new Error("Blob 생성 실패"))),
      mime,
      spec.quality,
    );
  });

  const dataUrl = await blobToDataUrl(blob);
  const fileName = buildFileName(originalName, spec, options.fileName);

  return {
    specId: spec.id,
    platformId,
    fileName,
    blob,
    dataUrl,
    width: spec.width,
    height: spec.height,
    sizeBytes: blob.size,
  };
}

function blobToDataUrl(blob: Blob): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => resolve(String(reader.result));
    reader.onerror = () => reject(reader.error);
    reader.readAsDataURL(blob);
  });
}

function stripExtension(name: string): string {
  const dot = name.lastIndexOf(".");
  return dot > 0 ? name.slice(0, dot) : name;
}

export function formatBytes(bytes: number): string {
  if (bytes < 1024) return `${bytes} B`;
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
  return `${(bytes / (1024 * 1024)).toFixed(2)} MB`;
}
