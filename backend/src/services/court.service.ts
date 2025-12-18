import Court from "@models/court.model.js";
import { ApiError } from "@utils/apiError.util.js";

interface CreateCourtData {
  name: string;
  code: string;
  type: "Supreme" | "High" | "District" | "Magistrate";
  state: string;
  city: string;
  address: string;
  contactEmail?: string;
  contactPhone?: string;
}

interface UpdateCourtData {
  name?: string;
  code?: string;
  type?: "Supreme" | "High" | "District" | "Magistrate";
  state?: string;
  city?: string;
  address?: string;
  contactEmail?: string;
  contactPhone?: string;
  isActive?: boolean;
}

interface GetAllCourtsQuery {
  type?: string;
  state?: string;
  city?: string;
  isActive?: string;
  page?: string;
  limit?: string;
}

class CourtService {
  // Create court
  async createCourt(data: CreateCourtData) {
    const {
      name,
      code,
      type,
      state,
      city,
      address,
      contactEmail,
      contactPhone,
    } = data;

    // Check if court exists
    const existingCourt = await Court.findOne({ $or: [{ code }, { name }] });
    if (existingCourt) {
      throw new ApiError(409, "Court with this code or name already exists");
    }

    // Create court
    const court = await Court.create({
      name,
      code: code.toUpperCase(),
      type,
      state,
      city,
      address,
      contactEmail,
      contactPhone,
    });

    return court;
  }

  // Get all courts with filters and pagination
  async getAllCourts(query: GetAllCourtsQuery) {
    const { type, state, city, isActive, page = "1", limit = "10" } = query;

    const filter: any = {};

    if (type) filter.type = type;
    if (state) filter.state = state;
    if (city) filter.city = city;
    if (isActive !== undefined) filter.isActive = isActive === "true";

    const skip = (Number(page) - 1) * Number(limit);

    const courts = await Court.find(filter)
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(Number(limit));

    const total = await Court.countDocuments(filter);

    return {
      courts,
      pagination: {
        page: Number(page),
        limit: Number(limit),
        total,
        totalPages: Math.ceil(total / Number(limit)),
      },
    };
  }

  // Get court by ID
  async getCourtById(courtId: string) {
    const court = await Court.findById(courtId);

    if (!court) {
      throw new ApiError(404, "Court not found");
    }

    return court;
  }

  // Get court by slug
  async getCourtBySlug(slug: string) {
    const court = await Court.findOne({ slug });

    if (!court) {
      throw new ApiError(404, "Court not found");
    }

    return court;
  }

  // Update court
  async updateCourt(courtId: string, data: UpdateCourtData) {
    // If code is being updated, check for duplicates
    if (data.code) {
      const existingCourt = await Court.findOne({
        code: data.code.toUpperCase(),
        _id: { $ne: courtId },
      });
      if (existingCourt) {
        throw new ApiError(409, "Court with this code already exists");
      }
      data.code = data.code.toUpperCase();
    }

    // If name is being updated, check for duplicates
    if (data.name) {
      const existingCourt = await Court.findOne({
        name: data.name,
        _id: { $ne: courtId },
      });
      if (existingCourt) {
        throw new ApiError(409, "Court with this name already exists");
      }
    }

    const court = await Court.findByIdAndUpdate(
      courtId,
      { $set: data },
      { new: true, runValidators: true }
    );

    if (!court) {
      throw new ApiError(404, "Court not found");
    }

    return court;
  }

  // Delete court
  async deleteCourt(courtId: string) {
    const court = await Court.findByIdAndDelete(courtId);

    if (!court) {
      throw new ApiError(404, "Court not found");
    }

    return null;
  }

  // Get courts by type
  async getCourtsByType(type: string) {
    const courts = await Court.find({ type, isActive: true }).sort({ name: 1 });

    return courts;
  }

  // Get courts by state
  async getCourtsByState(state: string) {
    const courts = await Court.find({ state, isActive: true }).sort({
      name: 1,
    });

    return courts;
  }

  // Toggle court active status
  async toggleCourtStatus(courtId: string) {
    const court = await Court.findById(courtId);

    if (!court) {
      throw new ApiError(404, "Court not found");
    }

    court.isActive = !court.isActive;
    await court.save();

    return court;
  }

  // Get court statistics
  async getCourtStatistics() {
    const totalCourts = await Court.countDocuments();
    const activeCourts = await Court.countDocuments({ isActive: true });
    const inactiveCourts = await Court.countDocuments({ isActive: false });

    const courtsByType = await Court.aggregate([
      {
        $group: {
          _id: "$type",
          count: { $sum: 1 },
        },
      },
      {
        $sort: { count: -1 },
      },
    ]);

    const courtsByState = await Court.aggregate([
      {
        $group: {
          _id: "$state",
          count: { $sum: 1 },
        },
      },
      {
        $sort: { count: -1 },
      },
    ]);

    return {
      totalCourts,
      activeCourts,
      inactiveCourts,
      courtsByType,
      courtsByState,
    };
  }
}

export default new CourtService();
