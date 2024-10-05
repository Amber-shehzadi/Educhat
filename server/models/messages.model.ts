import mongoose, { Model, Schema, Document, Types } from "mongoose";

export interface Imessages extends Document {
  sender: Types.ObjectId;
  recipient: Types.ObjectId;
  messagetype: "file" | "text";
  content: string;
  fileUrl: string;
}

const messageSchema: Schema<Imessages> = new Schema(
  {
    sender: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    recipient: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: false,
    },
    messagetype: {
      type: String,
      required: true,
      default: "text",
    },
    content: {
      type: String,
      required: function () {
        return this.messagetype === "text";
      },
    },
    fileUrl: {
      type: String,
      required: function () {
        return this.messagetype === "file";
      },
    },
  },

  { timestamps: true }
);

const Message: Model<Imessages> = mongoose.model("Message", messageSchema);
export default Message;
