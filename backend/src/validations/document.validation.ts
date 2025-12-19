import { z } from "zod";

export const uploadDocumentSchema = z.object({
  body: z.object({
    caseId: z.string().min(1, "Case ID is required"),
    hearingId: z.string().optional(),
    title: z.string().min(1, "Document title is required").trim(),
    type: z.enum([
      "petition",
      "affidavit",
      "order",
      "judgment",
      "evidence",
      "notice",
      "pleading",
      "misc",
    ]),
    description: z.string().trim().optional(),
    documentDate: z.string().or(z.date()).optional(),
    isConfidential: z
      .string()
      .transform((val) => val === "true")
      .optional(),
    isPublic: z
      .string()
      .transform((val) => val === "true")
      .optional(),
  }),
});

export const updateDocumentSchema = z.object({
  body: z.object({
    title: z.string().min(1, "Document title is required").trim().optional(),
    type: z
      .enum([
        "petition",
        "affidavit",
        "order",
        "judgment",
        "evidence",
        "notice",
        "pleading",
        "misc",
      ])
      .optional(),
    description: z.string().trim().optional(),
    documentDate: z.string().or(z.date()).optional(),
    isConfidential: z.boolean().optional(),
    isPublic: z.boolean().optional(),
  }),
  params: z.object({
    id: z.string().min(1, "Document ID is required"),
  }),
});

export const getDocumentByIdSchema = z.object({
  params: z.object({
    id: z.string().min(1, "Document ID is required"),
  }),
});

export const deleteDocumentSchema = z.object({
  params: z.object({
    id: z.string().min(1, "Document ID is required"),
  }),
});

export const getCaseDocumentsSchema = z.object({
  params: z.object({
    caseId: z.string().min(1, "Case ID is required"),
  }),
  query: z.object({
    type: z
      .enum([
        "petition",
        "affidavit",
        "order",
        "judgment",
        "evidence",
        "notice",
        "pleading",
        "misc",
      ])
      .optional(),
    isPublic: z.enum(["true", "false"]).optional(),
  }),
});
