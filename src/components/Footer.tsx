import Link from "next/link";
import { siteConfig } from "@/config/site";

export function Footer() {
  const year = new Date().getFullYear();
  return (
    <footer className="mt-16 border-t border-slate-200 bg-white">
      <div className="container-page py-12">
        <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-4">
          <div>
            <div className="flex items-center gap-2">
              <span className="grid h-8 w-8 place-items-center rounded-lg bg-brand-600 font-bold text-white">
                F
              </span>
              <span className="font-bold text-slate-900">{siteConfig.name}</span>
            </div>
            <p className="mt-3 max-w-xs text-sm text-slate-600">
              {siteConfig.tagline} — an independent tool to understand
              government-form requirements and prepare your files for upload.
            </p>
          </div>

          <FooterColumn title="Product" links={siteConfig.footerLinks.product} />
          <FooterColumn title="Company" links={siteConfig.footerLinks.company} />
          <FooterColumn title="Legal" links={siteConfig.footerLinks.legal} />
        </div>

        <div className="mt-10 rounded-xl bg-amber-50 p-4 text-xs text-amber-800 ring-1 ring-amber-200">
          <strong>Disclaimer:</strong> {siteConfig.name} is an independent
          informational and document-preparation tool. It is not affiliated
          with, endorsed by, or operated by any government department.
          Government requirements can change — always verify the final
          requirements on the official application portal before submitting.
        </div>

        <p className="mt-6 text-center text-xs text-slate-500">
          © {year} {siteConfig.name}. All rights reserved.
        </p>
      </div>
    </footer>
  );
}

function FooterColumn({
  title,
  links,
}: {
  title: string;
  links: { label: string; href: string }[];
}) {
  return (
    <div>
      <h2 className="text-sm font-semibold text-slate-900">{title}</h2>
      <ul className="mt-3 space-y-2">
        {links.map((l) => (
          <li key={l.href}>
            <Link
              href={l.href}
              className="text-sm text-slate-600 hover:text-brand-700"
            >
              {l.label}
            </Link>
          </li>
        ))}
      </ul>
    </div>
  );
}
