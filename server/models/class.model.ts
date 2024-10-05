import mongoose, { Document, Model, Schema } from "mongoose";

export interface IClass extends Document {
  name: string;
  description?: string;
  isActive: boolean;
  coordinator: mongoose.Types.ObjectId; // Reference to the Faculty managing the class
  teachers: mongoose.Types.ObjectId[]; // References to Teachers assigned to the class
  students: mongoose.Types.ObjectId[]; // References to Students enrolled in the class
  semester: "Semester_1" | "Semester_2" | "Semester_3" | "Semester_4" | "semester_5" | "semester_6" | "semester_7" | "semester_8"; // Define a union type for semesters
}

const classSchema: Schema<IClass> = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, "Class name is required"],
    },
    semester: {
      type: String,
    },
    // Session: {
    //   type: String,
    // },
    description: {
      type: String,
    },
    isActive: {
      type: Boolean,
      default: true,
    },
    // coordinator: {
    //   type: mongoose.Schema.Types.ObjectId,
    //   ref: "User",
    //   required: [true, "coordinator is required"],
    // },
    teachers: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
      },
    ],
    students: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
      },
    ],
  },
  { timestamps: true }
);

const ClassModel: Model<IClass> = mongoose.model("Class", classSchema);
export default ClassModel;
