import mongoose, { Document, Schema } from "mongoose";
import slug from "mongoose-slug-updater";

mongoose.plugin(slug as any);

export interface IUser extends Document {
  username: string;
  email: string;
  password: string;
  fullName: string;
  phone: string | null;
  avatar: string | null;
  role: "admin" | "judge" | "lawyer" | "litigant" | "clerk" | "public";
  barCouncilId: string | null;
  isVerified: boolean;
  refreshToken: string | null;
}

const UserSchema = new Schema<IUser>(
  {
    username: {
      type: String,
      required: true,
      unique: true,
      trim: true,
      lowercase: true,
      minLength: 3,
      maxLength: 30,
      index: true,
    },
    email: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      trim: true,
      index: true,
    },
    password: {
      type: String,
      required: true,
      minlength: 6,
    },
    fullName: {
      type: String,
      required: true,
      trim: true,
    },
    phone: {
      type: String,
      trim: true,
      default: null,
    },
    avatar: {
      type: String,
      default: null,
    },
    role: {
      type: String,
      enum: ["admin", "judge", "lawyer", "litigant", "clerk", "public"],
      default: "public",
    },
    barCouncilId: {
      type: String,
      sparse: true,
      unique: true,
      default: null,
    },
    isVerified: {
      type: Boolean,
      default: false,
    },
    refreshToken: {
      type: String,
      default: null,
    },
  },
  {
    timestamps: true,
  }
);

const User = mongoose.model<IUser>("User", UserSchema);
export default User;
