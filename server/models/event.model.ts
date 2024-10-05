import mongoose, { Document, Model, Schema } from "mongoose";

export interface IEvent extends Document {
  title: string;
  start: Date;
  end?: Date; // Optional for all-day events
  allDay: boolean;
  isActive: boolean;
  isVideoMeeting: boolean;
  description: string;
  assignees: mongoose.Types.ObjectId[]; // Array of user references
}

const eventSchema = new Schema<IEvent>(
  {
    title: {
      type: String,
      required: true,
    },
    description: {
      type: String,
    },
    start: {
      type: Date,
      required: true,
    },
    end: {
      type: Date,
    },
    allDay: {
      type: Boolean,
      required: true,
    },
    isVideoMeeting: {
      type: Boolean,
      required: false,
    },

    isActive: {
      type: Boolean,
      default: true,
    },

    assignees: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User", // Reference to the User model
      },
    ],
  },
  { timestamps: true }
);

const EventModel: Model<IEvent> = mongoose.model("Event", eventSchema);
export default EventModel;
