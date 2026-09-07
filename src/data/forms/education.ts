/**
 * Education entrance/scholarship forms: NEET, JEE Main, CUET, Scholarships.
 * Upload specs follow commonly published patterns; verification "pending".
 */
import type { FormDefinition, FormVersion } from "../../lib/types";
import { KB, documentRule, photoRule, questions, req, signatureRule, when } from "../builders";

function examUploadRequirements(opts: {
  hasThumb?: boolean;
  photoMax?: number;
  sigMax?: number;
}) {
  const reqs = [
    req({
      id: "photo",
      documentName: "Recent Passport-size Photograph",
      group: "Upload Documents",
      role: "photograph",
      description:
        "Recent colour photo with a light background and, where required, the candidate's name and date printed on it.",
      requiresUpload: true,
      uploadRule: photoRule({
        minFileSize: 10 * KB,
        maxFileSize: opts.photoMax ?? 200 * KB,
        aspectRatio: 3 / 4,
        notes:
          "Confirm the exact size and whether a name/date imprint is needed on the official information bulletin.",
      }),
      verification: "pending",
    }),
    req({
      id: "signature",
      documentName: "Signature",
      group: "Upload Documents",
      role: "signature",
      requiresUpload: true,
      uploadRule: signatureRule({
        minFileSize: 4 * KB,
        maxFileSize: opts.sigMax ?? 30 * KB,
        aspectRatio: 3 / 1,
      }),
      verification: "pending",
    }),
    req({
      id: "category-cert",
      documentName: "Category Certificate (OBC-NCL / SC / ST)",
      group: "Category / Eligibility",
      role: "certificate",
      necessity: "conditional",
      condition: when.oneOf("category", ["obc", "sc", "st"]),
      requiresUpload: true,
      uploadRule: documentRule(),
      verification: "pending",
    }),
    req({
      id: "ews-cert",
      documentName: "EWS Certificate",
      group: "Category / Eligibility",
      role: "certificate",
      necessity: "conditional",
      condition: when.equals("category", "ews"),
      requiresUpload: true,
      uploadRule: documentRule(),
      verification: "pending",
    }),
    req({
      id: "pwd-cert",
      documentName: "PwD/PwBD Certificate",
      group: "Category / Eligibility",
      role: "certificate",
      necessity: "conditional",
      condition: when.equals("pwd", "yes"),
      requiresUpload: true,
      uploadRule: documentRule(),
      verification: "pending",
    }),
  ];
  if (opts.hasThumb) {
    reqs.splice(
      2,
      0,
      req({
        id: "left-thumb",
        documentName: "Left Thumb Impression",
        group: "Upload Documents",
        role: "thumb-impression",
        requiresUpload: true,
        uploadRule: photoRule({ minFileSize: 4 * KB, maxFileSize: 30 * KB }),
        verification: "pending",
      })
    );
  }
  return reqs;
}

function examForm(
  slug: string,
  name: string,
  shortName: string,
  authority: string,
  officialUrl: string,
  aliases: string[],
  summary: string,
  opts: { hasThumb?: boolean; photoMax?: number; sigMax?: number } = {}
): FormDefinition {
  const version: FormVersion = {
    id: slug,
    label: `${shortName} 2026`,
    year: 2026,
    authority,
    officialUrl,
    sourceUrl: officialUrl,
    lastVerified: "2026-01-01",
    verification: "pending",
    isCurrent: true,
    questions: [questions.category(), questions.pwd()],
    requirements: examUploadRequirements(opts),
    faqs: [
      {
        question: `What photo and signature size does ${shortName} require?`,
        answer:
          "The photograph and signature are usually uploaded as JPEG files within specific size limits, sometimes with a left thumb impression. Confirm the exact figures on the official information bulletin.",
      },
    ],
    commonMistakes: [
      "Uploading a photo without the required name/date imprint (when applicable).",
      "Signature file too small or unclear.",
      "Not keeping the category certificate ready when claiming reservation.",
    ],
  };
  return {
    slug,
    name,
    shortName,
    category: "education",
    authority,
    aliases,
    summary,
    related: ["neet-2026", "jee-main-2026", "cuet-2026"].filter(
      (s) => s !== slug
    ),
    versions: [version],
  };
}

function scholarshipForm(): FormDefinition {
  const slug = "government-scholarship";
  const version: FormVersion = {
    id: slug,
    label: "Government Scholarship",
    year: 2026,
    authority: "National Scholarship Portal (NSP) / State portals",
    officialUrl: "https://scholarships.gov.in",
    sourceUrl: "https://scholarships.gov.in",
    lastVerified: "2026-01-01",
    verification: "pending",
    isCurrent: true,
    questions: [questions.category()],
    requirements: [
      req({
        id: "photo",
        documentName: "Photograph",
        group: "Upload Documents",
        role: "photograph",
        requiresUpload: true,
        uploadRule: photoRule({ minFileSize: 10 * KB, maxFileSize: 200 * KB }),
        verification: "pending",
      }),
      req({
        id: "marksheet",
        documentName: "Previous Class Marksheet",
        group: "Educational Proof",
        role: "certificate",
        requiresUpload: true,
      uploadRule: documentRule(),
        verification: "pending",
      }),
      req({
        id: "income-cert",
        documentName: "Income Certificate",
        group: "Supporting Documents",
        role: "certificate",
        description: "Family income certificate as required by the scheme.",
        requiresUpload: true,
      uploadRule: documentRule(),
        verification: "pending",
      }),
      req({
        id: "category-cert",
        documentName: "Category Certificate",
        group: "Category / Eligibility",
        role: "certificate",
        necessity: "conditional",
        condition: when.oneOf("category", ["obc", "sc", "st"]),
        requiresUpload: true,
      uploadRule: documentRule(),
        verification: "pending",
      }),
      req({
        id: "bank-passbook",
        documentName: "Bank Passbook (for DBT)",
        group: "Supporting Documents",
        role: "certificate",
        description: "Bank account details for Direct Benefit Transfer.",
        requiresUpload: true,
      uploadRule: documentRule(),
        verification: "pending",
      }),
    ],
    faqs: [
      {
        question: "What documents are needed for a government scholarship?",
        answer:
          "Commonly a photograph, previous marksheet, income certificate, category certificate (if applicable) and bank passbook for DBT. Exact documents depend on the specific scheme on the National Scholarship Portal or your State portal.",
      },
    ],
    commonMistakes: [
      "Bank account not seeded with Aadhaar for DBT.",
      "Uploading an income certificate that has expired.",
    ],
  };
  return {
    slug,
    name: "Government Scholarship Application",
    shortName: "Scholarship",
    category: "education",
    authority: "National Scholarship Portal (NSP)",
    aliases: ["scholarship", "nsp", "government scholarship", "pre matric", "post matric"],
    summary: "Documents commonly required for government scholarship applications.",
    related: ["neet-2026", "cuet-2026"],
    versions: [version],
  };
}

export const educationForms: FormDefinition[] = [
  examForm(
    "neet-2026",
    "NEET (UG) 2026",
    "NEET",
    "National Testing Agency (NTA)",
    "https://neet.nta.nic.in",
    ["neet", "neet ug", "medical entrance", "mbbs entrance"],
    "Photo, signature and thumb impression requirements for NEET (UG) 2026.",
    { hasThumb: true }
  ),
  examForm(
    "jee-main-2026",
    "JEE Main 2026",
    "JEE Main",
    "National Testing Agency (NTA)",
    "https://jeemain.nta.nic.in",
    ["jee", "jee main", "engineering entrance", "iit entrance"],
    "Photo and signature upload requirements for JEE Main 2026."
  ),
  examForm(
    "cuet-2026",
    "CUET (UG) 2026",
    "CUET",
    "National Testing Agency (NTA)",
    "https://cuet.nta.nic.in",
    ["cuet", "cuet ug", "common university entrance"],
    "Photo and signature upload requirements for CUET (UG) 2026."
  ),
  scholarshipForm(),
];
