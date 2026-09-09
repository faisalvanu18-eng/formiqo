import type { Metadata } from "next";
import { FormCard } from "@/components/FormCard";
import { SearchBox } from "@/components/SearchBox";
import { JsonLd } from "@/components/JsonLd";
import { siteConfig } from "@/config/site";
import { getFormsByCategory, allForms } from "@/data/registry";

export const metadata: Metadata = {
  title: "All Government Forms & Document Requirements",
  description:
    "Browse all supported Indian government forms — recruitment exams (SSC, UPSC, Railway, Banking, Agniveer), citizen services (passport, PAN, Aadhaar, EPF) and education (NEET, JEE, CTET, GATE). See documents required and photo/signature upload size.",
  keywords: [
    "government form documents required",
    "documents required list",
    "photo signature upload size",
    "sarkari form documents",
    "exam photo size",
    "government exam documents",
  ],
  alternates: { canonical: "/forms/" },
};

export default function FormsIndexPage() {
  const categories = getFormsByCategory();

  const itemListJsonLd = {
    "@context": "https://schema.org",
    "@type": "ItemList",
    name: "All government forms and exams on Formiqo",
    itemListElement: allForms.map((form, i) => ({
      "@type": "ListItem",
      position: i + 1,
      name: form.name,
      url: `${siteConfig.url}/forms/${form.slug}/`,
    })),
  };

  return (
    <div className="container-page py-10">
      <JsonLd data={itemListJsonLd} />
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
