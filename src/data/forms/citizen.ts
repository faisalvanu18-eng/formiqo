/**
 * Citizen services: Passport, PAN, Voter ID, Licences, Certificates, Ration.
 * Requirements summarised in original wording; verification marked "pending"
 * until confirmed against the relevant official portal.
 */
import type { FormDefinition, FormVersion } from "../../lib/types";
import { KB, documentRule, photoRule, questions, req, signatureRule, when } from "../builders";

/* ------------------------------- Passport ------------------------------- */

function passportRequirements(fresh: boolean) {
  return [
    req({
      id: "proof-of-dob",
      documentName: "Proof of Date of Birth",
      group: "Date of Birth Proof",
      role: "certificate",
      description: "Any one document establishing your date of birth.",
      alternatives: [
        "Birth Certificate",
        "10th (Matriculation) Certificate / Marksheet",
        "PAN Card",
        "Aadhaar Card",
        "Driving Licence",
        "Voter ID (EPIC)",
      ],
      requiresUpload: true,
      uploadRule: documentRule(),
      verification: "pending",
    }),
    req({
      id: "proof-of-address",
      documentName: "Proof of Present Address",
      group: "Address Proof",
      role: "address-proof",
      description: "Any one document establishing your current address.",
      alternatives: [
        "Aadhaar Card",
        "Electricity / Water / Landline bill",
        "Bank account statement / passbook",
        "Rent agreement (registered)",
        "Gas connection proof",
        "Voter ID (EPIC)",
      ],
      requiresUpload: true,
      uploadRule: documentRule(),
      verification: "pending",
    }),
    ...(fresh
      ? []
      : [
          req({
            id: "old-passport",
            documentName: "Original Old Passport",
            group: "Reissue Documents",
            role: "certificate",
            description:
              "Your existing passport along with a self-attested photocopy of its first two and last two pages.",
            requiresUpload: true,
      uploadRule: documentRule(),
            verification: "pending",
          }),
        ]),
    req({
      id: "minor-parent-passport",
      documentName: "Parents' Passport / Documents",
      group: "Minor Applicant",
      role: "certificate",
      necessity: "conditional",
      condition: when.equals("applicant", "minor"),
      description:
        "For minors, the parents' documents and Annexure as specified by Passport Seva are required.",
      requiresUpload: true,
      uploadRule: documentRule(),
      verification: "pending",
    }),
  ];
}

function passportForm(fresh: boolean): FormDefinition {
  const slug = fresh ? "passport-fresh" : "passport-reissue";
  const shortName = fresh ? "Passport (Fresh)" : "Passport (Reissue)";
  const version: FormVersion = {
    id: slug,
    label: shortName,
    year: 2026,
    applicationType: fresh ? "Fresh Application" : "Reissue",
    authority: "Ministry of External Affairs — Passport Seva",
    officialUrl: "https://www.passportindia.gov.in",
    sourceUrl: "https://www.passportindia.gov.in",
    lastVerified: "2026-01-01",
    verification: "pending",
    isCurrent: true,
    questions: [questions.applicant()],
    requirements: passportRequirements(fresh),
    faqs: [
      {
        question: `What documents are required for a ${
          fresh ? "fresh passport" : "passport reissue"
        }?`,
        answer:
          "You generally need proof of date of birth and proof of present address, from the lists of documents accepted by Passport Seva. Reissue additionally requires your existing passport. Confirm the current lists on the official Passport Seva portal.",
      },
      {
        question: "Do I need to upload documents online?",
        answer:
          "Passport applications are typically submitted online and documents verified in person at a Passport Seva Kendra. Keep originals and self-attested copies ready.",
      },
    ],
    commonMistakes: [
      "Address proof not matching the address entered in the application.",
      "Missing self-attested photocopies of the old passport for reissue.",
      "For minors, missing the required parent documents/annexures.",
    ],
  };
  return {
    slug,
    name: fresh
      ? "Passport — Fresh Application"
      : "Passport — Reissue / Renewal",
    shortName,
    category: "citizen-services",
    authority: "Ministry of External Affairs — Passport Seva",
    aliases: fresh
      ? ["passport", "new passport", "fresh passport", "passport apply"]
      : [
          "passport reissue",
          "passport renewal",
          "renew passport",
          "reissue passport",
        ],
    summary: fresh
      ? "Documents required for a fresh Indian passport application."
      : "Documents required to reissue or renew an Indian passport.",
    related: ["passport-fresh", "passport-reissue"].filter((s) => s !== slug),
    versions: [version],
  };
}

/* --------------------------------- PAN ---------------------------------- */

function panRequirements(isNew: boolean) {
  return [
    req({
      id: "proof-of-identity",
      documentName: "Proof of Identity",
      group: "Identity Proof",
      role: "id-proof",
      alternatives: [
        "Aadhaar Card",
        "Voter ID (EPIC)",
        "Passport",
        "Driving Licence",
      ],
      requiresUpload: true,
      uploadRule: documentRule(),
      verification: "pending",
    }),
    req({
      id: "proof-of-address",
      documentName: "Proof of Address",
      group: "Address Proof",
      role: "address-proof",
      alternatives: [
        "Aadhaar Card",
        "Voter ID (EPIC)",
        "Passport",
        "Utility bill (electricity/water)",
        "Bank account statement",
      ],
      requiresUpload: true,
      uploadRule: documentRule(),
      verification: "pending",
    }),
    req({
      id: "proof-of-dob",
      documentName: "Proof of Date of Birth",
      group: "Date of Birth Proof",
      role: "certificate",
      alternatives: [
        "Birth Certificate",
        "10th Certificate / Marksheet",
        "Aadhaar Card",
        "Passport",
      ],
      requiresUpload: true,
      uploadRule: documentRule(),
      verification: "pending",
    }),
    ...(isNew
      ? []
      : [
          req({
            id: "existing-pan",
            documentName: "Existing PAN Card",
            group: "Correction Documents",
            role: "certificate",
            description:
              "A copy of your existing PAN and proof of the detail you want corrected.",
            requiresUpload: true,
      uploadRule: documentRule(),
            verification: "pending",
          }),
        ]),
    req({
      id: "photo",
      documentName: "Photograph",
      group: "Upload Documents",
      role: "photograph",
      description:
        "Recent colour passport-size photograph (for the physical/eKYC application as applicable).",
      requiresUpload: true,
      uploadRule: photoRule({
        minFileSize: 10 * KB,
        maxFileSize: 200 * KB,
        aspectRatio: 3 / 4,
        notes: "Confirm exact size on the NSDL/UTIITSL portal you use.",
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
        maxFileSize: 200 * KB,
      }),
      verification: "pending",
    }),
  ];
}

function panForm(isNew: boolean): FormDefinition {
  const slug = isNew ? "pan-card-new" : "pan-card-correction";
  const shortName = isNew ? "PAN (New)" : "PAN (Correction)";
  const version: FormVersion = {
    id: slug,
    label: shortName,
    year: 2026,
    applicationType: isNew ? "New PAN (Form 49A)" : "Correction / Reprint",
    authority: "Income Tax Department (via NSDL / UTIITSL)",
    officialUrl: "https://www.onlineservices.nsdl.com/paam/endUserRegisterContact.html",
    sourceUrl: "https://www.incometax.gov.in",
    lastVerified: "2026-01-01",
    verification: "pending",
    isCurrent: true,
    questions: [],
    requirements: panRequirements(isNew),
    faqs: [
      {
        question: `What documents are required for a ${
          isNew ? "new PAN card" : "PAN correction"
        }?`,
        answer:
          "You generally need proof of identity, proof of address and proof of date of birth from the accepted lists, plus a photograph and signature for the application. Correction additionally requires your existing PAN. Confirm on the official portal.",
      },
    ],
    commonMistakes: [
      "Photo or signature file exceeding the portal's allowed size.",
      "Name spelling not matching the identity proof.",
    ],
  };
  return {
    slug,
    name: isNew
      ? "PAN Card — New Application"
      : "PAN Card — Correction / Update",
    shortName,
    category: "citizen-services",
    authority: "Income Tax Department (via NSDL / UTIITSL)",
    aliases: isNew
      ? ["pan", "pan card", "new pan", "pan apply", "form 49a"]
      : ["pan correction", "pan update", "correct pan", "pan reprint"],
    summary: isNew
      ? "Documents required to apply for a new PAN card."
      : "Documents required to correct or update PAN card details.",
    related: ["pan-card-new", "pan-card-correction"].filter((s) => s !== slug),
    versions: [version],
  };
}

/* ------------------------------- Voter ID ------------------------------- */

function voterForm(isNew: boolean): FormDefinition {
  const slug = isNew ? "voter-id-form-6" : "voter-id-form-8";
  const shortName = isNew ? "Voter ID (Form 6)" : "Voter ID (Form 8)";
  const version: FormVersion = {
    id: slug,
    label: shortName,
    year: 2026,
    applicationType: isNew
      ? "New Registration — Form 6"
      : "Correction / Update — Form 8",
    authority: "Election Commission of India",
    officialUrl: "https://voters.eci.gov.in",
    sourceUrl: "https://voters.eci.gov.in",
    lastVerified: "2026-01-01",
    verification: "pending",
    isCurrent: true,
    questions: [],
    requirements: [
      req({
        id: "photo",
        documentName: "Passport-size Photograph",
        group: "Upload Documents",
        role: "photograph",
        requiresUpload: true,
        uploadRule: photoRule({
          minFileSize: 10 * KB,
          maxFileSize: 200 * KB,
          aspectRatio: 3 / 4,
        }),
        verification: "pending",
      }),
      req({
        id: "age-proof",
        documentName: "Age Proof",
        group: "Date of Birth Proof",
        role: "certificate",
        alternatives: [
          "Birth Certificate",
          "10th Certificate / Marksheet",
          "Aadhaar Card",
          "PAN Card",
          "Driving Licence",
        ],
        requiresUpload: true,
      uploadRule: documentRule(),
        verification: "pending",
      }),
      req({
        id: "address-proof",
        documentName: "Address Proof",
        group: "Address Proof",
        role: "address-proof",
        alternatives: [
          "Aadhaar Card",
          "Utility bill (electricity/water/gas)",
          "Bank/Post office passbook",
          "Passport",
          "Rent agreement (registered)",
        ],
        requiresUpload: true,
      uploadRule: documentRule(),
        verification: "pending",
      }),
      ...(isNew
        ? []
        : [
            req({
              id: "existing-epic",
              documentName: "Existing Voter ID (EPIC)",
              group: "Correction Documents",
              role: "certificate",
              description: "Your existing EPIC number/card and proof of the correction.",
              requiresUpload: true,
      uploadRule: documentRule(),
              verification: "pending",
            }),
          ]),
    ],
    faqs: [
      {
        question: `Which form is used for ${
          isNew ? "new voter registration" : "correcting voter details"
        }?`,
        answer: isNew
          ? "Form 6 is used to register as a new elector. You typically need a photograph, an age proof and an address proof."
          : "Form 8 is used to correct or update entries in the electoral roll, shift address, or replace an EPIC.",
      },
    ],
    commonMistakes: [
      "Address proof not matching the constituency you are registering in.",
      "Uploading a photo that does not meet the portal's size limit.",
    ],
  };
  return {
    slug,
    name: isNew
      ? "Voter ID — New Registration (Form 6)"
      : "Voter ID — Correction / Update (Form 8)",
    shortName,
    category: "citizen-services",
    authority: "Election Commission of India",
    aliases: isNew
      ? ["voter id", "new voter", "form 6", "voter registration", "epic new"]
      : ["voter id correction", "form 8", "voter update", "correct voter id"],
    summary: isNew
      ? "Documents required for new voter registration (Form 6)."
      : "Documents required to correct or update voter details (Form 8).",
    related: ["voter-id-form-6", "voter-id-form-8"].filter((s) => s !== slug),
    versions: [version],
  };
}

/* ------------------------------- Licences ------------------------------- */

function licenceForm(learner: boolean): FormDefinition {
  const slug = learner ? "learner-licence" : "driving-licence";
  const shortName = learner ? "Learner's Licence" : "Driving Licence";
  const version: FormVersion = {
    id: slug,
    label: shortName,
    year: 2026,
    authority: "Ministry of Road Transport & Highways — Parivahan",
    officialUrl: "https://parivahan.gov.in",
    sourceUrl: "https://parivahan.gov.in",
    lastVerified: "2026-01-01",
    verification: "pending",
    isCurrent: true,
    questions: [questions.applicant()],
    requirements: [
      req({
        id: "photo",
        documentName: "Photograph",
        group: "Upload Documents",
        role: "photograph",
        requiresUpload: true,
        uploadRule: photoRule({
          minFileSize: 10 * KB,
          maxFileSize: 200 * KB,
          aspectRatio: 3 / 4,
        }),
        verification: "pending",
      }),
      req({
        id: "signature",
        documentName: "Signature",
        group: "Upload Documents",
        role: "signature",
        requiresUpload: true,
        uploadRule: signatureRule({ minFileSize: 10 * KB, maxFileSize: 200 * KB }),
        verification: "pending",
      }),
      req({
        id: "age-proof",
        documentName: "Age Proof",
        group: "Date of Birth Proof",
        role: "certificate",
        alternatives: [
          "Birth Certificate",
          "10th Certificate / Marksheet",
          "PAN Card",
          "Passport",
          "Aadhaar Card",
        ],
        requiresUpload: true,
      uploadRule: documentRule(),
        verification: "pending",
      }),
      req({
        id: "address-proof",
        documentName: "Address Proof",
        group: "Address Proof",
        role: "address-proof",
        alternatives: [
          "Aadhaar Card",
          "Voter ID (EPIC)",
          "Passport",
          "Utility bill",
          "Rent agreement (registered)",
        ],
        requiresUpload: true,
      uploadRule: documentRule(),
        verification: "pending",
      }),
      ...(learner
        ? []
        : [
            req({
              id: "llr",
              documentName: "Valid Learner's Licence",
              group: "Driving Licence Documents",
              role: "certificate",
              description:
                "A valid learner's licence is required before applying for a driving licence.",
              requiresUpload: true,
      uploadRule: documentRule(),
              verification: "pending",
            }),
          ]),
    ],
    faqs: [
      {
        question: `What documents are required for a ${shortName.toLowerCase()}?`,
        answer:
          "Generally a photograph, signature, age proof and address proof. A driving licence additionally requires a valid learner's licence. Confirm the exact list on the Parivahan Sarathi portal.",
      },
    ],
    commonMistakes: [
      "Applying for a driving licence before the learner's licence waiting period.",
      "Address proof not matching the RTO jurisdiction.",
    ],
  };
  return {
    slug,
    name: learner
      ? "Learner's Licence Application"
      : "Driving Licence Application",
    shortName,
    category: "citizen-services",
    authority: "Ministry of Road Transport & Highways — Parivahan",
    aliases: learner
      ? ["learner licence", "learners licence", "ll", "learning licence"]
      : ["driving licence", "driving license", "dl", "permanent licence"],
    summary: learner
      ? "Documents required for a learner's licence."
      : "Documents required for a permanent driving licence.",
    related: ["learner-licence", "driving-licence"].filter((s) => s !== slug),
    versions: [version],
  };
}

/* ----------------------------- Certificates ----------------------------- */

function certificateForm(
  slug: string,
  name: string,
  shortName: string,
  aliases: string[],
  summary: string,
  extra?: string
): FormDefinition {
  const version: FormVersion = {
    id: slug,
    label: shortName,
    year: 2026,
    authority:
      "Issued by the competent revenue authority (varies by State/UT)",
    officialUrl: "https://services.india.gov.in",
    sourceUrl: "https://services.india.gov.in",
    lastVerified: "2026-01-01",
    verification: "pending",
    isCurrent: true,
    questions: [],
    requirements: [
      req({
        id: "identity-proof",
        documentName: "Identity Proof",
        group: "Identity Proof",
        role: "id-proof",
        alternatives: ["Aadhaar Card", "Voter ID (EPIC)", "PAN Card", "Passport"],
        requiresUpload: true,
      uploadRule: documentRule(),
        verification: "pending",
      }),
      req({
        id: "address-proof",
        documentName: "Residence / Address Proof",
        group: "Address Proof",
        role: "address-proof",
        alternatives: [
          "Aadhaar Card",
          "Ration Card",
          "Utility bill",
          "Voter ID (EPIC)",
        ],
        requiresUpload: true,
      uploadRule: documentRule(),
        verification: "pending",
      }),
      req({
        id: "photo",
        documentName: "Passport-size Photograph",
        group: "Upload Documents",
        role: "photograph",
        requiresUpload: true,
        uploadRule: photoRule({
          minFileSize: 10 * KB,
          maxFileSize: 200 * KB,
          aspectRatio: 3 / 4,
        }),
        verification: "pending",
      }),
      req({
        id: "supporting",
        documentName: extra ?? "Supporting Declaration / Affidavit",
        group: "Supporting Documents",
        role: "certificate",
        description:
          "State portals often require a self-declaration or affidavit and any parent/guardian document, as applicable.",
        requiresUpload: true,
      uploadRule: documentRule(),
        verification: "pending",
      }),
    ],
    faqs: [
      {
        question: `Where do I apply for a ${shortName.toLowerCase()}?`,
        answer:
          "These certificates are issued by State/UT revenue authorities, usually through the State's e-District or Seva portal. Exact documents vary by State — always confirm on your State portal.",
      },
    ],
    commonMistakes: [
      "Using a document list from a different State.",
      "Missing the required self-declaration/affidavit.",
    ],
  };
  return {
    slug,
    name,
    shortName,
    category: "citizen-services",
    authority: "State/UT revenue authority",
    aliases,
    summary,
    related: [
      "income-certificate",
      "caste-certificate",
      "ews-certificate",
      "domicile-certificate",
    ].filter((s) => s !== slug),
    versions: [version],
  };
}

function rationForm(): FormDefinition {
  const slug = "ration-card";
  const version: FormVersion = {
    id: slug,
    label: "Ration Card",
    year: 2026,
    authority: "Department of Food & Public Distribution (State/UT)",
    officialUrl: "https://nfsa.gov.in",
    sourceUrl: "https://nfsa.gov.in",
    lastVerified: "2026-01-01",
    verification: "pending",
    isCurrent: true,
    questions: [],
    requirements: [
      req({
        id: "identity-proof",
        documentName: "Identity Proof of Head of Family",
        group: "Identity Proof",
        role: "id-proof",
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
        alternatives: ["Aadhaar Card", "Utility bill", "Rent agreement"],
        requiresUpload: true,
      uploadRule: documentRule(),
        verification: "pending",
      }),
      req({
        id: "family-photo",
        documentName: "Family / Head-of-Family Photograph",
        group: "Upload Documents",
        role: "photograph",
        requiresUpload: true,
        uploadRule: photoRule({ minFileSize: 10 * KB, maxFileSize: 200 * KB }),
        verification: "pending",
      }),
    ],
    faqs: [
      {
        question: "What documents are required for a ration card?",
        answer:
          "Typically the head of family's identity proof, an address proof and photographs of family members. Requirements and portals vary by State — confirm on your State food/PDS portal.",
      },
    ],
    commonMistakes: ["Aadhaar of all family members not linked/seeded."],
  };
  return {
    slug,
    name: "Ration Card Application",
    shortName: "Ration Card",
    category: "citizen-services",
    authority: "State/UT Food & Public Distribution Department",
    aliases: ["ration card", "new ration card", "pds card"],
    summary: "Documents required to apply for a ration card.",
    related: ["income-certificate", "domicile-certificate"],
    versions: [version],
  };
}

export const citizenForms: FormDefinition[] = [
  passportForm(true),
  passportForm(false),
  panForm(true),
  panForm(false),
  voterForm(true),
  voterForm(false),
  licenceForm(true),
  licenceForm(false),
  certificateForm(
    "income-certificate",
    "Income Certificate Application",
    "Income Certificate",
    ["income certificate", "income proof"],
    "Documents required for an income certificate.",
    "Income declaration / salary or income proof"
  ),
  certificateForm(
    "caste-certificate",
    "Caste Certificate Application",
    "Caste Certificate",
    ["caste certificate", "obc certificate", "sc certificate", "st certificate"],
    "Documents required for a caste certificate.",
    "Caste declaration / family caste proof"
  ),
  certificateForm(
    "ews-certificate",
    "EWS Certificate Application",
    "EWS Certificate",
    ["ews certificate", "ews", "income and asset certificate"],
    "Documents required for an EWS (Income & Asset) certificate.",
    "Income & asset declaration"
  ),
  certificateForm(
    "domicile-certificate",
    "Domicile / Residence Certificate Application",
    "Domicile Certificate",
    ["domicile certificate", "residence certificate", "domicile"],
    "Documents required for a domicile/residence certificate.",
    "Proof of continuous residence"
  ),
  rationForm(),
];
