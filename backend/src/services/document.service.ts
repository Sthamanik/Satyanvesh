import documentModel from "@models/document.model.js";
import caseModel from "@models/case.model.js";
import hearingModel from "@models/hearing.model.js";
import userModel from "@models/user.model.js";
import casePartyModel from "@models/caseParty.model.js";
import { ApiError } from "@utils/apiError.util.js";
import {
  uploadOnCloudinary,
  deleteFromCloudinary,
} from "@utils/cloudinary.util.js";
import EmailService from "@services/email.service.js";

interface UploadDocumentData {
  caseId: string;
  hearingId?: string;
  uploadedBy: string;
  title: string;
  type:
    | "petition"
    | "affidavit"
    | "order"
    | "judgment"
    | "evidence"
    | "notice"
    | "pleading"
    | "misc";
  description?: string;
  documentDate?: Date;
  isConfidential?: boolean;
  isPublic?: boolean;
  filePath: string;
}

interface UpdateDocumentData {
  title?: string;
  type?:
    | "petition"
    | "affidavit"
    | "order"
    | "judgment"
    | "evidence"
    | "notice"
    | "pleading"
    | "misc";
  description?: string;
  documentDate?: Date;
  isConfidential?: boolean;
  isPublic?: boolean;
}

interface GetCaseDocumentsQuery {
  type?: string;
  isPublic?: string;
}

class DocumentService {
  // Upload document
  async uploadDocument(data: UploadDocumentData) {
    const {
      caseId,
      hearingId,
      uploadedBy,
      title,
      type,
      description,
      documentDate,
      isConfidential,
      isPublic,
      filePath,
    } = data;

    // Verify case exists
    const caseData = await caseModel
      .findById(caseId)
      .populate("filedBy", "email fullName");
    if (!caseData) {
      throw new ApiError(404, "Case not found");
    }

    // Get uploader info
    const uploader = await userModel.findById(uploadedBy).select("fullName");

    // If hearingId provided, verify hearing exists
    if (hearingId) {
      const hearing = await hearingModel.findById(hearingId);
      if (!hearing) {
        throw new ApiError(404, "Hearing not found");
      }
    }

    // Upload to Cloudinary
    const uploadResult = await uploadOnCloudinary(filePath);
    if (!uploadResult) {
      throw new ApiError(500, "Failed to upload document to cloud storage");
    }

    // Create document record
    const document = await documentModel.create({
      caseId,
      hearingId,
      uploadedBy,
      title,
      type,
      url: uploadResult.secure_url,
      publicId: uploadResult.public_id,
      format: uploadResult.format,
      size: uploadResult.bytes,
      description,
      documentDate,
      isConfidential: isConfidential !== undefined ? isConfidential : false,
      isPublic: isPublic !== undefined ? isPublic : true,
    });

    // Send email notifications (only if document is not confidential)
    if (!isConfidential) {
      // Send to the person who filed the case
      if (caseData.filedBy && (caseData.filedBy as any).email) {
        EmailService.sendDocumentUploadedNotification(
          (caseData.filedBy as any).email,
          (caseData.filedBy as any).fullName,
          caseData.caseNumber,
          caseData.title,
          title,
          type,
          uploader?.fullName || "Unknown"
        ).catch((err) =>
          console.error("Failed to send document notification:", err)
        );
      }

      // Get all parties involved in the case
      const parties = await casePartyModel
        .find({ caseId })
        .populate("userId", "email fullName");

      for (const party of parties) {
        // Send email to registered users
        if (party.userId && (party.userId as any).email) {
          EmailService.sendDocumentUploadedNotification(
            (party.userId as any).email,
            (party.userId as any).fullName,
            caseData.caseNumber,
            caseData.title,
            title,
            type,
            uploader?.fullName || "Unknown"
          ).catch((err) =>
            console.error("Failed to send document notification to party:", err)
          );
        }
        // Send email to external parties with email
        else if (party.email) {
          EmailService.sendDocumentUploadedNotification(
            party.email,
            party.name,
            caseData.caseNumber,
            caseData.title,
            title,
            type,
            uploader?.fullName || "Unknown"
          ).catch((err) =>
            console.error(
              "Failed to send document notification to external party:",
              err
            )
          );
        }
      }
    }

    // Populate references
    const populatedDocument = await documentModel
      .findById(document._id)
      .populate("caseId", "caseNumber title")
      .populate("uploadedBy", "fullName username");

    return populatedDocument;
  }

  // Get all documents for a case
  async getCaseDocuments(caseId: string, query: GetCaseDocumentsQuery) {
    const { type, isPublic } = query;

    // Verify case exists
    const caseData = await caseModel.findById(caseId);
    if (!caseData) {
      throw new ApiError(404, "Case not found");
    }

    const filter: any = { caseId };
    if (type) filter.type = type;
    if (isPublic !== undefined) filter.isPublic = isPublic === "true";

    const documents = await documentModel
      .find(filter)
      .populate("uploadedBy", "fullName username")
      .populate("hearingId", "hearingNumber hearingDate")
      .sort({ createdAt: -1 });

    return documents;
  }

  // Get document by ID
  async getDocumentById(documentId: string) {
    const document = await documentModel
      .findById(documentId)
      .populate("caseId", "caseNumber title")
      .populate("uploadedBy", "fullName username")
      .populate("hearingId", "hearingNumber hearingDate");

    if (!document) {
      throw new ApiError(404, "Document not found");
    }

    return document;
  }

  // Get documents by hearing
  async getHearingDocuments(hearingId: string) {
    const documents = await documentModel
      .find({ hearingId })
      .populate("uploadedBy", "fullName username")
      .sort({ createdAt: -1 });

    return documents;
  }

  // Get documents by type
  async getDocumentsByType(caseId: string, type: string) {
    const documents = await documentModel
      .find({ caseId, type })
      .populate("uploadedBy", "fullName username")
      .sort({ createdAt: -1 });

    return documents;
  }

  // Get public documents
  async getPublicDocuments(caseId: string) {
    const documents = await documentModel
      .find({ caseId, isPublic: true, isConfidential: false })
      .populate("uploadedBy", "fullName username")
      .sort({ createdAt: -1 });

    return documents;
  }

  // Update document
  async updateDocument(documentId: string, data: UpdateDocumentData) {
    const document = await documentModel
      .findByIdAndUpdate(
        documentId,
        { $set: data },
        { new: true, runValidators: true }
      )
      .populate("caseId", "caseNumber title")
      .populate("uploadedBy", "fullName username");

    if (!document) {
      throw new ApiError(404, "Document not found");
    }

    return document;
  }

  // Delete document
  async deleteDocument(documentId: string) {
    const document = await documentModel.findByIdAndDelete(documentId);

    if (!document) {
      throw new ApiError(404, "Document not found");
    }

    // Delete from Cloudinary
    await deleteFromCloudinary(document.publicId);

    return null;
  }

  // Get document statistics
  async getDocumentStatistics() {
    const totalDocuments = await documentModel.countDocuments();
    const publicDocuments = await documentModel.countDocuments({
      isPublic: true,
    });
    const confidentialDocuments = await documentModel.countDocuments({
      isConfidential: true,
    });

    const documentsByType = await documentModel.aggregate([
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

    const totalSize = await documentModel.aggregate([
      {
        $group: {
          _id: null,
          totalBytes: { $sum: "$size" },
        },
      },
    ]);

    return {
      totalDocuments,
      publicDocuments,
      confidentialDocuments,
      documentsByType,
      totalStorageUsed: totalSize[0]?.totalBytes || 0,
    };
  }
}

export default new DocumentService();
