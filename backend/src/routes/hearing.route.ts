import { Router } from "express";
import {
  createHearing,
  getAllHearings,
  getCaseHearings,
  getHearingById,
  getUpcomingHearings,
  getHearingsByJudge,
  getTodaysHearings,
  updateHearing,
  updateHearingStatus,
  deleteHearing,
  getHearingStatistics,
} from "@controllers/hearing.controller.js";
import { validate } from "@middlewares/validate.middleware.js";
import { verifyJWT, authorizeRoles } from "@middlewares/auth.middleware.js";
import {
  createHearingSchema,
  updateHearingSchema,
  getHearingByIdSchema,
  deleteHearingSchema,
  getCaseHearingsSchema,
  updateHearingStatusSchema,
  getUpcomingHearingsSchema,
} from "@validations/hearing.validation.js";

const router = Router();

// Public/Protected routes
router.get(
  "/",
  // validate(getAllHearingsSchema), // TODO: Add schema if needed
  getAllHearings
);

router.get(
  "/upcoming",
  validate(getUpcomingHearingsSchema),
  getUpcomingHearings
);

router.get("/today", getTodaysHearings);

router.get("/case/:caseId", validate(getCaseHearingsSchema), getCaseHearings);

router.get("/judge/:judgeId", getHearingsByJudge);

router.get(
  "/statistics",
  authorizeRoles("admin", "judge"),
  getHearingStatistics
);

router.get("/:id", validate(getHearingByIdSchema), getHearingById);

// Admin/Judge/Clerk routes
router.use(verifyJWT);
router.post(
  "/",
  authorizeRoles("admin", "judge", "clerk"),
  validate(createHearingSchema),
  createHearing
);

router.patch(
  "/:id",
  authorizeRoles("admin", "judge", "clerk"),
  validate(updateHearingSchema),
  updateHearing
);

router.patch(
  "/:id/status",
  authorizeRoles("admin", "judge", "clerk"),
  validate(updateHearingStatusSchema),
  updateHearingStatus
);

router.delete(
  "/:id",
  authorizeRoles("admin"),
  validate(deleteHearingSchema),
  deleteHearing
);

router.get(
  "/statistics",
  authorizeRoles("admin", "judge"),
  getHearingStatistics
);

export default router;
