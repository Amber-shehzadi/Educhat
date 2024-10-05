import { Request, Response } from "express";
import notificationsModel from "../models/notifications.model";

export const getAllNotifications = async (req: Request, res: Response) => {
  try {
    const userId = req.user?._id;
    const notifications = await notificationsModel.find({
      userId,
    });
    const count = notifications.length;

    res.status(200).json({
      success: true,
      notifications,
      count,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Failed to fetch notifications",
    });
  }
};
