import express from "express";
import {
  activateUser,
  addFaculty,
  addTeacherStudent,
  deleteUser,
  getAllFaculties,
  getAllUsers,
  getAllUsersforChat,
  getUserCountsByRole,
  getUserInfo,
  getVerifiedStudentsWithDetails,
  getVerifiedTeachersForStudent,
  getVerifiedTeachersWithDetails,
  loginUser,
  logoutUser,
  registerUser,
  socialAuth,
  submitFeedbackToTeacher,
  updateAccessToken,
  updateCoverPicture,
  updateFaculty,
  updatePassword,
  updateProfilePicture,
  updateUserInfo,
  updateUserRole,
  verifyUser,
} from "../controllers/user.controller";
import { authorizedRole, isAuthenticated } from "../middleware/auth";

const userRouter = express.Router();

userRouter.get("/me", isAuthenticated, getUserInfo);
userRouter.get("/logout", isAuthenticated, logoutUser);
userRouter.get("/refresh-token", updateAccessToken);
userRouter.get("/all-users-for-chat", isAuthenticated, getAllUsersforChat);
userRouter.get(
  "/all-users",
  isAuthenticated,
  authorizedRole("admin"),
  getAllUsers
);

userRouter.post("/login", loginUser);
userRouter.post("/register", registerUser);
// userRouter.post("/social-auth", socialAuth);
userRouter.post("/activate-user", activateUser);

userRouter.put("/update-user-info", isAuthenticated, updateUserInfo);
userRouter.put("/update-user-password", isAuthenticated, updatePassword);
userRouter.put("/update-user-avatar", isAuthenticated, updateProfilePicture);
userRouter.put(
  "/update-user-coverpicture",
  isAuthenticated,
  updateCoverPicture
);

userRouter.put(
  "/update-user-role",
  isAuthenticated,
  authorizedRole("admin"),
  updateUserRole
);

userRouter.put(
  "/verfiy-user",
  isAuthenticated,
  authorizedRole("admin"),
  verifyUser
);

userRouter.delete(
  "/delete-user/:id",
  isAuthenticated,
  authorizedRole("admin"),
  deleteUser
);

userRouter.post(
  "/add-coordinator",
  isAuthenticated,
  authorizedRole("admin"),
  addFaculty
);

userRouter.put(
  "/update-coordinator/:id",
  isAuthenticated,
  authorizedRole("admin"),
  updateFaculty
);

userRouter.get(
  "/faculties-for-admin",
  isAuthenticated,
  authorizedRole("admin"),
  getAllFaculties
);

userRouter.post(
  "/add-teacher-student",
  isAuthenticated,
  authorizedRole("admin", "coordinator"),
  addTeacherStudent
);

userRouter.get(
  "/get-all-teachers",
  isAuthenticated,
  authorizedRole("admin", "coordinator"),
  getVerifiedTeachersWithDetails
);
userRouter.get(
  "/get-all-students",
  isAuthenticated,
  authorizedRole("admin", "coordinator"),
  getVerifiedStudentsWithDetails
);

userRouter.get(
  "/get-teachers-for-feedback",
  isAuthenticated,
  authorizedRole("student"),
  getVerifiedTeachersForStudent
);

userRouter.post(
  "/add-feedback",
  isAuthenticated,
  authorizedRole("student"),
  submitFeedbackToTeacher
);

userRouter.get(
  "/user-count",
  isAuthenticated,
  authorizedRole("admin", "coordinator"),
  getUserCountsByRole
);

export default userRouter;
