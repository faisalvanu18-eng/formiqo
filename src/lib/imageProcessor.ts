/**
 * Client-side image processing.
 *
 * All work happens in the browser using <canvas>. Files are never uploaded to
 * a server. The pipeline: decode -> (optional) crop to aspect ratio -> resize
 * to target/allowed dimensions -> encode + binary-search JPEG quality to land
 * inside the required file-size window -> validate.
 */
import type { UploadRule } from "./types";

export interface ProcessedImage {
  blob: Blob;
  mime: string;
  width: number;
  height: number;
  size: number;
  /** Object URL for preview (caller should revoke when done). */
  url: string;
}

export interface ImageProcessOptions {
  rule: UploadRule;
  /** Optional progress callback 0..1 for UI feedback. */
  onProgress?: (fraction: number) => void;
}

/** Load a File/Blob into an HTMLImageElement. */
function loadImage(file: Blob): Promise<HTMLImageElement> {
  return new Promise((resolve, reject) => {
    const url = URL.createObjectURL(file);
    const img = new Image();
    img.onload = () => {
      URL.revokeObjectURL(url);
      resolve(img);
    };
    img.onerror = () => {
      URL.revokeObjectURL(url);
      reject(
        new Error(
          "We couldn't read this image. It may be corrupted or in an unsupported format."
        )
      );
    };
    img.src = url;
  });
}

/**
 * Compute the target draw dimensions for the source image given the rule.
 * Honours exact dimensions, aspect ratio, and min/max width/height bounds.
 */
function computeTargetDimensions(
  srcW: number,
  srcH: number,
  rule: UploadRule
): { drawW: number; drawH: number; cropAspect?: number } {
  // Exact required dimensions win.
  if (rule.requiredWidth && rule.requiredHeight) {
    return {
      drawW: rule.requiredWidth,
      drawH: rule.requiredHeight,
      cropAspect: rule.requiredWidth / rule.requiredHeight,
    };
  }

  let drawW = srcW;
  let drawH = srcH;
  let cropAspect = rule.aspectRatio;

  // If aspect ratio required, we'll crop to it (handled by caller via cropAspect).
  if (cropAspect) {
    // Fit source into aspect by cropping; keep the larger dimension within bounds.
    // Start from source then clamp below.
    if (srcW / srcH > cropAspect) {
      drawH = srcH;
      drawW = Math.round(srcH * cropAspect);
    } else {
      drawW = srcW;
      drawH = Math.round(srcW / cropAspect);
    }
  }

  // Clamp width.
  if (rule.maxWidth && drawW > rule.maxWidth) {
    const scale = rule.maxWidth / drawW;
    drawW = rule.maxWidth;
    drawH = Math.round(drawH * scale);
  }
  if (rule.minWidth && drawW < rule.minWidth) {
    const scale = rule.minWidth / drawW;
    drawW = rule.minWidth;
    drawH = Math.round(drawH * scale);
  }
  // Clamp height.
  if (rule.maxHeight && drawH > rule.maxHeight) {
    const scale = rule.maxHeight / drawH;
    drawH = rule.maxHeight;
    drawW = Math.round(drawW * scale);
  }
  if (rule.minHeight && drawH < rule.minHeight) {
    const scale = rule.minHeight / drawH;
    drawH = rule.minHeight;
    drawW = Math.round(drawW * scale);
  }

  return { drawW: Math.max(1, drawW), drawH: Math.max(1, drawH), cropAspect };
}

/** Draw the source image into a canvas at target size, cropping if needed. */
function drawToCanvas(
  img: HTMLImageElement,
  drawW: number,
  drawH: number,
  cropAspect?: number
): HTMLCanvasElement {
  const canvas = document.createElement("canvas");
  canvas.width = drawW;
  canvas.height = drawH;
  const ctx = canvas.getContext("2d");
  if (!ctx) throw new Error("Your browser could not create a drawing canvas.");

  // White background so transparent PNGs convert cleanly to JPEG.
  ctx.fillStyle = "#ffffff";
  ctx.fillRect(0, 0, drawW, drawH);
  ctx.imageSmoothingEnabled = true;
  ctx.imageSmoothingQuality = "high";

  const srcW = img.naturalWidth;
  const srcH = img.naturalHeight;

  if (cropAspect) {
    // Centre-crop the source to the target aspect ratio.
    let sx = 0;
    let sy = 0;
    let sw = srcW;
    let sh = srcH;
    if (srcW / srcH > cropAspect) {
      sw = Math.round(srcH * cropAspect);
      sx = Math.round((srcW - sw) / 2);
    } else {
      sh = Math.round(srcW / cropAspect);
      sy = Math.round((srcH - sh) / 2);
    }
    ctx.drawImage(img, sx, sy, sw, sh, 0, 0, drawW, drawH);
  } else {
    ctx.drawImage(img, 0, 0, drawW, drawH);
  }
  return canvas;
}

function canvasToBlob(
  canvas: HTMLCanvasElement,
  mime: string,
  quality: number
): Promise<Blob> {
  return new Promise((resolve, reject) => {
    canvas.toBlob(
      (blob) => {
        if (blob) resolve(blob);
        else reject(new Error("Image encoding failed in this browser."));
      },
      mime,
      quality
    );
  });
}

/**
 * Encode the canvas targeting the required file-size window.
 * Uses a binary search over JPEG/WebP quality to land under maxFileSize while
 * staying above minFileSize where possible. If still too large at low quality,
 * progressively downscales the canvas.
 */
async function encodeToTargetSize(
  canvas: HTMLCanvasElement,
  mime: string,
  rule: UploadRule,
  onProgress?: (f: number) => void
): Promise<Blob> {
  const supportsQuality = mime === "image/jpeg" || mime === "image/webp";
  const maxSize = rule.maxFileSize;
  const minSize = rule.minFileSize;

  if (!supportsQuality) {
    // PNG etc. — no quality param. Return as-is (downscale handled elsewhere).
    return canvasToBlob(canvas, mime, 1);
  }

  let working = canvas;
  let best: Blob | null = null;

  for (let attempt = 0; attempt < 6; attempt++) {
    let lo = 0.3;
    let hi = 0.95;
    let candidate = await canvasToBlob(working, mime, hi);

    // Binary search quality to fit under maxSize.
    if (maxSize && candidate.size > maxSize) {
      for (let i = 0; i < 8; i++) {
        const mid = (lo + hi) / 2;
        const blob = await canvasToBlob(working, mime, mid);
        onProgress?.(Math.min(0.95, 0.4 + (i + attempt * 8) * 0.05));
        if (blob.size > maxSize) {
          hi = mid;
        } else {
          candidate = blob;
          lo = mid;
        }
      }
    } else {
      candidate = await canvasToBlob(working, mime, hi);
    }

    best = candidate;

    // Fits the window (or no max defined) — done.
    if (!maxSize || candidate.size <= maxSize) {
      // If below minSize, try to raise quality/size a little.
      if (minSize && candidate.size < minSize) {
        const boosted = await canvasToBlob(working, mime, 0.98);
        if (boosted.size <= (maxSize ?? Infinity)) best = boosted;
      }
      return best;
    }

    // Still too big even at low quality — downscale the canvas by 15% and retry.
    const nw = Math.max(1, Math.round(working.width * 0.85));
    const nh = Math.max(1, Math.round(working.height * 0.85));
    const scaled = document.createElement("canvas");
    scaled.width = nw;
    scaled.height = nh;
    const sctx = scaled.getContext("2d");
    if (!sctx) break;
    sctx.fillStyle = "#ffffff";
    sctx.fillRect(0, 0, nw, nh);
    sctx.imageSmoothingQuality = "high";
    sctx.drawImage(working, 0, 0, nw, nh);
    working = scaled;
  }

  if (!best) throw new Error("Could not compress the image to the required size.");
  return best;
}

/**
 * Main entry point: process a user image against an UploadRule.
 * Returns a prepared blob plus metadata and a preview URL.
 */
export async function processImage(
  file: File,
  { rule, onProgress }: ImageProcessOptions
): Promise<ProcessedImage> {
  onProgress?.(0.05);
  const img = await loadImage(file);
  onProgress?.(0.25);

  const { drawW, drawH, cropAspect } = computeTargetDimensions(
    img.naturalWidth,
    img.naturalHeight,
    rule
  );

  const canvas = drawToCanvas(img, drawW, drawH, cropAspect);
  onProgress?.(0.4);

  const targetMime = rule.targetFormat || "image/jpeg";
  const blob = await encodeToTargetSize(canvas, targetMime, rule, onProgress);
  onProgress?.(1);

  return {
    blob,
    mime: targetMime,
    width: canvas.width,
    height: canvas.height,
    size: blob.size,
    url: URL.createObjectURL(blob),
  };
}
