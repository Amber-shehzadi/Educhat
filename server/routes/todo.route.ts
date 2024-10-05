import express from "express";
import {
  addComment,
  createTodo,
  deleteTodo,
  getAllTodos,
  updateDragResizeTodo,
  updateTodo,
  updateTodoStatus,
  userCalendarTodos,
  userTodos,
} from "../controllers/todos.controller";
import { authorizedRole, isAuthenticated } from "../middleware/auth";

const todoRouter = express.Router();

todoRouter.post("/create-todo", isAuthenticated, createTodo);
todoRouter.get(
  "/get-all-todos",
  isAuthenticated,
  authorizedRole("admin", "coordinator"),
  getAllTodos
);
todoRouter.post("/get-calendar-todos", isAuthenticated, userCalendarTodos);
todoRouter.get("/get-user-todos", isAuthenticated, userTodos);
todoRouter.put("/update-todo-status/:id", isAuthenticated, updateTodoStatus);
todoRouter.put("/update-todo/:id", isAuthenticated, updateTodo);
todoRouter.delete("/delete-todo/:id", isAuthenticated, deleteTodo);
todoRouter.put("/add-comment/:id", isAuthenticated, addComment);
todoRouter.put("/drag-todo/:id", isAuthenticated, updateDragResizeTodo);

export default todoRouter;
