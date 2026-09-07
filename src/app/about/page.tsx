import type { Metadata } from "next";
import { PageShell } from "@/components/PageShell";
import { siteConfig } from "@/config/site";

export const metadata: Metadata = {
  title: "About",
  description:
    "Formiqo helps you understand current government-form requirements and prepare your files for online submission — an independent, browser-based tool.",
  alternates: { canonical: "/about/" },
};

export default function AboutPage() {
  return (
    <PageShell
      title="About Formiqo"
      intro="Know. Prepare. Apply. — an independent tool that removes the guesswork from government form applications."
    >
      <section>
        <h2 className="text-xl font-semibold text-slate-900">
          What is Formiqo?
        </h2>
        <p className="mt-2">
          {siteConfig.name} helps users understand current application
          requirements and prepare files for online submission. Instead of a
          long, generic list of every possible document, you tell us the exact
          form you are filling and answer a few short questions. We then show
          only the documents that apply to you, the officially accepted
          alternatives, and the exact photo, signature and file requirements.
        </p>
      </section>

      <section>
        <h2 className="text-xl font-semibold text-slate-900">How it works</h2>
        <ul className="mt-2 list-disc space-y-2 pl-5">
          <li>Search and select your exact form and version.</li>
          <li>Answer only the questions that can change your requirements.</li>
          <li>Get a personalized checklist with accepted alternatives.</li>
          <li>
            Upload your files — we resize, crop, compress and convert them to
            the required format and size, right in your browser.
          </li>
          <li>Download everything and apply on the official portal.</li>
        </ul>
      </section>

      <section>
        <h2 className="text-xl font-semibold text-slate-900">
          A few important things
        </h2>
        <ul className="mt-2 list-disc space-y-2 pl-5">
          <li>
            Our requirements are based on official sources and summarised in our
            own words.
          </li>
          <li>
            Government requirements can change at any time. Where a requirement
            has not been fully verified, we mark it clearly as{" "}
            <em>verification pending</em>.
          </li>
          <li>
            You should always verify the final requirements on the official
            notification or application portal before submitting.
          </li>
          <li>
            Formiqo is independent and is not affiliated with, endorsed by, or
            operated by any government department.
          </li>
        </ul>
      </section>
    </PageShell>
  );
}
