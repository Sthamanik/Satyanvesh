import { Router } from "express";
import {
  addCaseParty,
  getCaseParties,
  getCasePartyById,
  getPartiesByType,
  getPartiesByAdvocate,
  updateCaseParty,
  deleteCaseParty,
  getCasePartyStatistics,
} from "@controllers/caseParty.controller.js";
import { validate } from "@middlewares/validate.middleware.js";
import { verifyJWT, authorizeRoles } from "@middlewares/auth.middleware.js";
import {
  addCasePartySchema,
  updateCasePartySchema,
  getCasePartyByIdSchema,
  deleteCasePartySchema,
  getCasePartiesSchema,
  getPartiesByTypeSchema,
} from "@validations/caseParty.validation.js";

const router = Router();

// Public routes
router.get("/case/:caseId", validate(getCasePartiesSchema), getCaseParties);

router.get(
  "/case/:caseId/type/:partyType",
  validate(getPartiesByTypeSchema),
  getPartiesByType
);

router.get("/advocate/:advocateId", getPartiesByAdvocate);

router.get("/:id", validate(getCasePartyByIdSchema), getCasePartyById);

// Admin/Judge/Clerk/Lawyer routes
router.use(verifyJWT);
router.post(
  "/",
  authorizeRoles("admin", "judge", "clerk", "lawyer"),
  validate(addCasePartySchema),
  addCaseParty
);

router.patch(
  "/:id",
  authorizeRoles("admin", "judge", "clerk", "lawyer"),
  validate(updateCasePartySchema),
  updateCaseParty
);

router.delete(
  "/:id",
  authorizeRoles("admin", "judge", "clerk"),
  validate(deleteCasePartySchema),
  deleteCaseParty
);

router.get(
  "/statistics",
  authorizeRoles("admin", "judge"),
  getCasePartyStatistics
);

export default router;
