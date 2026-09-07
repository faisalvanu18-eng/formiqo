/**
 * Small authoring helpers so form data files stay concise and consistent.
 * These build well-typed objects with sensible defaults.
 */
import type { Condition, Question, Requirement, UploadRule } from "../lib/types";

export const KB = 1024;
export const MB = 1024 * 1024;

/** Common conditional questions reused across forms. */
export const questions = {
  applicationType(
    options: { value: string; label: string }[],
    defaultValue?: string
  ): Question {
    return {
      id: "applicationType",
      label: "What are you applying for?",
      options,
      defaultValue,
    };
  },
  applicant(): Question {
    return {
      id: "applicant",
      label: "Who is the applicant?",
      options: [
        { value: "adult", label: "Adult (18 or above)" },
        { value: "minor", label: "Minor (below 18)" },
      ],
      defaultValue: "adult",
    };
  },
  category(): Question {
    return {
      id: "category",
      label: "What is your category?",
      help: "Some documents are only required for reserved categories.",
      options: [
        { value: "general", label: "General / UR" },
        { value: "obc", label: "OBC" },
        { value: "sc", label: "SC" },
        { value: "st", label: "ST" },
        { value: "ews", label: "EWS" },
      ],
      defaultValue: "general",
    };
  },
  pwd(): Question {
    return {
      id: "pwd",
      label: "Are you a Person with Disability (PwD/PwBD)?",
      options: [
        { value: "no", label: "No" },
        { value: "yes", label: "Yes" },
      ],
      defaultValue: "no",
    };
  },
};

/** Condition builders. */
export const when = {
  equals(questionId: string, value: string): Condition {
    return { equals: { questionId, value } };
  },
  oneOf(questionId: string, values: string[]): Condition {
    return { in: { questionId, values } };
  },
  all(...conditions: Condition[]): Condition {
    return { all: conditions };
  },
  any(...conditions: Condition[]): Condition {
    return { any: conditions };
  },
  not(condition: Condition): Condition {
    return { not: condition };
  },
};

/** Standard passport-photo style image upload rule. */
export function photoRule(overrides: Partial<UploadRule> = {}): UploadRule {
  return {
    kind: "image",
    acceptedFormats: ["image/jpeg"],
    targetFormat: "image/jpeg",
    ...overrides,
  };
}

/** Standard signature image upload rule. */
export function signatureRule(overrides: Partial<UploadRule> = {}): UploadRule {
  return {
    kind: "image",
    acceptedFormats: ["image/jpeg"],
    targetFormat: "image/jpeg",
    ...overrides,
  };
}

/** Standard PDF upload rule. */
export function pdfRule(overrides: Partial<UploadRule> = {}): UploadRule {
  return {
    kind: "pdf",
    acceptedFormats: ["application/pdf"],
    ...overrides,
  };
}

/**
 * General supporting-document upload rule.
 *
 * Supporting documents (certificates, marksheets, ID/address proofs) do not
 * have a single official pixel spec — each portal differs. This rule lets the
 * user upload EITHER a PDF or an image (scan/photo) and the site fits it under
 * a generous, commonly-accepted size ceiling. The exact limit still varies by
 * portal, so the note reminds the user to confirm. Output can be switched to
 * image or PDF at download time.
 */
export function documentRule(overrides: Partial<UploadRule> = {}): UploadRule {
  return {
    kind: "document",
    acceptedFormats: ["application/pdf", "image/jpeg", "image/png"],
    // Sensible general ceiling — most govt portals accept up to a few hundred KB.
    maxFileSize: 300 * KB,
    notes:
      "General guideline: upload a clear scan or photo (PDF or image). Confirm the exact accepted size and format on the official portal.",
    ...overrides,
  };
}

/** Build a requirement with defaults filled in. */
export function req(r: Partial<Requirement> & Pick<Requirement, "id" | "documentName" | "role">): Requirement {
  return {
    necessity: "required",
    requiresUpload: false,
    verification: "pending",
    ...r,
  };
}
