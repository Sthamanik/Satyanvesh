import mongoose, { Document, Schema } from "mongoose";

export interface IAdvocate extends Document {
  userId: mongoose.Types.ObjectId;
  barCouncilId: string;
  licenseNumber: string;
  specialization: string[];
  experience: number;
  firmName: string | null;
  firmAddress: string | null;
  isActive: boolean;
  enrollmentDate: Date;
}

const AdvocateSchema = new Schema<IAdvocate>(
  {
    userId: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
      unique: true,
    },
    barCouncilId: {
      type: String,
      required: true,
      unique: true,
      uppercase: true,
      trim: true,
    },
    licenseNumber: {
      type: String,
      required: true,
      unique: true,
      uppercase: true,
      trim: true,
    },
    specialization: {
      type: [String],
      default: [],
    },
    experience: {
      type: Number,
      required: true,
      min: 0,
    },
    firmName: {
      type: String,
      trim: true,
      default: null,
    },
    firmAddress: {
      type: String,
      trim: true,
      default: null,
    },
    isActive: {
      type: Boolean,
      default: true,
    },
    enrollmentDate: {
      type: Date,
      required: true,
    },
  },
  {
    timestamps: true,
  }
);

const Advocate = mongoose.model<IAdvocate>("Advocate", AdvocateSchema);
export default Advocate;
