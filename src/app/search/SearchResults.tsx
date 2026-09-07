"use client";

import { useMemo } from "react";
import { useSearchParams } from "next/navigation";
import { SearchBox } from "@/components/SearchBox";
import { FormCard } from "@/components/FormCard";
import { searchForms } from "@/data/registry";

export function SearchResults() {
  const params = useSearchParams();
  const q = params.get("q") ?? "";
  const results = useMemo(() => (q ? searchForms(q, 30) : []), [q]);

  return (
    <div className="container-page py-10">
      <h1 className="text-3xl font-bold tracking-tight text-slate-900">
        Search forms
      </h1>
      <div className="mt-6 max-w-2xl">
        <SearchBox autoFocus initialQuery={q} />
      </div>

      {q && (
        <p className="mt-6 text-sm text-slate-500">
          {results.length} result{results.length === 1 ? "" : "s"} for
          &quot;{q}&quot;
        </p>
      )}

      {q && results.length === 0 && (
        <div className="mt-4 card p-8 text-center">
          <p className="text-slate-600">
            No forms matched your search. Try a shorter term like{" "}
            <span className="font-medium">cgl</span>,{" "}
            <span className="font-medium">passport</span> or{" "}
            <span className="font-medium">pan</span>.
          </p>
        </div>
      )}

      <div className="mt-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {results.map((form) => (
          <FormCard key={form.slug} form={form} />
        ))}
      </div>
    </div>
  );
}
