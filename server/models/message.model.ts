// import mongoose, { Model, Schema, Document, Types } from "mongoose";

// export interface Imessages extends Document {
//   conversationId: Types.ObjectId;
//   sender: string | object;
//   content: string;
//   replyTo: Types.ObjectId | "";
//   messageType: "text" | "image" | "video" | "document" | "voice" | "poll";
// }

// const messageSchema: Schema<Imessages> = new Schema(
//   {
//     conversationId: { type: Schema.Types.ObjectId, ref: "Conversation" },
//     sender: { type: String || Object, required: true },
//     content: { type: String },
//     replyTo: { type: Schema.Types.ObjectId, ref: "Message" },
//     messageType: { type: String, required: true, default: "text" },
//   },
//   { timestamps: true }
// );

// const MessageModel: Model<Imessages> = mongoose.model("Message", messageSchema);
// export default MessageModel;
