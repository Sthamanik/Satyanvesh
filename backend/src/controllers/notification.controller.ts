import { Request, Response } from "express";
import Notification from "../models/notification.model.js";
import { asyncHandler } from "@utils/asyncHandler.util.js";
import { ApiResponse } from "@utils/apiResponse.util.js";
import { ApiError } from "@utils/apiError.util.js";
import logger from "../utils/logger.util.js";

/**
 * Get notifications for the logged-in user
 */
export const getMyNotifications = asyncHandler(async (req: Request, res: Response) => {
  logger.debug(`Fetching notifications for user: ${req.user?._id}`);
  
  const notifications = await Notification.find({ recipientId: req.user?._id })
    .sort({ createdAt: -1 })
    .limit(50);

  logger.info(`Found ${notifications.length} notifications for user: ${req.user?._id}`);

  res
    .status(200)
    .json(new ApiResponse(200, notifications, "Notifications fetched successfully"));
});

/**
 * Mark a notification as read
 */
export const markNotificationAsRead = asyncHandler(async (req: Request, res: Response) => {
  const { id } = req.params;

  const notification = await Notification.findOneAndUpdate(
    { _id: id, recipientId: req.user?._id },
    { isRead: true },
    { new: true }
  );

  if (!notification) {
    throw new ApiError(404, "Notification not found");
  }

  res
    .status(200)
    .json(new ApiResponse(200, notification, "Notification marked as read"));
});

/**
 * Delete a notification
 */
export const deleteNotification = asyncHandler(async (req: Request, res: Response) => {
  const { id } = req.params;

  const notification = await Notification.findOneAndDelete({
    _id: id,
    recipientId: req.user?._id,
  });

  if (!notification) {
    throw new ApiError(404, "Notification not found");
  }

  res
    .status(200)
    .json(new ApiResponse(200, null, "Notification deleted successfully"));
});

/**
 * Clear all notifications for the user
 */
export const clearAllNotifications = asyncHandler(async (req: Request, res: Response) => {
  await Notification.deleteMany({ recipientId: req.user?._id });

  res
    .status(200)
    .json(new ApiResponse(200, null, "All notifications cleared"));
});
