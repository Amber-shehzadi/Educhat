import mongoose, { Model, Document, Schema } from "mongoose";

export interface IConversation extends Document {
  participants: Array<string>;
  isGroup: boolean;
  groupName: string;
  groupImage: string;
  admin: Array<string>;
  conversationType: string;
  isDeleted: boolean;
}

const conversationSchema: Schema<IConversation> = new mongoose.Schema(
  {
    participants: [String],
    isGroup: { type: Boolean, default: false },
    groupName: { type: String, default: "single_chat" },
    groupImage: { type: String },
    admin: [String],
    conversationType: { type: String, default: "unarchived" },
    isDeleted: { type: Boolean, default: false },
  },
  { timestamps: true }
);

const ConversationModel: Model<IConversation> = mongoose.model(
  "Conversation",
  conversationSchema
);
export default ConversationModel;
