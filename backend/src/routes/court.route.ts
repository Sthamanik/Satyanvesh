import { Router } from "express";
import {
  createCourt,
  getAllCourts,
  getCourtById,
  getCourtBySlug,
  updateCourt,
  deleteCourt,
  getCourtsByType,
  getCourtsByState,
  toggleCourtStatus,
  getCourtStatistics,
} from "@controllers/court.controller.js";
import { validate } from "@middlewares/validate.middleware";
import { verifyJWT, authorizeRoles } from "@middlewares/auth.middleware";
import {
  createCourtSchema,
  updateCourtSchema,
  getCourtByIdSchema,
  getCourtBySlugSchema,
  deleteCourtSchema,
  getAllCourtsSchema,
} from "@validations/court.validation.js";

const router = Router();

// Public routes
router.get("/", validate(getAllCourtsSchema), getAllCourts);

router.get("/slug/:slug", validate(getCourtBySlugSchema), getCourtBySlug);

router.get("/type/:type", getCourtsByType);

router.get("/state/:state", getCourtsByState);

router.get("/:id", validate(getCourtByIdSchema), getCourtById);

router.use(verifyJWT, authorizeRoles("admin"));
// Admin only routes
router.post(
  "/",
  verifyJWT,
  validate(createCourtSchema),
  createCourt
);

router.patch(
  "/:id",
  validate(updateCourtSchema),
  updateCourt
);

router.delete(
  "/:id",
  validate(deleteCourtSchema),
  deleteCourt
);

router.patch(
  "/:id/toggle",
  toggleCourtStatus
);

router.get(
  "/statistics",
  getCourtStatistics
);

export default router;
