import { Request, Response, NextFunction } from "express";
import ErrorHandler from "../utils/ErrorHandler";
import { AsyncErrors } from "../middleware/AsyncErrors";
import AnnouncementModel from "../models/announcements.model";
import notificationsModel from "../models/notifications.model";
import userModel from "../models/user.model";

// Create Announcement
export const createAnnouncement = AsyncErrors(
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { title, description } = req.body;
      const createdBy = req.user?._id; // Assuming the user is admin

      const newAnnouncement = await AnnouncementModel.create({
        title,
        description,
        createdBy,
      });

      res.status(201).json({
        success: true,
        announcement: newAnnouncement,
        message: "Announcement created successfully",
      });
    } catch (error: any) {
      return next(new ErrorHandler(error.message, 500));
    }
  }
);

// Get All Active Announcements (Everyone can see)
export const getAllAnnouncements = AsyncErrors(
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const announcements = await AnnouncementModel.find({
        isActive: true,
      }).populate("createdBy", "name email");

      res.status(200).json({
        success: true,
        announcements,
      });
    } catch (error: any) {
      return next(new ErrorHandler(error.message, 500));
    }
  }
);

export const getPaginatedAnnouncements = AsyncErrors(
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const limit = parseInt(req.query.limit as string) || 20;
      const offset = parseInt(req.query.offset as string) || 0;

      const announcements = await AnnouncementModel.find({ isActive: true })
        .populate({
          path: "createdBy",
          select: "name email avatar",
        })
        .sort({ createdAt: -1 })
        .skip(offset)
        .limit(limit + 1); // Fetch one extra item to check if there are more

      const hasMore = announcements.length > limit; // Check if there is more data
      const limitedAnnouncements = announcements.slice(0, limit); // Remove the extra item

      res.status(200).json({
        status: true,
        announcements: limitedAnnouncements,
        hasMore, // Indicate if there are more announcements
      });
    } catch (err: any) {
      return next(new ErrorHandler(err.message, 500));
    }
  }
);

// Update Announcement
export const updateAnnouncement = AsyncErrors(
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { id } = req.params;
      const { title, description } = req.body;

      const announcement = await AnnouncementModel.findByIdAndUpdate(
        id,
        { title, description },
        { new: true, runValidators: true }
      );

      if (!announcement) {
        return next(new ErrorHandler("Announcement not found", 404));
      }

      res.status(200).json({
        success: true,
        announcement,
        message: "Announcement updated successfully",
      });
    } catch (error: any) {
      return next(new ErrorHandler(error.message, 500));
    }
  }
);

// Delete Announcement (Soft delete by setting isActive to false)
export const deleteAnnouncement = AsyncErrors(
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { id } = req.params;

      const announcement = await AnnouncementModel.findByIdAndUpdate(
        id,
        { isActive: false },
        { new: true }
      );

      if (!announcement) {
        return next(new ErrorHandler("Announcement not found", 404));
      }

      res.status(200).json({
        success: true,
        message: "Announcement deleted successfully",
      });
    } catch (error: any) {
      return next(new ErrorHandler(error.message, 500));
    }
  }
);
