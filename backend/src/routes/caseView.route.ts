import { Router } from "express";
import {
  trackCaseView,
  getCaseViewAnalytics,
  getTrendingCases,
  getUserViewedCases,
  getMostViewedCases,
  getOverallStatistics,
  getViewStatisticsByDateRange,
  getPeakViewingHours,
} from "@controllers/caseView.controller.js";
import { validate } from "@middlewares/validate.middleware.js";
import { verifyJWT, authorizeRoles } from "@middlewares/auth.middleware.js";
import {
  trackCaseViewSchema,
  getCaseViewAnalyticsSchema,
  getTrendingCasesSchema,
} from "@validations/caseView.validation.js";

const router = Router();

// Public routes (optional authentication for tracking user)
router.post("/track", validate(trackCaseViewSchema), trackCaseView);

router.get("/trending", validate(getTrendingCasesSchema), getTrendingCases);

router.get("/most-viewed", getMostViewedCases);

// Authenticated routes
router.use(verifyJWT);
router.get("/my-viewed-cases", getUserViewedCases);

// Admin routes
router.use(authorizeRoles("admin", "judge"));
router.get(
  "/analytics/:caseId",
  validate(getCaseViewAnalyticsSchema),
  getCaseViewAnalytics
);

router.get(
  "/statistics/overall",
  getOverallStatistics
);

router.get(
  "/statistics/date-range",
  getViewStatisticsByDateRange
);

router.get(
  "/statistics/peak-hours",
  getPeakViewingHours
);

export default router;
