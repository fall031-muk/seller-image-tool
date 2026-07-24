"use client";

import { useCallback, useRef, useState } from "react";
import JSZip from "jszip";
import { loadImage, formatBytes, type ProcessedImage } from "@/lib/image/process";
import {
  splitTallImage,
  DEFAULT_SPLIT_OPTIONS,
  type SplitOptions,
} from "@/lib/image/split";
import { downloadBlob } from "@/lib/image/zip";

type SourceImage = {
  file: File;
  previewUrl: string;
};

const PRESETS: { label: string; value: number; note?: string }[] = [
  { label: "2,000px (모바일 안정)", value: 2000 },
  { label: "3,000px (표준)", value: 3000, note: "권장" },
  { label: "4,000px (긴 조각)", value: 4000 },
  { label: "5,000px (최대 압축)", value: 5000, note: "쿠팡 30000px 대응" },
];

const WIDTH_PRESETS: { label: string; value?: number }[] = [
  { label: "원본 폭 유지" },
  { label: "780 (쿠팡 상세)", value: 780 },
  { label: "860 (스마트스토어 상세)", value: 860 },
  { label: "1000", value: 1000 },
];

export function DetailImageSplitter() {
  const [sources, setSources] = useState<SourceImage[]>([]);
  const [options, setOptions] = useState<SplitOptions>(DEFAULT_SPLIT_OPTIONS);
  const [results, setResults] = useState<
    { source: string; parts: ProcessedImage[] }[]
  >([]);
  const [processing, setProcessing] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [isDragging, setIsDragging] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

  const handleFiles = useCallback((files: FileList | File[]) => {
    const arr = Array.from(files).filter((f) => f.type.startsWith("image/"));
    if (arr.length === 0) return;
    setSources((prev) => {
      prev.forEach((p) => URL.revokeObjectURL(p.previewUrl));
      return arr.map((file) => ({
        file,
        previewUrl: URL.createObjectURL(file),
      }));
    });
    setResults([]);
    setError(null);
  }, []);

  const run = useCallback(async () => {
    if (sources.length === 0) {
      setError("이미지를 먼저 선택해주세요");
      return;
    }
    setError(null);
    setProcessing(true);
    setResults([]);

    try {
      const out: { source: string; parts: ProcessedImage[] }[] = [];
      for (const src of sources) {
        const img = await loadImage(src.file);
        const parts = await splitTallImage(img, src.file.name, options);
        out.push({ source: src.file.name, parts });
      }
      setResults(out);
    } catch (err) {
      setError(err instanceof Error ? err.message : "처리 중 오류가 발생했습니다");
    } finally {
      setProcessing(false);
    }
  }, [sources, options]);

  const downloadAll = useCallback(async () => {
    if (results.length === 0) return;
    const zip = new JSZip();
    for (const group of results) {
      const folder = zip.folder(group.source.replace(/\.[^.]+$/, ""));
      for (const p of group.parts) folder?.file(p.fileName, p.blob);
    }
    const blob = await zip.generateAsync({ type: "blob", compression: "DEFLATE" });
    downloadBlob(blob, `detail-split-${Date.now()}.zip`);
  }, [results]);

  const onDrop = useCallback(
    (e: React.DragEvent) => {
      e.preventDefault();
      setIsDragging(false);
      if (e.dataTransfer.files?.length) handleFiles(e.dataTransfer.files);
    },
    [handleFiles],
  );

  const totalParts = results.reduce((sum, g) => sum + g.parts.length, 0);

  return (
    <div className="mx-auto w-full max-w-6xl px-4 py-8 sm:px-6 lg:px-8">
      <header className="mb-8">
        <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-zinc-900 dark:text-zinc-50">
          상세페이지 이미지 자동 분할
        </h1>
        <p className="mt-2 text-sm text-zinc-600 dark:text-zinc-400">
          긴 상세페이지 이미지를 세로 최대 높이 기준으로 자동 분할합니다.{" "}
          <span className="font-medium">
            쿠팡 세로 30,000px 제한 등 플랫폼 업로드 이슈를 한 번에 해결
          </span>
          하세요. 브라우저 안에서만 처리됩니다.
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
          {sources.length === 0 ? (
            <div className="text-sm text-zinc-600 dark:text-zinc-400">
              <div className="text-base font-medium text-zinc-800 dark:text-zinc-200">
                긴 상세페이지 이미지를 드래그하거나 클릭하여 선택
              </div>
              <div className="mt-1">여러 상품 상세페이지를 한 번에 처리 가능</div>
            </div>
          ) : (
            <div className="text-sm text-zinc-600 dark:text-zinc-400">
              <div className="flex flex-wrap justify-center gap-3">
                {sources.map((s, i) => (
                  <div
                    key={i}
                    className="relative h-24 w-16 overflow-hidden rounded-md border border-zinc-200 dark:border-zinc-700"
                  >
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img
                      src={s.previewUrl}
                      alt={s.file.name}
                      className="h-full w-full object-cover"
                    />
                  </div>
                ))}
              </div>
              <div className="mt-3 text-xs text-zinc-500">
                {sources.length}장 · 클릭하여 다시 선택
              </div>
            </div>
          )}
        </div>
      </section>

      <section className="mb-6 grid gap-4 sm:grid-cols-2">
        <div className="rounded-lg border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-950 p-4">
          <div className="text-sm font-semibold text-zinc-900 dark:text-zinc-100">
            조각당 최대 세로 높이
          </div>
          <div className="mt-2 grid grid-cols-2 gap-1.5">
            {PRESETS.map((p) => (
              <button
                key={p.value}
                type="button"
                onClick={() =>
                  setOptions((prev) => ({ ...prev, maxHeight: p.value }))
                }
                className={`rounded-md border px-2 py-1.5 text-left text-xs ${
                  options.maxHeight === p.value
                    ? "border-emerald-500 bg-emerald-50 dark:bg-emerald-900/30 text-emerald-800 dark:text-emerald-300"
                    : "border-zinc-200 dark:border-zinc-800 hover:border-zinc-400"
                }`}
              >
                <div className="font-medium">{p.label}</div>
                {p.note && (
                  <div className="text-[10px] text-zinc-500">{p.note}</div>
                )}
              </button>
            ))}
          </div>
          <label className="mt-3 block text-xs text-zinc-600 dark:text-zinc-400">
            직접 입력 (500~10000)
            <input
              type="number"
              min={500}
              max={10000}
              step={100}
              value={options.maxHeight}
              onChange={(e) =>
                setOptions((prev) => ({
                  ...prev,
                  maxHeight: Number(e.target.value),
                }))
              }
              className="mt-1 w-full rounded border border-zinc-300 dark:border-zinc-700 bg-white dark:bg-zinc-900 px-2 py-1.5 text-sm"
            />
          </label>
        </div>

        <div className="rounded-lg border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-950 p-4">
          <div className="text-sm font-semibold text-zinc-900 dark:text-zinc-100">
            출력 폭
          </div>
          <div className="mt-2 grid grid-cols-2 gap-1.5">
            {WIDTH_PRESETS.map((p, i) => (
              <button
                key={i}
                type="button"
                onClick={() =>
                  setOptions((prev) => ({ ...prev, outputWidth: p.value }))
                }
                className={`rounded-md border px-2 py-1.5 text-left text-xs ${
                  options.outputWidth === p.value
                    ? "border-emerald-500 bg-emerald-50 dark:bg-emerald-900/30 text-emerald-800 dark:text-emerald-300"
                    : "border-zinc-200 dark:border-zinc-800 hover:border-zinc-400"
                }`}
              >
                <div className="font-medium">{p.label}</div>
              </button>
            ))}
          </div>

          <div className="mt-4 space-y-2">
            <label className="block text-xs text-zinc-600 dark:text-zinc-400">
              포맷
              <select
                value={options.format}
                onChange={(e) =>
                  setOptions((prev) => ({
                    ...prev,
                    format: e.target.value as SplitOptions["format"],
                  }))
                }
                className="mt-1 w-full rounded border border-zinc-300 dark:border-zinc-700 bg-white dark:bg-zinc-900 px-2 py-1 text-sm"
              >
                <option value="jpeg">JPEG (권장)</option>
                <option value="png">PNG (투명 배경)</option>
                <option value="webp">WebP</option>
              </select>
            </label>
            <label className="block text-xs text-zinc-600 dark:text-zinc-400">
              품질 ({Math.round(options.quality * 100)}%)
              <input
                type="range"
                min={50}
                max={100}
                value={Math.round(options.quality * 100)}
                onChange={(e) =>
                  setOptions((prev) => ({
                    ...prev,
                    quality: Number(e.target.value) / 100,
                  }))
                }
                className="mt-1 w-full"
              />
            </label>
          </div>
        </div>
      </section>

      <section className="mb-8 flex flex-col sm:flex-row items-start sm:items-center gap-3">
        <button
          type="button"
          onClick={run}
          disabled={processing || sources.length === 0}
          className="inline-flex items-center justify-center rounded-lg bg-emerald-600 px-5 py-2.5 text-sm font-semibold text-white shadow-sm hover:bg-emerald-500 disabled:cursor-not-allowed disabled:bg-zinc-300 dark:disabled:bg-zinc-700"
        >
          {processing ? "분할 중..." : "분할 시작"}
        </button>
        {totalParts > 0 && (
          <button
            type="button"
            onClick={downloadAll}
            className="inline-flex items-center justify-center rounded-lg bg-zinc-900 dark:bg-zinc-100 px-5 py-2.5 text-sm font-semibold text-white dark:text-zinc-900 hover:bg-zinc-800 dark:hover:bg-zinc-200"
          >
            전체 ZIP 다운로드 ({totalParts}장)
          </button>
        )}
        {error && (
          <span className="text-sm text-red-600 dark:text-red-400">{error}</span>
        )}
      </section>

      {results.length > 0 && (
        <section className="space-y-6">
          {results.map((group) => (
            <div key={group.source}>
              <h2 className="mb-2 text-sm font-semibold text-zinc-800 dark:text-zinc-200">
                {group.source}{" "}
                <span className="text-zinc-500">
                  · {group.parts.length}조각으로 분할
                </span>
              </h2>
              <div className="grid gap-3 grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6">
                {group.parts.map((p) => (
                  <div
                    key={p.fileName}
                    className="overflow-hidden rounded-lg border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-950"
                  >
                    <div className="bg-zinc-100 dark:bg-zinc-900">
                      {/* eslint-disable-next-line @next/next/no-img-element */}
                      <img
                        src={URL.createObjectURL(p.blob)}
                        alt={p.fileName}
                        className="w-full"
                      />
                    </div>
                    <div className="p-2">
                      <div className="truncate text-[10px] text-zinc-500" title={p.fileName}>
                        {p.fileName}
                      </div>
                      <div className="mt-0.5 flex items-center justify-between text-[10px] text-zinc-600 dark:text-zinc-400">
                        <span>
                          {p.width}×{p.height}
                        </span>
                        <span>{formatBytes(p.sizeBytes)}</span>
                      </div>
                      <button
                        type="button"
                        onClick={() => downloadBlob(p.blob, p.fileName)}
                        className="mt-1.5 w-full rounded-md bg-zinc-100 dark:bg-zinc-800 px-2 py-1 text-[10px] font-medium text-zinc-700 dark:text-zinc-300 hover:bg-zinc-200 dark:hover:bg-zinc-700"
                      >
                        다운로드
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </section>
      )}
    </div>
  );
}
