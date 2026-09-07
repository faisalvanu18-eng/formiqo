import type { Metadata } from "next";
import { FormCard } from "@/components/FormCard";
import { SearchBox } from "@/components/SearchBox";
import { getFormsByCategory } from "@/data/registry";

export const metadata: Metadata = {
  title: "All Government Forms & Document Requirements",
  description:
    "Browse all supported government forms — recruitment exams, citizen services and education. See documents required and prepare your files for upload.",
  alternates: { canonical: "/forms/" },
};

export default function FormsIndexPage() {
  const categories = getFormsByCategory();

  return (
    <div className="container-page py-10">
      <header className="max-w-2xl">
        <h1 className="text-3xl font-bold tracking-tight text-slate-900">
          All Forms
        </h1>
        <p className="mt-2 text-slate-600">
          Choose your exact form to see a personalized document checklist and
          prepare your files. Requirements are summarised from official sources.
        </p>
      </header>

      <div className="mt-6 max-w-2xl">
        <SearchBox />
      </div>

      {categories.map((cat) => (
        <section key={cat.category} className="mt-10">
          <h2 className="text-xl font-bold text-slate-900">{cat.label}</h2>
          <div className="mt-4 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {cat.forms.map((form) => (
              <FormCard key={form.slug} form={form} />
            ))}
          </div>
        </section>
      ))}
    </div>
  );
}
