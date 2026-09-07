/**
 * Small, dependency-free loading UI primitives.
 *
 * - `Spinner`: an accessible, CSS-based animated spinner (respects reduced
 *   motion via Tailwind's motion-safe/reduce utilities).
 * - `LoadingOverlay`: a mobile-friendly, centered popup that dims the screen
 *   while something is loading. Safe-area aware and fully responsive.
 */

export function Spinner({
  className = "",
  label = "Loading",
}: {
  className?: string;
  label?: string;
}) {
  return (
    <span
      role="status"
      aria-live="polite"
      aria-label={label}
      className={`inline-block ${className}`}
    >
      <svg
        className="h-full w-full motion-safe:animate-spin"
        viewBox="0 0 24 24"
        fill="none"
        aria-hidden="true"
      >
        <circle
          className="opacity-20"
          cx="12"
          cy="12"
          r="10"
          stroke="currentColor"
          strokeWidth="4"
        />
        <path
          className="opacity-90"
          d="M22 12a10 10 0 0 0-10-10"
          stroke="currentColor"
          strokeWidth="4"
          strokeLinecap="round"
        />
      </svg>
      <span className="sr-only">{label}</span>
    </span>
  );
}

export function LoadingOverlay({
  message = "Loading…",
  subtext,
}: {
  message?: string;
  subtext?: string;
}) {
  return (
    <div
      role="alertdialog"
      aria-busy="true"
      aria-live="assertive"
      aria-label={message}
      className="fixed inset-0 z-[60] flex items-center justify-center bg-slate-900/40 p-4 backdrop-blur-sm"
    >
      <div className="flex w-full max-w-xs flex-col items-center gap-3 rounded-2xl bg-white px-6 py-7 text-center shadow-cardhover">
        <span className="h-9 w-9 text-brand-600">
          <Spinner className="h-9 w-9" label={message} />
        </span>
        <p className="text-sm font-semibold text-slate-900">{message}</p>
        {subtext && <p className="text-xs text-slate-500">{subtext}</p>}
      </div>
    </div>
  );
}

/**
 * Thin top-of-page progress bar (YouTube/GitHub style). Purely decorative
 * indeterminate animation; the real semantics live on the overlay.
 */
export function TopProgressBar() {
  return (
    <div
      aria-hidden="true"
      className="fixed inset-x-0 top-0 z-[70] h-1 overflow-hidden bg-brand-100"
    >
      <div className="h-full w-1/3 animate-loading-bar rounded-r-full bg-brand-600" />
    </div>
  );
}
