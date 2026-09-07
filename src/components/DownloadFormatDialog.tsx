"use client";

import { useEffect, useRef } from "react";
import { DownloadIcon, ImageIcon, PdfIcon } from "./icons";
import type { DownloadFormat } from "@/lib/formatConvert";

/**
 * Mobile-friendly popup that lets the user choose the download format
 * (image or PDF) before downloading. Each prepared file is then downloaded
 * separately, named after its document (handled by the caller).
 */
export function DownloadFormatDialog({
  open,
  fileCount,
  busy,
  progressLabel,
  onChoose,
  onClose,
}: {
  open: boolean;
  fileCount: number;
  busy: boolean;
  progressLabel?: string | null;
  onChoose: (format: DownloadFormat) => void;
  onClose: () => void;
}) {
  const panelRef = useRef<HTMLDivElement>(null);

  // Close on Escape.
  useEffect(() => {
    if (!open) return;
    function onKey(e: KeyboardEvent) {
      if (e.key === "Escape" && !busy) onClose();
    }
    document.addEventListener("keydown", onKey);
    return () => document.removeEventListener("keydown", onKey);
  }, [open, busy, onClose]);

  if (!open) return null;

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-label="Choose download format"
      className="fixed inset-0 z-[60] flex items-end justify-center bg-slate-900/40 p-0 backdrop-blur-sm sm:items-center sm:p-4"
      onMouseDown={(e) => {
        // Click outside the panel closes (unless busy).
        if (e.target === e.currentTarget && !busy) onClose();
      }}
    >
      <div
        ref={panelRef}
        className="w-full max-w-md rounded-t-2xl bg-white p-6 shadow-cardhover sm:rounded-2xl"
      >
        <div className="flex items-start justify-between gap-3">
          <div>
            <h2 className="text-lg font-bold text-slate-900">
              Choose download format
            </h2>
            <p className="mt-1 text-sm text-slate-600">
              We&apos;ll download {fileCount} file
              {fileCount === 1 ? "" : "s"} separately, each named after its
              document.
            </p>
          </div>
          <button
            type="button"
            onClick={onClose}
            disabled={busy}
            aria-label="Close"
            className="grid h-9 w-9 shrink-0 place-items-center rounded-lg text-slate-500 hover:bg-slate-100 disabled:opacity-40"
          >
            <svg
              className="h-5 w-5"
              fill="none"
              stroke="currentColor"
              strokeWidth={2}
              viewBox="0 0 24 24"
              aria-hidden="true"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M6 18L18 6M6 6l12 12"
              />
            </svg>
          </button>
        </div>

        <div className="mt-5 grid grid-cols-2 gap-3">
          <button
            type="button"
            disabled={busy}
            onClick={() => onChoose("image")}
            className="flex flex-col items-center gap-2 rounded-2xl border border-slate-200 p-5 text-center transition hover:border-brand-400 hover:bg-brand-50 disabled:cursor-not-allowed disabled:opacity-50"
          >
            <span className="grid h-11 w-11 place-items-center rounded-xl bg-brand-50 text-brand-600">
              <ImageIcon className="h-6 w-6" />
            </span>
            <span className="font-semibold text-slate-900">Image (JPG)</span>
            <span className="text-xs text-slate-500">
              Best for photos &amp; signatures
            </span>
          </button>

          <button
            type="button"
            disabled={busy}
            onClick={() => onChoose("pdf")}
            className="flex flex-col items-center gap-2 rounded-2xl border border-slate-200 p-5 text-center transition hover:border-brand-400 hover:bg-brand-50 disabled:cursor-not-allowed disabled:opacity-50"
          >
            <span className="grid h-11 w-11 place-items-center rounded-xl bg-brand-50 text-brand-600">
              <PdfIcon className="h-6 w-6" />
            </span>
            <span className="font-semibold text-slate-900">PDF</span>
            <span className="text-xs text-slate-500">
              Best for certificates &amp; proofs
            </span>
          </button>
        </div>

        {busy && (
          <div className="mt-5">
            <div className="flex items-center justify-between text-sm text-slate-600">
              <span className="inline-flex items-center gap-2">
                <DownloadIcon className="h-4 w-4" />
                {progressLabel ?? "Preparing your downloads…"}
              </span>
            </div>
            <div className="mt-2 h-1.5 overflow-hidden rounded-full bg-slate-100">
              <div className="h-full w-1/3 animate-loading-bar rounded-full bg-brand-600" />
            </div>
          </div>
        )}

        <p className="mt-4 text-center text-xs text-slate-400">
          Files are prepared in your browser. Nothing is uploaded to a server.
        </p>
      </div>
    </div>
  );
}
