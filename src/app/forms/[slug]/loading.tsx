import { Spinner } from "@/components/Spinner";

/**
 * Route-level loading UI for an individual form page. Shown while the form
 * data and interactive flow load. Mobile-friendly, matches the page layout.
 */
export default function FormDetailLoading() {
  return (
    <div className="container-page py-8">
      {/* Breadcrumb / title placeholders */}
      <div className="h-4 w-40 animate-pulse rounded bg-slate-200" />
      <div className="mt-4 h-9 w-3/4 max-w-lg animate-pulse rounded-lg bg-slate-200" />
      <div className="mt-3 h-4 w-full max-w-md animate-pulse rounded bg-slate-200" />

      {/* Stepper placeholder */}
      <div className="mt-6 flex flex-wrap gap-2">
        {Array.from({ length: 4 }).map((_, i) => (
          <div
            key={i}
            className="h-8 w-20 animate-pulse rounded-full bg-slate-200"
          />
        ))}
      </div>

      <div className="mt-6 flex items-center gap-2 text-sm text-slate-500">
        <span className="h-4 w-4 text-brand-600">
          <Spinner className="h-4 w-4" label="Loading form" />
        </span>
        Loading form…
      </div>

      {/* Card placeholder */}
      <div className="mt-4 space-y-4">
        <div className="h-40 animate-pulse rounded-2xl border border-slate-200 bg-white" />
        <div className="h-56 animate-pulse rounded-2xl border border-slate-200 bg-white" />
      </div>
    </div>
  );
}
