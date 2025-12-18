import Advocate from "@models/advocate.model.js";
import User from "@models/user.model.js";
import { ApiError } from "@utils/apiError.util.js";

interface CreateAdvocateData {
  userId: string;
  barCouncilId: string;
  licenseNumber: string;
  specialization?: string[];
  experience: number;
  firmName?: string;
  firmAddress?: string;
  enrollmentDate: Date;
}

interface UpdateAdvocateData {
  barCouncilId?: string;
  licenseNumber?: string;
  specialization?: string[];
  experience?: number;
  firmName?: string;
  firmAddress?: string;
  enrollmentDate?: Date;
  isActive?: boolean;
}

interface GetAllAdvocatesQuery {
  isActive?: string;
  specialization?: string;
  minExperience?: string;
  page?: string;
  limit?: string;
}

class AdvocateService {
  // Create advocate
  async createAdvocate(data: CreateAdvocateData) {
    const {
      userId,
      barCouncilId,
      licenseNumber,
      specialization,
      experience,
      firmName,
      firmAddress,
      enrollmentDate,
    } = data;

    // Check if user exists and is a lawyer
    const user = await User.findById(userId);
    if (!user) {
      throw new ApiError(404, "User not found");
    }
    if (user.role !== "lawyer") {
      throw new ApiError(
        400,
        "User must have lawyer role to become an advocate"
      );
    }

    // Check if advocate already exists for this user
    const existingAdvocate = await Advocate.findOne({
      $or: [{ userId }, { barCouncilId }, { licenseNumber }],
    });

    if (existingAdvocate) {
      throw new ApiError(
        409,
        "Advocate with this user, bar council ID, or license already exists"
      );
    }

    // Create advocate
    const advocate = await Advocate.create({
      userId,
      barCouncilId: barCouncilId.toUpperCase(),
      licenseNumber: licenseNumber.toUpperCase(),
      specialization: specialization || [],
      experience,
      firmName,
      firmAddress,
      enrollmentDate,
    });

    // Populate user details
    const populatedAdvocate = await Advocate.findById(advocate._id).populate(
      "userId",
      "fullName username email phone avatar"
    );

    return populatedAdvocate;
  }

  // Get all advocates with filters and pagination
  async getAllAdvocates(query: GetAllAdvocatesQuery) {
    const {
      isActive,
      specialization,
      minExperience,
      page = "1",
      limit = "10",
    } = query;

    const filter: any = {};

    if (isActive !== undefined) filter.isActive = isActive === "true";
    if (specialization) filter.specialization = { $in: [specialization] };
    if (minExperience) filter.experience = { $gte: Number(minExperience) };

    const skip = (Number(page) - 1) * Number(limit);

    const advocates = await Advocate.find(filter)
      .populate("userId", "fullName username email phone avatar")
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(Number(limit));

    const total = await Advocate.countDocuments(filter);

    return {
      advocates,
      pagination: {
        page: Number(page),
        limit: Number(limit),
        total,
        totalPages: Math.ceil(total / Number(limit)),
      },
    };
  }

  // Get advocate by ID
  async getAdvocateById(advocateId: string) {
    const advocate = await Advocate.findById(advocateId).populate(
      "userId",
      "fullName username email phone avatar"
    );

    if (!advocate) {
      throw new ApiError(404, "Advocate not found");
    }

    return advocate;
  }

  // Get advocate by user ID
  async getAdvocateByUserId(userId: string) {
    const advocate = await Advocate.findOne({ userId }).populate(
      "userId",
      "fullName username email phone avatar"
    );

    if (!advocate) {
      throw new ApiError(404, "Advocate not found");
    }

    return advocate;
  }

  // Update advocate
  async updateAdvocate(advocateId: string, data: UpdateAdvocateData) {
    // If barCouncilId is being updated, check for duplicates
    if (data.barCouncilId) {
      const existingAdvocate = await Advocate.findOne({
        barCouncilId: data.barCouncilId.toUpperCase(),
        _id: { $ne: advocateId },
      });
      if (existingAdvocate) {
        throw new ApiError(
          409,
          "Advocate with this bar council ID already exists"
        );
      }
      data.barCouncilId = data.barCouncilId.toUpperCase();
    }

    // If licenseNumber is being updated, check for duplicates
    if (data.licenseNumber) {
      const existingAdvocate = await Advocate.findOne({
        licenseNumber: data.licenseNumber.toUpperCase(),
        _id: { $ne: advocateId },
      });
      if (existingAdvocate) {
        throw new ApiError(
          409,
          "Advocate with this license number already exists"
        );
      }
      data.licenseNumber = data.licenseNumber.toUpperCase();
    }

    const advocate = await Advocate.findByIdAndUpdate(
      advocateId,
      { $set: data },
      { new: true, runValidators: true }
    ).populate("userId", "fullName username email phone avatar");

    if (!advocate) {
      throw new ApiError(404, "Advocate not found");
    }

    return advocate;
  }

  // Delete advocate
  async deleteAdvocate(advocateId: string) {
    const advocate = await Advocate.findByIdAndDelete(advocateId);

    if (!advocate) {
      throw new ApiError(404, "Advocate not found");
    }

    return null;
  }

  // Get advocates by specialization
  async getAdvocatesBySpecialization(specialization: string) {
    const advocates = await Advocate.find({
      specialization: { $in: [specialization] },
      isActive: true,
    })
      .populate("userId", "fullName username email phone")
      .sort({ experience: -1 });

    return advocates;
  }

  // Toggle advocate active status
  async toggleAdvocateStatus(advocateId: string) {
    const advocate = await Advocate.findById(advocateId);

    if (!advocate) {
      throw new ApiError(404, "Advocate not found");
    }

    advocate.isActive = !advocate.isActive;
    await advocate.save();

    const populatedAdvocate = await Advocate.findById(advocate._id).populate(
      "userId",
      "fullName username email phone avatar"
    );

    return populatedAdvocate;
  }

  // Get advocate statistics
  async getAdvocateStatistics() {
    const totalAdvocates = await Advocate.countDocuments();
    const activeAdvocates = await Advocate.countDocuments({ isActive: true });
    const inactiveAdvocates = await Advocate.countDocuments({
      isActive: false,
    });

    const advocatesBySpecialization = await Advocate.aggregate([
      { $unwind: "$specialization" },
      {
        $group: {
          _id: "$specialization",
          count: { $sum: 1 },
        },
      },
      {
        $sort: { count: -1 },
      },
    ]);

    const averageExperience = await Advocate.aggregate([
      {
        $group: {
          _id: null,
          avgExperience: { $avg: "$experience" },
        },
      },
    ]);

    return {
      totalAdvocates,
      activeAdvocates,
      inactiveAdvocates,
      advocatesBySpecialization,
      averageExperience: averageExperience[0]?.avgExperience || 0,
    };
  }
}

export default new AdvocateService();
