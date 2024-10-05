import { NextFunction, Request, Response } from "express";
import { AsyncErrors } from "../middleware/AsyncErrors";
import ErrorHandler from "../utils/ErrorHandler";
import EventModel from "../models/event.model";

// Create a new Event
export const createEvent = AsyncErrors(
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const {
        title,
        start,
        end,
        allDay,
        assignees,
        isVideoMeeting,
        description,
      } = req.body;
      const creator = req.user?._id;

      // Ensure start and end are converted to Date objects
      const startDate = new Date(start);
      const endDate = end ? new Date(end) : undefined;

      // Create a new Event
      const newEvent = await EventModel.create({
        title,
        start: startDate,
        end: endDate,
        allDay,
        assignees: assignees && assignees?.length ? [...assignees] : [creator],
        description,
        isVideoMeeting,
      });

      res.status(201).json({
        status: true,
        event: newEvent,
        message: "Event has been created successfully",
      });
    } catch (err: any) {
      return next(new ErrorHandler(err.message, 500));
    }
  }
);

// Get a specific Event by ID
export const getEvent = AsyncErrors(
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { id } = req.params;
      const event = await EventModel.findById(id).populate("assignees");

      if (!event || !event.isActive) {
        return next(new ErrorHandler("Event not found or inactive", 404));
      }

      res.status(200).json({ status: true, event });
    } catch (err: any) {
      return next(new ErrorHandler(err.message, 500));
    }
  }
);

// Get all Events
export const getAllEvents = AsyncErrors(
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const events = await EventModel.find({ isActive: true })
        .sort({ start: 1 }) // Sort by start date
        .populate("assignees"); // Populate assignees with user details

      res.status(200).json({
        status: true,
        events,
      });
    } catch (err: any) {
      return next(new ErrorHandler(err.message, 500));
    }
  }
);

// Get Events for a specific user
export const getUserEvents = AsyncErrors(
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { startDate, endDate } = req.query;
      const userId = req.user?._id;

      if (!userId) {
        return next(new ErrorHandler("User not authenticated", 401));
      }

      // Convert query parameters to Date objects, if provided
      const start = startDate ? new Date(startDate as string) : undefined;
      const end = endDate ? new Date(endDate as string) : undefined;

      // Build the query object with optional date range filtering
      const query: any = {
        isActive: true,
        //  assignees: userId
      };
      if (start && end) {
        query.start = { $gte: start, $lte: end };
      } else if (start) {
        query.start = { $gte: start };
      } else if (end) {
        query.start = { $lte: end };
      }

      // Fetch the events assigned to the logged-in user and within the date range
      const events = await EventModel.find(query)
        .sort({ start: 1 }) // Sort by start date
        .populate("assignees"); // Populate assignees with user details

      const eventsWithType = events.map((event) => ({
        ...event.toObject(),
        model: "event",
        editable:
          req.user?.role === "admin" || req.user?.role === "coordinator",
      }));
      res.status(200).json({
        status: true,
        events: eventsWithType,
      });
    } catch (err: any) {
      return next(new ErrorHandler(err.message, 500));
    }
  }
);

// Update an Event
export const updateEvent = AsyncErrors(
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { id } = req.params;
      const { title, start, end, allDay, assignees } = req.body;

      // Ensure start and end are converted to Date objects
      const startDate = new Date(start);
      const endDate = end ? new Date(end) : undefined;

      let event = await EventModel.findById(id);

      if (!event || !event.isActive) {
        return next(new ErrorHandler("Event not found or inactive", 404));
      }

      event = await EventModel.findByIdAndUpdate(
        id,
        { title, start: startDate, end: endDate, allDay, assignees },
        { new: true, runValidators: true }
      );

      res.status(200).json({
        status: true,
        event,
        message: "Event has been updated successfully.",
      });
    } catch (err: any) {
      return next(new ErrorHandler(err.message, 500));
    }
  }
);

export const updateDragResizeEvent = AsyncErrors(
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { id } = req.params;
      const { start, end, allDay } = req.body;

      // Ensure start and end are converted to Date objects
      const startDate = new Date(start);
      const endDate = end ? new Date(end) : undefined;

      let event = await EventModel.findById(id);

      if (!event || !event.isActive) {
        return next(new ErrorHandler("Event not found or inactive", 404));
      }

      event = await EventModel.findByIdAndUpdate(
        id,
        { start: startDate, end: endDate, allDay },
        { new: true, runValidators: true }
      );

      res.status(200).json({
        status: true,
        event,
        message: "Event has been updated successfully.",
      });
    } catch (err: any) {
      return next(new ErrorHandler(err.message, 500));
    }
  }
);

// Delete an Event (sets isActive to false)
export const deleteEvent = AsyncErrors(
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { id } = req.params;

      const event = await EventModel.findById(id);

      if (!event || !event.isActive) {
        return next(
          new ErrorHandler("Event not found or already inactive", 404)
        );
      }

      await EventModel.findByIdAndUpdate(
        id,
        { isActive: false },
        { new: true, runValidators: true }
      );

      res
        .status(200)
        .json({ status: true, message: "Event deleted successfully" });
    } catch (err: any) {
      return next(new ErrorHandler(err.message, 500));
    }
  }
);
