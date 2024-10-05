import mongoose, { Model, Document, Schema } from "mongoose";

// Define the interface for the Conversation document
export interface IChannel extends Document {
  name: string;
  members: mongoose.Types.ObjectId[];
  admin: mongoose.Types.ObjectId;
  messages: mongoose.Types.ObjectId[];
  image?: string;
}

// Define the schema for the Conversation model
const channelSchema: Schema<IChannel> = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
    },
    members: [
      { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
    ],
    admin: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    messages: [
      { type: mongoose.Schema.Types.ObjectId, ref: "Message", required: true },
    ],
    image: { type: String }, // Optional field
  },
  { timestamps: true }
);

// Create the model based on the schema
const ChannelModel: Model<IChannel> = mongoose.model<IChannel>(
  "Channel",
  channelSchema
);

export default ChannelModel;
