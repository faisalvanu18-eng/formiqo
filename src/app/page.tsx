import Link from "next/link";
import { SearchBox } from "@/components/SearchBox";
import { FormCard } from "@/components/FormCard";
import { getFormsByCategory, allForms } from "@/data/registry";
import { CheckIcon, ShieldIcon, UploadIcon, DownloadIcon } from "@/components/icons";

export default function HomePage() {
  const categories = getFormsByCategory();
  const popular = allForms.slice(0, 6);

  return (
    <>
      {/* Hero */}
      <section className="bg-gradient-to-b from-brand-50/70 to-slate-50">
        <div className="container-page py-14 sm:py-20">
          <div className="mx-auto max-w-3xl text-center">
            <p className="mb-3 text-sm font-semibold uppercase tracking-wide text-brand-600">
              Know. Prepare. Apply.
            </p>
            <h1 className="text-3xl font-bold tracking-tight text-slate-900 sm:text-5xl">
              Know Exactly What You Need Before You Apply
            </h1>
            <p className="mx-auto mt-4 max-w-2xl text-base text-slate-600 sm:text-lg">
              Select your government form, get a personalized document
              checklist, and prepare your files for upload — all in one place.
            </p>

            <div className="mx-auto mt-8 max-w-2xl">
              <p className="mb-2 text-left text-sm font-semibold text-slate-700">
                What form are you filling?
              </p>
              <SearchBox large autoFocus />
              <p className="mt-3 text-sm text-slate-500">
                No unnecessary document lists. No manual resizing. Just the
                requirements that apply to you.
              </p>

              <div className="mt-5 flex flex-wrap justify-center gap-2">
                {popular.map((form) => (
                  <Link
                    key={form.slug}
                    href={`/forms/${form.slug}/`}
                    className="rounded-full border border-slate-200 bg-white px-3 py-1.5 text-sm font-medium text-slate-700 shadow-sm hover:border-brand-300 hover:text-brand-700"
                  >
                    {form.shortName ?? form.name}
                  </Link>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* How it works */}
      <section className="container-page py-12">
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          <Feature
            icon={<CheckIcon className="h-5 w-5" />}
            title="See only what you need"
            text="Answer a few questions and get a checklist tailored to your exact application."
          />
          <Feature
            icon={<UploadIcon className="h-5 w-5" />}
            title="Prepare files automatically"
            text="We resize, crop, compress and convert photos, signatures and PDFs to the required specs."
          />
          <Feature
            icon={<ShieldIcon className="h-5 w-5" />}
            title="Processed in your browser"
            text="Your files are processed on your device whenever possible — no account needed."
          />
          <Feature
            icon={<DownloadIcon className="h-5 w-5" />}
            title="Download & apply"
            text="Download files individually or all together, then head to the official portal."
          />
        </div>
      </section>

      {/* Popular forms */}
      <section className="container-page py-6" id="popular">
        <div className="flex items-end justify-between">
          <h2 className="text-2xl font-bold text-slate-900">Popular Forms</h2>
          <Link href="/forms/" className="text-sm font-medium text-brand-700 hover:underline">
            View all forms →
          </Link>
        </div>

        {categories.map((cat) => (
          <div key={cat.category} className="mt-8">
            <h3 className="text-lg font-semibold text-slate-800">{cat.label}</h3>
            <div className="mt-4 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
              {cat.forms.map((form) => (
                <FormCard key={form.slug} form={form} />
              ))}
            </div>
          </div>
        ))}
      </section>

      {/* Trust strip */}
      <section className="container-page py-12">
        <div className="card bg-slate-900 p-8 text-center text-white">
          <h2 className="text-xl font-bold">
            Tell us the exact form you&apos;re filling.
          </h2>
          <p className="mx-auto mt-2 max-w-xl text-slate-300">
            We&apos;ll tell you what you need and prepare your files for
            submission. Formiqo is an independent tool and not a government
            website.
          </p>
          <Link href="/forms/" className="btn-primary btn-lg mt-6 bg-white text-brand-700 hover:bg-slate-100">
            Search Your Form
          </Link>
        </div>
      </section>
    </>
  );
}

function Feature({
  icon,
  title,
  text,
}: {
  icon: React.ReactNode;
  title: string;
  text: string;
}) {
  return (
    <div className="card p-5">
      <div className="grid h-10 w-10 place-items-center rounded-xl bg-brand-50 text-brand-600">
        {icon}
      </div>
      <h3 className="mt-3 font-semibold text-slate-900">{title}</h3>
      <p className="mt-1 text-sm text-slate-600">{text}</p>
    </div>
  );
}
