import mongoose, { Document, Schema } from "mongoose";
import slug from "mongoose-slug-updater";

mongoose.plugin(slug as any);

export interface ICourt extends Document {
  name: string;
  slug: string;
  code: string;
  type: "Supreme" | "High" | "District" | "Magistrate";
  state: string;
  city: string;
  address: string;
  contactEmail: string | null;
  contactPhone: string | null;
  isActive: boolean;
}

const CourtSchema = new Schema<ICourt>(
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
    type: {
      type: String,
      required: true,
      enum: ["Supreme", "High", "District", "Magistrate"],
    },
    state: {
      type: String,
      required: true,
      trim: true,
    },
    city: {
      type: String,
      required: true,
      trim: true,
    },
    address: {
      type: String,
      required: true,
      trim: true,
    },
    contactEmail: {
      type: String,
      lowercase: true,
      trim: true,
      default: null,
    },
    contactPhone: {
      type: String,
      trim: true,
      default: null,
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

const Court = mongoose.model<ICourt>("Court", CourtSchema);
export default Court;
