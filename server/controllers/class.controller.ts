import { NextFunction, Request, Response } from "express";
import { AsyncErrors } from "../middleware/AsyncErrors";
import ErrorHandler from "../utils/ErrorHandler";
import ClassModel from "../models/class.model";
import userModel from "../models/user.model";

export const createClass = AsyncErrors(
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { name, semester, description, Session } = req.body;
      const isAdmin = req.user?.role === "admin";
      // const facultyId = req.user?._id;
      // const facultyforClass = isAdmin ? coordinator : facultyId;

      const newClass = await ClassModel.create({
        name,
        description,
        semester,
        // coordinator: isAdmin ? coordinator : facultyId,
      });

      // await userModel.findByIdAndUpdate(facultyforClass, {
      //   $push: { managedClasses: newClass._id },
      // });

      res.status(201).json({
        status: true,
        class: newClass,
        message: "Class has been created successfully",
      });
    } catch (err: any) {
      return next(new ErrorHandler(err.message, 500));
    }
  }
);

// Get a specific class by ID
export const getClass = AsyncErrors(
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { id } = req.params;
      const classData = await ClassModel.findById(id);

      if (!classData) {
        return next(new ErrorHandler("Class not found", 404));
      }

      res.status(200).json({ status: true, class: classData });
    } catch (err: any) {
      return next(new ErrorHandler(err.message, 500));
    }
  }
);

// Get all classes
export const getAllClasses = AsyncErrors(
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const classes = await ClassModel.find({ isActive: true });
      // .populate(
      //   "coordinator",
      //   "name"
      // );
      // Assuming coordinator is populated with its name

      // Transform the data to match the Ant Design Table format
      const transformedData = classes.map((classData: any) => ({
        key: classData._id, // Using _id as the key
        name: classData.name,
        Session: classData.Session,
        semester: classData.semester,
        description: classData.description,
        // coordinator: classData.coordinator
        //   ? classData.coordinator.name
        //   : "Unknown", // Faculty name or "Unknown" if not found
      }));

      res.status(200).json({ status: true, classes: transformedData });
    } catch (err: any) {
      return next(new ErrorHandler(err.message, 500));
    }
  }
);

// Update a class
export const updateClass = AsyncErrors(
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { id } = req.params;
      const { name, semester, description, Session } = req.body;

      let classData = await ClassModel.findById(id);

      if (!classData) {
        return next(new ErrorHandler("Class not found", 404));
      }

      classData = await ClassModel.findByIdAndUpdate(
        id,
        { name, semester, description },
        { new: true, runValidators: true }
      );

      res.status(200).json({
        status: true,
        class: classData,
        message: "Class record has been updated successfully",
      });
    } catch (err: any) {
      return next(new ErrorHandler(err.message, 500));
    }
  }
);

// Delete a class
export const deleteClass = AsyncErrors(
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { id } = req.params;

      const classData = await ClassModel.findById(id);

      if (!classData) {
        return next(new ErrorHandler("Class not found", 404));
      }

      await ClassModel.findByIdAndUpdate(
        id,
        { isActive: false },
        { new: true, runValidators: true }
      );

      res
        .status(200)
        .json({ status: true, message: "Class deleted successfully" });
    } catch (err: any) {
      return next(new ErrorHandler(err.message, 500));
    }
  }
);

// for admin

export const assignedClassToFaculty = AsyncErrors(
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { name, section, Session, description } = req.body;
      const newClass = await ClassModel.create({
        name,
        description,
        Session,
        section,
      });
      // await userModel.findByIdAndUpdate(coordinator, {
      //   $push: { managedClasses: newClass._id },
      // });

      res.status(201).json({
        status: true,
        class: newClass,
        message: "Class has been created successfully",
      });
    } catch (err: any) {
      return next(new ErrorHandler(err.message, 500));
    }
  }
);
