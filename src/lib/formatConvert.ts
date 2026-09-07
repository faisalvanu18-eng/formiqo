/**
 * Format conversion helpers used by the download flow.
 *
 * A prepared document is stored as its "native" blob (an image for
 * photo/signature style rules, a PDF for document rules). At download time the
 * user can choose to receive every file as an IMAGE (JPG) or as a PDF. These
 * helpers convert between the two, entirely in the browser:
 *
 *   - imageBlobToPdf: embeds a JPG/PNG into a single-page PDF (pdf-lib).
 *   - pdfBlobToImage: renders the first page of a PDF to a JPG (pdf.js).
 *
 * Both are lazy about their heavy dependency imports so they don't bloat the
 * initial page bundle.
 */
import { PDFDocument } from "pdf-lib";

export type DownloadFormat = "image" | "pdf";

/** Extension for a given output format (images normalise to jpg). */
export function extensionFor(format: DownloadFormat): string {
  return format === "pdf" ? "pdf" : "jpg";
}

/** MIME for a given output format. */
export function mimeFor(format: DownloadFormat): string {
  return format === "pdf" ? "application/pdf" : "image/jpeg";
}

/** Wrap an image blob (JPEG/PNG) into a single-page PDF sized to the image. */
export async function imageBlobToPdf(imageBlob: Blob): Promise<Blob> {
  const bytes = new Uint8Array(await imageBlob.arrayBuffer());
  const pdf = await PDFDocument.create();

  const isPng = imageBlob.type.includes("png");
  const embedded = isPng
    ? await pdf.embedPng(bytes)
    : await pdf.embedJpg(bytes);

  const page = pdf.addPage([embedded.width, embedded.height]);
  page.drawImage(embedded, {
    x: 0,
    y: 0,
    width: embedded.width,
    height: embedded.height,
  });

  const out = await pdf.save();
  return new Blob([out], { type: "application/pdf" });
}

/**
 * Render the first page of a PDF to a JPEG blob using pdf.js.
 * Uses a scale that keeps the output reasonably crisp without being huge.
 */
export async function pdfBlobToImage(
  pdfBlob: Blob,
  scale = 2
): Promise<Blob> {
  // Lazy-load pdf.js only when a PDF actually needs rasterising.
  const pdfjs = await import("pdfjs-dist");
  // Reference the worker as a static file served from /public. Using a plain
  // string (not new URL(...)) prevents webpack from trying to bundle/minify
  // the worker, which breaks the Next.js build.
  pdfjs.GlobalWorkerOptions.workerSrc = "/pdf.worker.min.mjs";

  const data = new Uint8Array(await pdfBlob.arrayBuffer());
  const doc = await pdfjs.getDocument({ data }).promise;
  const page = await doc.getPage(1);
  const viewport = page.getViewport({ scale });

  const canvas = document.createElement("canvas");
  canvas.width = Math.ceil(viewport.width);
  canvas.height = Math.ceil(viewport.height);
  const ctx = canvas.getContext("2d");
  if (!ctx) throw new Error("Your browser could not create a drawing canvas.");
  // White background for a clean JPEG.
  ctx.fillStyle = "#ffffff";
  ctx.fillRect(0, 0, canvas.width, canvas.height);

  await page.render({ canvasContext: ctx, viewport }).promise;

  const blob: Blob = await new Promise((resolve, reject) => {
    canvas.toBlob(
      (b) => (b ? resolve(b) : reject(new Error("Image encoding failed."))),
      "image/jpeg",
      0.92
    );
  });
  return blob;
}

/**
 * Convert a prepared file's blob to the requested download format.
 * - If it's already in the requested format, returns it unchanged.
 * - image -> pdf and pdf -> image are handled; anything else returns as-is.
 */
export async function convertBlob(
  blob: Blob,
  currentKind: "image" | "pdf",
  target: DownloadFormat
): Promise<Blob> {
  if (currentKind === target) return blob;
  if (currentKind === "image" && target === "pdf") {
    return imageBlobToPdf(blob);
  }
  if (currentKind === "pdf" && target === "image") {
    return pdfBlobToImage(blob);
  }
  return blob;
}
