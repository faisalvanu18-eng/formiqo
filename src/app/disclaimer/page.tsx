import type { Metadata } from "next";
import { PageShell } from "@/components/PageShell";
import { siteConfig } from "@/config/site";

export const metadata: Metadata = {
  title: "Disclaimer",
  description:
    "Formiqo is an independent informational and document-preparation tool and is not a government website.",
  alternates: { canonical: "/disclaimer/" },
};

export default function DisclaimerPage() {
  return (
    <PageShell title="Disclaimer">
      <div className="card border-amber-200 bg-amber-50 p-6 text-amber-900">
        <p>
          {siteConfig.name} is an independent informational and
          document-preparation tool. It is not affiliated with, endorsed by, or
          operated by any government department unless explicitly stated.
          Government requirements may change. Users should verify the final
          requirements on the official notification or application portal before
          submitting an application.
        </p>
      </div>

      <section>
        <h2 className="text-xl font-semibold text-slate-900">
          No government affiliation
        </h2>
        <p className="mt-2">
          We are not a government website and do not accept applications. We
          summarise publicly available requirements in our own words and link
          you to the official portals to submit your application.
        </p>
      </section>

      <section>
        <h2 className="text-xl font-semibold text-slate-900">
          Accuracy of information
        </h2>
        <p className="mt-2">
          We work to keep requirements accurate and up to date, and mark
          unverified items as <em>verification pending</em>. However, official
          rules can change without notice. Always confirm the current
          requirements on the official source before you apply.
        </p>
      </section>

      <section>
        <h2 className="text-xl font-semibold text-slate-900">
          File preparation
        </h2>
        <p className="mt-2">
          Our tools prepare files to the requirements configured in Formiqo.
          They do not guarantee acceptance by any portal. Please review each
          prepared file before uploading it.
        </p>
      </section>
    </PageShell>
  );
}
