import type { Metadata } from "next";
import { PageShell } from "@/components/PageShell";
import { siteConfig } from "@/config/site";

export const metadata: Metadata = {
  title: "Terms of Use",
  description: "The terms that govern your use of Formiqo.",
  alternates: { canonical: "/terms/" },
};

export default function TermsPage() {
  return (
    <PageShell
      title="Terms of Use"
      intro="By using Formiqo you agree to these terms."
    >
      <section>
        <h2 className="text-xl font-semibold text-slate-900">Acceptable use</h2>
        <p className="mt-2">
          {siteConfig.name} provides information about government-form
          requirements and tools to prepare your files. You agree to use the
          service lawfully and not to misuse it or attempt to disrupt it.
        </p>
      </section>

      <section>
        <h2 className="text-xl font-semibold text-slate-900">
          Information is provided &quot;as is&quot;
        </h2>
        <p className="mt-2">
          We make reasonable efforts to keep requirements accurate, but we do
          not warrant that all information is complete, current or error-free.
          Requirements marked <em>verification pending</em> are provided as a
          helpful guide only. You are responsible for verifying the final
          requirements on the official source before applying.
        </p>
      </section>

      <section>
        <h2 className="text-xl font-semibold text-slate-900">
          No professional advice
        </h2>
        <p className="mt-2">
          Formiqo does not provide legal, financial or professional advice.
          Content is for general informational purposes only.
        </p>
      </section>

      <section>
        <h2 className="text-xl font-semibold text-slate-900">
          Limitation of liability
        </h2>
        <p className="mt-2">
          To the maximum extent permitted by law, {siteConfig.name} is not
          liable for any loss arising from reliance on the information or tools,
          including rejected applications or missed deadlines. Always confirm
          requirements officially before submitting.
        </p>
      </section>

      <section>
        <h2 className="text-xl font-semibold text-slate-900">Changes</h2>
        <p className="mt-2">
          We may update these terms from time to time. Continued use of the
          service constitutes acceptance of the updated terms.
        </p>
      </section>
    </PageShell>
  );
}
