import express from "express";
import { isAuthenticated } from "../middleware/auth";
import { getAllNotifications } from "../controllers/notifications.controller";

const notificationRouter = express.Router();

notificationRouter.get(
  "/get-user-notifications",
  isAuthenticated,
  getAllNotifications
);

export default notificationRouter;
