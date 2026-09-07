import { CheckIcon } from "./icons";

/**
 * All possible flow steps, keyed by the internal step index used in FormFlow
 * (0 = Form, 1 = Questions, 2 = Documents, 3 = Prepare Files, 4 = Ready).
 */
const ALL_STEPS = [
  { index: 0, label: "Form" },
  { index: 1, label: "Questions" },
  { index: 2, label: "Documents" },
  { index: 3, label: "Prepare Files" },
  { index: 4, label: "Ready" },
] as const;

/** Labels still exported for any other consumers. */
export const FLOW_STEPS = ALL_STEPS.map((s) => s.label);

/**
 * Progress indicator for the form flow.
 *
 * `current` is the internal step index (0–4). Forms without questions skip
 * step 1, so we build the list of *visible* steps from `hasQuestions` and map
 * the current index onto that list. This keeps the "Step X of N" count and the
 * bar accurate (e.g. a question-less form is 4 steps, not 5).
 *
 * - Mobile: compact "Step X of N" + label with a slim progress bar.
 * - >= sm: full horizontal stepper with numbered/checked circles.
 */
export function ProgressStepper({
  current,
  hasQuestions = true,
}: {
  current: number;
  hasQuestions?: boolean;
}) {
  // Visible steps for this specific form.
  const steps = ALL_STEPS.filter((s) => hasQuestions || s.index !== 1);
  const total = steps.length;

  // Position of the current internal step within the visible list.
  let position = steps.findIndex((s) => s.index === current);
  if (position < 0) {
    // Current index isn't a visible step (shouldn't happen) — approximate by
    // counting how many visible steps come at or before it.
    position = Math.max(
      0,
      steps.filter((s) => s.index <= current).length - 1
    );
  }
  const clamped = Math.min(Math.max(position, 0), total - 1);
  const pct = ((clamped + 1) / total) * 100;

  return (
    <div>
      {/* Compact mobile view */}
      <div className="sm:hidden" aria-label="Progress">
        <div className="flex items-center justify-between text-sm">
          <span className="font-semibold text-brand-700">
            Step {clamped + 1} of {total}
          </span>
          <span className="font-medium text-slate-600">
            {steps[clamped].label}
          </span>
        </div>
        <div className="mt-2 h-1.5 overflow-hidden rounded-full bg-slate-100">
          <div
            className="h-full rounded-full bg-brand-600 transition-all duration-300"
            style={{ width: `${pct}%` }}
          />
        </div>
      </div>

      {/* Full desktop view */}
      <ol className="hidden items-center gap-1 sm:flex" aria-label="Progress">
        {steps.map((s, i) => {
          const done = i < clamped;
          const activeStep = i === clamped;
          return (
            <li key={s.label} className="flex min-w-0 items-center gap-1">
              <span
                className={`flex items-center gap-2 rounded-full px-3 py-1.5 text-xs font-medium ${
                  activeStep
                    ? "bg-brand-600 text-white"
                    : done
                    ? "bg-brand-50 text-brand-700"
                    : "bg-slate-100 text-slate-500"
                }`}
                aria-current={activeStep ? "step" : undefined}
              >
                <span
                  className={`grid h-5 w-5 shrink-0 place-items-center rounded-full text-[10px] ${
                    activeStep
                      ? "bg-white/25"
                      : done
                      ? "bg-brand-600 text-white"
                      : "bg-slate-300 text-white"
                  }`}
                >
                  {done ? <CheckIcon className="h-3 w-3" /> : i + 1}
                </span>
                <span className="whitespace-nowrap">{s.label}</span>
              </span>
              {i < total - 1 && (
                <span
                  className="h-px w-4 shrink-0 bg-slate-200"
                  aria-hidden="true"
                />
              )}
            </li>
          );
        })}
      </ol>
    </div>
  );
}
