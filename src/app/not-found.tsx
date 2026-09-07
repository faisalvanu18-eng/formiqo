import Link from "next/link";

export default function NotFound() {
  return (
    <div className="container-page py-24 text-center">
      <p className="text-sm font-semibold uppercase tracking-wide text-brand-600">
        404
      </p>
      <h1 className="mt-2 text-3xl font-bold text-slate-900">
        Page not found
      </h1>
      <p className="mx-auto mt-2 max-w-md text-slate-600">
        We couldn&apos;t find that page. Try searching for your form instead.
      </p>
      <div className="mt-6 flex justify-center gap-3">
        <Link href="/" className="btn-secondary">
          Go home
        </Link>
        <Link href="/forms/" className="btn-primary">
          Browse forms
        </Link>
      </div>
    </div>
  );
}
