import mongoose, { Document, Schema } from "mongoose";

export interface ICaseView extends Document {
  userId: mongoose.Types.ObjectId | null;
  caseId: mongoose.Types.ObjectId;
  ipAddress: string | null;
  userAgent: string | null;
  viewedAt: Date;
}

const CaseViewSchema = new Schema<ICaseView>(
  {
    userId: {
      type: Schema.Types.ObjectId,
      ref: "User",
      default: null,
    },
    caseId: {
      type: Schema.Types.ObjectId,
      ref: "Case",
      required: true,
      index: true,
    },
    ipAddress: {
      type: String,
      trim: true,
      default: null,
    },
    userAgent: {
      type: String,
      trim: true,
      default: null,
    },
    viewedAt: {
      type: Date,
      default: Date.now,
      index: true,
    },
  },
  {
    timestamps: false,
  }
);

const CaseView = mongoose.model<ICaseView>("CaseView", CaseViewSchema);
export default CaseView;
