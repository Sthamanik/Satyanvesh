import casePartyModel from "@models/caseParty.model.js";
import caseModel from "@models/case.model.js";
import userModel from "@models/user.model.js";
import advocateModel from "@models/advocate.model.js";
import { ApiError } from "@utils/apiError.util.js";

interface AddCasePartyData {
  caseId: string;
  userId?: string;
  partyType:
    | "petitioner"
    | "respondent"
    | "appellant"
    | "defendant"
    | "plaintiff"
    | "witness";
  name: string;
  email?: string;
  phone?: string;
  address?: string;
  advocateId?: string;
}

interface UpdateCasePartyData {
  userId?: string;
  partyType?:
    | "petitioner"
    | "respondent"
    | "appellant"
    | "defendant"
    | "plaintiff"
    | "witness";
  name?: string;
  email?: string;
  phone?: string;
  address?: string;
  advocateId?: string;
}

class CasePartyService {
  // Add party to case
  async addCaseParty(data: AddCasePartyData) {
    const {
      caseId,
      userId,
      partyType,
      name,
      email,
      phone,
      address,
      advocateId,
    } = data;

    // Verify case exists
    const caseData = await caseModel.findById(caseId);
    if (!caseData) {
      throw new ApiError(404, "Case not found");
    }

    // If userId provided, verify user exists
    if (userId) {
      const user = await userModel.findById(userId);
      if (!user) {
        throw new ApiError(404, "User not found");
      }
    }

    // If advocateId provided, verify advocate exists
    if (advocateId) {
      const advocate = await advocateModel.findById(advocateId);
      if (!advocate) {
        throw new ApiError(404, "Advocate not found");
      }
    }

    // Create case party
    const caseParty = await casePartyModel.create({
      caseId,
      userId,
      partyType,
      name,
      email,
      phone,
      address,
      advocateId,
    });

    // Populate references
    const populatedCaseParty = await casePartyModel
      .findById(caseParty._id)
      .populate("userId", "fullName username email phone")
      .populate("advocateId");

    return populatedCaseParty;
  }

  // Get all parties for a case
  async getCaseParties(caseId: string) {
    // Verify case exists
    const caseData = await caseModel.findById(caseId);
    if (!caseData) {
      throw new ApiError(404, "Case not found");
    }

    const parties = await casePartyModel
      .find({ caseId })
      .populate("userId", "fullName username email phone")
      .populate({
        path: "advocateId",
        populate: {
          path: "userId",
          select: "fullName username email phone",
        },
      })
      .sort({ createdAt: -1 });

    return parties;
  }

  // Get party by ID
  async getCasePartyById(partyId: string) {
    const party = await casePartyModel
      .findById(partyId)
      .populate("caseId", "caseNumber title")
      .populate("userId", "fullName username email phone")
      .populate({
        path: "advocateId",
        populate: {
          path: "userId",
          select: "fullName username email phone",
        },
      });

    if (!party) {
      throw new ApiError(404, "Case party not found");
    }

    return party;
  }

  // Get parties by type
  async getPartiesByType(caseId: string, partyType: string) {
    // Verify case exists
    const caseData = await caseModel.findById(caseId);
    if (!caseData) {
      throw new ApiError(404, "Case not found");
    }

    const parties = await casePartyModel
      .find({ caseId, partyType })
      .populate("userId", "fullName username email phone")
      .populate({
        path: "advocateId",
        populate: {
          path: "userId",
          select: "fullName username email phone",
        },
      })
      .sort({ createdAt: -1 });

    return parties;
  }

  // Get all parties represented by an advocate
  async getPartiesByAdvocate(advocateId: string) {
    // Verify advocate exists
    const advocate = await advocateModel.findById(advocateId);
    if (!advocate) {
      throw new ApiError(404, "Advocate not found");
    }

    const parties = await casePartyModel
      .find({ advocateId })
      .populate("caseId", "caseNumber title status")
      .populate("userId", "fullName username email phone")
      .sort({ createdAt: -1 });

    return parties;
  }

  // Update case party
  async updateCaseParty(partyId: string, data: UpdateCasePartyData) {
    // If userId provided, verify user exists
    if (data.userId) {
      const user = await userModel.findById(data.userId);
      if (!user) {
        throw new ApiError(404, "User not found");
      }
    }

    // If advocateId provided, verify advocate exists
    if (data.advocateId) {
      const advocate = await advocateModel.findById(data.advocateId);
      if (!advocate) {
        throw new ApiError(404, "Advocate not found");
      }
    }

    const party = await casePartyModel
      .findByIdAndUpdate(
        partyId,
        { $set: data },
        { new: true, runValidators: true }
      )
      .populate("userId", "fullName username email phone")
      .populate({
        path: "advocateId",
        populate: {
          path: "userId",
          select: "fullName username email phone",
        },
      });

    if (!party) {
      throw new ApiError(404, "Case party not found");
    }

    return party;
  }

  // Delete case party
  async deleteCaseParty(partyId: string) {
    const party = await casePartyModel.findByIdAndDelete(partyId);

    if (!party) {
      throw new ApiError(404, "Case party not found");
    }

    return null;
  }

  // Get case party statistics
  async getCasePartyStatistics() {
    const totalParties = await casePartyModel.countDocuments();

    const partiesByType = await casePartyModel.aggregate([
      {
        $group: {
          _id: "$partyType",
          count: { $sum: 1 },
        },
      },
      {
        $sort: { count: -1 },
      },
    ]);

    const partiesWithAdvocates = await casePartyModel.countDocuments({
      advocateId: { $ne: null },
    });
    const partiesWithoutAdvocates = await casePartyModel.countDocuments({
      advocateId: null,
    });

    const registeredParties = await casePartyModel.countDocuments({
      userId: { $ne: null },
    });
    const externalParties = await casePartyModel.countDocuments({
      userId: null,
    });

    return {
      totalParties,
      partiesByType,
      partiesWithAdvocates,
      partiesWithoutAdvocates,
      registeredParties,
      externalParties,
    };
  }
}

export default new CasePartyService();
