import { Request, Response } from "express";
import { asyncHandler } from "@utils/asyncHandler.util.js";
import { ApiResponse } from "@utils/apiResponse.util.js";
import AuthService from "@services/auth.service.js";

// Register user
export const register = asyncHandler(async (req: Request, res: Response) => {
  const data = await AuthService.register(req.body);

  // Set cookies
  const cookieOptions = {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "strict" as const,
    maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
  };

  res
    .status(201)
    .cookie("accessToken", data.accessToken, {
      ...cookieOptions,
      maxAge: 15 * 60 * 1000,
    }) // 15 min
    .cookie("refreshToken", data.refreshToken, cookieOptions)
    .json(new ApiResponse(201, data, "User registered successfully"));
});

// Login user
export const login = asyncHandler(async (req: Request, res: Response) => {
  const data = await AuthService.login(req.body);

  // Set cookies
  const cookieOptions = {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "strict" as const,
    maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
  };

  res
    .status(200)
    .cookie("accessToken", data.accessToken, {
      ...cookieOptions,
      maxAge: 15 * 60 * 1000,
    }) // 15 min
    .cookie("refreshToken", data.refreshToken, cookieOptions)
    .json(new ApiResponse(200, data, "User logged in successfully"));
});

// Logout user
export const logout = asyncHandler(async (req: Request, res: Response) => {
  await AuthService.logout(req.user._id);

  const cookieOptions = {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "strict" as const,
  };

  res
    .status(200)
    .clearCookie("accessToken", cookieOptions)
    .clearCookie("refreshToken", cookieOptions)
    .json(new ApiResponse(200, null, "User logged out successfully"));
});

// Refresh access token
export const refreshAccessToken = asyncHandler(
  async (req: Request, res: Response) => {
    const incomingRefreshToken =
      req.cookies.refreshToken || req.body.refreshToken;

    const data = await AuthService.refreshAccessToken(incomingRefreshToken);

    const cookieOptions = {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "strict" as const,
      maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
    };

    res
      .status(200)
      .cookie("accessToken", data.accessToken, {
        ...cookieOptions,
        maxAge: 15 * 60 * 1000,
      })
      .cookie("refreshToken", data.refreshToken, cookieOptions)
      .json(new ApiResponse(200, data, "Access token refreshed successfully"));
  }
);

// Get current user
export const getCurrentUser = asyncHandler(
  async (req: Request, res: Response) => {
    const user = await AuthService.getCurrentUser(req.user._id);

    res
      .status(200)
      .json(new ApiResponse(200, user, "Current user fetched successfully"));
  }
);

// Change password
export const changePassword = asyncHandler(
  async (req: Request, res: Response) => {
    const { oldPassword, newPassword } = req.body;

    await AuthService.changePassword(req.user._id, oldPassword, newPassword);

    res
      .status(200)
      .json(new ApiResponse(200, null, "Password changed successfully"));
  }
);
