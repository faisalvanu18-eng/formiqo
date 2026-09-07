"use client";

import { useMemo, useState } from "react";
import { useSearchParams } from "next/navigation";
import { allForms } from "@/data/registry";
import { CheckIcon } from "@/components/icons";

const ISSUE_TYPES = [
  "Incorrect document requirement",
  "Outdated requirement",
  "Incorrect photo size",
  "Incorrect signature size",
  "Broken official link",
  "Other issue",
];

export function ReportErrorForm() {
  const params = useSearchParams();
  const prefillForm = params.get("form") ?? "";

  const [form, setForm] = useState(prefillForm);
  const [issueType, setIssueType] = useState(ISSUE_TYPES[0]);
  const [details, setDetails] = useState("");
  const [email, setEmail] = useState("");
  const [submitted, setSubmitted] = useState(false);

  const mailto = useMemo(() => {
    const subject = `Formiqo error report: ${issueType}`;
    const body = [
      `Form: ${form || "(not specified)"}`,
      `Issue type: ${issueType}`,
      `Details: ${details || "(none)"}`,
      `Reporter email: ${email || "(not provided)"}`,
    ].join("\n");
    return `mailto:hello@formiqo.com?subject=${encodeURIComponent(
      subject
    )}&body=${encodeURIComponent(body)}`;
  }, [form, issueType, details, email]);

  function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    // Static site: open the user's email client with a prefilled report.
    // A backend endpoint can replace this later without UI changes.
    window.location.href = mailto;
    setSubmitted(true);
  }

  if (submitted) {
    return (
      <div className="card border-emerald-200 bg-emerald-50 p-6">
        <div className="flex items-center gap-2 text-emerald-800">
          <CheckIcon className="h-5 w-5" />
          <h2 className="text-lg font-semibold">Thanks for the report</h2>
        </div>
        <p className="mt-2 text-sm text-emerald-700">
          Your email client should have opened with the report details. If it
          didn&apos;t, email us directly at{" "}
          <a href="mailto:hello@formiqo.com" className="font-medium underline">
            hello@formiqo.com
          </a>
          .
        </p>
      </div>
    );
  }

  return (
    <form onSubmit={onSubmit} className="card space-y-5 p-6">
      <div>
        <label htmlFor="rf-form" className="block text-sm font-medium text-slate-800">
          Which form?
        </label>
        <select
          id="rf-form"
          value={form}
          onChange={(e) => setForm(e.target.value)}
          className="mt-1 w-full rounded-xl border border-slate-300 px-3 py-2.5 text-sm focus:border-brand-500 focus:ring-2 focus:ring-brand-200"
        >
          <option value="">Select a form (optional)</option>
          {allForms.map((f) => (
            <option key={f.slug} value={f.slug}>
              {f.name}
            </option>
          ))}
        </select>
      </div>

      <div>
        <label htmlFor="rf-type" className="block text-sm font-medium text-slate-800">
          Type of issue
        </label>
        <select
          id="rf-type"
          value={issueType}
          onChange={(e) => setIssueType(e.target.value)}
          className="mt-1 w-full rounded-xl border border-slate-300 px-3 py-2.5 text-sm focus:border-brand-500 focus:ring-2 focus:ring-brand-200"
        >
          {ISSUE_TYPES.map((t) => (
            <option key={t}>{t}</option>
          ))}
        </select>
      </div>

      <div>
        <label htmlFor="rf-details" className="block text-sm font-medium text-slate-800">
          Details
        </label>
        <textarea
          id="rf-details"
          value={details}
          onChange={(e) => setDetails(e.target.value)}
          rows={5}
          required
          placeholder="Tell us what's wrong and, if possible, the official source with the correct information."
          className="mt-1 w-full rounded-xl border border-slate-300 px-3 py-2.5 text-sm focus:border-brand-500 focus:ring-2 focus:ring-brand-200"
        />
      </div>

      <div>
        <label htmlFor="rf-email" className="block text-sm font-medium text-slate-800">
          Your email (optional)
        </label>
        <input
          id="rf-email"
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder="So we can follow up if needed"
          className="mt-1 w-full rounded-xl border border-slate-300 px-3 py-2.5 text-sm focus:border-brand-500 focus:ring-2 focus:ring-brand-200"
        />
      </div>

      <p className="text-xs text-slate-500">
        Please do not attach or send images of your personal documents. We only
        need a description of the problem.
      </p>

      <button type="submit" className="btn-primary w-full">
        Submit report
      </button>
    </form>
  );
}
