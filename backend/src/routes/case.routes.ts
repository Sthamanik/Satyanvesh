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

const router = Router();

// Public routes
router.get("/search", searchCases);

router.get("/", validate(getAllCasesSchema), getAllCases);

router.get("/slug/:slug", validate(getCaseBySlugSchema), getCaseBySlug);

router.get(
  "/case-number/:caseNumber",
  validate(getCaseByCaseNumberSchema),
  getCaseByCaseNumber
);

router.get("/court/:courtId", getCasesByCourt);

router.get("/case-type/:caseTypeId", getCasesByCaseType);

router.get("/user/:userId", getCasesByUser);

router.get("/:id", validate(getCaseByIdSchema), getCaseById);

// Admin/Judge/Clerk routes
router.use(verifyJWT);
router.post(
  "/",
  authorizeRoles("admin", "judge", "clerk"),
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
