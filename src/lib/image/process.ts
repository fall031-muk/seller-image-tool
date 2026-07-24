import type { PlatformSpec, BackgroundMode } from "@/lib/platforms/specs";

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
    // Delay revoke — caller uses img immediately, but browser keeps decoded pixels.
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
    // 원본 이미지를 캔버스 전체에 blur로 채우기
    ctx.filter = "blur(24px)";
    ctx.drawImage(img, 0, 0, width, height);
    ctx.filter = "none";
    return;
  }
  // "original"이면 배경 없음 (투명으로 시작)
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

export async function processImage(
  img: HTMLImageElement,
  originalName: string,
  spec: PlatformSpec,
  platformId: string,
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

  const mime = `image/${spec.format}`;
  const blob = await new Promise<Blob>((resolve, reject) => {
    canvas.toBlob(
      (b) => (b ? resolve(b) : reject(new Error("Blob 생성 실패"))),
      mime,
      spec.quality,
    );
  });

  const dataUrl = await blobToDataUrl(blob);
  const baseName = stripExtension(originalName);
  const ext = spec.format === "jpeg" ? "jpg" : spec.format;
  const fileName = `${baseName}__${spec.id}_${spec.width}x${spec.height}.${ext}`;

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
