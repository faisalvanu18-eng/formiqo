/**
 * Client-side ZIP generation and file downloads using JSZip.
 * No server round-trip: the ZIP is built in memory and downloaded directly.
 */
import JSZip from "jszip";
import { safeFileName } from "./format";

export interface PreparedFileEntry {
  /** Display/document name, e.g. "Photograph". */
  name: string;
  blob: Blob;
  /** Extension without dot, e.g. "jpg" or "pdf". */
  extension: string;
}

/** Trigger a browser download for a single blob. */
export function downloadBlob(blob: Blob, filename: string): void {
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = filename;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  // Revoke shortly after to allow the download to start.
  setTimeout(() => URL.revokeObjectURL(url), 1000);
}

/** Build a ZIP of all prepared files and download it. */
export async function downloadAllAsZip(
  files: PreparedFileEntry[],
  zipBaseName: string,
  onProgress?: (fraction: number) => void
): Promise<void> {
  const zip = new JSZip();
  const usedNames = new Set<string>();

  for (const f of files) {
    let base = safeFileName(f.name) || "File";
    let candidate = `${base}.${f.extension}`;
    let n = 2;
    while (usedNames.has(candidate)) {
      candidate = `${base}_${n}.${f.extension}`;
      n++;
    }
    usedNames.add(candidate);
    zip.file(candidate, f.blob);
  }

  const content = await zip.generateAsync(
    { type: "blob", compression: "DEFLATE", compressionOptions: { level: 6 } },
    (meta) => onProgress?.(meta.percent / 100)
  );

  downloadBlob(content, `${safeFileName(zipBaseName)}.zip`);
}
