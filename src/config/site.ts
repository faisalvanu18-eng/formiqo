/**
 * Site-wide configuration. Centralised so branding, URLs and SEO defaults
 * can be updated in a single place. When a backend is added later, only the
 * data-loading layer needs to change — not this config.
 */
export const siteConfig = {
  name: "Formiqo",
  tagline: "Know. Prepare. Apply.",
  description:
    "Select your government form, get a personalized document checklist, and prepare your files for upload — all in one place.",
  // Production domain. Override at build time with NEXT_PUBLIC_SITE_URL
  // (e.g. on your host) without code changes; falls back to the default.
  url: (process.env.NEXT_PUBLIC_SITE_URL || "https://formiqo.online").replace(
    /\/$/,
    ""
  ),
  ogImage: "/og-image.png",
  twitter: "@formiqo",
  locale: "en_IN",
  keywords: [
    "government form documents required",
    "documents required",
    "photo signature upload size",
    "SSC CGL documents",
    "UPSC documents required",
    "Agniveer documents required",
    "India Post GDS documents",
    "NEET photo signature size",
    "JEE Main documents",
    "CTET photo size",
    "GATE documents required",
    "passport documents required",
    "PAN card documents",
    "Aadhaar documents required",
    "EPF withdrawal documents",
    "birth certificate documents",
    "photo resize compress KB",
  ],
  nav: [
    { label: "Forms", href: "/forms" },
    { label: "Tools", href: "/tools" },
    { label: "About", href: "/about" },
    { label: "Contact", href: "/contact" },
  ],
  footerLinks: {
    product: [
      { label: "All Forms", href: "/forms" },
      { label: "File Tools", href: "/tools" },
      { label: "Search", href: "/search" },
    ],
    company: [
      { label: "About", href: "/about" },
      { label: "Contact", href: "/contact" },
      { label: "Report an Error", href: "/report-error" },
    ],
    legal: [
      { label: "Privacy Policy", href: "/privacy-policy" },
      { label: "Terms of Use", href: "/terms" },
      { label: "Disclaimer", href: "/disclaimer" },
    ],
  },
  // AdSense publisher id.
  adsense: {
    enabled: true,
    client: "ca-pub-5788775732171838",
  },
  // Google Analytics 4 Measurement ID.
  analytics: {
    enabled: true,
    measurementId: "G-EXC4JD776E",
  },
};

export type SiteConfig = typeof siteConfig;
