// Lazy-loaded background removal helper.
// 초기 번들에 40MB 모델이 포함되지 않도록 동적 import 로 감쌈.

let cachedRunner: ((file: Blob) => Promise<Blob>) | null = null;
let loadingPromise: Promise<(file: Blob) => Promise<Blob>> | null = null;

export type RemoveBgProgress = {
  phase: "loading-model" | "processing";
  message: string;
};

async function loadRunner(
  onProgress?: (p: RemoveBgProgress) => void,
): Promise<(file: Blob) => Promise<Blob>> {
  if (cachedRunner) return cachedRunner;
  if (loadingPromise) return loadingPromise;

  onProgress?.({
    phase: "loading-model",
    message: "AI 모델 다운로드 중... (최초 1회, 약 40MB)",
  });

  loadingPromise = (async () => {
    const mod = await import("@imgly/background-removal");
    const runner = async (image: Blob) => mod.removeBackground(image);
    cachedRunner = runner;
    return runner;
  })();

  try {
    return await loadingPromise;
  } finally {
    loadingPromise = null;
  }
}

export async function removeBg(
  file: Blob,
  onProgress?: (p: RemoveBgProgress) => void,
): Promise<Blob> {
  const runner = await loadRunner(onProgress);
  onProgress?.({ phase: "processing", message: "배경 제거 중..." });
  return runner(file);
}

export async function blobToImage(blob: Blob): Promise<HTMLImageElement> {
  const url = URL.createObjectURL(blob);
  try {
    const img = new Image();
    img.decoding = "async";
    await new Promise<void>((resolve, reject) => {
      img.onload = () => resolve();
      img.onerror = () => reject(new Error("배경 제거 결과 이미지 로드 실패"));
      img.src = url;
    });
    return img;
  } finally {
    setTimeout(() => URL.revokeObjectURL(url), 0);
  }
}
