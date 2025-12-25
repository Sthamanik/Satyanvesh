import caseModel from "@models/case.model.js";
import courtModel from "@models/court.model.js";
import caseTypeModel from "@models/caseType.model.js";
import casePartyModel from "@models/caseParty.model.js";
import userModel from "@models/user.model.js";
import { ApiError } from "@utils/apiError.util.js";
import EmailService from "@services/email.service.js";

interface CreateCaseData {
  caseNumber: string;
  title: string;
  description?: string;
  caseTypeId: string;
  courtId: string;
  filedBy: string;
  filingDate: Date;
  priority?: string;
  isPublic?: boolean;
  isSensitive?: boolean;
}

interface UpdateCaseData {
  title?: string;
  description?: string;
  caseTypeId?: string;
  courtId?: string;
  status?: string;
  admissionDate?: Date;
  judgmentDate?: Date;
  priority?: string;
  stage?: string;
  nextHearingDate?: Date;
  isPublic?: boolean;
  isSensitive?: boolean;
  verdict?: string;
}

interface GetAllCasesQuery {
  status?: string;
  courtId?: string;
  caseTypeId?: string;
  priority?: string;
  stage?: string;
  isPublic?: string;
  search?: string;
  page?: string;
  limit?: string;
}

class CaseService {
  // Create case
  async createCase(data: CreateCaseData) {
    const {
      caseNumber,
      title,
      description,
      caseTypeId,
      courtId,
      filedBy,
      filingDate,
      priority,
      isPublic,
      isSensitive,
    } = data;

    // Check if case number exists
    const existingCase = await caseModel.findOne({ caseNumber });
    if (existingCase) {
      throw new ApiError(409, "Case with this case number already exists");
    }

    // Verify court exists
    const court = await courtModel.findById(courtId);
    if (!court) {
      throw new ApiError(404, "Court not found");
    }

    // Verify case type exists
    const caseType = await caseTypeModel.findById(caseTypeId);
    if (!caseType) {
      throw new ApiError(404, "Case type not found");
    }

    // Verify user exists
    const user = await userModel.findById(filedBy);
    if (!user) {
      throw new ApiError(404, "User not found");
    }

    // Create case
    const newCase = await caseModel.create({
      caseNumber: caseNumber.toUpperCase(),
      title,
      description,
      caseTypeId,
      courtId,
      filedBy,
      filingDate,
      priority: priority || "normal",
      isPublic: isPublic !== undefined ? isPublic : true,
      isSensitive: isSensitive !== undefined ? isSensitive : false,
    });

    // Populate references
    const populatedCase = await caseModel
      .findById(newCase._id)
      .populate("caseTypeId", "name code category")
      .populate("courtId", "name code type city state")
      .populate("filedBy", "fullName username email role");

    return populatedCase;
  }

  // Get all cases with filters and pagination
  async getAllCases(query: GetAllCasesQuery) {
    const {
      status,
      courtId,
      caseTypeId,
      priority,
      stage,
      isPublic,
      search,
      page = "1",
      limit = "10",
    } = query;

    const filter: any = {};

    if (status) filter.status = status;
    if (courtId) filter.courtId = courtId;
    if (caseTypeId) filter.caseTypeId = caseTypeId;
    if (priority) filter.priority = priority;
    if (stage) filter.stage = stage;
    if (isPublic !== undefined) filter.isPublic = isPublic === "true";

    if (search) {
      filter.$or = [
        { title: { $regex: search, $options: "i" } },
        { description: { $regex: search, $options: "i" } },
        { caseNumber: { $regex: search, $options: "i" } },
      ];
    }

    const skip = (Number(page) - 1) * Number(limit);

    const cases = await caseModel
      .find(filter)
      .populate("caseTypeId", "name code category")
      .populate("courtId", "name code type city state")
      .populate("filedBy", "fullName username email role")
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(Number(limit));

    const total = await caseModel.countDocuments(filter);

    return {
      cases,
      pagination: {
        page: Number(page),
        limit: Number(limit),
        total,
        totalPages: Math.ceil(total / Number(limit)),
      },
    };
  }

  // Get case by ID
  async getCaseById(caseId: string) {
    const caseData = await caseModel
      .findById(caseId)
      .populate("caseTypeId", "name code category")
      .populate("courtId", "name code type city state")
      .populate("filedBy", "fullName username email role");

    if (!caseData) {
      throw new ApiError(404, "Case not found");
    }

    // Increment view count
    caseData.viewCount += 1;
    await caseData.save();

    return caseData;
  }

  // Get case by slug
  async getCaseBySlug(slug: string) {
    const caseData = await caseModel
      .findOne({ slug })
      .populate("caseTypeId", "name code category")
      .populate("courtId", "name code type city state")
      .populate("filedBy", "fullName username email role");

    if (!caseData) {
      throw new ApiError(404, "Case not found");
    }

    // Increment view count
    caseData.viewCount += 1;
    await caseData.save();

    return caseData;
  }

  // Get case by case number
  async getCaseByCaseNumber(caseNumber: string) {
    const caseData = await caseModel
      .findOne({ caseNumber: caseNumber.toUpperCase() })
      .populate("caseTypeId", "name code category")
      .populate("courtId", "name code type city state")
      .populate("filedBy", "fullName username email role");

    if (!caseData) {
      throw new ApiError(404, "Case not found");
    }

    return caseData;
  }

  // Update case
  async updateCase(caseId: string, data: UpdateCaseData) {
    const caseData = await caseModel
      .findByIdAndUpdate(
        caseId,
        { $set: data },
        { new: true, runValidators: true }
      )
      .populate("caseTypeId", "name code category")
      .populate("courtId", "name code type city state")
      .populate("filedBy", "fullName username email role");

    if (!caseData) {
      throw new ApiError(404, "Case not found");
    }

    return caseData;
  }

  // Update case status
  async updateCaseStatus(caseId: string, status: string) {
    // Get case with populated data
    const caseData = await caseModel
      .findById(caseId)
      .populate("filedBy", "email fullName")
      .populate("courtId", "name")
      .populate("caseTypeId", "name");

    if (!caseData) {
      throw new ApiError(404, "Case not found");
    }

    const oldStatus = caseData.status;

    const updateData: any = { status };

    // Auto-set dates based on status
    if (status === "admitted" && !caseData.admissionDate) {
      updateData.admissionDate = new Date();
    }
    if (status === "judgment" && !caseData.judgmentDate) {
      updateData.judgmentDate = new Date();
    }

    // Update case
    caseData.status = status as
      | "judgment"
      | "filed"
      | "admitted"
      | "hearing"
      | "closed"
      | "archived";
    if (updateData.admissionDate)
      caseData.admissionDate = updateData.admissionDate;
    if (updateData.judgmentDate)
      caseData.judgmentDate = updateData.judgmentDate;
    await caseData.save();

    // Send email to the person who filed the case
    if (caseData.filedBy && (caseData.filedBy as any).email) {
      EmailService.sendCaseStatusUpdate(
        (caseData.filedBy as any).email,
        (caseData.filedBy as any).fullName,
        caseData.caseNumber,
        caseData.title,
        oldStatus,
        status
      ).catch((err) => console.error("Failed to send case status email:", err));
    }

    // Get all parties involved in the case and send emails
    const parties = await casePartyModel
      .find({ caseId })
      .populate("userId", "email fullName");

    for (const party of parties) {
      // Send email to registered users
      if (party.userId && (party.userId as any).email) {
        EmailService.sendCaseStatusUpdate(
          (party.userId as any).email,
          (party.userId as any).fullName,
          caseData.caseNumber,
          caseData.title,
          oldStatus,
          status
        ).catch((err) =>
          console.error("Failed to send case status email to party:", err)
        );
      }
      // Send email to external parties with email
      else if (party.email) {
        EmailService.sendCaseStatusUpdate(
          party.email,
          party.name,
          caseData.caseNumber,
          caseData.title,
          oldStatus,
          status
        ).catch((err) =>
          console.error(
            "Failed to send case status email to external party:",
            err
          )
        );
      }
    }

    // Populate for response
    const updatedCase = await caseModel
      .findById(caseId)
      .populate("caseTypeId", "name code category")
      .populate("courtId", "name code type city state")
      .populate("filedBy", "fullName username email role");

    return updatedCase;
  }

  // Delete case
  async deleteCase(caseId: string) {
    const caseData = await caseModel.findByIdAndDelete(caseId);

    if (!caseData) {
      throw new ApiError(404, "Case not found");
    }

    return null;
  }

  // Get cases by court
  async getCasesByCourt(courtId: string) {
    const cases = await caseModel
      .find({ courtId })
      .populate("caseTypeId", "name code category")
      .populate("filedBy", "fullName username")
      .sort({ createdAt: -1 });

    return cases;
  }

  // Get cases by case type
  async getCasesByCaseType(caseTypeId: string) {
    const cases = await caseModel
      .find({ caseTypeId })
      .populate("courtId", "name code type")
      .populate("filedBy", "fullName username")
      .sort({ createdAt: -1 });

    return cases;
  }

  // Get cases by user (filed by)
  async getCasesByUser(userId: string) {
    const cases = await caseModel
      .find({ filedBy: userId })
      .populate("caseTypeId", "name code category")
      .populate("courtId", "name code type city state")
      .sort({ createdAt: -1 });

    return cases;
  }

  // Search cases
  async searchCases(
    searchQuery: string,
    page: string = "1",
    limit: string = "10"
  ) {
    const filter = {
      $or: [
        { title: { $regex: searchQuery, $options: "i" } },
        { description: { $regex: searchQuery, $options: "i" } },
        { caseNumber: { $regex: searchQuery, $options: "i" } },
      ],
      isPublic: true,
    };

    const skip = (Number(page) - 1) * Number(limit);

    const cases = await caseModel
      .find(filter)
      .populate("caseTypeId", "name code category")
      .populate("courtId", "name code type city state")
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(Number(limit));

    const total = await caseModel.countDocuments(filter);

    return {
      cases,
      pagination: {
        page: Number(page),
        limit: Number(limit),
        total,
        totalPages: Math.ceil(total / Number(limit)),
      },
    };
  }

  // Get case statistics
  async getCaseStatistics() {
    const totalCases = await caseModel.countDocuments();
    const publicCases = await caseModel.countDocuments({ isPublic: true });
    const sensitiveCases = await caseModel.countDocuments({
      isSensitive: true,
    });

    const casesByStatus = await caseModel.aggregate([
      {
        $group: {
          _id: "$status",
          count: { $sum: 1 },
        },
      },
      {
        $sort: { count: -1 },
      },
    ]);

    const casesByPriority = await caseModel.aggregate([
      {
        $group: {
          _id: "$priority",
          count: { $sum: 1 },
        },
      },
      {
        $sort: { count: -1 },
      },
    ]);

    const casesByStage = await caseModel.aggregate([
      {
        $group: {
          _id: "$stage",
          count: { $sum: 1 },
        },
      },
      {
        $sort: { count: -1 },
      },
    ]);

    return {
      totalCases,
      publicCases,
      sensitiveCases,
      casesByStatus,
      casesByPriority,
      casesByStage,
    };
  }
}

export default new CaseService();
