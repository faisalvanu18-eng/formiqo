/**
 * Additional education/eligibility exams: CTET and GATE.
 * Upload specs follow commonly published information-bulletin patterns.
 * Verification "pending" until confirmed against the official bulletin.
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

/* -------------------------------- CTET ---------------------------------- */

function ctetForm(): FormDefinition {
  const slug = "ctet-2026";
  const version: FormVersion = {
    id: slug,
    label: "CTET 2026",
    year: 2026,
    authority: "Central Board of Secondary Education (CBSE)",
    officialUrl: "https://ctet.nic.in",
    sourceUrl: "https://ctet.nic.in",
    notification: "Refer to the official CTET information bulletin",
    lastVerified: "2026-01-01",
    verification: "pending",
    isCurrent: true,
    questions: [questions.category(), questions.pwd()],
    requirements: [
      req({
        id: "photo",
        documentName: "Recent Passport-size Photograph",
        group: "Upload Documents",
        role: "photograph",
        description:
          "Recent colour photograph (approximately 3.5 × 4.5 cm) with a light background.",
        requiresUpload: true,
        uploadRule: photoRule({
          minFileSize: 10 * KB,
          maxFileSize: 100 * KB,
          aspectRatio: 3.5 / 4.5,
          notes:
            "CTET commonly requires a JPEG photo of about 3.5 × 4.5 cm, 10–100 KB. Confirm on the official bulletin.",
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
          minFileSize: 3 * KB,
          maxFileSize: 30 * KB,
          aspectRatio: 3 / 1,
          notes:
            "Signature commonly a JPEG of about 3.5 × 1.5 cm, 3–30 KB. Confirm on the official bulletin.",
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
    ],
    faqs: [
      {
        question: "What photo and signature size is required for CTET?",
        answer:
          "CTET commonly requires a JPEG photograph of about 3.5 × 4.5 cm (10–100 KB) and a signature of about 3.5 × 1.5 cm (3–30 KB). Always confirm the exact figures on the official CTET information bulletin.",
      },
      {
        question: "Which papers can I apply for in CTET?",
        answer:
          "Paper I is for teaching Classes I–V and Paper II for Classes VI–VIII. You can apply for one or both papers depending on your eligibility.",
      },
    ],
    commonMistakes: [
      "Uploading a photo without a light/plain background.",
      "Signature image too small or unclear.",
      "Not keeping the category certificate ready when claiming relaxation.",
    ],
  };
  return {
    slug,
    name: "Central Teacher Eligibility Test (CTET) 2026",
    shortName: "CTET",
    category: "education",
    authority: "Central Board of Secondary Education (CBSE)",
    aliases: ["ctet", "cbse ctet", "central teacher eligibility test", "teacher eligibility"],
    summary: "Photo and signature upload requirements for CTET 2026.",
    related: ["gate-2026", "cuet-2026"],
    versions: [version],
  };
}

/* -------------------------------- GATE ---------------------------------- */

function gateForm(): FormDefinition {
  const slug = "gate-2026";
  const version: FormVersion = {
    id: slug,
    label: "GATE 2026",
    year: 2026,
    authority: "IIT / IISc (GATE Organising Institute)",
    officialUrl: "https://gate.iitk.ac.in",
    sourceUrl: "https://gate.iitk.ac.in",
    notification: "Refer to the official GATE information brochure",
    lastVerified: "2026-01-01",
    verification: "pending",
    isCurrent: true,
    questions: [questions.category(), questions.pwd()],
    requirements: [
      req({
        id: "photo",
        documentName: "Recent Passport-size Photograph",
        group: "Upload Documents",
        role: "photograph",
        description:
          "Recent colour photograph as per the GATE photo guidelines (light background, full face).",
        requiresUpload: true,
        uploadRule: photoRule({
          minFileSize: 5 * KB,
          maxFileSize: 1024 * KB,
          aspectRatio: 3 / 4,
          notes:
            "GATE follows detailed photo guidelines. Confirm exact dimensions and size on the official brochure.",
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
          minFileSize: 5 * KB,
          maxFileSize: 200 * KB,
          aspectRatio: 3 / 1,
        }),
        verification: "pending",
      }),
      req({
        id: "degree-cert",
        documentName: "Degree Certificate / Provisional Certificate",
        group: "Educational Proof",
        role: "certificate",
        description:
          "Degree certificate, or a certificate from the Head of Department/Institute for students in their final year.",
        requiresUpload: true,
        uploadRule: documentRule(),
        verification: "pending",
      }),
      req({
        id: "photo-id",
        documentName: "Photo Identity Proof",
        group: "Identity Proof",
        role: "id-proof",
        description:
          "A valid government photo ID; the same ID must be carried to the exam centre.",
        alternatives: [
          "Aadhaar Card",
          "Passport",
          "Voter ID (EPIC)",
          "PAN Card",
          "Driving Licence",
        ],
        requiresUpload: true,
        uploadRule: documentRule(),
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
    ],
    faqs: [
      {
        question: "What documents are required for GATE?",
        answer:
          "You generally need a recent photograph and signature as per GATE guidelines, a degree or final-year certificate, a valid photo ID, and a category/PwD certificate if you are claiming relaxation. Confirm the exact requirements on the official GATE brochure.",
      },
    ],
    commonMistakes: [
      "Uploading a photo that does not meet the GATE photo guidelines.",
      "Using a photo ID different from the one carried to the exam centre.",
      "Final-year students not uploading the required certificate from the institute.",
    ],
  };
  return {
    slug,
    name: "Graduate Aptitude Test in Engineering (GATE) 2026",
    shortName: "GATE",
    category: "education",
    authority: "IIT / IISc (GATE)",
    aliases: ["gate", "gate exam", "graduate aptitude test", "gate engineering"],
    summary: "Photo, signature and document upload requirements for GATE 2026.",
    related: ["jee-main-2026", "cuet-2026"],
    versions: [version],
  };
}

export const educationMoreForms: FormDefinition[] = [ctetForm(), gateForm()];
