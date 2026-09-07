/**
 * Banking (IBPS / SBI) and UPSC recruitment forms.
 * Upload specs follow commonly published patterns; verification "pending".
 */
import type { FormDefinition, FormVersion } from "../../lib/types";
import { KB, documentRule, photoRule, questions, req, signatureRule, when } from "../builders";

function bankingRequirements() {
  return [
    req({
      id: "photo",
      documentName: "Recent Passport-size Photograph",
      group: "Upload Documents",
      role: "photograph",
      requiresUpload: true,
      uploadRule: photoRule({
        minFileSize: 20 * KB,
        maxFileSize: 50 * KB,
        requiredWidth: 200,
        requiredHeight: 230,
        notes:
          "Banking exams commonly require ~200x230 px JPEG photos of 20–50 KB. Confirm on the official advertisement.",
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
        minFileSize: 10 * KB,
        maxFileSize: 20 * KB,
        requiredWidth: 140,
        requiredHeight: 60,
      }),
      verification: "pending",
    }),
    req({
      id: "handwritten-declaration",
      documentName: "Handwritten Declaration",
      group: "Upload Documents",
      role: "handwritten-declaration",
      description:
        "A declaration written by hand in running handwriting, as specified in the advertisement.",
      requiresUpload: true,
      uploadRule: photoRule({
        minFileSize: 10 * KB,
        maxFileSize: 50 * KB,
        requiredWidth: 800,
        requiredHeight: 400,
        notes: "Must be handwritten by the candidate, not typed or capitalised.",
      }),
      verification: "pending",
    }),
    req({
      id: "left-thumb",
      documentName: "Left Thumb Impression",
      group: "Upload Documents",
      role: "thumb-impression",
      description: "Left thumb impression on white paper with blue/black ink.",
      requiresUpload: true,
      uploadRule: photoRule({
        minFileSize: 20 * KB,
        maxFileSize: 50 * KB,
        requiredWidth: 240,
        requiredHeight: 240,
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
      requiresUpload: true,
      uploadRule: documentRule(),
      verification: "pending",
    }),
  ];
}

const bankingRelated = [
  "ibps-po-2026",
  "ibps-clerk-2026",
  "sbi-po-2026",
  "sbi-clerk-2026",
];

function bankingForm(
  slug: string,
  name: string,
  shortName: string,
  authority: string,
  officialUrl: string,
  aliases: string[],
  summary: string
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
    requirements: bankingRequirements(),
    faqs: [
      {
        question: `What documents do I upload for ${shortName}?`,
        answer:
          "Typically a photograph, signature, a handwritten declaration and a left thumb impression, plus a category certificate if you are claiming reservation. Confirm the exact list on the official advertisement.",
      },
    ],
    commonMistakes: [
      "Typing the declaration instead of writing it by hand.",
      "Using capital letters for the handwritten declaration.",
      "Uploading the wrong thumb impression.",
    ],
  };
  return {
    slug,
    name,
    shortName,
    category: "recruitment",
    authority,
    aliases,
    summary,
    related: bankingRelated.filter((s) => s !== slug),
    versions: [version],
  };
}

export const bankingForms: FormDefinition[] = [
  bankingForm(
    "ibps-po-2026",
    "IBPS Probationary Officer (PO) 2026",
    "IBPS PO",
    "Institute of Banking Personnel Selection (IBPS)",
    "https://www.ibps.in",
    ["ibps po", "ibps", "bank po", "probationary officer"],
    "Photo, signature, declaration and thumb impression requirements for IBPS PO 2026."
  ),
  bankingForm(
    "ibps-clerk-2026",
    "IBPS Clerk 2026",
    "IBPS Clerk",
    "Institute of Banking Personnel Selection (IBPS)",
    "https://www.ibps.in",
    ["ibps clerk", "bank clerk", "clerk"],
    "Photo, signature, declaration and thumb impression requirements for IBPS Clerk 2026."
  ),
  bankingForm(
    "sbi-po-2026",
    "SBI Probationary Officer (PO) 2026",
    "SBI PO",
    "State Bank of India (SBI)",
    "https://sbi.co.in/web/careers",
    ["sbi po", "sbi", "state bank po"],
    "Photo, signature, declaration and thumb impression requirements for SBI PO 2026."
  ),
  bankingForm(
    "sbi-clerk-2026",
    "SBI Clerk (Junior Associate) 2026",
    "SBI Clerk",
    "State Bank of India (SBI)",
    "https://sbi.co.in/web/careers",
    ["sbi clerk", "junior associate", "state bank clerk"],
    "Photo, signature, declaration and thumb impression requirements for SBI Clerk 2026."
  ),
];

function upscRequirements() {
  return [
    req({
      id: "photo",
      documentName: "Photograph with Name & Date",
      group: "Upload Documents",
      role: "photograph",
      description:
        "Recent photograph. UPSC commonly requires the candidate's name and the date of the photo to be printed on it.",
      requiresUpload: true,
      uploadRule: photoRule({
        minFileSize: 20 * KB,
        maxFileSize: 300 * KB,
        notes:
          "Confirm the exact size, and whether the name/date imprint is required, on the official UPSC notification.",
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
        minFileSize: 20 * KB,
        maxFileSize: 300 * KB,
      }),
      verification: "pending",
    }),
    req({
      id: "photo-id",
      documentName: "Photo Identity Proof",
      group: "Identity Proof",
      role: "id-proof",
      description: "Any government photo ID used at registration.",
      alternatives: [
        "Aadhaar Card",
        "Voter ID (EPIC)",
        "PAN Card",
        "Passport",
        "Driving Licence",
      ],
      requiresUpload: true,
      uploadRule: documentRule(),
      verification: "pending",
    }),
  ];
}

const upscRelated = ["upsc-cse-2026", "upsc-nda-2026", "upsc-cds-2026"];

function upscForm(
  slug: string,
  name: string,
  shortName: string,
  aliases: string[],
  summary: string
): FormDefinition {
  const version: FormVersion = {
    id: slug,
    label: `${shortName} 2026`,
    year: 2026,
    authority: "Union Public Service Commission (UPSC)",
    officialUrl: "https://upsc.gov.in",
    sourceUrl: "https://upsconline.nic.in",
    lastVerified: "2026-01-01",
    verification: "pending",
    isCurrent: true,
    questions: [questions.category(), questions.pwd()],
    requirements: upscRequirements(),
    faqs: [
      {
        question: `What photo does ${shortName} require?`,
        answer:
          "UPSC has, in recent cycles, required the candidate's name and the date of the photograph to be printed on the image. Always confirm the current requirement on the official UPSC notification.",
      },
    ],
    commonMistakes: [
      "Uploading a photo without the required name and date imprint.",
      "Using a photo older than the allowed period.",
    ],
  };
  return {
    slug,
    name,
    shortName,
    category: "recruitment",
    authority: "Union Public Service Commission (UPSC)",
    aliases,
    summary,
    related: upscRelated.filter((s) => s !== slug),
    versions: [version],
  };
}

export const upscForms: FormDefinition[] = [
  upscForm(
    "upsc-cse-2026",
    "UPSC Civil Services Examination (CSE) 2026",
    "UPSC CSE",
    ["upsc", "upsc cse", "civil services", "ias", "ips", "prelims"],
    "Photo, signature and identity requirements for UPSC Civil Services 2026."
  ),
  upscForm(
    "upsc-nda-2026",
    "UPSC National Defence Academy (NDA) 2026",
    "UPSC NDA",
    ["nda", "upsc nda", "national defence academy"],
    "Photo, signature and identity requirements for UPSC NDA 2026."
  ),
  upscForm(
    "upsc-cds-2026",
    "UPSC Combined Defence Services (CDS) 2026",
    "UPSC CDS",
    ["cds", "upsc cds", "combined defence services"],
    "Photo, signature and identity requirements for UPSC CDS 2026."
  ),
];
