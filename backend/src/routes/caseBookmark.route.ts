import { Router } from "express";
import {
  addBookmark,
  getUserBookmarks,
  getBookmarkById,
  checkBookmark,
  updateBookmark,
  removeBookmark,
  removeBookmarkByCase,
  getBookmarksWithUpcomingHearings,
  getUserBookmarkStatistics,
  getBookmarkStatistics,
} from "@controllers/caseBookmark.controller.js";
import { validate } from "@middlewares/validate.middleware.js";
import { verifyJWT, authorizeRoles } from "@middlewares/auth.middleware.js";
import {
  addBookmarkSchema,
  updateBookmarkSchema,
  getBookmarkByIdSchema,
  removeBookmarkSchema,
  checkBookmarkSchema,
} from "@validations/caseBookmark.validation.js";

const router = Router();

// All routes require authentication
router.use(verifyJWT);

// User routes
router.post("/", validate(addBookmarkSchema), addBookmark);

router.get("/my-bookmarks", getUserBookmarks);

router.get("/upcoming-hearings", getBookmarksWithUpcomingHearings);

router.get("/my-statistics", getUserBookmarkStatistics);

router.get("/check/:caseId", validate(checkBookmarkSchema), checkBookmark);

router.get("/:id", validate(getBookmarkByIdSchema), getBookmarkById);

router.patch("/:id", validate(updateBookmarkSchema), updateBookmark);

router.delete("/:id", validate(removeBookmarkSchema), removeBookmark);

router.delete("/case/:caseId", removeBookmarkByCase);

// Admin routes
router.get(
  "/admin/statistics",
  authorizeRoles("admin", "judge"),
  getBookmarkStatistics
);

export default router;
