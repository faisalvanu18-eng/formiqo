/** Formatting helpers shared across UI and processing. */

/** Human readable file size from bytes. */
export function formatBytes(bytes: number, decimals = 0): string {
  if (!bytes || bytes < 0) return "0 KB";
  const k = 1024;
  if (bytes < k) return `${bytes} B`;
  const sizes = ["B", "KB", "MB", "GB"];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  const value = bytes / Math.pow(k, i);
  const dm = i >= 2 ? Math.max(decimals, 1) : decimals;
  return `${value.toFixed(dm)} ${sizes[i]}`;
}

/** Format an ISO date (YYYY-MM-DD) as a readable date, else return as-is. */
export function formatDate(iso?: string): string {
  if (!iso) return "Not verified";
  const d = new Date(iso);
  if (isNaN(d.getTime())) return iso;
  return d.toLocaleDateString("en-IN", {
    year: "numeric",
    month: "short",
    day: "numeric",
  });
}

/** Turn a mime type into a short label, e.g. "image/jpeg" -> "JPG". */
export function mimeToLabel(mime: string): string {
  const map: Record<string, string> = {
    "image/jpeg": "JPG",
    "image/jpg": "JPG",
    "image/png": "PNG",
    "image/webp": "WEBP",
    "application/pdf": "PDF",
  };
  return map[mime] ?? mime.toUpperCase();
}

/** Safe filename fragment from arbitrary text. */
export function safeFileName(text: string): string {
  return text
    .replace(/[^a-zA-Z0-9]+/g, "_")
    .replace(/^_+|_+$/g, "")
    .slice(0, 60);
}
