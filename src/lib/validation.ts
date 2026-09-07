/**
 * Validation of prepared files against their UploadRule.
 * Produces human-readable checks used in the "Final Check" screen.
 */
import type { UploadRule } from "./types";
import { formatBytes, mimeToLabel } from "./format";

export interface ValidationCheck {
  label: string;
  ok: boolean;
  detail?: string;
}

export interface ImageResult {
  mime: string;
  width: number;
  height: number;
  size: number;
}

const ASPECT_TOLERANCE = 0.06;

export function validateImage(
  result: ImageResult,
  rule: UploadRule
): ValidationCheck[] {
  const checks: ValidationCheck[] = [];

  // Format
  const formatOk =
    rule.acceptedFormats.includes(result.mime) ||
    (rule.targetFormat ? rule.targetFormat === result.mime : false);
  checks.push({
    label: "Format",
    ok: formatOk,
    detail: mimeToLabel(result.mime),
  });

  // File size window
  const underMax = !rule.maxFileSize || result.size <= rule.maxFileSize;
  const overMin = !rule.minFileSize || result.size >= rule.minFileSize;
  checks.push({
    label: "File size",
    ok: underMax && overMin,
    detail: formatBytes(result.size, 1),
  });

  // Exact dimensions
  if (rule.requiredWidth && rule.requiredHeight) {
    const ok =
      result.width === rule.requiredWidth &&
      result.height === rule.requiredHeight;
    checks.push({
      label: "Dimensions",
      ok,
      detail: `${result.width} × ${result.height} px`,
    });
  } else if (rule.aspectRatio) {
    const actual = result.width / result.height;
    const ok = Math.abs(actual - rule.aspectRatio) <= ASPECT_TOLERANCE;
    checks.push({
      label: "Aspect ratio",
      ok,
      detail: `${result.width} × ${result.height} px`,
    });
  } else {
    // Bounds checks if any.
    let ok = true;
    if (rule.minWidth && result.width < rule.minWidth) ok = false;
    if (rule.maxWidth && result.width > rule.maxWidth) ok = false;
    if (rule.minHeight && result.height < rule.minHeight) ok = false;
    if (rule.maxHeight && result.height > rule.maxHeight) ok = false;
    checks.push({
      label: "Dimensions",
      ok,
      detail: `${result.width} × ${result.height} px`,
    });
  }

  return checks;
}

export function validatePdf(
  size: number,
  pageCount: number,
  rule: UploadRule
): ValidationCheck[] {
  const checks: ValidationCheck[] = [];
  checks.push({ label: "Format", ok: true, detail: "PDF" });
  checks.push({
    label: "File size",
    ok: !rule.maxFileSize || size <= rule.maxFileSize,
    detail: formatBytes(size, 1),
  });
  if (rule.pageLimit) {
    checks.push({
      label: "Pages",
      ok: pageCount <= rule.pageLimit,
      detail: `${pageCount} page${pageCount === 1 ? "" : "s"}`,
    });
  }
  return checks;
}

export function allChecksPass(checks: ValidationCheck[]): boolean {
  return checks.every((c) => c.ok);
}

/** Describe a rule in plain language for the upload card. */
export function describeRule(rule: UploadRule): string[] {
  const lines: string[] = [];
  lines.push(
    `Format: ${rule.acceptedFormats.map(mimeToLabel).join(" / ")}`
  );
  if (rule.minFileSize || rule.maxFileSize) {
    const min = rule.minFileSize ? formatBytes(rule.minFileSize) : null;
    const max = rule.maxFileSize ? formatBytes(rule.maxFileSize) : null;
    if (min && max) lines.push(`Size: ${min} – ${max}`);
    else if (max) lines.push(`Max size: ${max}`);
    else if (min) lines.push(`Min size: ${min}`);
  }
  if (rule.requiredWidth && rule.requiredHeight) {
    lines.push(`Dimensions: ${rule.requiredWidth} × ${rule.requiredHeight} px`);
  } else if (rule.aspectRatio) {
    const ratio =
      Math.abs(rule.aspectRatio - 3 / 4) < 0.01
        ? "3:4"
        : Math.abs(rule.aspectRatio - 3) < 0.01
        ? "3:1"
        : rule.aspectRatio.toFixed(2);
    lines.push(`Aspect ratio: ${ratio}`);
  }
  if (rule.pageLimit) lines.push(`Max pages: ${rule.pageLimit}`);
  return lines;
}
