import mongoose, { Schema, Document, Model } from "mongoose";

export interface IAnnouncement extends Document {
  title: string;
  description: string;
  createdBy: mongoose.Types.ObjectId; // Reference to the admin who created the announcement
  isActive: boolean; // For soft delete functionality
}

const announcementSchema: Schema<IAnnouncement> = new mongoose.Schema(
  {
    title: {
      type: String,
      required: [true, "Please enter the announcement title"],
    },
    description: {
      type: String,
      required: [true, "Please enter the announcement description"],
    },
    createdBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: [true, "Announcement must have a creator"],
    },
    isActive: {
      type: Boolean,
      default: true,
    },
  },
  { timestamps: true }
);

const AnnouncementModel: Model<IAnnouncement> = mongoose.model(
  "Announcement",
  announcementSchema
);

export default AnnouncementModel;
