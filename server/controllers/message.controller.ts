import { NextFunction, Request, Response } from "express";
import { AsyncErrors } from "../middleware/AsyncErrors";
import ErrorHandler from "../utils/ErrorHandler";
import userModel from "../models/user.model";
import Message from "../models/messages.model";
import { mkdirSync, renameSync } from "fs";
import OpenAI from "openai";

require("dotenv").config();

const openai = new OpenAI({
  apiKey: process.env.OPEN_AI_SECRET,
});
export const getMessagesfromChat = AsyncErrors(
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const sender = req.user?._id;
      const { recipient } = req.body;

      if (!sender || !recipient) {
        return next(new ErrorHandler("Both user IDs are required", 400));
      }
      const messages = await Message.find({
        $or: [
          { sender, recipient },
          { recipient: sender, sender: recipient },
        ],
      }).sort({ createdAt: 1 });
      res.status(200).json({ messages });
    } catch (err: any) {
      return next(new ErrorHandler(err.message, 500));
    }
  }
);

export const uploadFile = AsyncErrors(
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      if (!req.file) {
        return next(new ErrorHandler("File is required", 400));
      }

      const date = Date.now();
      let fileDir = `uploads/files/${date}`;
      let fileName = `${fileDir}/${req.file.originalname}`;

      mkdirSync(fileDir, { recursive: true });
      renameSync(req.file.path, fileName);
      res.status(200).json({ filePath: fileName });
    } catch (err: any) {
      return next(new ErrorHandler(err.message, 500));
    }
  }
);

export const openAIChatMessages = AsyncErrors(
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { content } = req.body;
      const chatResponse = await openai.chat.completions.create({
        model: "gpt-3.5-turbo",
        messages: [
          {
            role: "system",
            content:
              "You are an assistant in a chat helping users to get any information related study ,chores and other activities with 1-sentence response ",
          },
          { role: "user", content },
        ],
      });

      const messageContent = chatResponse.choices[0].message.content;
      return res.status(200).json({ messageContent, success: true });
    } catch (err: any) {
      return next(new ErrorHandler(err.message, 500));
    }
  }
);