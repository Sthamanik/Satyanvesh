import mongoose, { Document, Schema } from "mongoose";
import slug from "mongoose-slug-updater";

mongoose.plugin(slug as any);

export interface ICaseType extends Document {
  name: string;
  slug: string;
  code: string;
  description: string | null;
  category: "Civil" | "Criminal" | "Family" | "Constitutional";
  isActive: boolean;
}

const CaseTypeSchema = new Schema<ICaseType>(
  {
    name: {
      type: String,
      required: true,
      unique: true,
      trim: true,
    },
    slug: {
      type: String,
      slug: "name",
      unique: true,
      slugPaddingSize: 2,
      index: true,
    },
    code: {
      type: String,
      required: true,
      unique: true,
      uppercase: true,
      trim: true,
    },
    description: {
      type: String,
      trim: true,
      default: null,
    },
    category: {
      type: String,
      required: true,
      enum: ["Civil", "Criminal", "Family", "Constitutional"],
    },
    isActive: {
      type: Boolean,
      default: true,
    },
  },
  {
    timestamps: true,
  }
);

const CaseType = mongoose.model<ICaseType>("CaseType", CaseTypeSchema);
export default CaseType;
