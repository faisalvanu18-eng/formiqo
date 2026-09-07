import { Spinner } from "@/components/Spinner";

/** Route-level loading UI for the All Forms index. Mobile-friendly skeleton. */
export default function FormsLoading() {
  return (
    <div className="container-page py-10">
      <div className="max-w-2xl">
        <div className="h-9 w-40 animate-pulse rounded-lg bg-slate-200" />
        <div className="mt-3 h-4 w-full animate-pulse rounded bg-slate-200" />
        <div className="mt-2 h-4 w-2/3 animate-pulse rounded bg-slate-200" />
      </div>

      <div className="mt-6 h-12 max-w-2xl animate-pulse rounded-2xl bg-slate-200" />

      <div className="mt-8 flex items-center gap-2 text-sm text-slate-500">
        <span className="h-4 w-4 text-brand-600">
          <Spinner className="h-4 w-4" label="Loading forms" />
        </span>
        Loading forms…
      </div>

      {Array.from({ length: 2 }).map((_, s) => (
        <section key={s} className="mt-10">
          <div className="h-6 w-56 animate-pulse rounded bg-slate-200" />
          <div className="mt-4 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {Array.from({ length: 3 }).map((_, i) => (
              <div
                key={i}
                className="h-32 animate-pulse rounded-2xl border border-slate-200 bg-white"
              />
            ))}
          </div>
        </section>
      ))}
    </div>
  );
}
