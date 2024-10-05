import express from "express";
import { isAuthenticated } from "../middleware/auth";
import {
  createChannel,
  getChannelMessages,
  getChannels,
} from "../controllers/channel.controller";

const channelRouter = express.Router();

channelRouter.post("/create-channel", isAuthenticated, createChannel);
channelRouter.get("/get-user-channel", isAuthenticated, getChannels);
channelRouter.get(
  "/get-channel-messages/:channelId",
  isAuthenticated,
  getChannelMessages
);

export default channelRouter;
