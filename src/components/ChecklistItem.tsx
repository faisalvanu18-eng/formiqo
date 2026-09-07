import type { ResolvedRequirement } from "@/lib/types";
import { CheckIcon } from "./icons";

/**
 * A single document in the personalized checklist.
 *
 * The officially accepted alternatives are shown inline (always visible) so the
 * user can immediately see exactly what documents they can use for this
 * requirement — no extra clicks and nowhere else to go.
 */
export function ChecklistItem({ requirement }: { requirement: ResolvedRequirement }) {
  const hasAlternatives =
    requirement.alternatives && requirement.alternatives.length > 0;

  return (
    <div className="rounded-xl border border-slate-200 p-4">
      <div className="flex items-start justify-between gap-3">
        <div className="min-w-0">
          <div className="flex items-center gap-2">
            <span className="grid h-5 w-5 shrink-0 place-items-center rounded-full bg-brand-50 text-brand-600">
              <CheckIcon className="h-3 w-3" />
            </span>
            <h4 className="min-w-0 break-words font-medium text-slate-900">
              {requirement.documentName}
            </h4>
          </div>
          {requirement.description && (
            <p className="ml-7 mt-1 text-sm text-slate-600">
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

      {hasAlternatives && (
        <div className="ml-7 mt-3 rounded-lg bg-slate-50 p-3">
          <p className="text-xs font-semibold uppercase tracking-wide text-slate-500">
            Use any one of these
          </p>
          <ul className="mt-2 grid gap-1.5 sm:grid-cols-2">
            {requirement.alternatives!.map((alt) => (
              <li
                key={alt}
                className="flex items-start gap-2 text-sm text-slate-700"
              >
                <span className="mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full bg-brand-400" />
                <span className="min-w-0 break-words">{alt}</span>
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
}
