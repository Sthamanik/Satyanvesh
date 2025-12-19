import { Request, Response } from "express";
import { asyncHandler } from "@utils/asyncHandler.util.js";
import { ApiResponse } from "@utils/apiResponse.util.js";
import UserService from "@services/user.service.js";
import { ApiError } from "@utils/apiError.util";

// Create user (admin only)
export const createUser = asyncHandler(async (req: Request, res: Response) => {
  const user = await UserService.createUser(req.body);

  res.status(201).json(new ApiResponse(201, user, "User created successfully"));
});

// Get all users
export const getAllUsers = asyncHandler(async (req: Request, res: Response) => {
  const data = await UserService.getAllUsers(req.query);

  res
    .status(200)
    .json(new ApiResponse(200, data, "Users fetched successfully"));
});

// Get user by ID
export const getUserById = asyncHandler(async (req: Request, res: Response) => {
  const user = await UserService.getUserById(req.params.id);

  res.status(200).json(new ApiResponse(200, user, "User fetched successfully"));
});

// Get user by slug
export const getUserBySlug = asyncHandler(
  async (req: Request, res: Response) => {
    const user = await UserService.getUserBySlug(req.params.slug);

    res
      .status(200)
      .json(new ApiResponse(200, user, "User fetched successfully"));
  }
);

// Update user
export const updateUser = asyncHandler(async (req: Request, res: Response) => {
  const user = await UserService.updateUser(req.params.id, req.body);

  res.status(200).json(new ApiResponse(200, user, "User updated successfully"));
});

// Update user role (admin only)
export const updateUserRole = asyncHandler(
  async (req: Request, res: Response) => {
    const user = await UserService.updateUserRole(req.params.id, req.body.role);

    res
      .status(200)
      .json(new ApiResponse(200, user, "User role updated successfully"));
  }
);

// Verify user (admin only)
export const verifyUser = asyncHandler(async (req: Request, res: Response) => {
  const user = await UserService.verifyUser(req.params.id);

  res
    .status(200)
    .json(new ApiResponse(200, user, "User verified successfully"));
});

// Delete user (admin only)
export const deleteUser = asyncHandler(async (req: Request, res: Response) => {
  await UserService.deleteUser(req.params.id);

  res.status(200).json(new ApiResponse(200, null, "User deleted successfully"));
});

// Get users by role
export const getUsersByRole = asyncHandler(
  async (req: Request, res: Response) => {
    const users = await UserService.getUsersByRole(req.params.role);

    res
      .status(200)
      .json(new ApiResponse(200, users, "Users fetched successfully"));
  }
);

// Get user statistics (admin only)
export const getUserStatistics = asyncHandler(
  async (req: Request, res: Response) => {
    const stats = await UserService.getUserStatistics();

    res
      .status(200)
      .json(
        new ApiResponse(200, stats, "User statistics fetched successfully")
      );
  }
);

// Update avatar
export const updateAvatar = asyncHandler(async (req: Request, res: Response) => {
  if (!req.file) {
    throw new ApiError(400, "Avatar file is required");
  }

  const user = await UserService.updateAvatar(req.params.id, req.file.path);

  res.status(200).json(new ApiResponse(200, user, "Avatar updated successfully"));
});

// Remove avatar
export const removeAvatar = asyncHandler(async (req: Request, res: Response) => {
  const user = await UserService.removeAvatar(req.params.id);

  res.status(200).json(new ApiResponse(200, user, "Avatar removed successfully"));
});