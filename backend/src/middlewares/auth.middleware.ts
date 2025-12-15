import { Request, Response, NextFunction } from "express";
import { asyncHandler } from "@utils/asyncHandler.util.js";
import { ApiError } from "@utils/apiError.util.js";
import User from "@models/user.model.js";
import { verifyAccessToken } from "@utils/jwt.util.js";

// Extend Express Request type
declare global {
  namespace Express {
    interface Request {
      user?: any;
    }
  }
}

export const verifyJWT = asyncHandler(
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const token =
        req.cookies?.accessToken ||
        req.header("Authorization")?.replace("Bearer ", "");

      if (!token) {
        throw new ApiError(401, "Unauthorized request");
      }

      const decoded: any = verifyAccessToken(token);

      const user = await User.findById(decoded._id).select(
        "-password -refreshToken"
      );

      if (!user) {
        throw new ApiError(401, "Invalid access token");
      }

      req.user = user;
      next();
    } catch (error: any) {
      throw new ApiError(401, error?.message || "Invalid access token");
    }
  }
);

// Role-based authorization middleware
export const authorizeRoles = (...roles: string[]) => {
  return (req: Request, res: Response, next: NextFunction) => {
    if (!req.user) {
      throw new ApiError(401, "Unauthorized request");
    }

    if (!roles.includes(req.user.role)) {
      throw new ApiError(
        403,
        `Role ${req.user.role} is not allowed to access this resource`
      );
    }

    next();
  };
};
