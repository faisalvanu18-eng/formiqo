/**
 * Railway Recruitment Board (RRB) forms — NTPC, Group D, ALP, Technician.
 * Upload specs follow commonly published RRB CEN patterns. Verification is
 * marked "pending" pending confirmation against the live CEN notification.
 */
import type { FormDefinition, FormVersion } from "../../lib/types";
import { KB, documentRule, photoRule, questions, req, signatureRule, when } from "../builders";

const RRB_URL = "https://www.rrbcdg.gov.in";
const RRB_AUTHORITY = "Railway Recruitment Board (RRB)";

function rrbRequirements() {
  return [
    req({
      id: "photo",
      documentName: "Recent Colour Photograph",
      group: "Upload Documents",
      role: "photograph",
      description:
        "Recent colour photo with a light background, taken within the last three months.",
      requiresUpload: true,
      uploadRule: photoRule({
        minFileSize: 15 * KB,
        maxFileSize: 40 * KB,
        aspectRatio: 3 / 4,
        notes:
          "RRB CENs commonly ask for a JPEG photo around 15–40 KB. Confirm exact size on the live notification.",
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
        maxFileSize: 40 * KB,
        aspectRatio: 3 / 1,
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
  ];
}

const rrbRelated = [
  "rrb-ntpc-2026",
  "rrb-group-d-2026",
  "rrb-alp-2026",
  "rrb-technician-2026",
];

function rrbForm(
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
    authority: RRB_AUTHORITY,
    officialUrl: RRB_URL,
    sourceUrl: RRB_URL,
    notification: "Refer to the official RRB CEN",
    lastVerified: "2026-01-01",
    verification: "pending",
    isCurrent: true,
    questions: [questions.category(), questions.pwd()],
    requirements: rrbRequirements(),
    faqs: [
      {
        question: `What photo size is required for ${shortName}?`,
        answer:
          "RRB notifications commonly require a JPEG photograph of roughly 15–40 KB with a light background. Confirm the exact requirement on the official CEN.",
      },
    ],
    commonMistakes: [
      "Uploading a blurred or low-resolution photograph.",
      "Not keeping the same photo and signature used at registration.",
    ],
  };
  return {
    slug,
    name,
    shortName,
    category: "recruitment",
    authority: RRB_AUTHORITY,
    aliases,
    summary,
    related: rrbRelated.filter((s) => s !== slug),
    versions: [version],
  };
}

export const rrbForms: FormDefinition[] = [
  rrbForm(
    "rrb-ntpc-2026",
    "RRB Non-Technical Popular Categories (NTPC) 2026",
    "RRB NTPC",
    ["rrb ntpc", "ntpc", "railway ntpc", "non technical"],
    "Documents, photo and signature upload requirements for RRB NTPC 2026."
  ),
  rrbForm(
    "rrb-group-d-2026",
    "RRB Group D 2026",
    "RRB Group D",
    ["rrb group d", "group d", "railway group d", "level 1"],
    "Documents, photo and signature upload requirements for RRB Group D 2026."
  ),
  rrbForm(
    "rrb-alp-2026",
    "RRB Assistant Loco Pilot (ALP) 2026",
    "RRB ALP",
    ["rrb alp", "alp", "assistant loco pilot", "loco pilot"],
    "Documents, photo and signature upload requirements for RRB ALP 2026."
  ),
  rrbForm(
    "rrb-technician-2026",
    "RRB Technician 2026",
    "RRB Technician",
    ["rrb technician", "technician", "railway technician"],
    "Documents, photo and signature upload requirements for RRB Technician 2026."
  ),
];
