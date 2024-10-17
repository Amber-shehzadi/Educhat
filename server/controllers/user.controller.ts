require("dotenv").config();
import { NextFunction, Request, Response } from "express";
import jwt, { JwtPayload, Secret, decode } from "jsonwebtoken";
import { AsyncErrors } from "../middleware/AsyncErrors";
import userModel, { IUSER } from "../models/user.model";
import ErrorHandler from "../utils/ErrorHandler";
import sendMail from "../utils/SendMail";
import { accessTokenOption, refreshTokenOption, sendToken } from "../utils/jwt";
import { redis } from "../connection/redis";
import {
  getAllUserService,
  getUserbyId,
  updateUserRoleService,
  verifyUserService,
} from "../services/user.service";
import cloudinary from "cloudinary";
import ClassModel from "../models/class.model";

// <------------------ interfaces ------------------->
interface IRegistrationRequest {
  name: string;
  fatherName: string;
  email: string;
  password: string;
  avatar?: string;
}

interface IActivationToken {
  token: string;
  activationCode: string;
}

interface IActivationrequest {
  activation_token: string;
  activation_code: string;
}

interface ILoginRequest {
  email: string;
  password: string;
}

interface ISocialAuthrequest {
  email: string;
  name: string;
  avatar: string;
}

interface IUpdateUserInfo {
  name?: string;
  email?: string;
}

interface IUpdatePassword {
  oldPassword: string;
  newPassword: string;
}

interface IUpdateProfilePicture {
  avatar: string;
}

interface IUpdateCoverPicture {
  coverPicture: string;
}

// <----------------------- Auth Handlers ---------------------->

// register user
export const registerUser = AsyncErrors(
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const {
        name,
        email,
        fatherName,
        password,
        avatar,
      }: IRegistrationRequest = req.body;
      const isEmailExist = await userModel.findOne({ email });
      if (isEmailExist)
        return next(new ErrorHandler("Email already exist", 400));

      const user: IRegistrationRequest = {
        name,
        fatherName,
        email,
        password,
      };

      const { activationCode, token } = handleCreateActivationToken(user);
      const data = { user: { name: user.name }, activationCode };
      try {
        await sendMail({
          email: user.email,
          subject: "Activate your account",
          template: "activation-mail.ejs",
          data,
        });
        res.status(201).json({
          success: true,
          message: `Please check your email: ${user.email} to activate your account!`,
          token,
        });
      } catch (err: any) {
        return next(new ErrorHandler(err.message, 400));
      }
    } catch (err: any) {
      return next(new ErrorHandler(err.message, 400));
    }
  }
);

// activate user using OTP
export const activateUser = AsyncErrors(
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { activation_code, activation_token }: IActivationrequest =
        req.body;
      const newUser: { user: IUSER; activationCode: string } = jwt.verify(
        activation_token,
        process.env.ACTIVATION_SECRET as string
      ) as { user: IUSER; activationCode: string };
      if (newUser.activationCode !== activation_code) {
        return next(new ErrorHandler("Invalid activation code", 400));
      }
      const { email, fatherName, name, password } = newUser.user;
      const isEmailExist = await userModel.findOne({ email });
      if (isEmailExist) {
        return next(new ErrorHandler("Email already exist", 400));
      }
      const user = await userModel.create({
        name,
        fatherName,
        email,
        password,
      });
      res.status(201).json({
        success: true,
        user,
      });
    } catch (err: any) {
      return next(new ErrorHandler(err.message, 400));
    }
  }
);

// Login User

export const loginUser = AsyncErrors(
  async (req: Request, res: Response, next: NextFunction) => {
    const { email, password } = req.body as ILoginRequest;
    try {
      if (!email || !password) {
        return next(new ErrorHandler("Please enter email and password", 400));
      }

      const user = await userModel.findOne({ email }).select("+password");
      if (!user) {
        return next(new ErrorHandler("Invalid email or password", 400));
      }
      if (!user?.isVerified) {
        return next(new ErrorHandler("Your account is not varified yet", 400));
      }

      const isPasswordMatch = await user.comparePassword(password);
      if (!isPasswordMatch) {
        return next(new ErrorHandler("Invalid email or password", 400));
      }
      sendToken(user, 200, res);
    } catch (err: any) {
      return next(new ErrorHandler(err.message, 400));
    }
  }
);

// logout

export const logoutUser = AsyncErrors(
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      res.cookie("access_token", "", { maxAge: 1 });
      res.cookie("refresh_token", "", { maxAge: 1 });
      const userId = (req.user?._id as any) || "";
      redis.del(userId);
      res.status(200).json({
        success: true,
        message: "Logged out successfully",
      });
    } catch (err: any) {
      return next(new ErrorHandler(err.message, 400));
    }
  }
);

//update access token
export const updateAccessToken = AsyncErrors(
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const refresh_token = req.cookies.refresh_token as string;
      const decoded = jwt.verify(
        refresh_token,
        process.env.REFRESH_TOKEN as string
      ) as JwtPayload;
      const message = "Couldn't refresh the token";
      if (!decoded) {
        return next(new ErrorHandler(message, 400));
      }
      const session = await redis.get(decoded.id as string);
      if (!session) {
        return next(new ErrorHandler(message, 400));
      }

      const user = JSON.parse(session);
      const accessToken = jwt.sign(
        { id: user._id },
        process.env.ACCESS_TOKEN as string,
        { expiresIn: "5m" }
      );

      const refreshToken = jwt.sign(
        { id: user._id },
        process.env.REFRESH_TOKEN as string,
        { expiresIn: "7d" }
      );

      req.user = user;
      res.cookie("access_token", accessToken, accessTokenOption);
      res.cookie("refresh_token", refreshToken, refreshTokenOption);

      res.status(200).json({
        success: true,
        accessToken,
      });
    } catch (err: any) {
      return next(new ErrorHandler(err.message, 400));
    }
  }
);

// get user Info
export const getUserInfo = AsyncErrors(
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const userId = req.user?._id as string;
      getUserbyId(userId, res);
    } catch (err: any) {
      return next(new ErrorHandler(err.message, 400));
    }
  }
);

// social auth
export const socialAuth = AsyncErrors(
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { email, name, avatar } = req.body as ISocialAuthrequest;

      const user = await userModel.findOne({ email });
      if (!user) {
        const newUser = await userModel.create({ email, name, avatar });
        sendToken(newUser, 200, res);
      } else {
        sendToken(user, 200, res);
      }
    } catch (err: any) {
      return next(new ErrorHandler(err.message, 400));
    }
  }
);

export const updateUserInfo = AsyncErrors(
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { name, email } = req.body as IUpdateUserInfo;
      const userId = req.user?._id;
      const user = await userModel.findById(userId);

      if (email && user) {
        const isEmailExist = await userModel.findOne({ email });
        if (isEmailExist) {
          return next(new ErrorHandler("Email already exist", 400));
        }
        user.email = email;
      }
      if (name && user) {
        user.name = name;
      }
      await user?.save();
      await redis.set(userId as string, JSON.stringify(user));
      res.status(201).json({ success: true, user });
    } catch (err: any) {
      return next(new ErrorHandler(err.message, 400));
    }
  }
);

// update user password

export const updatePassword = AsyncErrors(
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { oldPassword, newPassword } = req.body as IUpdatePassword;

      if (!oldPassword || !newPassword) {
        return next(new ErrorHandler("Please enter old and new password", 400));
      }

      const user = await userModel.findById(req.user?._id).select("+password");
      if (user?.password === undefined) {
        return next(new ErrorHandler("Invalid user", 400));
      }
      const isPasswordMatch = await user?.comparePassword(oldPassword);
      if (!isPasswordMatch) {
        return next(new ErrorHandler("Invalid old password", 400));
      }
      user.password = newPassword;
      await user.save();
      await redis.set(req.user?._id as string, JSON.stringify(user));
      res.status(201).json({ success: true, user });
    } catch (err: any) {
      return next(new ErrorHandler(err.message, 400));
    }
  }
);

// update profile picture
export const updateProfilePicture = AsyncErrors(
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { avatar } = req.body as IUpdateProfilePicture;
      const userId = req.user?._id as string;
      const user = await userModel.findById(userId);

      if (avatar && user) {
        if (user?.avatar?.public_id) {
          await cloudinary.v2.uploader.destroy(user?.avatar?.public_id);

          const cloud = await cloudinary.v2.uploader.upload(avatar, {
            folder: "avatars",
            width: 150,
          });
          user.avatar = {
            public_id: cloud.public_id,
            url: cloud.secure_url,
          };
        } else {
          const cloud = await cloudinary.v2.uploader.upload(avatar, {
            folder: "avatars",
            width: 150,
          });
          user.avatar = {
            public_id: cloud.public_id,
            url: cloud.secure_url,
          };
        }

        await user.save();
        await redis.set(userId, JSON.stringify(user));
        res.status(200).json({
          success: true,
          user,
        });
      }
    } catch (err: any) {
      return next(new ErrorHandler(err.message, 400));
    }
  }
);

// update profile picture
export const updateCoverPicture = AsyncErrors(
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { coverPicture } = req.body as IUpdateCoverPicture;
      const userId = req.user?._id as string;
      const user = await userModel.findById(userId);

      if (coverPicture && user) {
        if (user?.coverPicture?.public_id) {
          await cloudinary.v2.uploader.destroy(user?.coverPicture?.public_id);

          const cloud = await cloudinary.v2.uploader.upload(coverPicture, {
            folder: "avatars",
            width: 150,
          });
          user.coverPicture = {
            public_id: cloud.public_id,
            url: cloud.secure_url,
          };
        } else {
          const cloud = await cloudinary.v2.uploader.upload(coverPicture, {
            folder: "avatars",
            width: 150,
          });
          user.coverPicture = {
            public_id: cloud.public_id,
            url: cloud.secure_url,
          };
        }

        await user.save();
        await redis.set(userId, JSON.stringify(user));
        res.status(200).json({
          success: true,
          user,
        });
      }
    } catch (err: any) {
      return next(new ErrorHandler(err.message, 400));
    }
  }
);

export const handleCreateActivationToken = (user: any): IActivationToken => {
  const activationCode = Math.floor(1000 + Math.random() * 9000).toString();
  const token = jwt.sign(
    { user, activationCode },
    process.env.ACTIVATION_SECRET as Secret,
    { expiresIn: "5m" }
  );
  return { token, activationCode };
};

// get all users --- only for admin
export const getAllUsers = AsyncErrors(
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      getAllUserService(res);
    } catch (err: any) {
      return next(new ErrorHandler(err.message, 500));
    }
  }
);
// for chat
export const getAllUsersforChat = AsyncErrors(
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const users = await userModel
        .find({ _id: { $ne: req.user?._id } })
        .populate("assignedClasses") // Populates assigned classes
        .sort({ createdAt: -1 });
      res.status(200).json({
        success: true,
        users,
      });
    } catch (err: any) {
      return next(new ErrorHandler(err.message, 500));
    }
  }
);

// update user role --- only for admin
export const updateUserRole = AsyncErrors(
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { id, role } = req.body;
      const user = updateUserRoleService(res, id, role);
      res.status(201).json({
        success: true,
        user,
        message: "User role has been updated successfully",
      });
    } catch (err: any) {
      return next(new ErrorHandler(err.message, 500));
    }
  }
);

export const verifyUser = AsyncErrors(
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { id, isVerified } = req.body;
      const user = verifyUserService(id, isVerified);
      res.status(201).json({
        success: true,
        user,
        message: "User has been verfied successfully",
      });
    } catch (err: any) {
      return next(new ErrorHandler(err.message, 500));
    }
  }
);

// delete user --- only admin
export const deleteUser = AsyncErrors(
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { id } = req.params; // Assuming 'id' is passed in the request parameters

      // Find the user by ID
      const user = await userModel.findById(id);
      if (!user) {
        return next(new ErrorHandler("Faculty not found", 404));
      }

      // Mark the user as inactive (assuming an 'isActive' field exists)
      // user. = false;
      await user.save();

      res.status(200).json({
        success: true,
        message: "Faculty has been deactivated successfully",
      });
    } catch (err: any) {
      return next(new ErrorHandler(err.message, 400));
    }
  }
);

// for admin add coordinator

export const addFaculty = AsyncErrors(
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { email, name, password } = req.body;
      const isEmailExist = await userModel.findOne({ email });
      if (isEmailExist) {
        return next(new ErrorHandler("Email already exist", 400));
      }
      const user = await userModel.create({
        name,
        email,
        password,
        isVerified: true,
      });
      res.status(201).json({
        success: true,
        user,
        message: "Coordinator has been added successfully",
      });
    } catch (err: any) {
      return next(new ErrorHandler(err.message, 400));
    }
  }
);

export const updateFaculty = AsyncErrors(
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { id } = req.params; // Assuming 'id' is passed in the request parameters
      const { email, name, password } = req.body;

      // Check if the user exists by ID
      const user = await userModel.findById(id);
      if (!user) {
        return next(new ErrorHandler("Faculty not found", 404));
      }

      // Check if the email is being updated and already exists for another user
      if (email && email !== user.email) {
        const isEmailExist = await userModel.findOne({ email });
        if (isEmailExist) {
          return next(new ErrorHandler("Email already exists", 400));
        }
      }

      // Update the user fields
      user.name = name || user.name;
      user.email = email || user.email;
      if (password) user.password = password; // Update password if provided

      await user.save();

      res.status(200).json({
        success: true,
        user,
        message: "Coordinator details updated successfully",
      });
    } catch (err: any) {
      return next(new ErrorHandler(err.message, 400));
    }
  }
);

export const addUsers = AsyncErrors(
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { email, name, password } = req.body;
      const isEmailExist = await userModel.findOne({ email });
      if (isEmailExist) {
        return next(new ErrorHandler("Email already exist", 400));
      }
      const user = await userModel.create({
        name,
        email,
        password,
      });
      res.status(201).json({
        success: true,
        user,
      });
    } catch (err: any) {
      return next(new ErrorHandler(err.message, 400));
    }
  }
);

export const getAllFaculties = AsyncErrors(
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      // Find all coordinator users who are verified
      const faculties = await userModel.find({ role: "coordinator" }).populate({
        path: "managedClasses", // Populate the managedClasses array with full class details
        model: "Class", // Reference to Class model
      });

      res.status(200).json({
        status: true,
        faculties,
      });
    } catch (err: any) {
      return next(new ErrorHandler(err.message, 500));
    }
  }
);

export const addTeacherStudent = AsyncErrors(
  async (req: Request, res: Response, next: NextFunction) => {
    let avatarCloud;
    try {
      const {
        email,
        name,
        password,
        address,
        cnic,
        contact,
        gender,
        role,
        avatar,
        reg_no,
        classId,
      } = req.body;

      // Check if the email already exists
      const isEmailExist = await userModel.findOne({ email });
      if (isEmailExist) {
        return next(new ErrorHandler("Email already exists", 400));
      }

      // // Check if the cnic already exists
      // const isCnicExist = await userModel.findOne({ cnic });
      // if (isCnicExist) {
      //   return next(new ErrorHandler("CNIC already exists", 400));
      // }

      // Check if the cnic already exists
      const isRegExist = await userModel.findOne({ reg_no });
      if (isRegExist) {
        return next(
          new ErrorHandler("Registration Number already exists", 400)
        );
      }

      // Check if the phone already exists
      const isPhoneNumExist = await userModel.findOne({ contact });
      if (isPhoneNumExist) {
        return next(new ErrorHandler("Phone Number already exists", 400));
      }

      // Upload avatar to cloudinary
      if (avatar) {
        const cloud = await cloudinary.v2.uploader.upload(avatar, {
          folder: "avatars",
          width: 150,
        });
        avatarCloud = {
          public_id: cloud.public_id,
          url: cloud.secure_url,
        };
      }

      // Create the user
      const user = await userModel.create({
        name,
        email,
        password,
        address,
        cnic,
        contact,
        gender,
        role,
        avatar: avatarCloud || avatar,
        reg_no,
        isVerified: true,
      });

      // Update user and class based on role
      if (role === "teacher") {
        // Add classId to the user's assignedClasses
        user.assignedClasses = [classId];
        await user.save();

        await ClassModel.findByIdAndUpdate(
          classId,
          { $push: { teachers: user._id } },
          { new: true }
        );
      } else if (role === "student") {
        user.enrolledClasses = [classId];
        await user.save();

        await ClassModel.findByIdAndUpdate(
          classId,
          { $push: { students: user._id } },
          { new: true }
        );
      }

      res.status(201).json({
        success: true,
        user,
        message: `User has been added successfully`,
      });
    } catch (err: any) {
      return next(new ErrorHandler(err.message, 400));
    }
  }
);

// get all teachers

export const getVerifiedTeachersWithDetails = AsyncErrors(
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const teachers = await userModel
        .find({ role: "teacher" })
        .populate({
          path: "assignedClasses",
          select: "name section description",
        })
        .populate({
          path: "feedbacks.user",
          select: "name email",
        });

      res.status(200).json({
        status: true,
        teachers,
      });
    } catch (err: any) {
      return next(new ErrorHandler(err.message, 500));
    }
  }
);

// get all students

export const getVerifiedStudentsWithDetails = AsyncErrors(
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const students = await userModel
        .find({ role: "student" })
        .populate({
          path: "enrolledClasses",
          select: "name section description",
        })
        .populate({
          path: "feedbacks.user",
          select: "name email",
        });

      res.status(200).json({
        status: true,
        students,
      });
    } catch (err: any) {
      return next(new ErrorHandler(err.message, 500));
    }
  }
);

// teachers for feedback

export const getVerifiedTeachersForStudent = AsyncErrors(
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const studentId = req.user?._id; // Assuming the user is logged in and `req.user` contains the student info

      // Find the student and populate the active enrolledClasses with teacher details
      const student = await userModel.findById(studentId).populate({
        path: "enrolledClasses",
        match: { isActive: true }, // Only return active classes
        populate: {
          path: "teachers",
          match: { isVerified: true }, // Only return verified teachers
          select: "-password", // Exclude password field for security reasons
        },
      });

      if (!student) {
        return next(new ErrorHandler("Student not found", 404));
      }

      // Extract the verified teacher objects from the active enrolled classes
      const verifiedTeachers = student.enrolledClasses?.length
        ? student.enrolledClasses
            .map((classObj: any) => classObj.teachers)
            .flat()
        : [];

      res.status(200).json({
        status: true,
        teachers: verifiedTeachers,
      });
    } catch (err: any) {
      return next(new ErrorHandler(err.message, 500));
    }
  }
);

export const submitFeedbackToTeacher = AsyncErrors(
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const studentId = req.user?._id; // Assuming the user is logged in
      const { teacherId, feedbackText } = req.body;

      // Find the student and populate the active enrolledClasses with teacher details
      const student = await userModel.findById(studentId).populate({
        path: "enrolledClasses",
        match: { isActive: true }, // Only consider active classes
        populate: {
          path: "teachers",
          match: { isVerified: true }, // Only consider verified teachers
          select: "-password", // Exclude password field
        },
      });

      if (!student) {
        return next(new ErrorHandler("Student not found", 404));
      }

      // Extract the verified teacher objects from the active enrolled classes
      const verifiedTeachers = student.enrolledClasses?.length
        ? student.enrolledClasses
            .map((classObj: any) => classObj.teachers)
            .flat()
        : [];

      // Check if the teacherId exists in the student's classes
      const teacher = verifiedTeachers.find(
        (teacher: any) => teacher._id.toString() === teacherId
      );

      if (!teacher) {
        return next(
          new ErrorHandler("You cannot provide feedback to this teacher", 403)
        );
      }

      // Add feedback to the teacher's feedback array
      teacher.feedbacks.push({ user: studentId, feedbackText });
      await teacher.save();

      res.status(200).json({
        status: true,
        message: "Feedback submitted successfully",
        teacher,
      });
    } catch (err: any) {
      return next(new ErrorHandler(err.message, 500));
    }
  }
);

export const getUserCountsByRole = AsyncErrors(
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const roleCounts = await userModel.aggregate([
        {
          $match: { isVerified: true }, // First, filter documents by isVerified:true
        },
        {
          $group: {
            _id: "$role", // Group by the "role" field
            count: { $sum: 1 }, // Count the number of occurrences
          },
        },
        {
          $project: {
            role: "$_id", // Rename _id to role
            count: 1,
            _id: 0, // Exclude the original _id field from the output
          },
        },
      ]);

      if (!roleCounts.length) {
        return next(new ErrorHandler("No users found", 404));
      }

      res.status(200).json({
        success: true,
        usercount: roleCounts,
      });
    } catch (err: any) {
      return next(new ErrorHandler(err.message, 500));
    }
  }
);
