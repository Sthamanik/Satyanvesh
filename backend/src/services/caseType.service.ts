import CaseType from "@models/caseType.model.js";
import { ApiError } from "@utils/apiError.util.js";

interface CreateCaseTypeData {
  name: string;
  code: string;
  description?: string;
  category: "Civil" | "Criminal" | "Family" | "Constitutional";
}

interface UpdateCaseTypeData {
  name?: string;
  code?: string;
  description?: string;
  category?: "Civil" | "Criminal" | "Family" | "Constitutional";
  isActive?: boolean;
}

interface GetAllCaseTypesQuery {
  category?: string;
  isActive?: string;
  page?: string;
  limit?: string;
}

class CaseTypeService {
  // Create case type
  async createCaseType(data: CreateCaseTypeData) {
    const { name, code, description, category } = data;

    // Check if case type exists
    const existingCaseType = await CaseType.findOne({
      $or: [{ code }, { name }],
    });
    if (existingCaseType) {
      throw new ApiError(
        409,
        "Case type with this code or name already exists"
      );
    }

    // Create case type
    const caseType = await CaseType.create({
      name,
      code: code.toUpperCase(),
      description,
      category,
    });

    return caseType;
  }

  // Get all case types with filters and pagination
  async getAllCaseTypes(query: GetAllCaseTypesQuery) {
    const { category, isActive, page = "1", limit = "10" } = query;

    const filter: any = {};

    if (category) filter.category = category;
    if (isActive !== undefined) filter.isActive = isActive === "true";

    const skip = (Number(page) - 1) * Number(limit);

    const caseTypes = await CaseType.find(filter)
      .sort({ name: 1 })
      .skip(skip)
      .limit(Number(limit));

    const total = await CaseType.countDocuments(filter);

    return {
      caseTypes,
      pagination: {
        page: Number(page),
        limit: Number(limit),
        total,
        totalPages: Math.ceil(total / Number(limit)),
      },
    };
  }

  // Get case type by ID
  async getCaseTypeById(caseTypeId: string) {
    const caseType = await CaseType.findById(caseTypeId);

    if (!caseType) {
      throw new ApiError(404, "Case type not found");
    }

    return caseType;
  }

  // Get case type by slug
  async getCaseTypeBySlug(slug: string) {
    const caseType = await CaseType.findOne({ slug });

    if (!caseType) {
      throw new ApiError(404, "Case type not found");
    }

    return caseType;
  }

  // Update case type
  async updateCaseType(caseTypeId: string, data: UpdateCaseTypeData) {
    // If code is being updated, check for duplicates
    if (data.code) {
      const existingCaseType = await CaseType.findOne({
        code: data.code.toUpperCase(),
        _id: { $ne: caseTypeId },
      });
      if (existingCaseType) {
        throw new ApiError(409, "Case type with this code already exists");
      }
      data.code = data.code.toUpperCase();
    }

    // If name is being updated, check for duplicates
    if (data.name) {
      const existingCaseType = await CaseType.findOne({
        name: data.name,
        _id: { $ne: caseTypeId },
      });
      if (existingCaseType) {
        throw new ApiError(409, "Case type with this name already exists");
      }
    }

    const caseType = await CaseType.findByIdAndUpdate(
      caseTypeId,
      { $set: data },
      { new: true, runValidators: true }
    );

    if (!caseType) {
      throw new ApiError(404, "Case type not found");
    }

    return caseType;
  }

  // Delete case type
  async deleteCaseType(caseTypeId: string) {
    const caseType = await CaseType.findByIdAndDelete(caseTypeId);

    if (!caseType) {
      throw new ApiError(404, "Case type not found");
    }

    return null;
  }

  // Get case types by category
  async getCaseTypesByCategory(category: string) {
    const caseTypes = await CaseType.find({ category, isActive: true }).sort({
      name: 1,
    });

    return caseTypes;
  }

  // Toggle case type active status
  async toggleCaseTypeStatus(caseTypeId: string) {
    const caseType = await CaseType.findById(caseTypeId);

    if (!caseType) {
      throw new ApiError(404, "Case type not found");
    }

    caseType.isActive = !caseType.isActive;
    await caseType.save();

    return caseType;
  }

  // Get case type statistics
  async getCaseTypeStatistics() {
    const totalCaseTypes = await CaseType.countDocuments();
    const activeCaseTypes = await CaseType.countDocuments({ isActive: true });
    const inactiveCaseTypes = await CaseType.countDocuments({
      isActive: false,
    });

    const caseTypesByCategory = await CaseType.aggregate([
      {
        $group: {
          _id: "$category",
          count: { $sum: 1 },
        },
      },
      {
        $sort: { count: -1 },
      },
    ]);

    return {
      totalCaseTypes,
      activeCaseTypes,
      inactiveCaseTypes,
      caseTypesByCategory,
    };
  }
}

export default new CaseTypeService();
