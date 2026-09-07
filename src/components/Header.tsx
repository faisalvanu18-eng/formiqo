"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { siteConfig } from "@/config/site";
import { LogoMark } from "./Logo";

export function Header() {
  const [open, setOpen] = useState(false);
  const pathname = usePathname();

  // Close the menu whenever the route changes (e.g. after tapping a link).
  useEffect(() => {
    setOpen(false);
  }, [pathname]);

  // While the menu is open: lock body scroll and allow Escape to close.
  useEffect(() => {
    if (!open) return;
    const { overflow } = document.body.style;
    document.body.style.overflow = "hidden";
    function onKey(e: KeyboardEvent) {
      if (e.key === "Escape") setOpen(false);
    }
    document.addEventListener("keydown", onKey);
    return () => {
      document.body.style.overflow = overflow;
      document.removeEventListener("keydown", onKey);
    };
  }, [open]);

  function isActive(href: string) {
    if (href === "/") return pathname === "/";
    return pathname === href || pathname.startsWith(`${href}/`);
  }

  return (
    <>
      <header className="sticky top-0 z-40 border-b border-slate-200 bg-white/90 backdrop-blur">
        <div className="container-page flex h-16 items-center justify-between">
          <Link
            href="/"
            className="flex items-center gap-2"
            onClick={() => setOpen(false)}
          >
            <LogoMark className="h-9 w-9" />
            <span className="flex flex-col leading-none">
              <span className="text-lg font-bold text-slate-900">
                {siteConfig.name}
              </span>
              <span className="text-[11px] font-medium text-slate-500">
                {siteConfig.tagline}
              </span>
            </span>
          </Link>

          {/* Desktop nav */}
          <nav
            aria-label="Primary"
            className="hidden items-center gap-1 sm:flex"
          >
            {siteConfig.nav.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                aria-current={isActive(item.href) ? "page" : undefined}
                className={`rounded-lg px-3 py-2 text-sm font-medium hover:bg-slate-100 hover:text-slate-900 ${
                  isActive(item.href)
                    ? "bg-brand-50 text-brand-700"
                    : "text-slate-600"
                }`}
              >
                {item.label}
              </Link>
            ))}
            <Link href="/forms" className="btn-primary ml-2 px-4 py-2 text-sm">
              Find Your Form
            </Link>
          </nav>

          {/* Mobile hamburger toggle */}
          <button
            type="button"
            aria-label={open ? "Close menu" : "Open menu"}
            aria-expanded={open}
            aria-controls="mobile-menu"
            onClick={() => setOpen(true)}
            className="grid h-10 w-10 place-items-center rounded-lg text-slate-700 hover:bg-slate-100 sm:hidden"
          >
            <svg
              className="h-6 w-6"
              fill="none"
              stroke="currentColor"
              strokeWidth={2}
              viewBox="0 0 24 24"
              aria-hidden="true"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M4 6h16M4 12h16M4 18h16"
              />
            </svg>
          </button>
        </div>
      </header>

      {/*
        Mobile drawer lives OUTSIDE the sticky, backdrop-blurred <header> so it
        is not trapped in the header's stacking context. It sits above
        everything with a high z-index and slides in from the right.
      */}
      {/* Backdrop */}
      <div
        onClick={() => setOpen(false)}
        aria-hidden="true"
        className={`fixed inset-0 z-[90] bg-slate-900/50 transition-opacity duration-200 sm:hidden ${
          open ? "opacity-100" : "pointer-events-none opacity-0"
        }`}
      />

      {/* Drawer */}
      <nav
        id="mobile-menu"
        aria-label="Mobile"
        aria-hidden={!open}
        className={`fixed inset-y-0 right-0 z-[100] flex w-72 max-w-[85%] flex-col bg-white shadow-cardhover transition-transform duration-300 ease-out sm:hidden ${
          open ? "translate-x-0" : "pointer-events-none translate-x-full"
        }`}
      >
        {/* Drawer header */}
        <div className="flex h-16 shrink-0 items-center justify-between border-b border-slate-200 px-4">
          <span className="flex items-center gap-2">
            <LogoMark className="h-9 w-9" />
            <span className="text-lg font-bold text-slate-900">
              {siteConfig.name}
            </span>
          </span>
          <button
            type="button"
            aria-label="Close menu"
            onClick={() => setOpen(false)}
            className="grid h-10 w-10 place-items-center rounded-lg text-slate-700 hover:bg-slate-100"
          >
            <svg
              className="h-6 w-6"
              fill="none"
              stroke="currentColor"
              strokeWidth={2}
              viewBox="0 0 24 24"
              aria-hidden="true"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M6 18L18 6M6 6l12 12"
              />
            </svg>
          </button>
        </div>

        {/* Drawer links */}
        <div className="flex flex-1 flex-col gap-1 overflow-y-auto p-4">
          {siteConfig.nav.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              onClick={() => setOpen(false)}
              aria-current={isActive(item.href) ? "page" : undefined}
              className={`flex items-center justify-between rounded-xl px-4 py-3 text-base font-medium ${
                isActive(item.href)
                  ? "bg-brand-50 text-brand-700"
                  : "text-slate-700 hover:bg-slate-100"
              }`}
            >
              {item.label}
              <svg
                className="h-4 w-4 text-slate-300"
                fill="none"
                stroke="currentColor"
                strokeWidth={2}
                viewBox="0 0 24 24"
                aria-hidden="true"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="m9 6 6 6-6 6"
                />
              </svg>
            </Link>
          ))}
          <Link
            href="/forms"
            onClick={() => setOpen(false)}
            className="btn-primary mt-2 px-4 py-3 text-center text-base"
          >
            Find Your Form
          </Link>
        </div>
      </nav>
    </>
  );
}
