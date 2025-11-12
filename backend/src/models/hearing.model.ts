import mongoose, { Document, Schema } from "mongoose";

export interface IHearing extends Document {
  caseId: mongoose.Types.ObjectId;
  hearingNumber: string;
  hearingDate: Date;
  hearingTime: string;
  judgeId: mongoose.Types.ObjectId;
  courtRoom: string | null;
  purpose: "preliminary" | "evidence" | "argument" | "judgment" | "mention";
  status: "scheduled" | "ongoing" | "completed" | "adjourned" | "cancelled";
  notes: string | null;
  nextHearingDate: Date | null;
  adjournmentReason: string | null;
}

const HearingSchema = new Schema<IHearing>(
  {
    caseId: {
      type: Schema.Types.ObjectId,
      ref: "Case",
      required: true,
      index: true,
    },
    hearingNumber: {
      type: String,
      required: true,
      trim: true,
    },
    hearingDate: {
      type: Date,
      required: true,
      index: true,
    },
    hearingTime: {
      type: String,
      required: true,
    },
    judgeId: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
      index: true,
    },
    courtRoom: {
      type: String,
      trim: true,
      default: null,
    },
    purpose: {
      type: String,
      required: true,
      enum: ["preliminary", "evidence", "argument", "judgment", "mention"],
    },
    status: {
      type: String,
      enum: ["scheduled", "ongoing", "completed", "adjourned", "cancelled"],
      default: "scheduled",
      index: true,
    },
    notes: {
      type: String,
      trim: true,
      default: null,
    },
    nextHearingDate: {
      type: Date,
      default: null,
    },
    adjournmentReason: {
      type: String,
      trim: true,
      default: null,
    },
  },
  {
    timestamps: true,
  }
);

const Hearing = mongoose.model<IHearing>("Hearing", HearingSchema);
export default Hearing;
