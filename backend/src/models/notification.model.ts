import mongoose, { Document, Schema } from "mongoose";

export interface INotification extends Document {
  recipientId: mongoose.Types.ObjectId;
  type: "hearing_scheduled" | "case_update" | "document_added" | "system";
  message: string;
  link: string | null;
  isRead: boolean;
}

const NotificationSchema = new Schema<INotification>(
  {
    recipientId: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
      index: true,
    },
    type: {
      type: String,
      required: true,
      enum: ["hearing_scheduled", "case_update", "document_added", "system"],
    },
    message: {
      type: String,
      required: true,
      trim: true,
    },
    link: {
      type: String,
      default: null,
    },
    isRead: {
      type: Boolean,
      default: false,
      index: true,
    },
  },
  {
    timestamps: true,
  }
);

const Notification = mongoose.model<INotification>("Notification", NotificationSchema);
export default Notification;
