import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import {
  getAllSlugs,
  getFormBySlug,
  getCurrentVersion,
  getRelatedForms,
} from "@/data/registry";
import { siteConfig } from "@/config/site";
import { FormFlow } from "@/components/FormFlow";
import { JsonLd } from "@/components/JsonLd";
import { FormCard } from "@/components/FormCard";
import { mimeToLabel } from "@/lib/format";
import { describeRule } from "@/lib/validation";
import { ExternalIcon } from "@/components/icons";

interface Params {
  params: { slug: string };
}

export function generateStaticParams() {
  return getAllSlugs().map((slug) => ({ slug }));
}

export function generateMetadata({ params }: Params): Metadata {
  const form = getFormBySlug(params.slug);
  if (!form) return {};
  const version = getCurrentVersion(form.versions);
  const title = `${version.label} Documents Required – Photo, Signature & Upload Size`;
  const description = `Find the documents required for ${version.label}, including photo, signature and upload requirements. Prepare your files and download them ready for submission.`;
  const url = `${siteConfig.url}/forms/${form.slug}/`;
  return {
    title,
    description,
    alternates: { canonical: `/forms/${form.slug}/` },
    openGraph: {
      title,
      description,
      url,
      type: "article",
    },
    twitter: { card: "summary_large_image", title, description },
  };
}

export default function FormPage({ params }: Params) {
  const form = getFormBySlug(params.slug);
  if (!form) notFound();
  const version = getCurrentVersion(form.versions);
  const related = getRelatedForms(form);

  const uploadRules = version.requirements
    .filter((r) => r.requiresUpload && r.uploadRule)
    .map((r) => ({ name: r.documentName, role: r.role, rule: r.uploadRule! }));

  const photo = uploadRules.find((u) => u.role === "photograph");
  const signature = uploadRules.find((u) => u.role === "signature");

  const breadcrumbJsonLd = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: [
      { "@type": "ListItem", position: 1, name: "Home", item: siteConfig.url },
      {
        "@type": "ListItem",
        position: 2,
        name: "Forms",
        item: `${siteConfig.url}/forms/`,
      },
      {
        "@type": "ListItem",
        position: 3,
        name: version.label,
        item: `${siteConfig.url}/forms/${form.slug}/`,
      },
    ],
  };

  const faqJsonLd =
    version.faqs && version.faqs.length > 0
      ? {
          "@context": "https://schema.org",
          "@type": "FAQPage",
          mainEntity: version.faqs.map((f) => ({
            "@type": "Question",
            name: f.question,
            acceptedAnswer: { "@type": "Answer", text: f.answer },
          })),
        }
      : null;

  return (
    <>
      <JsonLd data={breadcrumbJsonLd} />
      {faqJsonLd && <JsonLd data={faqJsonLd} />}

      <div className="container-page py-8">
        {/* Breadcrumb */}
        <nav aria-label="Breadcrumb" className="mb-4 text-sm text-slate-500">
          <ol className="flex flex-wrap items-center gap-1">
            <li>
              <Link href="/" className="hover:text-brand-700">
                Home
              </Link>
            </li>
            <li aria-hidden="true">/</li>
            <li>
              <Link href="/forms/" className="hover:text-brand-700">
                Forms
              </Link>
            </li>
            <li aria-hidden="true">/</li>
            <li className="text-slate-700">{version.label}</li>
          </ol>
        </nav>

        <header className="mb-6">
          <h1 className="text-2xl font-bold tracking-tight text-slate-900 break-words sm:text-3xl">
            {version.label}
          </h1>
          <p className="mt-2 max-w-2xl text-slate-600">{form.summary}</p>
        </header>

        <div className="grid gap-8 lg:grid-cols-[minmax(0,1fr)_320px]">
          {/* Main column: interactive flow */}
          <div className="min-w-0">
            <FormFlow form={form} version={version} />
          </div>

          {/* Sidebar */}
          <aside className="min-w-0 space-y-6">
            {related.length > 0 && (
              <div className="card p-5">
                <h2 className="text-sm font-semibold text-slate-900">
                  Related forms
                </h2>
                <ul className="mt-3 space-y-2">
                  {related.map((r) => (
                    <li key={r.slug}>
                      <Link
                        href={`/forms/${r.slug}/`}
                        className="text-sm text-brand-700 hover:underline"
                      >
                        {getCurrentVersion(r.versions).label}
                      </Link>
                    </li>
                  ))}
                </ul>
              </div>
            )}
          </aside>
        </div>

        {/* SEO / helpful content */}
        <section className="mt-16 max-w-3xl space-y-12">
          <div>
            <h2 className="text-xl font-bold text-slate-900 break-words sm:text-2xl">
              Documents Required for {version.label}
            </h2>
            <p className="mt-3 text-slate-600">
              Below is a summary of the documents commonly needed for{" "}
              {version.label}, issued by {version.authority}. The exact list can
              vary with your category and application details — use the tool
              above to see only the documents that apply to you, then prepare
              your files in the correct format and size.
            </p>
          </div>

          {(photo || signature) && (
            <div className="grid gap-6 sm:grid-cols-2">
              {photo && (
                <SpecCard title="Photo Requirements" rule={photo.rule} />
              )}
              {signature && (
                <SpecCard
                  title="Signature Requirements"
                  rule={signature.rule}
                />
              )}
            </div>
          )}

          <div>
            <h2 className="text-xl font-bold text-slate-900">
              How to Prepare Your Files
            </h2>
            <ol className="mt-3 list-decimal space-y-2 pl-5 text-slate-600">
              <li>Select this form and answer the short questions above.</li>
              <li>
                Review your personalized checklist and note any accepted
                alternatives you can use.
              </li>
              <li>
                Upload your photo, signature or PDF — Formiqo automatically
                resizes, crops, compresses and converts each file to match the
                requirement.
              </li>
              <li>Check the validation results and download your files.</li>
              <li>Head to the official portal and submit your application.</li>
            </ol>
          </div>

          {version.commonMistakes && version.commonMistakes.length > 0 && (
            <div>
              <h2 className="text-xl font-bold text-slate-900">
                Common Mistakes to Avoid
              </h2>
              <ul className="mt-3 list-disc space-y-2 pl-5 text-slate-600">
                {version.commonMistakes.map((m) => (
                  <li key={m}>{m}</li>
                ))}
              </ul>
            </div>
          )}

          {version.faqs && version.faqs.length > 0 && (
            <div>
              <h2 className="text-xl font-bold text-slate-900">
                Frequently Asked Questions
              </h2>
              <div className="mt-4 space-y-4">
                {version.faqs.map((f) => (
                  <details
                    key={f.question}
                    className="rounded-xl border border-slate-200 p-4"
                  >
                    <summary className="cursor-pointer font-medium text-slate-900">
                      {f.question}
                    </summary>
                    <p className="mt-2 text-sm text-slate-600">{f.answer}</p>
                  </details>
                ))}
              </div>
            </div>
          )}

          <div className="card p-6">
            <h2 className="text-lg font-bold text-slate-900">
              Official Application Website
            </h2>
            <p className="mt-2 text-sm text-slate-600">
              Apply for {version.label} on the official portal operated by{" "}
              {version.authority}. Formiqo is an independent tool and is not a
              government website.
            </p>
            <a
              href={version.officialUrl}
              target="_blank"
              rel="noopener noreferrer nofollow"
              className="btn-primary mt-4"
            >
              Apply on Official Website <ExternalIcon className="h-4 w-4" />
            </a>
          </div>

          {related.length > 0 && (
            <div>
              <h2 className="text-xl font-bold text-slate-900">
                Related Forms
              </h2>
              <div className="mt-4 grid gap-4 sm:grid-cols-2">
                {related.map((r) => (
                  <FormCard key={r.slug} form={r} />
                ))}
              </div>
            </div>
          )}
        </section>
      </div>
    </>
  );
}

function SpecCard({
  title,
  rule,
}: {
  title: string;
  rule: import("@/lib/types").UploadRule;
}) {
  const lines = describeRule(rule);
  return (
    <div className="card p-5">
      <h3 className="font-semibold text-slate-900">{title}</h3>
      <ul className="mt-3 space-y-1.5 text-sm text-slate-600">
        {lines.map((l) => (
          <li key={l} className="flex items-center gap-2">
            <span className="h-1.5 w-1.5 rounded-full bg-brand-400" />
            {l}
          </li>
        ))}
        <li className="flex items-center gap-2">
          <span className="h-1.5 w-1.5 rounded-full bg-brand-400" />
          Accepted: {rule.acceptedFormats.map(mimeToLabel).join(", ")}
        </li>
      </ul>
    </div>
  );
}
