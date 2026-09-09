/**
 * Additional high-search-volume recruitment forms:
 * Agniveer (Agnipath), India Post GDS, RPF Constable/SI, IBPS RRB.
 *
 * Upload specs follow commonly published notification patterns. Verification is
 * marked "pending" until confirmed against the live official notification, and
 * every page shows a "confirm on the official portal" note.
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

/* ------------------------------- Agniveer ------------------------------- */

function agniveerRequirements() {
  return [
    req({
      id: "photo",
      documentName: "Recent Passport-size Photograph",
      group: "Upload Documents",
      role: "photograph",
      description:
        "Recent colour photograph with a light background, taken within the last three months.",
      requiresUpload: true,
      uploadRule: photoRule({
        minFileSize: 10 * KB,
        maxFileSize: 50 * KB,
        aspectRatio: 3 / 4,
        notes:
          "Agnipath/Agniveer recruitment commonly asks for a JPEG photo of roughly 10–50 KB. Confirm exact size on the live notification.",
      }),
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
        minFileSize: 5 * KB,
        maxFileSize: 20 * KB,
        aspectRatio: 3 / 1,
      }),
      verification: "pending",
    }),
    req({
      id: "class-10-cert",
      documentName: "Class 10 / Matriculation Certificate & Marksheet",
      group: "Educational Proof",
      role: "certificate",
      description:
        "Class 10 certificate for date of birth and the marksheet for the required qualification.",
      requiresUpload: true,
      uploadRule: documentRule(),
      verification: "pending",
    }),
    req({
      id: "class-12-cert",
      documentName: "Class 12 / Intermediate Marksheet",
      group: "Educational Proof",
      role: "certificate",
      necessity: "conditional",
      condition: when.equals("qualification", "12"),
      description:
        "Class 12 marksheet, required for entries that need 10+2 qualification (e.g. Agniveer GD 10+2, Technical).",
      requiresUpload: true,
      uploadRule: documentRule(),
      verification: "pending",
    }),
    req({
      id: "domicile-cert",
      documentName: "Domicile / Residence Certificate",
      group: "Category / Eligibility",
      role: "address-proof",
      description:
        "Domicile certificate issued by the competent authority of your State/UT.",
      requiresUpload: true,
      uploadRule: documentRule(),
      verification: "pending",
    }),
    req({
      id: "category-cert",
      documentName: "Caste / Category Certificate",
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

function agniveerQuestions() {
  return [
    {
      id: "qualification",
      label: "Which qualification are you applying with?",
      options: [
        { value: "10", label: "Class 10 (Agniveer General Duty)" },
        { value: "12", label: "Class 12 / Diploma (10+2, Technical, Clerk)" },
      ],
      defaultValue: "10",
    },
    questions.category(),
  ];
}

function agniveerForm(
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
    notification: "Refer to the official Agnipath/Agniveer notification",
    lastVerified: "2026-01-01",
    verification: "pending",
    isCurrent: true,
    questions: agniveerQuestions(),
    requirements: agniveerRequirements(),
    faqs: [
      {
        question: `What documents are required for ${shortName}?`,
        answer:
          "Typically your Class 10 certificate and marksheet (for date of birth and qualification), a domicile certificate, a recent photograph and signature, plus a caste certificate if you are claiming reservation. 10+2 and technical entries also need the Class 12 marksheet. Confirm the exact list on the official notification.",
      },
      {
        question: `What photo size is required for ${shortName}?`,
        answer:
          "A JPEG photograph of roughly 10–50 KB with a light background is commonly required. Always confirm the exact size and dimensions on the live notification before uploading.",
      },
    ],
    commonMistakes: [
      "Uploading a photo older than the allowed period or with a busy background.",
      "Missing the domicile certificate required for the recruitment rally.",
      "Class 10 name/date of birth not matching other documents.",
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
    related: ["agniveer-army-2026", "agniveer-airforce-2026", "agniveer-navy-2026"].filter(
      (s) => s !== slug
    ),
    versions: [version],
  };
}

/* ----------------------------- India Post GDS ---------------------------- */

function gdsForm(): FormDefinition {
  const slug = "india-post-gds-2026";
  const version: FormVersion = {
    id: slug,
    label: "India Post GDS 2026",
    year: 2026,
    authority: "Department of Posts (India Post)",
    officialUrl: "https://indiapostgdsonline.gov.in",
    sourceUrl: "https://indiapostgdsonline.gov.in",
    notification: "Refer to the official India Post GDS notification",
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
          "Recent colour photograph with a light background (commonly 320×400 px).",
        requiresUpload: true,
        uploadRule: photoRule({
          minFileSize: 30 * KB,
          maxFileSize: 100 * KB,
          requiredWidth: 320,
          requiredHeight: 400,
          notes:
            "India Post GDS commonly requires a JPEG photo of 320×400 px, 30–100 KB. Confirm on the official portal.",
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
          maxFileSize: 100 * KB,
          requiredWidth: 300,
          requiredHeight: 120,
          notes:
            "Signature commonly 300×120 px JPEG. Confirm exact figures on the official portal.",
        }),
        verification: "pending",
      }),
      req({
        id: "class-10-cert",
        documentName: "Class 10 / Secondary Marksheet",
        group: "Educational Proof",
        role: "certificate",
        description:
          "Class 10 (Secondary) marksheet — GDS merit is based on Class 10 marks.",
        requiresUpload: true,
        uploadRule: documentRule(),
        verification: "pending",
      }),
      req({
        id: "dob-proof",
        documentName: "Date of Birth Proof",
        group: "Date of Birth Proof",
        role: "certificate",
        alternatives: [
          "Class 10 Certificate",
          "Birth Certificate",
        ],
        requiresUpload: true,
        uploadRule: documentRule(),
        verification: "pending",
      }),
      req({
        id: "category-cert",
        documentName: "Category Certificate (OBC / SC / ST / EWS)",
        group: "Category / Eligibility",
        role: "certificate",
        necessity: "conditional",
        condition: when.oneOf("category", ["obc", "sc", "st", "ews"]),
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
        requiresUpload: true,
        uploadRule: documentRule(),
        verification: "pending",
      }),
    ],
    faqs: [
      {
        question: "What documents are required for India Post GDS?",
        answer:
          "You mainly need your Class 10 marksheet (merit is based on these marks), a date of birth proof, a recent photograph and signature, and a category certificate if you are claiming reservation. Confirm the exact list on the official India Post GDS portal.",
      },
      {
        question: "What is the photo and signature size for India Post GDS?",
        answer:
          "The photograph is commonly 320×400 px JPEG (about 30–100 KB) and the signature 300×120 px. Always confirm the current requirement on the official portal.",
      },
    ],
    commonMistakes: [
      "Uploading a photo or signature outside the required pixel dimensions.",
      "Class 10 marks entered not matching the uploaded marksheet.",
      "Applying without a valid category certificate when claiming reservation.",
    ],
  };
  return {
    slug,
    name: "India Post Gramin Dak Sevak (GDS) 2026",
    shortName: "India Post GDS",
    category: "recruitment",
    authority: "Department of Posts (India Post)",
    aliases: [
      "india post gds",
      "gds",
      "gramin dak sevak",
      "post office gds",
      "dak sevak",
      "post office recruitment",
    ],
    summary:
      "Documents, photo and signature upload requirements for India Post GDS 2026.",
    related: ["ssc-gd-2026", "rrb-group-d-2026"],
    versions: [version],
  };
}

/* ------------------------------- RPF ------------------------------------ */

function rpfForm(
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
    authority: "Railway Protection Force (RPF) — Indian Railways",
    officialUrl: "https://www.rpf.indianrailways.gov.in",
    sourceUrl: "https://www.rpf.indianrailways.gov.in",
    notification: "Refer to the official RPF recruitment notification",
    lastVerified: "2026-01-01",
    verification: "pending",
    isCurrent: true,
    questions: [questions.category(), questions.pwd()],
    requirements: [
      req({
        id: "photo",
        documentName: "Recent Colour Photograph",
        group: "Upload Documents",
        role: "photograph",
        requiresUpload: true,
        uploadRule: photoRule({
          minFileSize: 15 * KB,
          maxFileSize: 40 * KB,
          aspectRatio: 3 / 4,
          notes:
            "RPF notifications commonly follow the RRB pattern of a JPEG photo around 15–40 KB. Confirm on the live notification.",
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
        id: "class-10-cert",
        documentName: "Class 10 / Matriculation Certificate",
        group: "Educational Proof",
        role: "certificate",
        description: "Class 10 certificate for date of birth and qualification.",
        requiresUpload: true,
        uploadRule: documentRule(),
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
    ],
    faqs: [
      {
        question: `What photo size is required for ${shortName}?`,
        answer:
          "RPF recruitment commonly follows the railway pattern of a JPEG photograph around 15–40 KB with a light background. Confirm the exact requirement on the official notification.",
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
    authority: "Railway Protection Force (RPF)",
    aliases,
    summary,
    related: ["rpf-constable-2026", "rpf-si-2026", "ssc-gd-2026"].filter(
      (s) => s !== slug
    ),
    versions: [version],
  };
}

/* ----------------------------- IBPS RRB --------------------------------- */

function ibpsRrbForm(
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
    authority: "Institute of Banking Personnel Selection (IBPS)",
    officialUrl: "https://www.ibps.in",
    sourceUrl: "https://www.ibps.in",
    notification: "Refer to the official IBPS RRB advertisement",
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
        requiresUpload: true,
        uploadRule: photoRule({
          minFileSize: 20 * KB,
          maxFileSize: 50 * KB,
          requiredWidth: 200,
          requiredHeight: 230,
          notes:
            "IBPS commonly requires a ~200×230 px JPEG photo of 20–50 KB. Confirm on the official advertisement.",
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
    ],
    faqs: [
      {
        question: `What documents do I upload for ${shortName}?`,
        answer:
          "Typically a photograph, signature, a handwritten declaration and a left thumb impression, plus a category certificate if you are claiming reservation. Confirm the exact list on the official IBPS advertisement.",
      },
    ],
    commonMistakes: [
      "Typing the declaration instead of writing it by hand.",
      "Using the wrong (right) thumb impression.",
      "Photo or signature file exceeding the allowed size.",
    ],
  };
  return {
    slug,
    name,
    shortName,
    category: "recruitment",
    authority: "Institute of Banking Personnel Selection (IBPS)",
    aliases,
    summary,
    related: ["ibps-rrb-po-2026", "ibps-rrb-clerk-2026", "ibps-po-2026", "ibps-clerk-2026"].filter(
      (s) => s !== slug
    ),
    versions: [version],
  };
}

export const recruitmentMoreForms: FormDefinition[] = [
  agniveerForm(
    "agniveer-army-2026",
    "Agniveer Indian Army 2026",
    "Agniveer Army",
    "Indian Army — Agnipath Scheme",
    "https://joinindianarmy.nic.in",
    ["agniveer", "agnipath", "agniveer army", "indian army agniveer", "army bharti"],
    "Documents, photo and signature upload requirements for Agniveer Indian Army 2026."
  ),
  agniveerForm(
    "agniveer-airforce-2026",
    "Agniveer Indian Air Force (Agniveervayu) 2026",
    "Agniveer Air Force",
    "Indian Air Force — Agnipath Scheme",
    "https://agnipathvayu.cdac.in",
    ["agniveer vayu", "agniveervayu", "air force agniveer", "iaf agniveer", "agnipath air force"],
    "Documents, photo and signature upload requirements for Agniveer Air Force 2026."
  ),
  agniveerForm(
    "agniveer-navy-2026",
    "Agniveer Indian Navy (SSR / MR) 2026",
    "Agniveer Navy",
    "Indian Navy — Agnipath Scheme",
    "https://www.joinindiannavy.gov.in",
    ["agniveer navy", "navy agniveer", "agniveer ssr", "agniveer mr", "agnipath navy"],
    "Documents, photo and signature upload requirements for Agniveer Navy 2026."
  ),
  gdsForm(),
  rpfForm(
    "rpf-constable-2026",
    "RPF Constable 2026",
    "RPF Constable",
    ["rpf constable", "rpf", "railway protection force constable", "railway police constable"],
    "Documents, photo and signature upload requirements for RPF Constable 2026."
  ),
  rpfForm(
    "rpf-si-2026",
    "RPF Sub-Inspector (SI) 2026",
    "RPF SI",
    ["rpf si", "rpf sub inspector", "railway protection force si", "railway si"],
    "Documents, photo and signature upload requirements for RPF Sub-Inspector 2026."
  ),
  ibpsRrbForm(
    "ibps-rrb-po-2026",
    "IBPS RRB Officer Scale I (PO) 2026",
    "IBPS RRB PO",
    ["ibps rrb po", "rrb po", "rrb officer scale 1", "gramin bank po", "regional rural bank po"],
    "Photo, signature, declaration and thumb impression requirements for IBPS RRB PO 2026."
  ),
  ibpsRrbForm(
    "ibps-rrb-clerk-2026",
    "IBPS RRB Office Assistant (Clerk) 2026",
    "IBPS RRB Clerk",
    ["ibps rrb clerk", "rrb clerk", "office assistant", "gramin bank clerk", "regional rural bank clerk"],
    "Photo, signature, declaration and thumb impression requirements for IBPS RRB Clerk 2026."
  ),
];
