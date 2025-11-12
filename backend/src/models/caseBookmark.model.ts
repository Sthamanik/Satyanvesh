import mongoose, { Document, Schema } from "mongoose";

export interface ICaseBookmark extends Document {
  userId: mongoose.Types.ObjectId;
  caseId: mongoose.Types.ObjectId;
  notes: string | null;
}

const CaseBookmarkSchema = new Schema<ICaseBookmark>(
  {
    userId: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
      index: true,
    },
    caseId: {
      type: Schema.Types.ObjectId,
      ref: "Case",
      required: true,
      index: true,
    },
    notes: {
      type: String,
      trim: true,
      default: null,
    },
  },
  {
    timestamps: true,
  }
);

CaseBookmarkSchema.index({ userId: 1, caseId: 1 }, { unique: true });

const CaseBookmark = mongoose.model<ICaseBookmark>(
  "CaseBookmark",
  CaseBookmarkSchema
);
export default CaseBookmark;
