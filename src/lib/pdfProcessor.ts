/**
 * Client-side PDF handling using pdf-lib. All processing is in-browser.
 *
 * Note on compression: true image re-compression inside a PDF is limited in a
 * pure browser environment. We (a) validate page count and size, (b) re-save
 * with object streams to remove redundancy, and (c) if a PDF is over the limit
 * and is effectively a scanned document, we cannot always guarantee a target
 * size — in that case we report clearly rather than silently failing.
 */
import { PDFDocument } from "pdf-lib";
import type { UploadRule } from "./types";

export interface ProcessedPdf {
  blob: Blob;
  size: number;
  pageCount: number;
  url: string;
  /** True if we could bring it within the max size (or no max set). */
  withinSize: boolean;
}

export async function processPdf(
  file: File,
  rule: UploadRule,
  onProgress?: (f: number) => void
): Promise<ProcessedPdf> {
  onProgress?.(0.1);
  let bytes: ArrayBuffer;
  try {
    bytes = await file.arrayBuffer();
  } catch {
    throw new Error("We couldn't read this file.");
  }

  let doc: PDFDocument;
  try {
    doc = await PDFDocument.load(bytes, { ignoreEncryption: true });
  } catch {
    throw new Error(
      "This doesn't look like a valid PDF, or it is password-protected."
    );
  }
  onProgress?.(0.4);

  const pageCount = doc.getPageCount();

  // Re-save with object streams to strip redundancy — a light, safe optimisation.
  const saved = await doc.save({ useObjectStreams: true });
  onProgress?.(0.85);

  const blob = new Blob([saved], { type: "application/pdf" });
  const withinSize = !rule.maxFileSize || blob.size <= rule.maxFileSize;
  onProgress?.(1);

  return {
    blob,
    size: blob.size,
    pageCount,
    url: URL.createObjectURL(blob),
    withinSize,
  };
}

/** Quick validation without full processing (page limit + size window). */
export function validatePdfMeta(
  size: number,
  pageCount: number,
  rule: UploadRule
): string[] {
  const errors: string[] = [];
  if (rule.maxFileSize && size > rule.maxFileSize) {
    errors.push("The PDF is larger than the allowed maximum size.");
  }
  if (rule.pageLimit && pageCount > rule.pageLimit) {
    errors.push(
      `The PDF has ${pageCount} pages but the limit is ${rule.pageLimit}.`
    );
  }
  return errors;
}
