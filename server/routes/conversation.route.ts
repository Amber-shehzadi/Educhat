import express from "express";
import { isAuthenticated } from "../middleware/auth";
import {
  createConversation,
  getALLPreviousConversations,
  getConversationmembers,
} from "../controllers/conversation.controller";
const conversationRouter = express.Router();

conversationRouter.get(
  "/my-conversations",
  isAuthenticated,
  getALLPreviousConversations
);
conversationRouter.get(
  "/conversation-members/:id",
  isAuthenticated,
  getConversationmembers
);

conversationRouter.post(
  "/create-conversation",
  isAuthenticated,
  createConversation
);

export default conversationRouter;
