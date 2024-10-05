import express from "express";

import { authorizedRole, isAuthenticated } from "../middleware/auth";
import {
  createEvent,
  deleteEvent,
  getUserEvents,
  updateDragResizeEvent,
  updateEvent,
} from "../controllers/event.controller";

const eventRouter = express.Router();

eventRouter.post("/create-event", isAuthenticated, createEvent);
eventRouter.post("/user-events", isAuthenticated, getUserEvents);
eventRouter.put("/event/:id", isAuthenticated, updateEvent);
eventRouter.put("/dreg-event/:id", isAuthenticated, updateDragResizeEvent);
eventRouter.delete("/delete-event/:id", isAuthenticated, deleteEvent);

export default eventRouter;
