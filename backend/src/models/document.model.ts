import mongoose, { Document, Schema } from "mongoose";

export interface IDocument extends Document {
  caseId: mongoose.Types.ObjectId;
  hearingId: mongoose.Types.ObjectId | null;
  uploadedBy: mongoose.Types.ObjectId;
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
  url: string;
  publicId: string;
  format: string;
  size: number;
  description: string | null;
  documentDate: Date | null;
  isConfidential: boolean;
  isPublic: boolean;
}

const DocumentSchema = new Schema<IDocument>(
  {
    caseId: {
      type: Schema.Types.ObjectId,
      ref: "Case",
      required: true,
      index: true,
    },
    hearingId: {
      type: Schema.Types.ObjectId,
      ref: "Hearing",
      default: null,
    },
    uploadedBy: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    title: {
      type: String,
      required: true,
      trim: true,
    },
    type: {
      type: String,
      required: true,
      enum: [
        "petition",
        "affidavit",
        "order",
        "judgment",
        "evidence",
        "notice",
        "pleading",
        "misc",
      ],
      index: true,
    },
    url: {
      type: String,
      required: true,
    },
    publicId: {
      type: String,
      required: true,
    },
    format: {
      type: String,
      required: true,
      lowercase: true,
    },
    size: {
      type: Number,
      required: true,
    },
    description: {
      type: String,
      trim: true,
      default: null,
    },
    documentDate: {
      type: Date,
      default: null,
    },
    isConfidential: {
      type: Boolean,
      default: false,
    },
    isPublic: {
      type: Boolean,
      default: true,
      index: true,
    },
  },
  {
    timestamps: true,
  }
);

const DocumentModel = mongoose.model<IDocument>("Document", DocumentSchema);
export default DocumentModel;
