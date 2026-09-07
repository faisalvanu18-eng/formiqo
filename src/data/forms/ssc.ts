/**
 * SSC recruitment forms (CGL, CHSL, MTS, GD, CPO, Stenographer, Selection Post).
 *
 * The Staff Selection Commission uses a broadly consistent one-time
 * registration (OTR) upload spec across its exams. Upload sizes/dimensions
 * below reflect commonly published SSC OTR requirements. Because notification
 * numbers and exact 2026 figures must be confirmed against the live official
 * notification, form-level verification is marked "pending" and each page shows
 * a "verify on the official portal" notice.
 */
import type { FormDefinition, FormVersion } from "../../lib/types";
import {
  KB,
  documentRule,
  photoRule,
  questions,
  req,
  signatureRule,
  when,
} from "../builders";

const SSC_URL = "https://ssc.gov.in";
const SSC_AUTHORITY = "Staff Selection Commission (SSC)";

/**
 * Shared SSC upload requirements. SSC OTR photo/signature specs are used
 * across exams; individual exams may add category or PwD documents.
 */
function sscUploadRequirements() {
  return [
    req({
      id: "photo",
      documentName: "Recent Passport-size Photograph",
      group: "Upload Documents",
      role: "photograph",
      description:
        "Recent colour photograph with a light/white background, taken within the last three months.",
      requiresUpload: true,
      uploadRule: photoRule({
        minFileSize: 20 * KB,
        maxFileSize: 50 * KB,
        minWidth: 350,
        maxWidth: 1000,
        aspectRatio: 3 / 4,
        notes:
          "SSC OTR commonly requires a JPEG photo of 20–50 KB. Confirm exact pixels on the official notification.",
      }),
      notes:
        "Do not use selfies, filtered images, or photos with caps/sunglasses.",
      verification: "pending",
    }),
    req({
      id: "signature",
      documentName: "Signature",
      group: "Upload Documents",
      role: "signature",
      description:
        "Sign on white paper with black/blue ink and scan or photograph it.",
      requiresUpload: true,
      uploadRule: signatureRule({
        minFileSize: 10 * KB,
        maxFileSize: 20 * KB,
        aspectRatio: 3 / 1,
        notes:
          "SSC OTR commonly requires a JPEG signature of 10–20 KB. Confirm exact pixels on the official notification.",
      }),
      verification: "pending",
    }),
    req({
      id: "category-cert",
      documentName: "Category Certificate (OBC / SC / ST)",
      group: "Category / Eligibility",
      role: "certificate",
      necessity: "conditional",
      condition: when.oneOf("category", ["obc", "sc", "st"]),
      description:
        "Valid caste/category certificate in the prescribed format issued by a competent authority.",
      requiresUpload: true,
      uploadRule: documentRule(),
      alternatives: [],
      notes: "Required to claim reservation benefits under the relevant category.",
      verification: "pending",
    }),
    req({
      id: "ews-cert",
      documentName: "EWS Certificate (Income & Asset)",
      group: "Category / Eligibility",
      role: "certificate",
      necessity: "conditional",
      condition: when.equals("category", "ews"),
      description:
        "Income and Asset Certificate issued by a competent authority for EWS reservation.",
      requiresUpload: true,
      uploadRule: documentRule(),
      verification: "pending",
    }),
    req({
      id: "pwd-cert",
      documentName: "Disability Certificate (PwBD)",
      group: "Category / Eligibility",
      role: "certificate",
      necessity: "conditional",
      condition: when.equals("pwd", "yes"),
      description:
        "Certificate of disability issued by a competent medical authority.",
      requiresUpload: true,
      uploadRule: documentRule(),
      verification: "pending",
    }),
  ];
}

function sscQuestions() {
  return [questions.category(), questions.pwd()];
}

function sscFaqs(exam: string) {
  return [
    {
      question: `What photo size is required for ${exam}?`,
      answer:
        "SSC's one-time registration commonly accepts a JPEG photograph of about 20–50 KB with a light background. Always confirm the exact size and dimensions on the official SSC notification before uploading.",
    },
    {
      question: `What signature size is required for ${exam}?`,
      answer:
        "A JPEG signature file of roughly 10–20 KB is commonly required. Sign on white paper with black or blue ink for the clearest scan.",
    },
    {
      question: "Do I need a category certificate?",
      answer:
        "A valid category certificate (OBC/SC/ST) or EWS certificate is required only if you are claiming reservation under that category.",
    },
  ];
}

const sscCommonMistakes = [
  "Uploading a photo larger than the allowed file size — Formiqo compresses it for you.",
  "Using a photo with a busy background instead of a plain light background.",
  "Signing in pencil or a very thin pen so the signature is unclear.",
  "Selecting the wrong category and not having the matching certificate ready.",
];

function buildSscVersion(examLabel: string, id: string): FormVersion {
  return {
    id,
    label: `${examLabel} 2026`,
    year: 2026,
    authority: SSC_AUTHORITY,
    officialUrl: SSC_URL,
    sourceUrl: SSC_URL,
    notification: "Refer to the official SSC notification",
    lastVerified: "2026-01-01",
    verification: "pending",
    isCurrent: true,
    questions: sscQuestions(),
    requirements: sscUploadRequirements(),
    faqs: sscFaqs(examLabel),
    commonMistakes: sscCommonMistakes,
  };
}

const sscRelated = [
  "ssc-cgl-2026",
  "ssc-chsl-2026",
  "ssc-mts-2026",
  "ssc-gd-2026",
  "ssc-cpo-2026",
  "ssc-stenographer-2026",
  "ssc-selection-post-2026",
];

function sscForm(
  slug: string,
  name: string,
  shortName: string,
  aliases: string[],
  summary: string
): FormDefinition {
  return {
    slug,
    name,
    shortName,
    category: "recruitment",
    authority: SSC_AUTHORITY,
    aliases,
    summary,
    related: sscRelated.filter((s) => s !== slug),
    versions: [buildSscVersion(shortName, slug)],
  };
}

export const sscForms: FormDefinition[] = [
  sscForm(
    "ssc-cgl-2026",
    "SSC Combined Graduate Level (CGL) 2026",
    "SSC CGL",
    ["ssc cgl", "cgl", "combined graduate level", "ssc graduate"],
    "Documents, photo and signature upload requirements for SSC CGL 2026."
  ),
  sscForm(
    "ssc-chsl-2026",
    "SSC Combined Higher Secondary Level (CHSL) 2026",
    "SSC CHSL",
    ["ssc chsl", "chsl", "10+2", "higher secondary"],
    "Documents, photo and signature upload requirements for SSC CHSL 2026."
  ),
  sscForm(
    "ssc-mts-2026",
    "SSC Multi Tasking Staff (MTS) 2026",
    "SSC MTS",
    ["ssc mts", "mts", "multi tasking staff", "havaldar"],
    "Documents, photo and signature upload requirements for SSC MTS 2026."
  ),
  sscForm(
    "ssc-gd-2026",
    "SSC General Duty (GD) Constable 2026",
    "SSC GD",
    ["ssc gd", "gd constable", "gd", "constable gd"],
    "Documents, photo and signature upload requirements for SSC GD Constable 2026."
  ),
  sscForm(
    "ssc-cpo-2026",
    "SSC Central Police Organisation (CPO) 2026",
    "SSC CPO",
    ["ssc cpo", "cpo", "si delhi police", "sub inspector"],
    "Documents, photo and signature upload requirements for SSC CPO 2026."
  ),
  sscForm(
    "ssc-stenographer-2026",
    "SSC Stenographer Grade C & D 2026",
    "SSC Stenographer",
    ["ssc steno", "stenographer", "steno", "ssc stenographer"],
    "Documents, photo and signature upload requirements for SSC Stenographer 2026."
  ),
  sscForm(
    "ssc-selection-post-2026",
    "SSC Selection Post (Phase) 2026",
    "SSC Selection Post",
    ["ssc selection post", "selection post", "phase"],
    "Documents, photo and signature upload requirements for SSC Selection Post 2026."
  ),
];
