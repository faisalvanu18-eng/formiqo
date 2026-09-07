"use client";

import { useEffect, useRef, useState } from "react";
import { usePathname, useSearchParams } from "next/navigation";
import { LoadingOverlay, TopProgressBar } from "./Spinner";

/**
 * Global navigation loading indicator for the App Router.
 *
 * The App Router does not expose router navigation events, so we detect the
 * *start* of a forward navigation by listening (in the capture phase) for
 * clicks on internal <a>/<Link> anchors, and we detect the *end* when the
 * pathname or query string actually changes (or a short safety timeout).
 *
 * Back/forward (popstate) navigations are intentionally NOT shown: the App
 * Router serves the previous page from cache, so they are effectively instant
 * and a loading popup there is just noise (and could linger).
 *
 * A short delay before showing avoids a flash on instant navigations, and a
 * minimum visible duration avoids a jarring flicker on medium ones. The whole
 * UI is mobile-friendly (centered popup + top progress bar).
 */
export function RouteLoadingIndicator() {
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const [visible, setVisible] = useState(false);

  // Key that represents the "current location". When it changes, navigation
  // has completed.
  const locationKey = `${pathname}?${searchParams?.toString() ?? ""}`;

  const showTimer = useRef<ReturnType<typeof setTimeout> | null>(null);
  const safetyTimer = useRef<ReturnType<typeof setTimeout> | null>(null);
  const shownAt = useRef<number | null>(null);

  // Hide when the location actually changes.
  useEffect(() => {
    clearTimeout(showTimer.current ?? undefined);
    clearTimeout(safetyTimer.current ?? undefined);

    if (!shownAt.current) {
      setVisible(false);
      return;
    }
    // Keep it on screen for a minimum time to avoid flicker.
    const elapsed = Date.now() - shownAt.current;
    const remaining = Math.max(0, 250 - elapsed);
    const t = setTimeout(() => {
      setVisible(false);
      shownAt.current = null;
    }, remaining);
    return () => clearTimeout(t);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [locationKey]);

  useEffect(() => {
    function start(targetHref: string | null) {
      // Ignore navigations that don't change the location.
      if (targetHref) {
        try {
          const url = new URL(targetHref, window.location.href);
          if (
            url.pathname === window.location.pathname &&
            url.search === window.location.search
          ) {
            return; // same page (e.g. #anchor) — no loading UI
          }
        } catch {
          /* ignore malformed */
        }
      }

      clearTimeout(showTimer.current ?? undefined);
      clearTimeout(safetyTimer.current ?? undefined);

      // Delay slightly so instant client navigations don't flash the overlay.
      showTimer.current = setTimeout(() => {
        shownAt.current = Date.now();
        setVisible(true);
      }, 120);

      // Safety net: never let the overlay get stuck.
      safetyTimer.current = setTimeout(() => {
        setVisible(false);
        shownAt.current = null;
      }, 6000);
    }

    function onClick(e: MouseEvent) {
      // Respect modifier keys / non-primary buttons (open in new tab, etc.).
      if (
        e.defaultPrevented ||
        e.button !== 0 ||
        e.metaKey ||
        e.ctrlKey ||
        e.shiftKey ||
        e.altKey
      ) {
        return;
      }
      const anchor = (e.target as HTMLElement | null)?.closest("a");
      if (!anchor) return;

      const href = anchor.getAttribute("href");
      const target = anchor.getAttribute("target");
      if (
        !href ||
        target === "_blank" ||
        href.startsWith("#") ||
        href.startsWith("mailto:") ||
        href.startsWith("tel:") ||
        anchor.hasAttribute("download")
      ) {
        return;
      }

      // Only handle same-origin navigations.
      try {
        const url = new URL(href, window.location.href);
        if (url.origin !== window.location.origin) return;
      } catch {
        return;
      }

      start(href);
    }

    document.addEventListener("click", onClick, true);
    return () => {
      document.removeEventListener("click", onClick, true);
      clearTimeout(showTimer.current ?? undefined);
      clearTimeout(safetyTimer.current ?? undefined);
    };
  }, []);

  if (!visible) return null;

  return (
    <>
      <TopProgressBar />
      <LoadingOverlay
        message="Loading…"
        subtext="Getting things ready for you."
      />
    </>
  );
}
