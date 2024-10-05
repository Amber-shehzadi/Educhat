import mongoose, { Model, Document, Schema, Types } from "mongoose";

export interface IMedia extends Document {
  messageId: Types.ObjectId;
  mediaType: "text" | "image" | "video" | "voice" | "document";
  url: string;
  fileName: string;
  fileSize: number;
  mimeType: string;
  uploadedAt: Date;
}

const mediaSchema: Schema<IMedia> = new Schema(
  {
    messageId: { type: Schema.Types.ObjectId, ref: "Message", required: true },
    mediaType: { type: String, required: true },
    url: { type: String, required: true },
    fileName: { type: String, required: true },
    fileSize: { type: Number, required: true },
    mimeType: { type: String, required: true },
  },
  { timestamps: true }
);

const MediaModel: Model<IMedia> = mongoose.model("Media", mediaSchema);
export default MediaModel;
