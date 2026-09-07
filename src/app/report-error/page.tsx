import type { Metadata } from "next";
import { Suspense } from "react";
import { PageShell } from "@/components/PageShell";
import { ReportErrorForm } from "./ReportErrorForm";

export const metadata: Metadata = {
  title: "Report an Error",
  description:
    "Found an incorrect or outdated requirement on Formiqo? Let us know so we can fix it.",
  alternates: { canonical: "/report-error/" },
};

export default function ReportErrorPage() {
  return (
    <PageShell
      title="Report an Error"
      intro="Spotted an incorrect or outdated requirement? Help us keep Formiqo accurate."
    >
      <Suspense fallback={<div className="text-slate-500">Loading…</div>}>
        <ReportErrorForm />
      </Suspense>
    </PageShell>
  );
}
