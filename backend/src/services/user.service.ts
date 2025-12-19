import User from "@models/user.model.js";
import { ApiError } from "@utils/apiError.util.js";
import {
  uploadOnCloudinary,
  deleteFromCloudinary,
} from "@utils/cloudinary.util.js";

interface CreateUserData {
  username: string;
  email: string;
  password: string;
  fullName: string;
  phone?: string;
  role?: string;
  barCouncilId?: string;
}

interface UpdateUserData {
  fullName?: string;
  phone?: string;
  avatar?: string;
}

interface GetAllUsersQuery {
  role?: string;
  isVerified?: string;
  search?: string;
  page?: string;
  limit?: string;
}

class UserService {
  // Create user (admin only)
  async createUser(data: CreateUserData) {
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

    // Remove sensitive data
    const userResponse = await User.findById(user._id).select(
      "-password -refreshToken"
    );

    return userResponse;
  }

  // Get all users with filters and pagination
  async getAllUsers(query: GetAllUsersQuery) {
    const { role, isVerified, search, page = "1", limit = "10" } = query;

    const filter: any = {};

    if (role) filter.role = role;
    if (isVerified !== undefined) filter.isVerified = isVerified === "true";
    if (search) {
      filter.$or = [
        { fullName: { $regex: search, $options: "i" } },
        { username: { $regex: search, $options: "i" } },
        { email: { $regex: search, $options: "i" } },
      ];
    }

    const skip = (Number(page) - 1) * Number(limit);

    const users = await User.find(filter)
      .select("-password -refreshToken")
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(Number(limit));

    const total = await User.countDocuments(filter);

    return {
      users,
      pagination: {
        page: Number(page),
        limit: Number(limit),
        total,
        totalPages: Math.ceil(total / Number(limit)),
      },
    };
  }

  // Get user by ID
  async getUserById(userId: string) {
    const user = await User.findById(userId).select("-password -refreshToken");

    if (!user) {
      throw new ApiError(404, "User not found");
    }

    return user;
  }

  // Get user by slug
  async getUserBySlug(slug: string) {
    const user = await User.findOne({ slug }).select("-password -refreshToken");

    if (!user) {
      throw new ApiError(404, "User not found");
    }

    return user;
  }

  // Update user profile
  async updateUser(userId: string, data: UpdateUserData) {
    const user = await User.findByIdAndUpdate(
      userId,
      { $set: data },
      { new: true, runValidators: true }
    ).select("-password -refreshToken");

    if (!user) {
      throw new ApiError(404, "User not found");
    }

    return user;
  }

  // Update user role (admin only)
  async updateUserRole(userId: string, role: string) {
    const user = await User.findByIdAndUpdate(
      userId,
      { role },
      { new: true, runValidators: true }
    ).select("-password -refreshToken");

    if (!user) {
      throw new ApiError(404, "User not found");
    }

    return user;
  }

  // Verify user (admin only)
  async verifyUser(userId: string) {
    const user = await User.findByIdAndUpdate(
      userId,
      { isVerified: true },
      { new: true }
    ).select("-password -refreshToken");

    if (!user) {
      throw new ApiError(404, "User not found");
    }

    return user;
  }

  // Delete user (admin only)
  async deleteUser(userId: string) {
    const user = await User.findByIdAndDelete(userId);

    if (!user) {
      throw new ApiError(404, "User not found");
    }

    return null;
  }

  // Get users by role
  async getUsersByRole(role: string) {
    const users = await User.find({ role })
      .select("-password -refreshToken")
      .sort({ createdAt: -1 });

    return users;
  }

  // Get user statistics (admin only)
  async getUserStatistics() {
    const totalUsers = await User.countDocuments();
    const verifiedUsers = await User.countDocuments({ isVerified: true });
    const unverifiedUsers = await User.countDocuments({ isVerified: false });

    const usersByRole = await User.aggregate([
      {
        $group: {
          _id: "$role",
          count: { $sum: 1 },
        },
      },
    ]);

    return {
      totalUsers,
      verifiedUsers,
      unverifiedUsers,
      usersByRole,
    };
  }

  // Update user avatar
  async updateAvatar(userId: string, filePath: string) {
    // Get user to check if old avatar exists
    const user = await User.findById(userId);
    if (!user) {
      throw new ApiError(404, "User not found");
    }

    // Upload new avatar to Cloudinary
    const uploadResult = await uploadOnCloudinary(filePath);
    if (!uploadResult) {
      throw new ApiError(500, "Failed to upload avatar to cloud storage");
    }

    // Delete old avatar from Cloudinary if exists
    if (user.avatar) {
      // Extract publicId from URL
      const urlParts = user.avatar.split("/");
      const publicIdWithExt = urlParts[urlParts.length - 1];
      const publicId = "judiciary-documents/" + publicIdWithExt.split(".")[0];
      await deleteFromCloudinary(publicId);
    }

    // Update user with new avatar URL
    const updatedUser = await User
      .findByIdAndUpdate(
        userId,
        { avatar: uploadResult.secure_url },
        { new: true }
      )
      .select("-password -refreshToken");

    return updatedUser;
  }

  // Remove user avatar
  async removeAvatar(userId: string) {
    const user = await User.findById(userId);
    if (!user) {
      throw new ApiError(404, "User not found");
    }

    // Delete from Cloudinary if exists
    if (user.avatar) {
      const urlParts = user.avatar.split("/");
      const publicIdWithExt = urlParts[urlParts.length - 1];
      const publicId = "judiciary-documents/" + publicIdWithExt.split(".")[0];
      await deleteFromCloudinary(publicId);
    }

    // Remove avatar from user
    const updatedUser = await User
      .findByIdAndUpdate(userId, { avatar: null }, { new: true })
      .select("-password -refreshToken");

    return updatedUser;
  }
}

export default new UserService();
