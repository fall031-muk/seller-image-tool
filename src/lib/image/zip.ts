import JSZip from "jszip";
import type { ProcessedImage } from "./process";
import { getPlatformById } from "@/lib/platforms/specs";

export async function buildZip(items: ProcessedImage[]): Promise<Blob> {
  const zip = new JSZip();
  for (const item of items) {
    const platform = getPlatformById(item.platformId);
    const folder = platform ? platform.name : item.platformId;
    zip.folder(folder)?.file(item.fileName, item.blob);
  }
  return zip.generateAsync({ type: "blob", compression: "DEFLATE" });
}

export function downloadBlob(blob: Blob, fileName: string) {
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = fileName;
  document.body.appendChild(a);
  a.click();
  a.remove();
  setTimeout(() => URL.revokeObjectURL(url), 1000);
}
