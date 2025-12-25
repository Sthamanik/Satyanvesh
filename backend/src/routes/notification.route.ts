import { Router } from "express";
import { verifyJWT } from "../middlewares/auth.middleware";
import {
  getMyNotifications,
  markNotificationAsRead,
  deleteNotification,
  clearAllNotifications,
} from "../controllers/notification.controller.js";

const router = Router();

router.use(verifyJWT);

router.get("/", getMyNotifications);
router.patch("/:id/read", markNotificationAsRead);
router.delete("/clear-all", clearAllNotifications);
router.delete("/:id", deleteNotification);

export default router;
