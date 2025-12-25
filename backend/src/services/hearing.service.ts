import hearingModel from "@models/hearing.model.js";
import caseModel from "@models/case.model.js";
import casePartyModel from "@models/caseParty.model.js";
import userModel from "@models/user.model.js";
import { ApiError } from "@utils/apiError.util.js";
import EmailService from "./email.service.js";

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
  // Helper method to send hearing notifications
  private async sendHearingNotifications(
    caseData: any,
    hearingDate: Date,
    hearingTime: string,
    courtName: string,
    courtRoom?: string
  ) {
    // Send to the person who filed the case
    if (caseData.filedBy && caseData.filedBy.email) {
      EmailService.sendHearingReminder(
        caseData.filedBy.email,
        caseData.filedBy.fullName,
        caseData.caseNumber,
        caseData.title,
        hearingDate,
        hearingTime,
        courtName,
        courtRoom
      ).catch((err) => console.error("Failed to send hearing email:", err));
    }

    // Get all parties involved in the case
    const parties = await casePartyModel
      .find({ caseId: caseData._id })
      .populate("userId", "email fullName");

    for (const party of parties) {
      // Send email to registered users
      if (party.userId && (party.userId as any).email) {
        EmailService.sendHearingReminder(
          (party.userId as any).email,
          (party.userId as any).fullName,
          caseData.caseNumber,
          caseData.title,
          hearingDate,
          hearingTime,
          courtName,
          courtRoom
        ).catch((err) =>
          console.error("Failed to send hearing email to party:", err)
        );
      }
      // Send email to external parties with email
      else if (party.email) {
        EmailService.sendHearingReminder(
          party.email,
          party.name,
          caseData.caseNumber,
          caseData.title,
          hearingDate,
          hearingTime,
          courtName,
          courtRoom
        ).catch((err) =>
          console.error("Failed to send hearing email to external party:", err)
        );
      }
    }
  }

  // Create hearing
  async createHearing(data: CreateHearingData) {
    const {
      caseId,
      hearingNumber,
      hearingDate,
      hearingTime,
      judgeId,
      courtRoom,
      purpose,
    } = data;

    // Verify case exists
    const caseData = await caseModel
      .findById(caseId)
      .populate("courtId", "name")
      .populate("filedBy", "email fullName");
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

    // Send hearing notification emails
    await this.sendHearingNotifications(
      caseData,
      hearingDate,
      hearingTime,
      (caseData.courtId as any).name,
      courtRoom
    );

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

  // Get all hearings with filters and pagination
  async getAllHearings(query: any) {
    const {
      page = "1",
      limit = "10",
      status,
      judgeId,
      caseId,
      startDate,
      endDate,
    } = query;

    const filter: any = {};

    if (status) filter.status = status;
    if (judgeId) filter.judgeId = judgeId;
    if (caseId) filter.caseId = caseId;
    
    if (startDate || endDate) {
      filter.hearingDate = {};
      if (startDate) filter.hearingDate.$gte = new Date(startDate);
      if (endDate) filter.hearingDate.$lte = new Date(endDate);
    }

    const skip = (Number(page) - 1) * Number(limit);

    const hearings = await hearingModel
      .find(filter)
      .populate("caseId", "caseNumber title status courtId")
      .populate("judgeId", "fullName username")
      .sort({ hearingDate: -1 })
      .skip(skip)
      .limit(Number(limit));

    const total = await hearingModel.countDocuments(filter);

    return {
      hearings,
      pagination: {
        page: Number(page),
        limit: Number(limit),
        total,
        totalPages: Math.ceil(total / Number(limit)),
      },
    };
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
      hearings = hearings.filter(
        (hearing: any) => hearing.caseId?.courtId?.toString() === courtId
      );
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
      .findByIdAndUpdate(
        hearingId,
        { $set: data },
        { new: true, runValidators: true }
      )
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

    const hearing = await hearingModel.findById(hearingId).populate({
      path: "caseId",
      populate: [
        { path: "courtId", select: "name" },
        { path: "filedBy", select: "email fullName" },
      ],
    });

    if (!hearing) {
      throw new ApiError(404, "Hearing not found");
    }

    // Update hearing
    hearing.status = status;
    if (notes) hearing.notes = notes;
    if (nextHearingDate) hearing.nextHearingDate = nextHearingDate;
    if (adjournmentReason) hearing.adjournmentReason = adjournmentReason;
    await hearing.save();

    // Update case next hearing date if provided
    if (nextHearingDate && hearing.caseId) {
      await caseModel.findByIdAndUpdate((hearing.caseId as any)._id, {
        nextHearingDate,
      });

      // Send notification about adjourned hearing with new date
      if (status === "adjourned") {
        const caseData = hearing.caseId as any;
        const courtRoom = hearing.courtRoom ?? "Default court room";
        await this.sendHearingNotifications(
          caseData,
          nextHearingDate,
          hearing.hearingTime,
          caseData.courtId?.name || "Court",
          courtRoom
        );
      }
    }

    // Populate for response
    const updatedHearing = await hearingModel
      .findById(hearingId)
      .populate("caseId", "caseNumber title status")
      .populate("judgeId", "fullName username email");

    return updatedHearing;
  }

  // Delete hearing
  async deleteHearing(hearingId: string) {
    const hearing = await hearingModel.findByIdAndDelete(hearingId);

    if (!hearing) {
      throw new ApiError(404, "Hearing not found");
    }

    // Decrement case hearing count
    await caseModel.findByIdAndUpdate(hearing.caseId, {
      $inc: { hearingCount: -1 },
    });

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