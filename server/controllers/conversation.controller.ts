import { NextFunction, Request, Response } from "express";
import { AsyncErrors } from "../middleware/AsyncErrors";
import ErrorHandler from "../utils/ErrorHandler";
import ConversationModel, { IConversation } from "../models/conversation.model";
import cloudinary from "cloudinary";
import MessageModel from "../models/message.model";
import userModel from "../models/user.model";

export const createConversation = AsyncErrors(
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const {
        participants,
        isGroup,
        groupName,
        groupImage,
        admin,
      }: IConversation = req.body;
      const existingConversation = await ConversationModel.findOne({
        $or: [
          { participants: { $eq: participants } },
          { participants: { $eq: participants.reverse() } },
        ],
      });
      if (existingConversation) {
        return res.status(400).json({
          success: false,
          message: "This conversation already exists",
          conversationId: existingConversation._id,
        });
      }
      let groupImageUrl;
      if (groupImage) {
        // todo upload image later
        const cloud = await cloudinary.v2.uploader.upload(groupImage, {
          folder: "CampusHub/groupImages",
          width: 300,
        });

        groupImageUrl = {
          public_id: cloud.public_id,
          url: cloud.url,
        };
      }

      const conversation = await ConversationModel.create({
        participants,
        isGroup,
        groupName,
        groupImageUrl,
        admin,
      });

      res.status(200).json({ success: true, conversationId: conversation._id });
    } catch (err: any) {
      return next(new ErrorHandler(err.message, 500));
    }
  }
);

// get all previous conversations
export const getALLPreviousConversations = AsyncErrors(
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const userID = req.user?._id;
      const myConversations = await ConversationModel.find({
        participants: userID,
      }).sort({ createdAt: -1 });

      const conversationWithDetail = await Promise.all(
        myConversations.map(async (conversation: any) => {
          let userDetail = {};
          if (!conversation.isGroup) {
            const otherUserID = conversation.participants.find(
              (id: string) => id.toString() !== userID
            );
            const profile = await userModel.findById(otherUserID);
            if (!profile) {
              return next(new ErrorHandler("Other user not found", 404));
            }
            userDetail = profile;
          }

          const lastMessage = await MessageModel.findOne({
            conversationId: conversation._id,
          }).sort({ createdAt: -1 });

          return {
            ...conversation.toObject(),
            userDetail,
            lastMessage,
          };
        })
      );
      res
        .status(200)
        .json({ success: true, conversations: conversationWithDetail });
    } catch (err: any) {
      return next(new ErrorHandler(err.message, 500));
    }
  }
);

// get all members of a chat
export const getConversationmembers = AsyncErrors(
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const conversationId = req.params.id;
      const conversation = await ConversationModel.findById(conversationId);
      if (!conversation) {
        return next(new ErrorHandler("Conversation cannot be found", 404));
      }
      const conversationMembers = await userModel.find({
        _id: { $in: conversation.participants },
      });
      res.status(200).json({
        success: true,
        conversationMembers,
      });
    } catch (err: any) {
      return next(new ErrorHandler(err.message, 500));
    }
  }
);
