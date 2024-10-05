import express from "express";
import multer from "multer";
import { isAuthenticated } from "../middleware/auth";
import {
  getMessagesfromChat,
  openAIChatMessages,
  uploadFile,
} from "../controllers/message.controller";

const messageRouter = express.Router();

const upload = multer({ dest: "uploads/files" });
messageRouter.post("/get-messages", isAuthenticated, getMessagesfromChat);
messageRouter.post(
  "/upload-file",
  isAuthenticated,
  upload.single("file"),
  uploadFile
);

messageRouter.post("/chatgpt-message", openAIChatMessages);



export default messageRouter;
