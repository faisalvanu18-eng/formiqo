"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import type { Answers, FormDefinition, FormVersion } from "@/lib/types";
import {
  getVisibleQuestions,
  resolveRequirements,
  getUploadRequirements,
  groupRequirements,
} from "@/lib/engine";
import { ProgressStepper } from "./ProgressStepper";
import { ChecklistItem } from "./ChecklistItem";
import { UploadCard, type PreparedFile } from "./UploadCard";
import { TrustIndicators } from "./TrustIndicators";
import {
  ArrowRightIcon,
  CheckIcon,
  AlertIcon,
  DownloadIcon,
  ExternalIcon,
} from "./icons";
import { downloadBlob } from "@/lib/zip";
import { safeFileName } from "@/lib/format";
import { DownloadFormatDialog } from "./DownloadFormatDialog";
import {
  convertBlob,
  extensionFor,
  type DownloadFormat,
} from "@/lib/formatConvert";

type Step = 0 | 1 | 2 | 3 | 4; // Form, Questions, Documents, Prepare, Ready

export function FormFlow({
  form,
  version,
}: {
  form: FormDefinition;
  version: FormVersion;
}) {
  // Initialise answers with question defaults.
  const initialAnswers = useMemo<Answers>(() => {
    const a: Answers = {};
    for (const q of version.questions) {
      if (q.defaultValue) a[q.id] = q.defaultValue;
    }
    return a;
  }, [version.questions]);

  const [step, setStep] = useState<Step>(0);
  const [answers, setAnswers] = useState<Answers>(initialAnswers);
  const [prepared, setPrepared] = useState<Record<string, PreparedFile>>({});
  const [downloadOpen, setDownloadOpen] = useState(false);
  const [downloadBusy, setDownloadBusy] = useState(false);
  const [downloadLabel, setDownloadLabel] = useState<string | null>(null);

  // Anchor at the top of the flow so we can scroll to it on step changes.
  const topRef = useRef<HTMLDivElement>(null);
  const isFirstStepRender = useRef(true);

  // Whenever the step changes, bring the top of the flow into view so the user
  // starts reading the new step from its beginning (e.g. the upload section)
  // instead of staying scrolled at the previous position. Skipped on the very
  // first render so we don't yank the page down on load.
  useEffect(() => {
    if (isFirstStepRender.current) {
      isFirstStepRender.current = false;
      return;
    }
    topRef.current?.scrollIntoView({ behavior: "smooth", block: "start" });
  }, [step]);

  /**
   * Sync the multi-step flow with browser history so the device/browser Back
   * button walks back through the steps instead of leaving the page.
   *
   * On mount we tag the CURRENT history entry as step 0 (replaceState). Every
   * forward move pushes a new entry tagged with its step. Pressing Back fires
   * `popstate` and we restore the step from the entry we land on. Because step
   * 0 is tagged too, Back keeps walking the steps until the user goes *before*
   * the form (an earlier page), at which point the browser leaves naturally.
   */
  useEffect(() => {
    if (typeof window === "undefined") return;

    // Tag the entry that represents "arrived at the form" as step 0, without
    // adding a new history entry.
    if ((window.history.state as { formStep?: number } | null)?.formStep == null) {
      window.history.replaceState(
        { ...(window.history.state ?? {}), formStep: 0 },
        ""
      );
    }

    function onPopState(e: PopStateEvent) {
      const s = (e.state as { formStep?: number } | null)?.formStep;
      // Any entry we land on within the form is tagged; default to step 0 so
      // the flow can never get visually stuck on an old step.
      const next = typeof s === "number" ? s : 0;
      setStep(Math.min(Math.max(next, 0), 4) as Step);
    }
    window.addEventListener("popstate", onPopState);
    return () => window.removeEventListener("popstate", onPopState);
  }, []);

  // Move forward to a step and record it in history so Back returns here.
  function goToStep(next: Step) {
    if (next === step) return;
    if (next > step && typeof window !== "undefined") {
      window.history.pushState({ formStep: next }, "");
    }
    setStep(next);
  }

  // Go back one logical step. Uses history.back() so the browser Back button
  // and the on-screen Back button behave identically; the popstate handler
  // restores the step.
  function goBackTo(prev: Step) {
    if (typeof window !== "undefined") {
      window.history.back();
    } else {
      setStep(prev);
    }
  }

  const visibleQuestions = useMemo(
    () => getVisibleQuestions(version, answers),
    [version, answers]
  );
  const resolved = useMemo(
    () => resolveRequirements(version, answers),
    [version, answers]
  );
  const grouped = useMemo(() => groupRequirements(resolved), [resolved]);
  const uploadReqs = useMemo(
    () => getUploadRequirements(version, answers),
    [version, answers]
  );

  const hasQuestions = version.questions.length > 0;

  function setAnswer(id: string, value: string) {
    setAnswers((prev) => ({ ...prev, [id]: value }));
  }

  function onPrepared(file: PreparedFile) {
    setPrepared((prev) => ({ ...prev, [file.requirementId]: file }));
  }
  function onCleared(reqId: string) {
    setPrepared((prev) => {
      const next = { ...prev };
      delete next[reqId];
      return next;
    });
  }

  const preparedList = Object.values(prepared);
  const allUploaded =
    uploadReqs.length > 0 &&
    uploadReqs.every((r) => prepared[r.id]);
  const allValid =
    allUploaded && uploadReqs.every((r) => prepared[r.id]?.valid);

  async function handleDownloadWithFormat(format: DownloadFormat) {
    const files = uploadReqs
      .map((r) => prepared[r.id])
      .filter(Boolean) as PreparedFile[];

    setDownloadBusy(true);
    const ext = extensionFor(format);
    const usedNames = new Set<string>();

    try {
      for (let i = 0; i < files.length; i++) {
        const f = files[i];
        setDownloadLabel(
          `Preparing ${f.documentName} (${i + 1} of ${files.length})…`
        );

        // Convert to the chosen format when needed (image <-> pdf).
        const outBlob = await convertBlob(f.blob, f.sourceKind, format);

        // Build a clean, unique filename per document.
        let base = safeFileName(f.documentName) || "Document";
        let name = `${base}.${ext}`;
        let n = 2;
        while (usedNames.has(name)) {
          name = `${base}_${n}.${ext}`;
          n++;
        }
        usedNames.add(name);

        downloadBlob(outBlob, name);
        // Small gap so browsers reliably trigger multiple downloads.
        await new Promise((res) => setTimeout(res, 350));
      }
      setDownloadOpen(false);
    } catch (e) {
      setDownloadLabel(
        e instanceof Error
          ? `Could not prepare downloads: ${e.message}`
          : "Could not prepare downloads."
      );
    } finally {
      setDownloadBusy(false);
      setTimeout(() => setDownloadLabel(null), 400);
    }
  }

  // Steps that can be shown depend on whether the form has questions/uploads.
  function goNextFromForm() {
    goToStep(hasQuestions ? 1 : 2);
  }

  return (
    <div className="space-y-6">
      {/* Scroll target for step changes; scroll-mt clears the sticky header. */}
      <div ref={topRef} className="scroll-mt-24" aria-hidden="true" />
      <ProgressStepper current={step} hasQuestions={hasQuestions} />

      {/* STEP 0: Form overview */}
      {step === 0 && (
        <div className="space-y-6">
          <TrustIndicators version={version} />
          <div className="card p-6">
            <h2 className="break-words text-lg font-semibold text-slate-900">
              Start preparing for {version.label}
            </h2>
            <p className="mt-1 text-sm text-slate-600">
              {hasQuestions
                ? "Answer a few quick questions so we only show the documents that apply to you."
                : "See the documents you need and prepare your files for upload."}
            </p>
            <button onClick={goNextFromForm} className="btn-primary btn-lg mt-4">
              {hasQuestions ? "Answer Questions" : "See My Documents"}
              <ArrowRightIcon className="h-4 w-4" />
            </button>
          </div>
        </div>
      )}

      {/* STEP 1: Questions */}
      {step === 1 && hasQuestions && (
        <div className="card p-6">
          <h2 className="text-lg font-semibold text-slate-900">
            A few quick questions
          </h2>
          <p className="mt-1 text-sm text-slate-600">
            We only ask what can change your required documents.
          </p>

          <div className="mt-6 space-y-6">
            {visibleQuestions.map((q) => (
              <fieldset key={q.id}>
                <legend className="font-medium text-slate-900">{q.label}</legend>
                {q.help && (
                  <p className="mt-1 text-sm text-slate-500">{q.help}</p>
                )}
                <div className="mt-3 grid gap-2 sm:grid-cols-2">
                  {q.options.map((opt) => {
                    const checked = answers[q.id] === opt.value;
                    return (
                      <label
                        key={opt.value}
                        className={`flex cursor-pointer items-center gap-3 rounded-xl border p-3 text-sm ${
                          checked
                            ? "border-brand-500 bg-brand-50"
                            : "border-slate-200 hover:bg-slate-50"
                        }`}
                      >
                        <input
                          type="radio"
                          name={q.id}
                          value={opt.value}
                          checked={checked}
                          onChange={() => setAnswer(q.id, opt.value)}
                          className="h-4 w-4 text-brand-600"
                        />
                        <span className="text-slate-800">{opt.label}</span>
                      </label>
                    );
                  })}
                </div>
              </fieldset>
            ))}
          </div>

          <div className="mt-6 flex justify-between">
            <button onClick={() => goBackTo(0)} className="btn-secondary">
              Back
            </button>
            <button onClick={() => goToStep(2)} className="btn-primary">
              See My Documents <ArrowRightIcon className="h-4 w-4" />
            </button>
          </div>
        </div>
      )}

      {/* STEP 2: Personalized checklist */}
      {step === 2 && (
        <div className="space-y-6">
          <div className="card p-6">
            <h2 className="text-xl font-bold text-slate-900">
              Your Required Documents
            </h2>
            <p className="mt-1 text-sm text-slate-600">
              Based on your answers, here is exactly what you need for{" "}
              {version.label}.
            </p>

            <div className="mt-6 space-y-6">
              {grouped.map((group) => (
                <div key={group.group}>
                  <h3 className="text-sm font-semibold uppercase tracking-wide text-slate-500">
                    {group.group}
                  </h3>
                  <div className="mt-3 space-y-3">
                    {group.items.map((item) => (
                      <ChecklistItem key={item.id} requirement={item} />
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="flex justify-between">
            <button
              onClick={() => goBackTo(hasQuestions ? 1 : 0)}
              className="btn-secondary"
            >
              Back
            </button>
            {uploadReqs.length > 0 ? (
              <button onClick={() => goToStep(3)} className="btn-primary">
                Prepare My Files <ArrowRightIcon className="h-4 w-4" />
              </button>
            ) : (
              <a
                href={version.officialUrl}
                target="_blank"
                rel="noopener noreferrer nofollow"
                className="btn-primary"
              >
                Apply on Official Website <ExternalIcon className="h-4 w-4" />
              </a>
            )}
          </div>
        </div>
      )}

      {/* STEP 3: Prepare files */}
      {step === 3 && (
        <div className="space-y-6">
          <div className="card bg-emerald-50 p-4 text-sm text-emerald-800 ring-1 ring-emerald-200">
            Your files are processed in your browser whenever possible. We do
            not require an account and do not store your documents.
          </div>

          <div className="space-y-4">
            {uploadReqs.map((r) => (
              <UploadCard
                key={r.id}
                requirement={r}
                onPrepared={onPrepared}
                onCleared={onCleared}
              />
            ))}
          </div>

          <div className="flex justify-between">
            <button onClick={() => goBackTo(2)} className="btn-secondary">
              Back
            </button>
            <button
              onClick={() => goToStep(4)}
              disabled={!allUploaded}
              className="btn-primary"
            >
              Final Check <ArrowRightIcon className="h-4 w-4" />
            </button>
          </div>
          {!allUploaded && (
            <p className="text-right text-xs text-slate-500">
              Upload all required files to continue.
            </p>
          )}
        </div>
      )}

      {/* STEP 4: Final check + download */}
      {step === 4 && (
        <div className="space-y-6">
          <div className="card p-6">
            <h2 className="text-xl font-bold text-slate-900">Final Check</h2>
            <ul className="mt-4 space-y-2">
              {uploadReqs.map((r) => {
                const f = prepared[r.id];
                const ok = f?.valid;
                return (
                  <li
                    key={r.id}
                    className={`flex items-center gap-2 text-sm ${
                      ok ? "text-emerald-700" : "text-amber-700"
                    }`}
                  >
                    {ok ? (
                      <CheckIcon className="h-4 w-4" />
                    ) : (
                      <AlertIcon className="h-4 w-4" />
                    )}
                    <span>
                      {r.documentName} — {ok ? "Ready" : "Check the details"}
                    </span>
                  </li>
                );
              })}
            </ul>
          </div>

          {allValid ? (
            <div className="card border-emerald-200 bg-emerald-50 p-6 text-center">
              <h2 className="text-2xl font-bold text-emerald-800">
                Everything is Ready
              </h2>
              <p className="mt-1 text-sm text-emerald-700">
                Your files meet the selected application&apos;s configured
                requirements.
              </p>
            </div>
          ) : (
            <div className="card border-amber-200 bg-amber-50 p-6 text-center">
              <h2 className="text-xl font-bold text-amber-800">
                Almost there
              </h2>
              <p className="mt-1 text-sm text-amber-700">
                Some files did not pass every check. You can still download
                them, but consider re-uploading a higher-quality original.
              </p>
            </div>
          )}

          <div className="grid gap-3 sm:grid-cols-2">
            <button
              onClick={() => setDownloadOpen(true)}
              disabled={preparedList.length === 0}
              className="btn-primary btn-lg"
            >
              <DownloadIcon className="h-5 w-5" />
              Download All Files
            </button>
            <a
              href={version.officialUrl}
              target="_blank"
              rel="noopener noreferrer nofollow"
              className="btn-secondary btn-lg"
            >
              Go to Official Application <ExternalIcon className="h-5 w-5" />
            </a>
          </div>

          <div className="card p-5">
            <h3 className="text-sm font-semibold text-slate-700">
              Download individually
            </h3>
            <div className="mt-3 flex flex-wrap gap-2">
              {preparedList.map((f) => (
                <button
                  key={f.requirementId}
                  onClick={() =>
                    downloadBlob(
                      f.blob,
                      `${safeFileName(f.documentName)}.${f.extension}`
                    )
                  }
                  className="btn-secondary py-2 text-xs"
                >
                  <DownloadIcon className="h-4 w-4" /> {f.documentName}
                </button>
              ))}
            </div>
          </div>

          <p className="text-center text-xs text-slate-500">
            Always verify the final requirements on the official application
            portal before submission.
          </p>

          <div className="flex justify-start">
            <button onClick={() => goBackTo(3)} className="btn-secondary">
              Back
            </button>
          </div>
        </div>
      )}

      <DownloadFormatDialog
        open={downloadOpen}
        fileCount={preparedList.length}
        busy={downloadBusy}
        progressLabel={downloadLabel}
        onChoose={handleDownloadWithFormat}
        onClose={() => {
          if (!downloadBusy) setDownloadOpen(false);
        }}
      />
    </div>
  );
}
