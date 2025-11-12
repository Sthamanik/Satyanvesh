import mongoose, { Document, Schema } from "mongoose";

export interface ICaseParty extends Document {
  caseId: mongoose.Types.ObjectId;
  userId: mongoose.Types.ObjectId | null;
  partyType:
    | "petitioner"
    | "respondent"
    | "appellant"
    | "defendant"
    | "plaintiff"
    | "witness";
  name: string;
  email: string | null;
  phone: string | null;
  address: string | null;
  advocateId: mongoose.Types.ObjectId | null;
}

const CasePartySchema = new Schema<ICaseParty>(
  {
    caseId: {
      type: Schema.Types.ObjectId,
      ref: "Case",
      required: true,
      index: true,
    },
    userId: {
      type: Schema.Types.ObjectId,
      ref: "User",
      default: null,
    },
    partyType: {
      type: String,
      required: true,
      enum: [
        "petitioner",
        "respondent",
        "appellant",
        "defendant",
        "plaintiff",
        "witness",
      ],
    },
    name: {
      type: String,
      required: true,
      trim: true,
    },
    email: {
      type: String,
      lowercase: true,
      trim: true,
      default: null,
    },
    phone: {
      type: String,
      trim: true,
      default: null,
    },
    address: {
      type: String,
      trim: true,
      default: null,
    },
    advocateId: {
      type: Schema.Types.ObjectId,
      ref: "Advocate",
      default: null,
    },
  },
  {
    timestamps: true,
  }
);

const CaseParty = mongoose.model<ICaseParty>("CaseParty", CasePartySchema);
export default CaseParty;
