import type { Metadata } from "next";
import Link from "next/link";
import { PageShell } from "@/components/PageShell";

export const metadata: Metadata = {
  title: "Contact",
  description:
    "Get in touch with the Formiqo team with questions, feedback or corrections.",
  alternates: { canonical: "/contact/" },
};

export default function ContactPage() {
  return (
    <PageShell
      title="Contact Us"
      intro="We'd love to hear your feedback and suggestions."
    >
      <p>
        Formiqo is built to be genuinely useful. If you have feedback, a feature
        request, or a general question, please reach out. For incorrect or
        outdated form requirements, please use the dedicated report form so we
        can track and fix it quickly.
      </p>

      <div className="card p-6">
        <h2 className="text-lg font-semibold text-slate-900">Email</h2>
        <p className="mt-1 text-sm">
          <a
            href="mailto:hello@formiqo.com"
            className="font-medium text-brand-700 hover:underline"
          >
            hello@formiqo.com
          </a>
        </p>
        <p className="mt-3 text-sm text-slate-600">
          Please do not email copies of your identity documents. We do not need
          them, and Formiqo never asks for your personal documents.
        </p>
      </div>

      <p>
        Found something wrong on a form page?{" "}
        <Link href="/report-error/" className="font-medium text-brand-700 hover:underline">
          Report an error
        </Link>
        .
      </p>
    </PageShell>
  );
}
