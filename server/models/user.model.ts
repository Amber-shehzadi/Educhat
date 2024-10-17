require("dotenv").config();
import jwt from "jsonwebtoken";
import bcrypt from "bcryptjs";
import mongoose, { Document, Model, Schema } from "mongoose";

const emailRegex: RegExp =
  /^(([^<>()[\]\\.,;:\s@\"]+(\.[^<>()[\]\\.,;:\s@\"]+)*)|(\".+\"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;

interface IFeedback {
  user: mongoose.Types.ObjectId; // Reference to the user who gave the feedback
  feedbackText: string; // The feedback text
  date: Date; // Date when the feedback was given
}
export interface IUSER extends Document {
  name: string;
  nickname: string;
  fatherName: string;
  address: string;
  cnic: string;
  contact: string;
  reg_no: string;
  about: string;
  email: string;
  password: string;
  gender: "male" | "female";
  avatar: {
    public_id: string;
    url: string;
  };
  coverPicture: {
    public_id: string;
    url: string;
  };
  role: "coordinator" | "student" | "teacher" | "admin";
  isVerified: boolean;
  isOnline: boolean;
  managedClasses?: mongoose.Types.ObjectId[]; // Classes managed by Faculty
  assignedClasses?: mongoose.Types.ObjectId[]; // Classes assigned to Teacher
  enrolledClasses?: mongoose.Types.ObjectId[];
  comparePassword: (password: string) => Promise<boolean>;
  authAccessToken: () => string;
  authRefreshToken: () => string;
  feedbacks?: IFeedback[]; // Array of feedbacks
}

const userSchema: Schema<IUSER> = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, "Please enter your name"],
    },
    nickname: {
      type: String,
    },
    fatherName: {
      type: String,
    },
    feedbacks: [
      {
        user: {
          type: mongoose.Schema.Types.ObjectId,
          ref: "User",
        },
        feedbackText: {
          type: String,
        },
        date: {
          type: Date,
          default: Date.now,
        },
      },
    ],
    address: {
      type: String,
    },
    cnic: {
      type: String,
      // unique: true,
    },
    contact: {
      type: String,
      // unique: true,
    },
    about: {
      type: String,
    },
    reg_no: {
      type: String,
      // unique: true,
    },
    email: {
      type: String,
      required: [true, "Please enter your email"],
      validate: {
        validator: function (value: string) {
          return emailRegex.test(value);
        },
        message: "Please enter a valid email",
      },
      unique: true,
    },
    password: {
      type: String,
      // required: [true, "Please enter your password"], because we have social auth and it don't need password
      minlength: [8, "Password must be at least 8 characters"],
      select: false,
    },
    avatar: {
      public_id: String,
      url: String,
    },
    coverPicture: {
      public_id: String,
      url: String,
    },
    gender: {
      type: String,
      default: "female",
    },
    role: {
      type: String,
      default: "coordinator",
    },
    isVerified: {
      type: Boolean,
      default: false,
    },
    isOnline: {
      type: Boolean,
      default: false,
    },
    managedClasses: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Class",
      },
    ], // Array of classes managed by Faculty
    assignedClasses: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Class",
      },
    ], // Array of classes assigned to Teacher
    enrolledClasses: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Class",
      },
    ],
  },
  { timestamps: true }
);

// <---------------------------------- Pre Functions that will run before saving data --------------------------------------------->
// hash password bfore saving
userSchema.pre<IUSER>("save", async function (next) {
  if (!this.isModified("password")) {
    next();
  }
  this.password = await bcrypt.hash(this.password, 10);
  next();
});

// <------------------------------------ Custom Methods ----------------------------------------->
// authAccessToken
userSchema.methods.authAccessToken = function () {
  return jwt.sign({ id: this._id }, process.env.ACCESS_TOKEN || "", {
    expiresIn: "5m",
  });
};

// authRefreshToken
userSchema.methods.authRefreshToken = function () {
  return jwt.sign({ id: this._id }, process.env.REFRESH_TOKEN || "", {
    expiresIn: "7d",
  });
};

// compare password
userSchema.methods.comparePassword = async function (
  enteredPassword: string
): Promise<Boolean> {
  return await bcrypt.compare(enteredPassword, this.password);
};

const userModel: Model<IUSER> = mongoose.model("User", userSchema);
export default userModel;
