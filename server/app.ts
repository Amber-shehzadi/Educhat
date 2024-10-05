import path from "path";
require("dotenv").config();
import express, { NextFunction, Request, Response } from "express";
import cors from "cors";
import cookieParser from "cookie-parser";
import { ErrorMiddleware } from "./middleware/error";
import userRouter from "./routes/user.route";
import conversationRouter from "./routes/conversation.route";
import messageRouter from "./routes/message.route";
import contactsRouter from "./routes/contacts.route";
import channelRouter from "./routes/channel.route";
import classRouter from "./routes/class.route";
import todoRouter from "./routes/todo.route";
import eventRouter from "./routes/event.route";
import announcementRouter from "./routes/announcement.route";
import notificationRouter from "./routes/notiications.route";

export const app = express();

app.use(cookieParser());
// body parser
app.use(express.json({ limit: "50mb" }));

// cookie parser

// cors => cross origin resource sharing

app.use(
  cors({
    origin: ["http://localhost:3000", "http://localhost:5173"],
    credentials: true,
  })
);

// routes
app.use(
  "/uploads/files",
  express.static(path.join(__dirname, "uploads", "files"))
);
app.use(
  "/api/v1",
  userRouter,
  messageRouter,
  contactsRouter,
  channelRouter,
  classRouter,
  todoRouter,
  eventRouter,
  announcementRouter,
  notificationRouter
);

// testing api
app.get("/test", (req: Request, res: Response, next: NextFunction) => {
  res.status(200).json({
    message: "API is working fine",
  });
});

// unknown routes
app.all("*", (req: Request, res: Response, next: NextFunction) => {
  const err = new Error(`Route ${req.originalUrl} not found`) as any;
  err.statusCode = 404;
  next(err);
});

app.use(ErrorMiddleware);
