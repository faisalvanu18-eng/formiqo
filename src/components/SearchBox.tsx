"use client";

import { useEffect, useMemo, useRef, useState, useTransition } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { searchForms, getCurrentVersion } from "@/data/registry";
import { SearchIcon } from "./icons";
import { Spinner } from "./Spinner";

/**
 * Primary search interaction. Client-side instant results (no server) with
 * keyboard navigation and accessible combobox semantics.
 */
export function SearchBox({
  autoFocus = false,
  large = false,
  initialQuery = "",
}: {
  autoFocus?: boolean;
  large?: boolean;
  initialQuery?: string;
}) {
  const router = useRouter();
  const [query, setQuery] = useState(initialQuery);
  const [open, setOpen] = useState(false);
  const [active, setActive] = useState(-1);
  const [isPending, startTransition] = useTransition();
  const inputRef = useRef<HTMLInputElement>(null);
  const listId = "search-suggestions";

  const results = useMemo(
    () => (query.trim() ? searchForms(query, 8) : []),
    [query]
  );

  useEffect(() => {
    if (autoFocus) inputRef.current?.focus();
  }, [autoFocus]);

  function go(slug: string) {
    setOpen(false);
    startTransition(() => {
      router.push(`/forms/${slug}/`);
    });
  }

  function goSearch(q: string) {
    setOpen(false);
    startTransition(() => {
      router.push(`/search/?q=${encodeURIComponent(q)}`);
    });
  }

  function onKeyDown(e: React.KeyboardEvent<HTMLInputElement>) {
    if (!open || results.length === 0) {
      if (e.key === "Enter" && query.trim()) {
        goSearch(query.trim());
      }
      return;
    }
    if (e.key === "ArrowDown") {
      e.preventDefault();
      setActive((a) => Math.min(a + 1, results.length - 1));
    } else if (e.key === "ArrowUp") {
      e.preventDefault();
      setActive((a) => Math.max(a - 1, 0));
    } else if (e.key === "Enter") {
      e.preventDefault();
      if (active >= 0 && results[active]) go(results[active].slug);
      else if (query.trim()) goSearch(query.trim());
    } else if (e.key === "Escape") {
      setOpen(false);
    }
  }

  return (
    <div className="relative w-full">
      <label htmlFor="form-search" className="sr-only">
        Search for a government form
      </label>
      <div className="relative">
        <SearchIcon
          className={`pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 ${
            large ? "h-6 w-6" : "h-5 w-5"
          }`}
        />
        <input
          id="form-search"
          ref={inputRef}
          type="search"
          role="combobox"
          aria-expanded={open && results.length > 0}
          aria-controls={listId}
          aria-autocomplete="list"
          autoComplete="off"
          value={query}
          onChange={(e) => {
            setQuery(e.target.value);
            setOpen(true);
            setActive(-1);
          }}
          onFocus={() => setOpen(true)}
          onBlur={() => setTimeout(() => setOpen(false), 150)}
          onKeyDown={onKeyDown}
          placeholder="Search SSC CGL, Passport, PAN Card, Voter ID, RRB NTPC..."
          className={`w-full rounded-2xl border border-slate-300 bg-white pl-12 pr-12 text-slate-900 shadow-card placeholder:text-slate-400 focus:border-brand-500 focus:ring-2 focus:ring-brand-200 ${
            large ? "py-5 text-lg" : "py-3.5 text-base"
          }`}
        />
        {isPending && (
          <span
            className={`pointer-events-none absolute right-4 top-1/2 -translate-y-1/2 text-brand-600 ${
              large ? "h-6 w-6" : "h-5 w-5"
            }`}
          >
            <Spinner
              className={large ? "h-6 w-6" : "h-5 w-5"}
              label="Searching"
            />
          </span>
        )}
      </div>

      {open && results.length > 0 && (
        <ul
          id={listId}
          role="listbox"
          className="absolute z-30 mt-2 max-h-80 w-full overflow-auto rounded-2xl border border-slate-200 bg-white p-2 shadow-cardhover"
        >
          {results.map((form, i) => {
            const version = getCurrentVersion(form.versions);
            return (
              <li key={form.slug} role="option" aria-selected={i === active}>
                <Link
                  href={`/forms/${form.slug}/`}
                  onMouseDown={(e) => {
                    e.preventDefault();
                    go(form.slug);
                  }}
                  className={`flex flex-col rounded-xl px-4 py-3 ${
                    i === active ? "bg-brand-50" : "hover:bg-slate-50"
                  }`}
                >
                  <span className="font-medium text-slate-900">
                    {version.label}
                  </span>
                  <span className="text-xs text-slate-500">
                    {form.authority}
                  </span>
                </Link>
              </li>
            );
          })}
        </ul>
      )}
    </div>
  );
}
