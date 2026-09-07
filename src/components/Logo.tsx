import type { SVGProps } from "react";

/**
 * Formiqo brand mark.
 *
 * A rounded brand-blue tile containing a stylised "F" whose lower arm turns
 * into a checkmark — a nod to "Know. Prepare. Apply." (documents made ready).
 * Pure SVG, no external assets, scales crisply at any size.
 */
export function LogoMark({
  title = "Formiqo",
  ...props
}: SVGProps<SVGSVGElement> & { title?: string }) {
  return (
    <svg
      viewBox="0 0 48 48"
      role="img"
      aria-label={title}
      xmlns="http://www.w3.org/2000/svg"
      {...props}
    >
      <defs>
        <linearGradient id="formiqoGrad" x1="0" y1="0" x2="48" y2="48"
          gradientUnits="userSpaceOnUse">
          <stop offset="0" stopColor="#3b82f6" />
          <stop offset="1" stopColor="#2563eb" />
        </linearGradient>
      </defs>

      {/* Tile */}
      <rect x="0" y="0" width="48" height="48" rx="12" fill="url(#formiqoGrad)" />

      {/* Stylised "F" */}
      <path
        d="M17 13.5h14a1.5 1.5 0 0 1 0 3H20v6.5h8a1.5 1.5 0 0 1 0 3h-8v9a1.5 1.5 0 0 1-3 0V15a1.5 1.5 0 0 1 0-1.5Z"
        fill="#ffffff"
      />

      {/* Checkmark accent */}
      <path
        d="M27.5 30.5l3.2 3.2 6.3-6.6"
        fill="none"
        stroke="#ffffff"
        strokeWidth="3"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}
