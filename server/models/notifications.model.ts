// models/notification.model.ts
import mongoose, { Document, Schema } from "mongoose";

interface INotification extends Document {
  userId: mongoose.Schema.Types.ObjectId;
  message: string;
  sender: mongoose.Schema.Types.ObjectId;
  createdAt: Date;
  isRead: boolean; // Track read/unread status
}

const NotificationSchema: Schema = new Schema(
  {
    userId: { type: Schema.Types.ObjectId, ref: "User", required: true },
    message: { type: String, required: true },
    sender: { type: Schema.Types.ObjectId, ref: "User", required: true },
    createdAt: { type: Date, default: Date.now },
    isRead: { type: Boolean, default: false }, // Default to unread
  },
  { timestamps: true }
);

export default mongoose.model<INotification>(
  "Notification",
  NotificationSchema
);
