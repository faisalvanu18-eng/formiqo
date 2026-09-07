import type { Metadata } from "next";
import { Suspense } from "react";
import { SearchResults } from "./SearchResults";

// Search result URLs are user-specific/duplicate — do not index (spec §29).
export const metadata: Metadata = {
  title: "Search",
  description: "Search for your exact government form.",
  robots: { index: false, follow: true },
  alternates: { canonical: "/search/" },
};

export default function SearchPage() {
  return (
    <Suspense
      fallback={
        <div className="container-page py-10 text-slate-500">Loading…</div>
      }
    >
      <SearchResults />
    </Suspense>
  );
}
