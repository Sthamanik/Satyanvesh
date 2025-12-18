import { Router } from "express";
import {
  createCaseType,
  getAllCaseTypes,
  getCaseTypeById,
  getCaseTypeBySlug,
  updateCaseType,
  deleteCaseType,
  getCaseTypesByCategory,
  toggleCaseTypeStatus,
  getCaseTypeStatistics,
} from "@controllers/caseType.controller.js";
import { validate } from "@middlewares/validate.middleware.js";
import { verifyJWT, authorizeRoles } from "@middlewares/auth.middleware.js";
import {
  createCaseTypeSchema,
  updateCaseTypeSchema,
  getCaseTypeByIdSchema,
  getCaseTypeBySlugSchema,
  deleteCaseTypeSchema,
  getAllCaseTypesSchema,
} from "@validations/caseType.validation.js";

const router = Router();

// Public routes
router.get("/", validate(getAllCaseTypesSchema), getAllCaseTypes);

router.get("/slug/:slug", validate(getCaseTypeBySlugSchema), getCaseTypeBySlug);

router.get("/category/:category", getCaseTypesByCategory);

router.get("/:id", validate(getCaseTypeByIdSchema), getCaseTypeById);

// Admin only routes
router.use(verifyJWT, authorizeRoles("admin"));
router.post(
  "/",
  validate(createCaseTypeSchema),
  createCaseType
);

router.patch(
  "/:id",
  validate(updateCaseTypeSchema),
  updateCaseType
);

router.delete(
  "/:id",
  validate(deleteCaseTypeSchema),
  deleteCaseType
);

router.patch(
  "/:id/toggle-status",
  toggleCaseTypeStatus
);

router.get(
  "/statistics",
  getCaseTypeStatistics
);

export default router;
