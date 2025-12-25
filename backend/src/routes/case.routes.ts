import { Router } from "express";
import {
  createCase,
  getAllCases,
  getCaseById,
  getCaseBySlug,
  getCaseByCaseNumber,
  updateCase,
  updateCaseStatus,
  deleteCase,
  getCasesByCourt,
  getCasesByCaseType,
  getCasesByUser,
  searchCases,
  getCaseStatistics,
  getMyCases,
} from "@controllers/case.controller.js";
import { validate } from "@middlewares/validate.middleware.js";
import { verifyJWT, authorizeRoles } from "@middlewares/auth.middleware.js";
import {
  createCaseSchema,
  updateCaseSchema,
  getCaseByIdSchema,
  getCaseBySlugSchema,
  getCaseByCaseNumberSchema,
  deleteCaseSchema,
  updateCaseStatusSchema,
  getAllCasesSchema,
} from "@validations/case.validation.js";
import { createCaseLimiter, readLimiter, searchLimiter } from "@middlewares/rateLimiter.middleware";

const router = Router();

// Public routes
router.get("/search", searchLimiter, searchCases);

router.get("/", readLimiter, validate(getAllCasesSchema), getAllCases);

router.get("/slug/:slug", readLimiter, validate(getCaseBySlugSchema), getCaseBySlug);

router.get(
  "/case-number/:caseNumber",
  readLimiter,
  validate(getCaseByCaseNumberSchema),
  getCaseByCaseNumber
);

router.get("/court/:courtId", readLimiter, getCasesByCourt);

router.get("/case-type/:caseTypeId", readLimiter, getCasesByCaseType);

router.get("/user/:userId", readLimiter, getCasesByUser);
router.get(
  "/statistics",
  authorizeRoles("admin", "judge"),
  getCaseStatistics
);

router.get("/:id", readLimiter, validate(getCaseByIdSchema), getCaseById);

// Admin/Judge/Clerk routes
router.use(verifyJWT);

router.get("/my-cases", getMyCases);

router.post(
  "/",
  authorizeRoles("admin", "judge", "clerk"),
  createCaseLimiter,
  validate(createCaseSchema),
  createCase
);

router.patch(
  "/:id",
  authorizeRoles("admin", "judge", "clerk"),
  validate(updateCaseSchema),
  updateCase
);

router.patch(
  "/:id/status",
  authorizeRoles("admin", "judge", "clerk"),
  validate(updateCaseStatusSchema),
  updateCaseStatus
);

router.delete(
  "/:id",
  authorizeRoles("admin"),
  validate(deleteCaseSchema),
  deleteCase
);

router.get(
  "/statistics",
  authorizeRoles("admin", "judge"),
  getCaseStatistics
);

export default router;
