import { Spinner } from "@/components/Spinner";

/**
 * Route-level loading UI shown automatically while the search page and its
 * data resolve. Mobile-friendly: centered content, responsive skeleton grid.
 */
export default function SearchLoading() {
  return (
    <div className="container-page py-10">
      <div className="h-9 w-48 animate-pulse rounded-lg bg-slate-200" />
      <div className="mt-6 h-14 max-w-2xl animate-pulse rounded-2xl bg-slate-200" />

      <div className="mt-8 flex items-center gap-2 text-sm text-slate-500">
        <span className="h-4 w-4 text-brand-600">
          <Spinner className="h-4 w-4" label="Loading search results" />
        </span>
        Loading results…
      </div>

      <div className="mt-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {Array.from({ length: 6 }).map((_, i) => (
          <div
            key={i}
            className="h-32 animate-pulse rounded-2xl border border-slate-200 bg-white"
          />
        ))}
      </div>
    </div>
  );
}
