import hearingModel from "@models/hearing.model.js";
import caseModel from "@models/case.model.js";
import userModel from "@models/user.model.js";
import { ApiError } from "@utils/apiError.util.js";

interface CreateHearingData {
  caseId: string;
  hearingNumber: string;
  hearingDate: Date;
  hearingTime: string;
  judgeId: string;
  courtRoom?: string;
  purpose: "preliminary" | "evidence" | "argument" | "judgment" | "mention";
}

interface UpdateHearingData {
  hearingNumber?: string;
  hearingDate?: Date;
  hearingTime?: string;
  judgeId?: string;
  courtRoom?: string;
  purpose?: "preliminary" | "evidence" | "argument" | "judgment" | "mention";
  status?: "scheduled" | "ongoing" | "completed" | "adjourned" | "cancelled";
  notes?: string;
  nextHearingDate?: Date;
  adjournmentReason?: string;
}

interface UpdateHearingStatusData {
  status: "scheduled" | "ongoing" | "completed" | "adjourned" | "cancelled";
  notes?: string;
  nextHearingDate?: Date;
  adjournmentReason?: string;
}

interface GetUpcomingHearingsQuery {
  judgeId?: string;
  courtId?: string;
  limit?: string;
}

class HearingService {
  // Create hearing
  async createHearing(data: CreateHearingData) {
    const { caseId, hearingNumber, hearingDate, hearingTime, judgeId, courtRoom, purpose } = data;

    // Verify case exists
    const caseData = await caseModel.findById(caseId);
    if (!caseData) {
      throw new ApiError(404, "Case not found");
    }

    // Verify judge exists and has judge role
    const judge = await userModel.findById(judgeId);
    if (!judge) {
      throw new ApiError(404, "Judge not found");
    }
    if (judge.role !== "judge") {
      throw new ApiError(400, "User must have judge role");
    }

    // Create hearing
    const hearing = await hearingModel.create({
      caseId,
      hearingNumber,
      hearingDate,
      hearingTime,
      judgeId,
      courtRoom,
      purpose,
    });

    // Update case hearing count and next hearing date
    await caseModel.findByIdAndUpdate(caseId, {
      $inc: { hearingCount: 1 },
      nextHearingDate: hearingDate,
    });

    // Populate references
    const populatedHearing = await hearingModel
      .findById(hearing._id)
      .populate("caseId", "caseNumber title status")
      .populate("judgeId", "fullName username email");

    return populatedHearing;
  }

  // Get all hearings for a case
  async getCaseHearings(caseId: string) {
    // Verify case exists
    const caseData = await caseModel.findById(caseId);
    if (!caseData) {
      throw new ApiError(404, "Case not found");
    }

    const hearings = await hearingModel
      .find({ caseId })
      .populate("judgeId", "fullName username email")
      .sort({ hearingDate: -1 });

    return hearings;
  }

  // Get hearing by ID
  async getHearingById(hearingId: string) {
    const hearing = await hearingModel
      .findById(hearingId)
      .populate("caseId", "caseNumber title status courtId")
      .populate("judgeId", "fullName username email");

    if (!hearing) {
      throw new ApiError(404, "Hearing not found");
    }

    return hearing;
  }

  // Get upcoming hearings
  async getUpcomingHearings(query: GetUpcomingHearingsQuery) {
    const { judgeId, courtId, limit = "10" } = query;

    const filter: any = {
      hearingDate: { $gte: new Date() },
      status: "scheduled",
    };

    if (judgeId) filter.judgeId = judgeId;

    let hearings = await hearingModel
      .find(filter)
      .populate("caseId", "caseNumber title courtId")
      .populate("judgeId", "fullName username")
      .sort({ hearingDate: 1 })
      .limit(Number(limit));

    // Filter by court if courtId provided
    if (courtId) {
      hearings = hearings.filter((hearing: any) => hearing.caseId?.courtId?.toString() === courtId);
    }

    return hearings;
  }

  // Get hearings by judge
  async getHearingsByJudge(judgeId: string) {
    const hearings = await hearingModel
      .find({ judgeId })
      .populate("caseId", "caseNumber title status")
      .sort({ hearingDate: -1 });

    return hearings;
  }

  // Get today's hearings
  async getTodaysHearings(judgeId?: string) {
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    const tomorrow = new Date(today);
    tomorrow.setDate(tomorrow.getDate() + 1);

    const filter: any = {
      hearingDate: { $gte: today, $lt: tomorrow },
      status: { $in: ["scheduled", "ongoing"] },
    };

    if (judgeId) filter.judgeId = judgeId;

    const hearings = await hearingModel
      .find(filter)
      .populate("caseId", "caseNumber title")
      .populate("judgeId", "fullName username")
      .sort({ hearingTime: 1 });

    return hearings;
  }

  // Update hearing
  async updateHearing(hearingId: string, data: UpdateHearingData) {
    const hearing = await hearingModel
      .findByIdAndUpdate(hearingId, { $set: data }, { new: true, runValidators: true })
      .populate("caseId", "caseNumber title status")
      .populate("judgeId", "fullName username email");

    if (!hearing) {
      throw new ApiError(404, "Hearing not found");
    }

    return hearing;
  }

  // Update hearing status
  async updateHearingStatus(hearingId: string, data: UpdateHearingStatusData) {
    const { status, notes, nextHearingDate, adjournmentReason } = data;

    const hearing = await hearingModel
      .findByIdAndUpdate(
        hearingId,
        { $set: { status, notes, nextHearingDate, adjournmentReason } },
        { new: true, runValidators: true }
      )
      .populate("caseId", "caseNumber title status")
      .populate("judgeId", "fullName username email");

    if (!hearing) {
      throw new ApiError(404, "Hearing not found");
    }

    // Update case next hearing date if provided
    if (nextHearingDate && hearing.caseId) {
      await caseModel.findByIdAndUpdate((hearing.caseId as any)._id, { nextHearingDate });
    }

    return hearing;
  }

  // Delete hearing
  async deleteHearing(hearingId: string) {
    const hearing = await hearingModel.findByIdAndDelete(hearingId);

    if (!hearing) {
      throw new ApiError(404, "Hearing not found");
    }

    // Decrement case hearing count
    await caseModel.findByIdAndUpdate(hearing.caseId, { $inc: { hearingCount: -1 } });

    return null;
  }

  // Get hearing statistics
  async getHearingStatistics() {
    const totalHearings = await hearingModel.countDocuments();

    const hearingsByStatus = await hearingModel.aggregate([
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

    const hearingsByPurpose = await hearingModel.aggregate([
      {
        $group: {
          _id: "$purpose",
          count: { $sum: 1 },
        },
      },
      {
        $sort: { count: -1 },
      },
    ]);

    const upcomingHearings = await hearingModel.countDocuments({
      hearingDate: { $gte: new Date() },
      status: "scheduled",
    });

    return {
      totalHearings,
      upcomingHearings,
      hearingsByStatus,
      hearingsByPurpose,
    };
  }
}

export default new HearingService();