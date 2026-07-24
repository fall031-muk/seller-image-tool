"use client";

import { useCallback, useMemo, useRef, useState } from "react";
import { PLATFORMS, type PlatformSpec } from "@/lib/platforms/specs";
import {
  loadImage,
  processImage,
  formatBytes,
  type ProcessedImage,
} from "@/lib/image/process";
import { buildZip, downloadBlob } from "@/lib/image/zip";

type SourceImage = {
  file: File;
  previewUrl: string;
};

const DEFAULT_SELECTED = new Set(
  PLATFORMS.flatMap((p) => p.specs.map((s) => s.id)).filter((id) =>
    ["smartstore-main", "coupang-main"].includes(id),
  ),
);

export function SellerImageTool() {
  const [sources, setSources] = useState<SourceImage[]>([]);
  const [selectedSpecs, setSelectedSpecs] = useState<Set<string>>(
    new Set(DEFAULT_SELECTED),
  );
  const [results, setResults] = useState<ProcessedImage[]>([]);
  const [processing, setProcessing] = useState(false);
  const [progress, setProgress] = useState<{ done: number; total: number }>({
    done: 0,
    total: 0,
  });
  const [error, setError] = useState<string | null>(null);
  const [isDragging, setIsDragging] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

  const allSpecs = useMemo(
    () => PLATFORMS.flatMap((p) => p.specs.map((s) => ({ p, s }))),
    [],
  );

  const handleFiles = useCallback((fileList: FileList | File[]) => {
    const files = Array.from(fileList).filter((f) =>
      f.type.startsWith("image/"),
    );
    if (files.length === 0) return;
    setSources((prev) => {
      // 기존 것 revoke
      prev.forEach((p) => URL.revokeObjectURL(p.previewUrl));
      return files.map((file) => ({
        file,
        previewUrl: URL.createObjectURL(file),
      }));
    });
    setResults([]);
    setError(null);
  }, []);

  const toggleSpec = useCallback((specId: string) => {
    setSelectedSpecs((prev) => {
      const next = new Set(prev);
      if (next.has(specId)) next.delete(specId);
      else next.add(specId);
      return next;
    });
  }, []);

  const toggleAllForPlatform = useCallback(
    (platformSpecIds: string[], allOn: boolean) => {
      setSelectedSpecs((prev) => {
        const next = new Set(prev);
        platformSpecIds.forEach((id) => {
          if (allOn) next.delete(id);
          else next.add(id);
        });
        return next;
      });
    },
    [],
  );

  const runProcess = useCallback(async () => {
    if (sources.length === 0) {
      setError("이미지를 먼저 선택해주세요");
      return;
    }
    if (selectedSpecs.size === 0) {
      setError("변환할 플랫폼을 하나 이상 선택해주세요");
      return;
    }
    setError(null);
    setProcessing(true);
    setResults([]);

    const selectedList: { platformId: string; spec: PlatformSpec }[] = [];
    for (const { p, s } of allSpecs) {
      if (selectedSpecs.has(s.id)) {
        selectedList.push({ platformId: p.id, spec: s });
      }
    }
    const total = sources.length * selectedList.length;
    setProgress({ done: 0, total });

    const out: ProcessedImage[] = [];
    try {
      for (const src of sources) {
        const img = await loadImage(src.file);
        for (const { platformId, spec } of selectedList) {
          const result = await processImage(img, src.file.name, spec, platformId);
          out.push(result);
          setProgress((prev) => ({ ...prev, done: prev.done + 1 }));
        }
      }
      setResults(out);
    } catch (err) {
      setError(err instanceof Error ? err.message : "처리 중 오류가 발생했습니다");
    } finally {
      setProcessing(false);
    }
  }, [sources, selectedSpecs, allSpecs]);

  const downloadZip = useCallback(async () => {
    if (results.length === 0) return;
    const blob = await buildZip(results);
    downloadBlob(blob, `seller-images-${Date.now()}.zip`);
  }, [results]);

  const downloadOne = useCallback((item: ProcessedImage) => {
    downloadBlob(item.blob, item.fileName);
  }, []);

  const onDrop = useCallback(
    (e: React.DragEvent) => {
      e.preventDefault();
      setIsDragging(false);
      if (e.dataTransfer.files?.length) handleFiles(e.dataTransfer.files);
    },
    [handleFiles],
  );

  return (
    <div className="mx-auto w-full max-w-6xl px-4 py-8 sm:px-6 lg:px-8">
      <header className="mb-8">
        <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-zinc-900 dark:text-zinc-50">
          셀러 이미지 자동 변환
        </h1>
        <p className="mt-2 text-sm text-zinc-600 dark:text-zinc-400">
          상품 이미지 1장으로 스마트스토어, 쿠팡, 무신사 등{" "}
          <span className="font-medium">각 플랫폼 규격</span>에 맞춘 이미지를 한 번에
          만들어드립니다. 이미지는{" "}
          <span className="font-medium text-emerald-600 dark:text-emerald-400">
            100% 브라우저 안에서만 처리
          </span>
          되어 서버로 전송되지 않습니다.
        </p>
      </header>

      <section className="mb-6">
        <div
          onDragOver={(e) => {
            e.preventDefault();
            setIsDragging(true);
          }}
          onDragLeave={() => setIsDragging(false)}
          onDrop={onDrop}
          onClick={() => inputRef.current?.click()}
          className={`cursor-pointer rounded-xl border-2 border-dashed p-8 sm:p-12 text-center transition ${
            isDragging
              ? "border-emerald-500 bg-emerald-50 dark:bg-emerald-950/30"
              : "border-zinc-300 dark:border-zinc-700 hover:border-zinc-400 dark:hover:border-zinc-600 bg-zinc-50 dark:bg-zinc-900/40"
          }`}
        >
          <input
            ref={inputRef}
            type="file"
            accept="image/*"
            multiple
            className="hidden"
            onChange={(e) => e.target.files && handleFiles(e.target.files)}
          />
          <div className="text-sm text-zinc-600 dark:text-zinc-400">
            {sources.length === 0 ? (
              <>
                <div className="text-base font-medium text-zinc-800 dark:text-zinc-200">
                  이미지를 드래그하거나 클릭하여 선택
                </div>
                <div className="mt-1">JPG, PNG, WebP · 여러 장 동시 업로드 가능</div>
              </>
            ) : (
              <div className="flex flex-wrap justify-center gap-3">
                {sources.slice(0, 6).map((s, i) => (
                  <div
                    key={i}
                    className="relative h-20 w-20 overflow-hidden rounded-md border border-zinc-200 dark:border-zinc-700"
                  >
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img
                      src={s.previewUrl}
                      alt={s.file.name}
                      className="h-full w-full object-cover"
                    />
                  </div>
                ))}
                {sources.length > 6 && (
                  <div className="flex h-20 w-20 items-center justify-center rounded-md bg-zinc-200 dark:bg-zinc-800 text-sm font-medium">
                    +{sources.length - 6}
                  </div>
                )}
              </div>
            )}
          </div>
          {sources.length > 0 && (
            <div className="mt-3 text-xs text-zinc-500">
              {sources.length}장 선택됨 · 클릭하여 다시 선택
            </div>
          )}
        </div>
      </section>

      <section className="mb-6">
        <h2 className="mb-3 text-sm font-semibold text-zinc-800 dark:text-zinc-200">
          변환할 플랫폼 / 규격
        </h2>
        <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
          {PLATFORMS.map((platform) => {
            const specIds = platform.specs.map((s) => s.id);
            const allOn = specIds.every((id) => selectedSpecs.has(id));
            return (
              <div
                key={platform.id}
                className="rounded-lg border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-950 p-3"
              >
                <div className="mb-2 flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <span
                      className="inline-block h-2.5 w-2.5 rounded-full"
                      style={{ backgroundColor: platform.color }}
                    />
                    <span className="text-sm font-medium text-zinc-900 dark:text-zinc-100">
                      {platform.name}
                    </span>
                  </div>
                  <button
                    type="button"
                    onClick={() => toggleAllForPlatform(specIds, allOn)}
                    className="text-xs text-zinc-500 hover:text-zinc-900 dark:hover:text-zinc-100"
                  >
                    {allOn ? "모두 해제" : "모두 선택"}
                  </button>
                </div>
                <ul className="space-y-1">
                  {platform.specs.map((spec) => (
                    <li key={spec.id}>
                      <label className="flex cursor-pointer items-center gap-2 rounded px-1 py-1 text-sm text-zinc-700 dark:text-zinc-300 hover:bg-zinc-50 dark:hover:bg-zinc-900">
                        <input
                          type="checkbox"
                          checked={selectedSpecs.has(spec.id)}
                          onChange={() => toggleSpec(spec.id)}
                          className="h-4 w-4 rounded border-zinc-300 text-emerald-600 focus:ring-emerald-500"
                        />
                        <span className="flex-1">{spec.name}</span>
                        <span className="text-xs text-zinc-500">
                          {spec.width}×{spec.height}
                        </span>
                      </label>
                    </li>
                  ))}
                </ul>
              </div>
            );
          })}
        </div>
      </section>

      <section className="mb-8 flex flex-col sm:flex-row items-start sm:items-center gap-3">
        <button
          type="button"
          onClick={runProcess}
          disabled={processing || sources.length === 0}
          className="inline-flex items-center justify-center rounded-lg bg-emerald-600 px-5 py-2.5 text-sm font-semibold text-white shadow-sm hover:bg-emerald-500 disabled:cursor-not-allowed disabled:bg-zinc-300 dark:disabled:bg-zinc-700"
        >
          {processing
            ? `변환 중... ${progress.done}/${progress.total}`
            : "변환 시작"}
        </button>
        {results.length > 0 && (
          <button
            type="button"
            onClick={downloadZip}
            className="inline-flex items-center justify-center rounded-lg bg-zinc-900 dark:bg-zinc-100 px-5 py-2.5 text-sm font-semibold text-white dark:text-zinc-900 hover:bg-zinc-800 dark:hover:bg-zinc-200"
          >
            전체 ZIP 다운로드 ({results.length}장)
          </button>
        )}
        {error && (
          <span className="text-sm text-red-600 dark:text-red-400">{error}</span>
        )}
      </section>

      {results.length > 0 && (
        <section>
          <h2 className="mb-3 text-sm font-semibold text-zinc-800 dark:text-zinc-200">
            결과 미리보기
          </h2>
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
            {results.map((item) => (
              <div
                key={`${item.platformId}-${item.specId}-${item.fileName}`}
                className="overflow-hidden rounded-lg border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-950"
              >
                <div className="aspect-square bg-zinc-100 dark:bg-zinc-900">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src={item.dataUrl}
                    alt={item.fileName}
                    className="h-full w-full object-contain"
                  />
                </div>
                <div className="p-3">
                  <div className="truncate text-xs text-zinc-500" title={item.fileName}>
                    {item.fileName}
                  </div>
                  <div className="mt-1 flex items-center justify-between text-xs text-zinc-600 dark:text-zinc-400">
                    <span>
                      {item.width}×{item.height}
                    </span>
                    <span>{formatBytes(item.sizeBytes)}</span>
                  </div>
                  <button
                    type="button"
                    onClick={() => downloadOne(item)}
                    className="mt-2 w-full rounded-md bg-zinc-100 dark:bg-zinc-800 px-2 py-1.5 text-xs font-medium text-zinc-700 dark:text-zinc-300 hover:bg-zinc-200 dark:hover:bg-zinc-700"
                  >
                    다운로드
                  </button>
                </div>
              </div>
            ))}
          </div>
        </section>
      )}

      <footer className="mt-12 border-t border-zinc-200 dark:border-zinc-800 pt-6 text-xs text-zinc-500">
        <p>
          플랫폼 규격은 참고용입니다. 정확한 최신 규격은 각 플랫폼 셀러센터
          가이드를 확인하세요.
        </p>
      </footer>
    </div>
  );
}
