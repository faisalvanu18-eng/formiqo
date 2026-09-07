import type { Metadata } from "next";
import { PageShell } from "@/components/PageShell";
import { siteConfig } from "@/config/site";

export const metadata: Metadata = {
  title: "Privacy Policy",
  description:
    "How Formiqo handles your files and data. Files are processed in your browser whenever possible.",
  alternates: { canonical: "/privacy-policy/" },
};

export default function PrivacyPage() {
  return (
    <PageShell
      title="Privacy Policy"
      intro="Your privacy matters. This page explains how Formiqo handles files and data."
    >
      <section>
        <h2 className="text-xl font-semibold text-slate-900">
          Client-side file processing
        </h2>
        <p className="mt-2">
          Formiqo prepares your files (photos, signatures, PDFs) in your browser
          whenever it is technically possible. In normal use, the file
          preparation described on this site runs on your device and does not
          require uploading your documents to our servers.
        </p>
      </section>

      <section>
        <h2 className="text-xl font-semibold text-slate-900">
          No unnecessary document collection
        </h2>
        <p className="mt-2">
          We do not ask you to create an account, and we do not collect your
          identity documents. We do not need copies of your Aadhaar, PAN,
          certificates or other personal documents to provide this service.
        </p>
      </section>

      <section>
        <h2 className="text-xl font-semibold text-slate-900">
          Cookies and analytics
        </h2>
        <p className="mt-2">
          We may use privacy-respecting analytics to understand which forms and
          features are useful (for example, anonymous counts of searches or
          downloads). Where analytics are used, we do not track the contents of
          any file you prepare. Any cookies used are described here and can be
          controlled through your browser settings.
        </p>
      </section>

      <section>
        <h2 className="text-xl font-semibold text-slate-900">Advertising</h2>
        <p className="mt-2">
          {siteConfig.name} may display advertising (for example, Google
          AdSense) to support the free tool. Advertising partners may use
          cookies to serve relevant ads in accordance with their own policies.
          Ads are placed so they never interfere with the tool, upload or
          download controls.
        </p>
      </section>

      <section>
        <h2 className="text-xl font-semibold text-slate-900">
          Third-party services
        </h2>
        <p className="mt-2">
          When you choose to apply, we link you to official government portals.
          Those websites have their own privacy policies, which govern any data
          you provide to them.
        </p>
      </section>

      <section>
        <h2 className="text-xl font-semibold text-slate-900">Data retention</h2>
        <p className="mt-2">
          Because file preparation happens in your browser, your prepared files
          exist only in your current browser session and are removed when you
          close or refresh the page, unless you download them.
        </p>
      </section>

      <section>
        <h2 className="text-xl font-semibold text-slate-900">Contact</h2>
        <p className="mt-2">
          For privacy questions, contact{" "}
          <a
            href="mailto:hello@formiqo.com"
            className="font-medium text-brand-700 hover:underline"
          >
            hello@formiqo.com
          </a>
          .
        </p>
      </section>

      <p className="text-sm text-slate-500">
        This policy may be updated from time to time. Please review it
        periodically.
      </p>
    </PageShell>
  );
}
