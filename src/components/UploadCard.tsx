"use client";

import { useCallback, useRef, useState } from "react";
import type { ResolvedRequirement } from "@/lib/types";
import { processImage } from "@/lib/imageProcessor";
import { processPdf } from "@/lib/pdfProcessor";
import {
  validateImage,
  validatePdf,
  allChecksPass,
  describeRule,
  type ValidationCheck,
} from "@/lib/validation";
import { formatBytes, mimeToLabel } from "@/lib/format";
import { UploadIcon, CheckIcon, AlertIcon, DownloadIcon } from "./icons";
import { downloadBlob } from "@/lib/zip";

export interface PreparedFile {
  requirementId: string;
  documentName: string;
  blob: Blob;
  extension: string;
  /** Native format of the prepared blob, for download-time conversion. */
  sourceKind: "image" | "pdf";
  checks: ValidationCheck[];
  valid: boolean;
}

export function UploadCard({
  requirement,
  onPrepared,
  onCleared,
}: {
  requirement: ResolvedRequirement;
  onPrepared: (file: PreparedFile) => void;
  onCleared: (requirementId: string) => void;
}) {
  const rule = requirement.uploadRule!;
  const inputRef = useRef<HTMLInputElement>(null);
  const [status, setStatus] = useState<
    "idle" | "processing" | "done" | "error"
  >("idle");
  const [progress, setProgress] = useState(0);
  const [error, setError] = useState<string | null>(null);
  const [preview, setPreview] = useState<{
    url: string;
    size: number;
    mime: string;
    width?: number;
    height?: number;
    origSize: number;
    origType: string;
    checks: ValidationCheck[];
    valid: boolean;
    blob: Blob;
    extension: string;
  } | null>(null);

  const specLines = describeRule(rule);

  const handleFile = useCallback(
    async (file: File) => {
      setError(null);
      setStatus("processing");
      setProgress(0.02);

      try {
        // Basic format guard with a friendly message.
        const accepted = rule.acceptedFormats;
        const fileIsImage = file.type.startsWith("image/");
        const fileIsPdf = file.type === "application/pdf";

        // Decide how to process this file. "document" rules accept either an
        // image or a PDF and process based on what the user actually uploaded.
        let processAs: "image" | "pdf";
        if (rule.kind === "image") {
          if (!fileIsImage) {
            throw new Error("Please upload an image file (JPG or PNG).");
          }
          processAs = "image";
        } else if (rule.kind === "pdf") {
          if (!fileIsPdf) {
            throw new Error("Please upload a PDF file for this document.");
          }
          processAs = "pdf";
        } else {
          // document rule: accept image or PDF
          if (fileIsPdf) processAs = "pdf";
          else if (fileIsImage) processAs = "image";
          else {
            throw new Error(
              "Please upload a PDF or an image (JPG or PNG) for this document."
            );
          }
        }

        if (processAs === "image") {
          const result = await processImage(file, {
            rule,
            onProgress: setProgress,
          });
          const checks = validateImage(
            {
              mime: result.mime,
              width: result.width,
              height: result.height,
              size: result.size,
            },
            rule
          );
          const valid = allChecksPass(checks);
          const extension = result.mime === "image/png" ? "png" : "jpg";
          setPreview({
            url: result.url,
            size: result.size,
            mime: result.mime,
            width: result.width,
            height: result.height,
            origSize: file.size,
            origType: file.type,
            checks,
            valid,
            blob: result.blob,
            extension,
          });
          onPrepared({
            requirementId: requirement.id,
            documentName: requirement.documentName,
            blob: result.blob,
            extension,
            sourceKind: "image",
            checks,
            valid,
          });
        } else {
          const result = await processPdf(file, rule, setProgress);
          const checks = validatePdf(result.size, result.pageCount, rule);
          const valid = allChecksPass(checks);
          setPreview({
            url: result.url,
            size: result.size,
            mime: "application/pdf",
            origSize: file.size,
            origType: file.type,
            checks,
            valid,
            blob: result.blob,
            extension: "pdf",
          });
          onPrepared({
            requirementId: requirement.id,
            documentName: requirement.documentName,
            blob: result.blob,
            extension: "pdf",
            sourceKind: "pdf",
            checks,
            valid,
          });
        }

        setStatus("done");
        setProgress(1);
        void accepted;
      } catch (e) {
        setStatus("error");
        setError(
          e instanceof Error
            ? e.message
            : "Something went wrong while preparing this file."
        );
      }
    },
    [rule, requirement.id, requirement.documentName, onPrepared]
  );

  function reset() {
    if (preview) URL.revokeObjectURL(preview.url);
    setPreview(null);
    setStatus("idle");
    setProgress(0);
    setError(null);
    onCleared(requirement.id);
    if (inputRef.current) inputRef.current.value = "";
  }

  return (
    <div className="card p-5">
      <div className="flex items-start justify-between gap-3">
        <div className="min-w-0">
          <h4 className="break-words font-semibold text-slate-900">
            {requirement.documentName}
          </h4>
          {requirement.description && (
            <p className="mt-1 text-sm text-slate-600">
              {requirement.description}
            </p>
          )}
        </div>
        {requirement.necessity === "optional" ? (
          <span className="badge-optional shrink-0 whitespace-nowrap">
            Optional
          </span>
        ) : requirement.necessity === "conditional" ? (
          <span className="badge-conditional shrink-0 whitespace-nowrap">
            Required if applicable
          </span>
        ) : (
          <span className="badge-required shrink-0 whitespace-nowrap">
            Required
          </span>
        )}
      </div>

      <ul className="mt-3 flex flex-wrap gap-x-4 gap-y-1 text-xs text-slate-500">
        {specLines.map((line) => (
          <li key={line}>{line}</li>
        ))}
      </ul>
      {rule.notes && (
        <p className="mt-2 text-xs text-slate-400">{rule.notes}</p>
      )}

      <input
        ref={inputRef}
        type="file"
        accept={rule.acceptedFormats.join(",")}
        className="sr-only"
        aria-label={`Upload ${requirement.documentName}`}
        onChange={(e) => {
          const f = e.target.files?.[0];
          if (f) void handleFile(f);
        }}
      />

      {/* Idle / upload button */}
      {status === "idle" && (
        <button
          type="button"
          onClick={() => inputRef.current?.click()}
          className="btn-secondary mt-4 w-full border-dashed py-6 text-slate-600"
        >
          <UploadIcon className="h-5 w-5" />
          Upload {requirement.role === "photograph" ? "Photo" : "File"}
        </button>
      )}

      {/* Processing */}
      {status === "processing" && (
        <div className="mt-4">
          <div className="flex items-center justify-between text-sm text-slate-600">
            <span>Preparing your file…</span>
            <span>{Math.round(progress * 100)}%</span>
          </div>
          <div className="mt-2 h-2 overflow-hidden rounded-full bg-slate-100">
            <div
              className="h-full rounded-full bg-brand-600 transition-all"
              style={{ width: `${Math.max(5, progress * 100)}%` }}
            />
          </div>
        </div>
      )}

      {/* Error */}
      {status === "error" && (
        <div className="mt-4 rounded-xl bg-red-50 p-4 text-sm text-red-700 ring-1 ring-red-200">
          <div className="flex items-start gap-2">
            <AlertIcon className="mt-0.5 h-4 w-4 shrink-0" />
            <p>{error}</p>
          </div>
          <button
            type="button"
            onClick={() => inputRef.current?.click()}
            className="btn-secondary mt-3 py-2 text-xs"
          >
            Try another file
          </button>
        </div>
      )}

      {/* Result */}
      {status === "done" && preview && (
        <div className="mt-4">
          <div className="flex flex-col gap-4 sm:flex-row">
            <div className="shrink-0">
              {preview.mime === "application/pdf" ? (
                <div className="grid h-28 w-28 place-items-center rounded-xl bg-slate-100 text-xs font-semibold text-slate-500">
                  PDF
                </div>
              ) : (
                // eslint-disable-next-line @next/next/no-img-element
                <img
                  src={preview.url}
                  alt={`Prepared ${requirement.documentName}`}
                  className="h-28 w-28 rounded-xl border border-slate-200 object-cover"
                />
              )}
            </div>

            <div className="min-w-0 flex-1">
              <p className="text-xs text-slate-500">
                {formatBytes(preview.origSize, 1)}{" "}
                {mimeToLabel(preview.origType)} →{" "}
                <span className="font-semibold text-slate-700">
                  {formatBytes(preview.size, 1)} {mimeToLabel(preview.mime)}
                  {preview.width
                    ? ` · ${preview.width}×${preview.height}`
                    : ""}
                </span>
              </p>
              <ul className="mt-2 space-y-1">
                {preview.checks.map((c) => (
                  <li
                    key={c.label}
                    className={`flex items-center gap-2 text-sm ${
                      c.ok ? "text-emerald-700" : "text-red-700"
                    }`}
                  >
                    {c.ok ? (
                      <CheckIcon className="h-4 w-4" />
                    ) : (
                      <AlertIcon className="h-4 w-4" />
                    )}
                    <span>
                      {c.label} {c.ok ? "correct" : "issue"}
                      {c.detail ? ` — ${c.detail}` : ""}
                    </span>
                  </li>
                ))}
              </ul>

              {!preview.valid && (
                <p className="mt-2 text-xs text-amber-700">
                  Some checks did not pass. Try a higher-quality original image
                  for best results.
                </p>
              )}

              <div className="mt-3 flex flex-wrap gap-2">
                <button
                  type="button"
                  onClick={() =>
                    downloadBlob(
                      preview.blob,
                      `${requirement.documentName}.${preview.extension}`
                    )
                  }
                  className="btn-secondary py-2 text-xs"
                >
                  <DownloadIcon className="h-4 w-4" /> Download
                </button>
                <button
                  type="button"
                  onClick={reset}
                  className="btn-secondary py-2 text-xs"
                >
                  Replace file
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
