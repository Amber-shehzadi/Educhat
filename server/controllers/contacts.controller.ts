import { NextFunction, Request, Response } from "express";
import { AsyncErrors } from "../middleware/AsyncErrors";
import ErrorHandler from "../utils/ErrorHandler";
import userModel from "../models/user.model";
import mongoose from "mongoose";
import Message from "../models/messages.model";

require("dotenv").config();

export const searchContact = AsyncErrors(
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { searchTerm } = req.body;
      if (!searchTerm) {
        return next(new ErrorHandler("Search value is requied", 400));
      }
      const sanitizedSearchTerm = searchTerm.replace(
        /[.*+?^${}()|[\]\\]/g,
        "\\$&"
      );
      const regex = new RegExp(sanitizedSearchTerm, "i");
      const contacts = await userModel.find({
        $and: [
          { _id: { $ne: req?.user?._id } },
          {
            $or: [
              {
                name: regex,
              },
              { email: regex },
            ],
          },
        ],
      });
      res.status(200).json({ contacts });
    } catch (err: any) {
      return next(new ErrorHandler(err.message, 500));
    }
  }
);

export const getContactforDMList = AsyncErrors(
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      let userID = req?.user?._id;

      userID = new mongoose.Types.ObjectId(userID as string);
      const contacts = await Message.aggregate([
        {
          $match: {
            $or: [{ sender: userID }, { recipient: userID }],
          },
        },
        { $sort: { createdAt: -1 } },
        {
          $group: {
            _id: {
              $cond: {
                if: { $eq: ["$sender", userID] },
                then: "$recipient",
                else: "$sender",
              },
            },
            lastMessageTime: { $first: "$createdAt" },
            lastMessage: { $first: "$content" },
          },
        },
        {
          $lookup: {
            from: "users",
            localField: "_id",
            foreignField: "_id",
            as: "contactInfo",
          },
        },
        { $unwind: "$contactInfo" },
        {
          $project: {
            _id: 1,
            lastMessageTime: 1,
            lastMessage: 1,
            name: "$contactInfo.name",
            email: "$contactInfo.email",
            avatar: "$contactInfo.avatar",
          },
        },
        {
          $sort: { lastMessageTime: -1 },
        },
      ]);

      res.status(200).json({ contacts });
    } catch (err: any) {
      return next(new ErrorHandler(err.message, 500));
    }
  }
);
