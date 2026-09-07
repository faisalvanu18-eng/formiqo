/**
 * Data access layer / registry.
 *
 * This is the ONLY module the UI imports to read form data. Today it loads from
 * local TS files; a future backend/admin can replace the internals here (e.g.
 * fetch from an API at build time) without changing components or the engine.
 */
import type { FormCategory, FormDefinition } from "../lib/types";
import { getCurrentVersion } from "../lib/engine";
import { sscForms } from "./forms/ssc";
import { rrbForms } from "./forms/rrb";
import { bankingForms, upscForms } from "./forms/recruitment-extra";
import { citizenForms } from "./forms/citizen";
import { educationForms } from "./forms/education";

/** All forms in the system, in a stable order. */
export const allForms: FormDefinition[] = [
  ...sscForms,
  ...rrbForms,
  ...upscForms,
  ...bankingForms,
  ...citizenForms,
  ...educationForms,
];

export const categoryLabels: Record<FormCategory, string> = {
  recruitment: "Government Recruitment",
  "citizen-services": "Citizen Services",
  education: "Education",
};

export const categoryOrder: FormCategory[] = [
  "recruitment",
  "citizen-services",
  "education",
];

/** Look up a form by slug. */
export function getFormBySlug(slug: string): FormDefinition | undefined {
  return allForms.find((f) => f.slug === slug);
}

/** All slugs — used for static path generation. */
export function getAllSlugs(): string[] {
  return allForms.map((f) => f.slug);
}

/** Forms grouped by category, preserving order. */
export function getFormsByCategory(): {
  category: FormCategory;
  label: string;
  forms: FormDefinition[];
}[] {
  return categoryOrder.map((category) => ({
    category,
    label: categoryLabels[category],
    forms: allForms.filter((f) => f.category === category),
  }));
}

/** Resolve related forms (skips missing slugs). */
export function getRelatedForms(form: FormDefinition): FormDefinition[] {
  return (form.related ?? [])
    .map((slug) => getFormBySlug(slug))
    .filter((f): f is FormDefinition => Boolean(f));
}

function normalise(s: string): string {
  return s.toLowerCase().replace(/[^a-z0-9]+/g, " ").trim();
}

/**
 * Lightweight fuzzy-ish search over name, short name, aliases and authority.
 * Scored so exact/prefix matches rank above partial token matches.
 * Runs client-side; no server needed.
 */
export function searchForms(query: string, limit = 20): FormDefinition[] {
  const q = normalise(query);
  if (!q) return [];
  const tokens = q.split(" ").filter(Boolean);

  const scored = allForms
    .map((form) => {
      const haystacks = [
        form.name,
        form.shortName ?? "",
        form.authority,
        ...form.aliases,
        getCurrentVersion(form.versions).label,
      ].map(normalise);

      let score = 0;
      for (const hay of haystacks) {
        if (hay === q) score += 100;
        if (hay.startsWith(q)) score += 40;
        if (hay.includes(q)) score += 20;
        for (const t of tokens) {
          if (hay === t) score += 12;
          else if (hay.startsWith(t)) score += 6;
          else if (hay.includes(t)) score += 3;
        }
      }
      return { form, score };
    })
    .filter((s) => s.score > 0)
    .sort((a, b) => b.score - a.score)
    .slice(0, limit)
    .map((s) => s.form);

  return scored;
}

export { getCurrentVersion };
