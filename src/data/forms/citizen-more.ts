/**
 * Additional high-search-volume citizen services:
 * Aadhaar (enrol/update), ABHA (Ayushman Bharat Health Account),
 * EPFO/UAN, Birth Certificate, Death Certificate, Marriage Registration.
 *
 * Document lists are summarised in original wording. Verification "pending"
 * until confirmed against the relevant official portal, and each page shows a
 * "confirm on the official portal" note.
 */
import type { FormDefinition, FormVersion } from "../../lib/types";
import {
  KB,
  documentRule,
  photoRule,
  questions,
  req,
  when,
} from "../builders";

/* ------------------------------- Aadhaar -------------------------------- */

function aadhaarForm(isNew: boolean): FormDefinition {
  const slug = isNew ? "aadhaar-enrolment" : "aadhaar-update";
  const shortName = isNew ? "Aadhaar (New Enrolment)" : "Aadhaar (Update)";
  const version: FormVersion = {
    id: slug,
    label: shortName,
    year: 2026,
    applicationType: isNew ? "New Enrolment" : "Update / Correction",
    authority: "Unique Identification Authority of India (UIDAI)",
    officialUrl: "https://uidai.gov.in",
    sourceUrl: "https://myaadhaar.uidai.gov.in",
    lastVerified: "2026-01-01",
    verification: "pending",
    isCurrent: true,
    questions: [],
    requirements: [
      req({
        id: "proof-of-identity",
        documentName: "Proof of Identity (PoI)",
        group: "Identity Proof",
        role: "id-proof",
        description: "Any one document from the UIDAI list of valid identity documents.",
        alternatives: [
          "PAN Card",
          "Passport",
          "Voter ID (EPIC)",
          "Driving Licence",
          "Ration Card with photo",
        ],
        requiresUpload: true,
        uploadRule: documentRule(),
        verification: "pending",
      }),
      req({
        id: "proof-of-address",
        documentName: "Proof of Address (PoA)",
        group: "Address Proof",
        role: "address-proof",
        description: "Any one document from the UIDAI list of valid address documents.",
        alternatives: [
          "Passport",
          "Voter ID (EPIC)",
          "Electricity / Water / Gas bill",
          "Bank passbook / statement",
          "Rent agreement (registered)",
        ],
        requiresUpload: true,
        uploadRule: documentRule(),
        verification: "pending",
      }),
      req({
        id: "proof-of-dob",
        documentName: "Proof of Date of Birth (DoB)",
        group: "Date of Birth Proof",
        role: "certificate",
        alternatives: [
          "Birth Certificate",
          "10th (Matriculation) Certificate",
          "PAN Card",
          "Passport",
        ],
        requiresUpload: true,
        uploadRule: documentRule(),
        verification: "pending",
      }),
      req({
        id: "proof-of-relationship",
        documentName: "Proof of Relationship (for child / head of family)",
        group: "Supporting Documents",
        role: "certificate",
        necessity: "optional",
        description:
          "For a child's enrolment, a relationship document (e.g. birth certificate) linking to the head of family may be required.",
        requiresUpload: false,
        verification: "pending",
      }),
    ],
    faqs: [
      {
        question: `What documents are required for ${
          isNew ? "a new Aadhaar" : "an Aadhaar update"
        }?`,
        answer:
          "UIDAI accepts documents in four categories — Proof of Identity, Proof of Address, Proof of Date of Birth and (for children) Proof of Relationship. You need one valid document from each applicable category. Always confirm the current accepted list on the UIDAI portal.",
      },
      {
        question: "Do I upload documents or visit a centre for Aadhaar?",
        answer:
          "New enrolment and biometric updates are done at an Aadhaar centre with original documents. Certain updates (like address) can be done online on myAadhaar by uploading a scanned document. Confirm the current process on the UIDAI portal.",
      },
    ],
    commonMistakes: [
      "Address on the proof not matching the address being entered.",
      "Uploading a blurred scan that gets rejected during verification.",
    ],
  };
  return {
    slug,
    name: isNew
      ? "Aadhaar Card — New Enrolment"
      : "Aadhaar Card — Update / Correction",
    shortName,
    category: "citizen-services",
    authority: "Unique Identification Authority of India (UIDAI)",
    aliases: isNew
      ? ["aadhaar", "aadhar", "new aadhaar", "aadhaar enrolment", "aadhaar card apply"]
      : [
          "aadhaar update",
          "aadhar update",
          "aadhaar correction",
          "update aadhaar address",
          "aadhaar name change",
        ],
    summary: isNew
      ? "Documents required for a new Aadhaar enrolment."
      : "Documents required to update or correct Aadhaar details.",
    related: ["aadhaar-enrolment", "aadhaar-update", "pan-card-new"].filter(
      (s) => s !== slug
    ),
    versions: [version],
  };
}

/* --------------------------------- ABHA --------------------------------- */

function abhaForm(): FormDefinition {
  const slug = "abha-health-id";
  const version: FormVersion = {
    id: slug,
    label: "ABHA Health ID (Ayushman Bharat)",
    year: 2026,
    authority: "National Health Authority (Ayushman Bharat Digital Mission)",
    officialUrl: "https://abha.abdm.gov.in",
    sourceUrl: "https://abdm.gov.in",
    lastVerified: "2026-01-01",
    verification: "pending",
    isCurrent: true,
    questions: [],
    requirements: [
      req({
        id: "identity-proof",
        documentName: "Aadhaar or Driving Licence",
        group: "Identity Proof",
        role: "id-proof",
        description:
          "ABHA is commonly created using Aadhaar (with OTP) or a Driving Licence.",
        alternatives: ["Aadhaar Card", "Driving Licence"],
        requiresUpload: true,
        uploadRule: documentRule(),
        verification: "pending",
      }),
      req({
        id: "mobile",
        documentName: "Mobile Number (for OTP)",
        group: "Supporting Documents",
        role: "other",
        description:
          "A mobile number is needed to receive the OTP used to create your ABHA.",
        requiresUpload: false,
        verification: "pending",
      }),
    ],
    faqs: [
      {
        question: "What documents are required to create an ABHA health ID?",
        answer:
          "An ABHA (Ayushman Bharat Health Account) number is usually created online using your Aadhaar with OTP verification, or a Driving Licence, along with a mobile number. Confirm the current process on the official ABDM portal.",
      },
      {
        question: "Is ABHA the same as the Ayushman card?",
        answer:
          "No. ABHA is a digital health ID that links your health records. The Ayushman Bharat (PM-JAY) golden card is a separate health-insurance card for eligible families.",
      },
    ],
    commonMistakes: [
      "Mobile number not linked with Aadhaar when using Aadhaar OTP.",
      "Confusing ABHA (health ID) with the PM-JAY insurance card.",
    ],
  };
  return {
    slug,
    name: "ABHA Health ID (Ayushman Bharat) Registration",
    shortName: "ABHA Health ID",
    category: "citizen-services",
    authority: "National Health Authority (ABDM)",
    aliases: [
      "abha",
      "abha card",
      "ayushman bharat health account",
      "health id",
      "abha health id",
      "abdm",
    ],
    summary: "Documents required to create an ABHA (Ayushman Bharat) health ID.",
    related: ["aadhaar-enrolment"],
    versions: [version],
  };
}

/* --------------------------------- EPFO --------------------------------- */

function epfoForm(): FormDefinition {
  const slug = "epf-withdrawal";
  const version: FormVersion = {
    id: slug,
    label: "EPF Withdrawal / Claim (UAN)",
    year: 2026,
    authority: "Employees' Provident Fund Organisation (EPFO)",
    officialUrl: "https://unifiedportal-mem.epfindia.gov.in",
    sourceUrl: "https://www.epfindia.gov.in",
    lastVerified: "2026-01-01",
    verification: "pending",
    isCurrent: true,
    questions: [],
    requirements: [
      req({
        id: "uan",
        documentName: "Activated UAN & KYC",
        group: "Account Details",
        role: "other",
        description:
          "Your Universal Account Number must be active with Aadhaar, PAN and bank details seeded and verified.",
        requiresUpload: false,
        verification: "pending",
      }),
      req({
        id: "bank-passbook",
        documentName: "Bank Passbook / Cancelled Cheque",
        group: "Bank Details",
        role: "certificate",
        description:
          "A bank passbook or cancelled cheque showing your name, account number and IFSC for the claim payout.",
        requiresUpload: true,
        uploadRule: documentRule(),
        verification: "pending",
      }),
      req({
        id: "aadhaar",
        documentName: "Aadhaar Card",
        group: "Identity Proof",
        role: "id-proof",
        description: "Aadhaar linked and verified with your UAN.",
        requiresUpload: true,
        uploadRule: documentRule(),
        verification: "pending",
      }),
      req({
        id: "pan",
        documentName: "PAN Card",
        group: "Identity Proof",
        role: "id-proof",
        description:
          "PAN linked to your UAN — required for tax purposes on certain withdrawals.",
        requiresUpload: true,
        uploadRule: documentRule(),
        verification: "pending",
      }),
      req({
        id: "form-15g",
        documentName: "Form 15G / 15H",
        group: "Supporting Documents",
        role: "certificate",
        necessity: "optional",
        description:
          "May be uploaded to avoid TDS where applicable, subject to eligibility conditions.",
        requiresUpload: false,
        verification: "pending",
      }),
    ],
    faqs: [
      {
        question: "What do I need for an EPF (PF) online withdrawal?",
        answer:
          "You need an activated UAN with verified Aadhaar, PAN and bank KYC seeded, plus a bank passbook/cancelled cheque. Claims are filed online on the EPFO Member portal. Confirm the current process on the official EPFO portal.",
      },
      {
        question: "Why is my PF claim rejected?",
        answer:
          "Common reasons are a name mismatch between Aadhaar/PAN and EPFO records, incorrect bank details, or KYC not being verified by the employer. Ensure all details match before filing.",
      },
    ],
    commonMistakes: [
      "Bank IFSC or account number not matching the seeded KYC.",
      "Name mismatch between Aadhaar/PAN and EPFO records.",
      "Filing before KYC is approved by the employer.",
    ],
  };
  return {
    slug,
    name: "EPF Withdrawal / Claim (EPFO UAN)",
    shortName: "EPF Withdrawal",
    category: "citizen-services",
    authority: "Employees' Provident Fund Organisation (EPFO)",
    aliases: [
      "epf",
      "epfo",
      "pf withdrawal",
      "uan",
      "provident fund",
      "pf claim",
      "pf online withdrawal",
    ],
    summary: "Documents required for an online EPF (PF) withdrawal via UAN.",
    related: ["pan-card-new", "aadhaar-enrolment"],
    versions: [version],
  };
}

/* --------------------------- Vital certificates ------------------------- */

function birthCertificateForm(): FormDefinition {
  const slug = "birth-certificate";
  const version: FormVersion = {
    id: slug,
    label: "Birth Certificate",
    year: 2026,
    authority: "Registrar of Births & Deaths (State/UT / Municipal body)",
    officialUrl: "https://crsorgi.gov.in",
    sourceUrl: "https://crsorgi.gov.in",
    lastVerified: "2026-01-01",
    verification: "pending",
    isCurrent: true,
    questions: [],
    requirements: [
      req({
        id: "hospital-proof",
        documentName: "Proof of Birth (Hospital Record)",
        group: "Birth Proof",
        role: "certificate",
        description:
          "Discharge summary or letter from the hospital/institution where the birth took place.",
        requiresUpload: true,
        uploadRule: documentRule(),
        verification: "pending",
      }),
      req({
        id: "parents-id",
        documentName: "Parents' Identity Proof",
        group: "Identity Proof",
        role: "id-proof",
        alternatives: ["Aadhaar Card", "Voter ID (EPIC)", "Passport"],
        requiresUpload: true,
        uploadRule: documentRule(),
        verification: "pending",
      }),
      req({
        id: "address-proof",
        documentName: "Address Proof",
        group: "Address Proof",
        role: "address-proof",
        alternatives: ["Aadhaar Card", "Utility bill", "Ration Card"],
        requiresUpload: true,
        uploadRule: documentRule(),
        verification: "pending",
      }),
      req({
        id: "marriage-proof",
        documentName: "Parents' Marriage Certificate",
        group: "Supporting Documents",
        role: "certificate",
        necessity: "optional",
        description:
          "Some registrars ask for the parents' marriage certificate. Requirement varies by State.",
        requiresUpload: false,
        verification: "pending",
      }),
    ],
    faqs: [
      {
        question: "What documents are required for a birth certificate?",
        answer:
          "Generally proof of birth from the hospital, the parents' identity proof and an address proof. Requirements vary by State/municipal body — confirm on your State's Registrar of Births & Deaths portal.",
      },
    ],
    commonMistakes: [
      "Applying after the free registration window without the required affidavit.",
      "Name spellings not matching the parents' identity documents.",
    ],
  };
  return {
    slug,
    name: "Birth Certificate Application",
    shortName: "Birth Certificate",
    category: "citizen-services",
    authority: "Registrar of Births & Deaths (State/UT)",
    aliases: [
      "birth certificate",
      "birth certificate apply",
      "janam praman patra",
      "new birth certificate",
    ],
    summary: "Documents required to apply for a birth certificate.",
    related: ["death-certificate", "marriage-certificate"],
    versions: [version],
  };
}

function deathCertificateForm(): FormDefinition {
  const slug = "death-certificate";
  const version: FormVersion = {
    id: slug,
    label: "Death Certificate",
    year: 2026,
    authority: "Registrar of Births & Deaths (State/UT / Municipal body)",
    officialUrl: "https://crsorgi.gov.in",
    sourceUrl: "https://crsorgi.gov.in",
    lastVerified: "2026-01-01",
    verification: "pending",
    isCurrent: true,
    questions: [],
    requirements: [
      req({
        id: "proof-of-death",
        documentName: "Proof of Death (Hospital / Cremation)",
        group: "Death Proof",
        role: "certificate",
        description:
          "Medical certificate of cause of death from the hospital, or the cremation/burial ground receipt.",
        requiresUpload: true,
        uploadRule: documentRule(),
        verification: "pending",
      }),
      req({
        id: "deceased-id",
        documentName: "Identity Proof of the Deceased",
        group: "Identity Proof",
        role: "id-proof",
        alternatives: ["Aadhaar Card", "Voter ID (EPIC)", "PAN Card"],
        requiresUpload: true,
        uploadRule: documentRule(),
        verification: "pending",
      }),
      req({
        id: "applicant-id",
        documentName: "Applicant's Identity Proof",
        group: "Identity Proof",
        role: "id-proof",
        description: "Identity proof of the family member applying.",
        alternatives: ["Aadhaar Card", "Voter ID (EPIC)", "PAN Card"],
        requiresUpload: true,
        uploadRule: documentRule(),
        verification: "pending",
      }),
      req({
        id: "address-proof",
        documentName: "Address Proof",
        group: "Address Proof",
        role: "address-proof",
        alternatives: ["Aadhaar Card", "Utility bill", "Ration Card"],
        requiresUpload: true,
        uploadRule: documentRule(),
        verification: "pending",
      }),
    ],
    faqs: [
      {
        question: "What documents are required for a death certificate?",
        answer:
          "Generally proof of death (hospital medical certificate or cremation receipt), the deceased person's identity proof, the applicant's identity proof and an address proof. Requirements vary by State — confirm on your State's Registrar portal.",
      },
    ],
    commonMistakes: [
      "Applying after the free registration window without the required affidavit.",
      "Details of the deceased not matching the identity proof.",
    ],
  };
  return {
    slug,
    name: "Death Certificate Application",
    shortName: "Death Certificate",
    category: "citizen-services",
    authority: "Registrar of Births & Deaths (State/UT)",
    aliases: [
      "death certificate",
      "death certificate apply",
      "mrityu praman patra",
    ],
    summary: "Documents required to apply for a death certificate.",
    related: ["birth-certificate", "marriage-certificate"],
    versions: [version],
  };
}

function marriageCertificateForm(): FormDefinition {
  const slug = "marriage-certificate";
  const version: FormVersion = {
    id: slug,
    label: "Marriage Registration Certificate",
    year: 2026,
    authority: "Registrar of Marriages (State/UT)",
    officialUrl: "https://services.india.gov.in",
    sourceUrl: "https://services.india.gov.in",
    lastVerified: "2026-01-01",
    verification: "pending",
    isCurrent: true,
    questions: [],
    requirements: [
      req({
        id: "age-proof",
        documentName: "Age Proof of Both Spouses",
        group: "Date of Birth Proof",
        role: "certificate",
        alternatives: [
          "Birth Certificate",
          "10th (Matriculation) Certificate",
          "Passport",
          "Aadhaar Card",
        ],
        requiresUpload: true,
        uploadRule: documentRule(),
        verification: "pending",
      }),
      req({
        id: "address-proof",
        documentName: "Address Proof of Both Spouses",
        group: "Address Proof",
        role: "address-proof",
        alternatives: [
          "Aadhaar Card",
          "Voter ID (EPIC)",
          "Passport",
          "Utility bill",
        ],
        requiresUpload: true,
        uploadRule: documentRule(),
        verification: "pending",
      }),
      req({
        id: "marriage-proof",
        documentName: "Proof of Marriage (Invitation / Temple Receipt)",
        group: "Marriage Proof",
        role: "certificate",
        description:
          "Marriage invitation card or a certificate from the place of marriage, as accepted by the registrar.",
        requiresUpload: true,
        uploadRule: documentRule(),
        verification: "pending",
      }),
      req({
        id: "photos",
        documentName: "Passport-size Photographs & Marriage Photo",
        group: "Upload Documents",
        role: "photograph",
        description:
          "Passport-size photographs of both spouses and, in many States, a joint marriage photograph.",
        requiresUpload: true,
        uploadRule: photoRule({
          minFileSize: 10 * KB,
          maxFileSize: 200 * KB,
          aspectRatio: 3 / 4,
        }),
        verification: "pending",
      }),
      req({
        id: "witness-id",
        documentName: "Witness Identity Proof",
        group: "Supporting Documents",
        role: "id-proof",
        description:
          "Identity proof of witnesses who were present at the marriage (number of witnesses varies by State).",
        requiresUpload: true,
        uploadRule: documentRule(),
        verification: "pending",
      }),
    ],
    faqs: [
      {
        question: "What documents are required for marriage registration?",
        answer:
          "Generally age proof and address proof of both spouses, proof of marriage (invitation card or place-of-marriage certificate), passport-size photographs and witness identity proofs. Requirements vary by State and by the Act (Hindu Marriage Act or Special Marriage Act) — confirm on your State portal.",
      },
    ],
    commonMistakes: [
      "Witnesses not carrying original identity proof on the appointment date.",
      "Age or address proof names not matching across documents.",
    ],
  };
  return {
    slug,
    name: "Marriage Registration Certificate Application",
    shortName: "Marriage Certificate",
    category: "citizen-services",
    authority: "Registrar of Marriages (State/UT)",
    aliases: [
      "marriage certificate",
      "marriage registration",
      "vivah praman patra",
      "register marriage",
    ],
    summary: "Documents required to register a marriage and get a certificate.",
    related: ["birth-certificate", "death-certificate"],
    versions: [version],
  };
}

export const citizenMoreForms: FormDefinition[] = [
  aadhaarForm(true),
  aadhaarForm(false),
  abhaForm(),
  epfoForm(),
  birthCertificateForm(),
  deathCertificateForm(),
  marriageCertificateForm(),
];
