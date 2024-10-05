import { NextFunction, Request, Response } from "express";
import { AsyncErrors } from "../middleware/AsyncErrors";
import ErrorHandler from "../utils/ErrorHandler";
import ConversationModel, { IConversation } from "../models/conversation.model";
import cloudinary from "cloudinary";
import userModel from "../models/user.model";
import ChannelModel from "../models/channel.model";
import mongoose from "mongoose";

// get all members of a chat
export const createChannel = AsyncErrors(
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const user = req.user;
      const { name, members } = req.body;
      const validMmebers = await userModel.find({ _id: { $in: members } });
      if (validMmebers.length !== members.length) {
        return next(new ErrorHandler("Some members are not valid users", 400));
      }
      const newChannel = await ChannelModel.create({
        name,
        members,
        admin: user?._id,
      });
      res.status(200).json({
        success: true,
        channel: newChannel,
      });
    } catch (err: any) {
      return next(new ErrorHandler(err.message, 500));
    }
  }
);

export const getChannels = AsyncErrors(
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const userId = new mongoose.Types.ObjectId(req.user?._id as string);
      const channels = await ChannelModel.find({
        $or: [{ admin: userId }, { members: userId }],
      }).sort({ updatedAt: -1 });
      res.status(200).json({
        success: true,
        channels,
      });
    } catch (err: any) {
      return next(new ErrorHandler(err.message, 500));
    }
  }
);

export const getChannelMessages = AsyncErrors(
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { channelId } = req.params;
      const channel = await ChannelModel.findById(channelId).populate({
        path: "messages",
        populate: {
          path: "sender",
          select: "name email _id avatar",
        },
      });
      if (!channel) {
        return next(new ErrorHandler("Channel not found", 400));
      }
      const messages = channel.messages;
      res.status(200).json({
        success: true,
        messages,
      });
    } catch (err: any) {
      return next(new ErrorHandler(err.message, 500));
    }
  }
);
