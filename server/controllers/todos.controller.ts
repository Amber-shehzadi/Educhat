import { NextFunction, Request, Response } from "express";
import { AsyncErrors } from "../middleware/AsyncErrors";
import ErrorHandler from "../utils/ErrorHandler";
import TodoModel from "../models/todolist.model";
import userModel from "../models/user.model";

// Create a new ToDo item
export const createTodo = AsyncErrors(
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { title, description, startDate, endDate, assignedUsers } =
        req.body;

      // Ensure startDate and endDate are converted to Date objects
      const start = new Date(startDate);
      const end = new Date(endDate);

      // Get the ID of the user creating the todo
      const creator = req.user?._id;

      // Create a new Todo item
      const newTodo = await TodoModel.create({
        title,
        description,
        startDate: start,
        endDate: end,
        assignedUsers:
          assignedUsers && assignedUsers?.length
            ? [...assignedUsers]
            : [creator],
        comments: [],
      });

      res.status(201).json({
        status: true,
        todo: newTodo,
        message: "ToDo has been created successfully",
      });
    } catch (err: any) {
      return next(new ErrorHandler(err.message, 500));
    }
  }
);

// Get a specific ToDo by ID
export const getTodo = AsyncErrors(
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { id } = req.params;
      const todo = await TodoModel.findById(id);

      if (!todo) {
        return next(new ErrorHandler("ToDo not found", 404));
      }

      res.status(200).json({ status: true, todo });
    } catch (err: any) {
      return next(new ErrorHandler(err.message, 500));
    }
  }
);

// Get all ToDos for a specific user
export const getAllTodos = AsyncErrors(
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      // Fetch all todos and populate assignedUsers with user details
      const todos = await TodoModel.find({})
        .sort({ createdAt: -1 })
        .populate({
          path: "assignedUsers",
          select: "name email role avatar",
        })
        .populate({
          path: "comments.user",
          select: "name email role avatar",
        });

      res.status(200).json({
        status: true,
        todos,
      });
    } catch (err: any) {
      return next(new ErrorHandler(err.message, 500));
    }
  }
);


export const userCalendarTodos = AsyncErrors(
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { start, end } = req.body;
      const userId = req.user?._id;

      // Convert query parameters to Date objects, if provided
      const startDate = start ? new Date(start as string) : undefined;
      const endDate = end ? new Date(end as string) : undefined;

      // Build the query object with optional date range filtering
      const query: any = {
        assignedUsers: userId,
        isActive: true,
      };
      if (startDate && endDate) {
        query.startDate = { $gte: startDate, $lte: endDate };
      } else if (startDate) {
        query.startDate = { $gte: startDate };
      } else if (endDate) {
        query.startDate = { $lte: endDate };
      }

      // Fetch todos assigned to the user and within the date range
      const todos = await TodoModel.find(query)
        .sort({ startDate: 1 }) // Sort by start date
        .populate({
          path: "assignedUsers",
          select: "name email role avatar",
        })
        .populate({
          path: "comments.user",
          select: "name email role avatar",
        });

      // Map todos to include `start` and `end` fields
      const todosWithStartEnd = todos.map((todo) => ({
        ...todo.toObject(),
        start: todo.startDate,
        end: todo.endDate,
        model: "todo",
      }));

      res.status(200).json({
        status: true,
        todos: todosWithStartEnd,
      });
    } catch (err: any) {
      return next(new ErrorHandler(err.message, 500));
    }
  }
);

export const userTodos = AsyncErrors(
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const userId = req.user?._id;

      // Fetch todos assigned to the user
      const todos = await TodoModel.find({
        assignedUsers: userId,
        isActive: true,
      })
        .sort({ createdAt: -1 })
        .populate({
          path: "assignedUsers",
          select: "name email role avatar",
        })
        .populate({
          path: "comments.user",
          select: "name email role avatar",
        })
        .sort({ createdAt: -1 });
      const todosWithType = todos.map((todo) => ({
        ...todo.toObject(),
        model: "todo",
      }));
      res.status(200).json({
        status: true,
        todos: todosWithType,
      });
    } catch (err: any) {
      return next(new ErrorHandler(err.message, 500));
    }
  }
);

// Update a ToDo item
export const updateTodoStatus = AsyncErrors(
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { id } = req.params;
      const { status } = req.body;

      let todo = await TodoModel.findById(id);

      if (!todo) {
        return next(new ErrorHandler("ToDo not found", 404));
      }

      todo = await TodoModel.findByIdAndUpdate(
        id,
        { status },
        { new: true, runValidators: true }
      );

      res.status(200).json({ status: true, todo });
    } catch (err: any) {
      return next(new ErrorHandler(err.message, 500));
    }
  }
);

export const updateDragResizeTodo = AsyncErrors(
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { id } = req.params;
      const { start, end } = req.body;

      // Ensure start and end are converted to Date objects
      const startDate = new Date(start);
      const endDate = end ? new Date(end) : undefined;

      let todo = await TodoModel.findById(id);

      if (!todo || !todo.isActive) {
        return next(new ErrorHandler("Todo not found or inactive", 404));
      }

      todo = await TodoModel.findByIdAndUpdate(
        id,
        { startDate: startDate, endDate: endDate },
        { new: true, runValidators: true }
      );

      res.status(200).json({
        status: true,
        todo,
        message: "Todo has been updated successfully.",
      });
    } catch (err: any) {
      return next(new ErrorHandler(err.message, 500));
    }
  }
);

export const updateTodo = AsyncErrors(
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { id } = req.params;
      const { title, description, startDate, endDate } = req.body;
      const start = new Date(startDate);
      const end = new Date(endDate);
      let todo = await TodoModel.findById(id);

      if (!todo) {
        return next(new ErrorHandler("ToDo not found", 404));
      }

      todo = await TodoModel.findByIdAndUpdate(
        id,
        { title, description, startDate: start, endDate: end },
        { new: true, runValidators: true }
      );

      res.status(200).json({
        status: true,
        todo,
        message: "Todo has been updated successfully.",
      });
    } catch (err: any) {
      return next(new ErrorHandler(err.message, 500));
    }
  }
);

// Delete a ToDo item
export const deleteTodo = AsyncErrors(
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { id } = req.params;

      const todo = await TodoModel.findById(id);

      if (!todo) {
        return next(new ErrorHandler("ToDo not found", 404));
      }

      await TodoModel.findByIdAndUpdate(
        id,
        { isActive: false },
        { new: true, runValidators: true }
      );

      res
        .status(200)
        .json({ status: true, message: "ToDo deleted successfully" });
    } catch (err: any) {
      return next(new ErrorHandler(err.message, 500));
    }
  }
);

// Add a comment to a ToDo item
export const addComment = AsyncErrors(
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { id } = req.params;
      const { commentText }: { commentText: string } = req.body;
      const user = req.user?._id;

      const todo = await TodoModel.findById(id);

      if (!todo) {
        return next(new ErrorHandler("ToDo not found", 404));
      }

      const comment = {
        commentText,
        user,
      };

      // @ts-expect-error object
      todo.comments.push(comment);

      await todo.save();

      res
        .status(200)
        .json({ status: true, comments: todo?.comments.reverse() });
    } catch (err: any) {
      return next(new ErrorHandler(err.message, 500));
    }
  }
);


