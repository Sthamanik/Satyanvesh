import User from "@models/user.model.js";
import { ApiError } from "@utils/apiError.util.js";
import {
  generateAccessToken,
  generateRefreshToken,
  verifyRefreshToken,
} from "@utils/jwt.util.js";

interface RegisterData {
  username: string;
  email: string;
  password: string;
  fullName: string;
  phone?: string;
  role?: string;
  barCouncilId?: string;
}

interface LoginData {
  email: string;
  password: string;
}

class AuthService {
  // Register new user
  async register(data: RegisterData) {
    const { username, email, password, fullName, phone, role, barCouncilId } =
      data;

    // Check if user exists
    const existingUser = await User.findOne({ $or: [{ email }, { username }] });
    if (existingUser) {
      throw new ApiError(409, "User with email or username already exists");
    }

    // Validate barCouncilId for lawyers
    if (role === "lawyer" && !barCouncilId) {
      throw new ApiError(400, "Bar Council ID is required for lawyers");
    }

    // Create user
    const user = await User.create({
      username,
      email,
      password, // Will be hashed by pre-save hook
      fullName,
      phone,
      role,
      barCouncilId,
    });

    // Generate tokens
    const accessToken = generateAccessToken(user);
    const refreshToken = generateRefreshToken(user);

    // Save refresh token
    user.refreshToken = refreshToken;
    await user.save({ validateBeforeSave: false });

    // Remove sensitive data
    const userResponse = await User.findById(user._id).select(
      "-password -refreshToken"
    );

    return {
      user: userResponse,
      accessToken,
      refreshToken,
    };
  }

  // Login user
  async login(data: LoginData) {
    const { email, password } = data;

    // Find user
    const user = await User.findOne({ email });
    if (!user) {
      throw new ApiError(404, "User does not exist");
    }

    // Verify password
    const isPasswordValid = await user.isPasswordCorrect(password);
    if (!isPasswordValid) {
      throw new ApiError(401, "Invalid credentials");
    }

    // Generate tokens
    const accessToken = generateAccessToken(user);
    const refreshToken = generateRefreshToken(user);

    // Save refresh token
    user.refreshToken = refreshToken;
    await user.save({ validateBeforeSave: false });

    // Remove sensitive data
    const userResponse = await User.findById(user._id).select(
      "-password -refreshToken"
    );

    return {
      user: userResponse,
      accessToken,
      refreshToken,
    };
  }

  // Logout user
  async logout(userId: string) {
    await User.findByIdAndUpdate(
      userId,
      { $unset: { refreshToken: 1 } },
      { new: true }
    );

    return null;
  }

  // Refresh access token
  async refreshAccessToken(incomingRefreshToken: string) {
    if (!incomingRefreshToken) {
      throw new ApiError(401, "Unauthorized request");
    }

    try {
      const decoded: any = verifyRefreshToken(incomingRefreshToken);

      const user = await User.findById(decoded._id);
      if (!user) {
        throw new ApiError(401, "Invalid refresh token");
      }

      if (incomingRefreshToken !== user.refreshToken) {
        throw new ApiError(401, "Refresh token is expired or used");
      }

      // Generate new tokens
      const accessToken = generateAccessToken(user);
      const refreshToken = generateRefreshToken(user);

      // Save new refresh token
      user.refreshToken = refreshToken;
      await user.save({ validateBeforeSave: false });

      return {
        accessToken,
        refreshToken,
      };
    } catch (error: any) {
      throw new ApiError(401, error?.message || "Invalid refresh token");
    }
  }

  // Get current user
  async getCurrentUser(userId: string) {
    const user = await User.findById(userId).select("-password -refreshToken");

    if (!user) {
      throw new ApiError(404, "User not found");
    }

    return user;
  }

  // Change password
  async changePassword(
    userId: string,
    oldPassword: string,
    newPassword: string
  ) {
    const user = await User.findById(userId);
    if (!user) {
      throw new ApiError(404, "User not found");
    }

    const isPasswordValid = await user.isPasswordCorrect(oldPassword);
    if (!isPasswordValid) {
      throw new ApiError(400, "Invalid old password");
    }

    user.password = newPassword; // Will be hashed by pre-save hook
    await user.save();

    return null;
  }
}

export default new AuthService();
