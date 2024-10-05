import express from "express";
import {
  createClass,
  getClass,
  getAllClasses,
  updateClass,
  deleteClass,
  assignedClassToFaculty,
} from "../controllers/class.controller";
import { authorizedRole, isAuthenticated } from "../middleware/auth";

const classRouter = express.Router();

// Create a new class
classRouter.post(
  "/create-class",
  isAuthenticated,
  authorizedRole("admin", "coordinator"),
  createClass
);

// Get a specific class by ID
classRouter.get("/class/:id", isAuthenticated, getClass);

// Get all classes
classRouter.get(
  "/classes",
  isAuthenticated,
  authorizedRole("admin", "coordinator"),
  getAllClasses
);

// Update a class by ID
classRouter.put(
  "/class/:id",
  isAuthenticated,
  authorizedRole("admin", "coordinator"),
  updateClass
);

// Delete a class by ID
classRouter.delete(
  "/class/:id",
  isAuthenticated,
  authorizedRole("admin", "coordinator"),
  deleteClass
);

// for admin
classRouter.delete(
  "assignedClassToFaculty",
  isAuthenticated,
  authorizedRole("admin"),
  assignedClassToFaculty
);


export default classRouter;
