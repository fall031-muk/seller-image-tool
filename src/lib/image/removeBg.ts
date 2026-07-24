// Lazy-loaded background removal helper.
// 초기 번들에 40MB 모델이 포함되지 않도록 동적 import 로 감쌈.

type LibConfig = {
  device?: "cpu" | "gpu";
  progress?: (name: string, current: number, total: number) => void;
};

type LibModule = typeof import("@imgly/background-removal");

let cachedModule: LibModule | null = null;
let loadingPromise: Promise<LibModule> | null = null;

export type RemoveBgProgress = {
  phase: "loading-model" | "processing";
  message: string;
  ratio?: number; // 0 ~ 1
  device?: "cpu" | "gpu";
};

async function loadModule(): Promise<LibModule> {
  if (cachedModule) return cachedModule;
  if (loadingPromise) return loadingPromise;
  loadingPromise = (async () => {
    const mod = await import("@imgly/background-removal");
    cachedModule = mod;
    return mod;
  })();
  try {
    return await loadingPromise;
  } finally {
    loadingPromise = null;
  }
}

async function isWebGpuAvailable(): Promise<boolean> {
  try {
    const nav = navigator as Navigator & {
      gpu?: { requestAdapter: () => Promise<unknown | null> };
    };
    if (!nav.gpu) return false;
    const adapter = await nav.gpu.requestAdapter();
    return !!adapter;
  } catch {
    return false;
  }
}

export async function removeBg(
  file: Blob,
  onProgress?: (p: RemoveBgProgress) => void,
): Promise<Blob> {
  const useGpu = await isWebGpuAvailable();
  const device: "cpu" | "gpu" = useGpu ? "gpu" : "cpu";

  onProgress?.({
    phase: "loading-model",
    message: useGpu
      ? "AI 모델 로드 중... (WebGPU 사용)"
      : "AI 모델 로드 중... (최초 1회, 약 40MB)",
    ratio: 0,
    device,
  });

  const mod = await loadModule();

  let lastPhase: RemoveBgProgress["phase"] = "loading-model";
  const config: LibConfig = {
    device,
    progress: (name, current, total) => {
      // name 예: "fetch:model", "compute:mask"
      const isFetch = name.startsWith("fetch");
      const phase: RemoveBgProgress["phase"] = isFetch
        ? "loading-model"
        : "processing";
      const ratio = total > 0 ? current / total : undefined;
      lastPhase = phase;
      onProgress?.({
        phase,
        message: isFetch
          ? `AI 모델 다운로드 중... ${ratio !== undefined ? `(${Math.round(ratio * 100)}%)` : ""}`
          : `배경 제거 중... ${ratio !== undefined ? `(${Math.round(ratio * 100)}%)` : ""}`,
        ratio,
        device,
      });
    },
  };

  const result = await mod.removeBackground(file, config);
  onProgress?.({
    phase: lastPhase,
    message: "완료",
    ratio: 1,
    device,
  });
  return result;
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
