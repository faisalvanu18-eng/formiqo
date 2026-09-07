import type { Metadata } from "next";
import Link from "next/link";
import { getFormsByCategory } from "@/data/registry";

export const metadata: Metadata = {
  title: "File Preparation Tools",
  description:
    "Formiqo prepares your photo, signature and PDF files to the exact size, dimensions and format each government form requires — all in your browser.",
  alternates: { canonical: "/tools/" },
};

export default function ToolsPage() {
  const recruitment = getFormsByCategory().find(
    (c) => c.category === "recruitment"
  );

  return (
    <div className="container-page py-10">
      <header className="max-w-2xl">
        <h1 className="text-3xl font-bold tracking-tight text-slate-900">
          File Preparation Tools
        </h1>
        <p className="mt-2 text-slate-600">
          Formiqo&apos;s tools are built into each form so they always target
          the correct requirements. Instead of guessing sizes, pick your form
          and we prepare every file for you.
        </p>
      </header>

      <div className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        <ToolCard
          title="Photo Resizer & Compressor"
          text="Crop to the required aspect ratio, resize to exact pixels and compress to the target file size — JPG/PNG in, ready photo out."
        />
        <ToolCard
          title="Signature Preparer"
          text="Convert and compress your signature to the accepted format and size limits without losing clarity."
        />
        <ToolCard
          title="Thumb & Declaration"
          text="Prepare thumb impressions and handwritten declarations where the application requires them."
        />
        <ToolCard
          title="PDF Optimizer"
          text="Validate page count and file size, and optimise PDFs so they fit within upload limits."
        />
        <ToolCard
          title="Format Converter"
          text="Convert PNG or other images to the JPEG format most portals expect."
        />
        <ToolCard
          title="Download All (ZIP)"
          text="Bundle all your prepared files into a single ZIP, generated entirely in your browser."
        />
      </div>

      <div className="mt-10 card p-6">
        <h2 className="text-lg font-semibold text-slate-900">
          Start with your form
        </h2>
        <p className="mt-1 text-sm text-slate-600">
          The tools apply the exact requirements for the form you choose.
        </p>
        <div className="mt-4 flex flex-wrap gap-2">
          {recruitment?.forms.slice(0, 6).map((f) => (
            <Link
              key={f.slug}
              href={`/forms/${f.slug}/`}
              className="btn-secondary py-2 text-xs"
            >
              {f.shortName ?? f.name}
            </Link>
          ))}
          <Link href="/forms/" className="btn-primary py-2 text-xs">
            All forms →
          </Link>
        </div>
      </div>
    </div>
  );
}

function ToolCard({ title, text }: { title: string; text: string }) {
  return (
    <div className="card p-5">
      <h3 className="font-semibold text-slate-900">{title}</h3>
      <p className="mt-1 text-sm text-slate-600">{text}</p>
    </div>
  );
}
