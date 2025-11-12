import mongoose, { Document, Schema } from "mongoose";
import slug from "mongoose-slug-updater";

mongoose.plugin(slug as any);

export interface ICase extends Document {
  caseNumber: string;
  slug: string;
  title: string;
  description: string | null;
  caseTypeId: mongoose.Types.ObjectId;
  courtId: mongoose.Types.ObjectId;
  filedBy: mongoose.Types.ObjectId;
  status: "filed" | "admitted" | "hearing" | "judgment" | "closed" | "archived";
  filingDate: Date;
  admissionDate: Date | null;
  judgmentDate: Date | null;
  priority: "normal" | "urgent" | "high";
  stage: "preliminary" | "trial" | "final";
  hearingCount: number;
  nextHearingDate: Date | null;
  isPublic: boolean;
  isSensitive: boolean;
  viewCount: number;
  bookmarkCount: number;
}

const CaseSchema = new Schema<ICase>(
  {
    caseNumber: {
      type: String,
      required: true,
      unique: true,
      uppercase: true,
      trim: true,
      index: true,
    },
    slug: {
      type: String,
      slug: "title",
      unique: true,
      slugPaddingSize: 4,
      index: true,
    },
    title: {
      type: String,
      required: true,
      trim: true,
    },
    description: {
      type: String,
      trim: true,
      default: null,
    },
    caseTypeId: {
      type: Schema.Types.ObjectId,
      ref: "CaseType",
      required: true,
      index: true,
    },
    courtId: {
      type: Schema.Types.ObjectId,
      ref: "Court",
      required: true,
      index: true,
    },
    filedBy: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    status: {
      type: String,
      enum: ["filed", "admitted", "hearing", "judgment", "closed", "archived"],
      default: "filed",
      index: true,
    },
    filingDate: {
      type: Date,
      required: true,
    },
    admissionDate: {
      type: Date,
      default: null,
    },
    judgmentDate: {
      type: Date,
      default: null,
    },
    priority: {
      type: String,
      enum: ["normal", "urgent", "high"],
      default: "normal",
    },
    stage: {
      type: String,
      enum: ["preliminary", "trial", "final"],
      default: "preliminary",
    },
    hearingCount: {
      type: Number,
      default: 0,
    },
    nextHearingDate: {
      type: Date,
      default: null,
      index: true,
    },
    isPublic: {
      type: Boolean,
      default: true,
      index: true,
    },
    isSensitive: {
      type: Boolean,
      default: false,
    },
    viewCount: {
      type: Number,
      default: 0,
    },
    bookmarkCount: {
      type: Number,
      default: 0,
    },
  },
  {
    timestamps: true,
  }
);

const Case = mongoose.model<ICase>("Case", CaseSchema);
export default Case;
