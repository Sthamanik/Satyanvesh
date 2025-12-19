import { z } from "zod";

export const addCasePartySchema = z.object({
  body: z.object({
    caseId: z.string().min(1, "Case ID is required"),
    userId: z.string().optional(),
    partyType: z.enum(["petitioner", "respondent", "appellant", "defendant", "plaintiff", "witness"]),
    name: z.string().min(1, "Name is required").trim(),
    email: z.string().email("Invalid email address").optional(),
    phone: z.string().trim().optional(),
    address: z.string().trim().optional(),
    advocateId: z.string().optional(),
  }),
});

export const updateCasePartySchema = z.object({
  body: z.object({
    userId: z.string().optional(),
    partyType: z.enum(["petitioner", "respondent", "appellant", "defendant", "plaintiff", "witness"]).optional(),
    name: z.string().min(1, "Name is required").trim().optional(),
    email: z.string().email("Invalid email address").optional(),
    phone: z.string().trim().optional(),
    address: z.string().trim().optional(),
    advocateId: z.string().optional(),
  }),
  params: z.object({
    id: z.string().min(1, "Case party ID is required"),
  }),
});

export const getCasePartyByIdSchema = z.object({
  params: z.object({
    id: z.string().min(1, "Case party ID is required"),
  }),
});

export const deleteCasePartySchema = z.object({
  params: z.object({
    id: z.string().min(1, "Case party ID is required"),
  }),
});

export const getCasePartiesSchema = z.object({
  params: z.object({
    caseId: z.string().min(1, "Case ID is required"),
  }),
});

export const getPartiesByTypeSchema = z.object({
  params: z.object({
    caseId: z.string().min(1, "Case ID is required"),
    partyType: z.enum(["petitioner", "respondent", "appellant", "defendant", "plaintiff", "witness"]),
  }),
});