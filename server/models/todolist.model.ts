import mongoose, { Document, Model, Schema } from "mongoose";

export interface IComment extends Document {
  commentText: string;
  user: mongoose.Types.ObjectId;
  createdAt: Date;
}

export interface ITodo extends Document {
  title: string;
  isActive: boolean;
  description?: string;
  isCompleted: boolean;
  startDate: Date;
  endDate: Date;
  comments: IComment[];
  status: "pending" | "in-progress" | "on-hold" | "completed";

  assignedUsers: mongoose.Types.ObjectId[]; // Array of users assigned to the todo
}

const commentSchema = new mongoose.Schema<IComment>({
  commentText: {
    type: String,
    required: true,
  },
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

const todoSchema = new mongoose.Schema<ITodo>(
  {
    title: {
      type: String,
      required: true,
    },
    status: {
      type: String,
      enum: ["pending", "in-progress", "on-hold", "completed"],
      default: "pending",
    },
    isActive: {
      type: Boolean,
      default: true,
    },
    description: {
      type: String,
    },
    isCompleted: {
      type: Boolean,
      default: false,
    },
    startDate: {
      type: Date,
      required: true,
    },
    endDate: {
      type: Date,
      required: true,
    },
    comments: [commentSchema],
    assignedUsers: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
      },
    ],
  },
  { timestamps: true }
);

const TodoModel: Model<ITodo> = mongoose.model("Todo", todoSchema);
export default TodoModel;
