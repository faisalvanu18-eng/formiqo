import Link from "next/link";
import type { FormDefinition } from "@/lib/types";
import { getCurrentVersion } from "@/data/registry";
import { ArrowRightIcon } from "./icons";

export function FormCard({ form }: { form: FormDefinition }) {
  const version = getCurrentVersion(form.versions);
  return (
    <Link
      href={`/forms/${form.slug}/`}
      className="group card flex flex-col p-5 transition hover:-translate-y-0.5 hover:shadow-cardhover"
    >
      <div className="flex items-start justify-between gap-3">
        <h3 className="font-semibold text-slate-900 group-hover:text-brand-700">
          {version.label}
        </h3>
        <ArrowRightIcon className="mt-1 h-4 w-4 shrink-0 text-slate-300 group-hover:text-brand-600" />
      </div>
      <p className="mt-1 text-sm text-slate-500">{form.authority}</p>
      <p className="mt-3 line-clamp-2 text-sm text-slate-600">{form.summary}</p>
    </Link>
  );
}
