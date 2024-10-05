// routes/announcementRoutes.ts
import express from "express";
import {
  createAnnouncement,
  deleteAnnouncement,
  getPaginatedAnnouncements,
  updateAnnouncement,
} from "../controllers/announcement.controller";
import { authorizedRole, isAuthenticated } from "../middleware/auth";

const announcementRouter = express.Router();

announcementRouter.post(
  "/announcements",
  isAuthenticated,
  authorizedRole("coordinator", "admin"),
  createAnnouncement
);
announcementRouter.get(
  "/announcements",
  isAuthenticated,
  getPaginatedAnnouncements
);
announcementRouter.put(
  "/announcements/:id",
  isAuthenticated,
  authorizedRole("coordinator", "admin"),
  updateAnnouncement
);
announcementRouter.delete(
  "/announcements/:id",
  isAuthenticated,
  authorizedRole("coordinator", "admin"),
  deleteAnnouncement
);

export default announcementRouter;
