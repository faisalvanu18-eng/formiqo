/**
 * Core domain models for Formiqo's rule-based requirements engine.
 *
 * The data shape is intentionally serialisable (plain JSON-compatible objects)
 * so that today it can live in local TS/JSON files and tomorrow be served from
 * a database/admin API without changing the engine or UI.
 */

/** Categories used to group forms on listing pages. */
export type FormCategory =
  | "recruitment"
  | "citizen-services"
  | "education";

/** How confident we are in a form/requirement's data. */
export type VerificationStatus = "verified" | "pending";

/** Accepted upload file kinds. */
export type UploadKind = "image" | "pdf" | "document";

/** Well-known document upload roles used for ZIP naming and icons. */
export type DocumentRole =
  | "photograph"
  | "signature"
  | "thumb-impression"
  | "handwritten-declaration"
  | "certificate"
  | "id-proof"
  | "address-proof"
  | "other";

/**
 * A single answer option for a conditional question.
 */
export interface QuestionOption {
  value: string;
  label: string;
}

/**
 * A conditional question. Only questions that can change the required
 * documents should be asked (see product spec §7).
 */
export interface Question {
  /** Stable id referenced by requirement/condition rules. */
  id: string;
  label: string;
  help?: string;
  options: QuestionOption[];
  /** Optional default answer value. */
  defaultValue?: string;
  /**
   * This question is only shown when the given condition evaluates true.
   * Enables nested/dependent questions.
   */
  showWhen?: Condition;
}

/**
 * A boolean rule evaluated against the user's answers.
 * Kept deliberately small and declarative so it is easy to author, validate
 * and later edit through an admin UI.
 */
export type Condition =
  | { all: Condition[] }
  | { any: Condition[] }
  | { not: Condition }
  | { equals: { questionId: string; value: string } }
  | { in: { questionId: string; values: string[] } }
  | { always: true };

export type Requirement = {
  id: string;
  /** Human document name, e.g. "Passport size photograph". */
  documentName: string;
  /** Group label for the checklist, e.g. "Identity Proof". */
  group?: string;
  role: DocumentRole;
  /**
   * "required": always required (given conditions).
   * "conditional": required only if `condition` is true.
   * "optional": helpful but not mandatory.
   */
  necessity: "required" | "conditional" | "optional";
  /** When present, requirement only applies if this evaluates true. */
  condition?: Condition;
  /** Short description shown under the document name. */
  description?: string;
  /**
   * Officially accepted alternative documents (the "I don't have this"
   * feature). Never invent these — leave empty if unverified.
   */
  alternatives?: string[];
  /** Whether the user must upload a file for this requirement. */
  requiresUpload: boolean;
  uploadRule?: UploadRule;
  notes?: string;
  sourceUrl?: string;
  lastVerified?: string;
  verification: VerificationStatus;
};

/**
 * Exact upload specification for a document. All size values are in bytes to
 * avoid unit ambiguity in the processing pipeline; helpers convert to KB/MB.
 */
export interface UploadRule {
  kind: UploadKind;
  /** e.g. ["image/jpeg"] or ["application/pdf"]. */
  acceptedFormats: string[];
  /** Preferred output format for image processing (mime). */
  targetFormat?: string;
  minFileSize?: number;
  maxFileSize?: number;
  /** Exact required pixel dimensions (image). */
  requiredWidth?: number;
  requiredHeight?: number;
  minWidth?: number;
  maxWidth?: number;
  minHeight?: number;
  maxHeight?: number;
  /** width / height, e.g. 3/4 for passport photos. */
  aspectRatio?: number;
  dpi?: number;
  /** PDF only. */
  pageLimit?: number;
  notes?: string;
}

/**
 * A concrete version of a form tied to Form + Year + Notification.
 * Requirements are attached at the version level so historical versions are
 * never overwritten (see spec §22).
 */
export interface FormVersion {
  id: string;
  /** Display label, e.g. "SSC CGL 2026". */
  label: string;
  year: number;
  applicationType?: string;
  authority: string;
  officialUrl: string;
  sourceUrl?: string;
  notification?: string;
  lastVerified?: string;
  verification: VerificationStatus;
  isCurrent: boolean;
  questions: Question[];
  requirements: Requirement[];
  /** FAQ entries used for on-page content and FAQPage structured data. */
  faqs?: { question: string; answer: string }[];
  /** Common mistakes list rendered on the form page. */
  commonMistakes?: string[];
}

/**
 * A form/service. May have multiple versions across years.
 */
export interface FormDefinition {
  /** URL slug, e.g. "ssc-cgl-2026". */
  slug: string;
  name: string;
  shortName?: string;
  category: FormCategory;
  authority: string;
  /** Search aliases: abbreviations, common spellings, Hinglish. */
  aliases: string[];
  /** One-line summary for cards and meta descriptions. */
  summary: string;
  /** Related form slugs for internal linking. */
  related?: string[];
  versions: FormVersion[];
}

/** User answers keyed by question id. */
export type Answers = Record<string, string>;

/** A requirement resolved for a specific set of answers. */
export interface ResolvedRequirement extends Requirement {
  /** True if this requirement is active given the current answers. */
  active: boolean;
}
