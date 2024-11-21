import { Router } from "express";
import { AuthMiddleware } from "../middleware/auth.middlewares";
import TodoController from "../controller/todo.controller";

const todosRouter = Router();

// Todo Routes
todosRouter.post("/todos", AuthMiddleware.authenticateUser, TodoController.addTodo);
todosRouter.get("/todos", AuthMiddleware.authenticateUser, TodoController.getTodos);
todosRouter.put("/todos/:id", AuthMiddleware.authenticateUser, TodoController.updateTodo);
todosRouter.delete("/todos/:id", AuthMiddleware.authenticateUser, TodoController.deleteTodo);
todosRouter.put("/todos/toggle/:id",AuthMiddleware.authenticateUser,TodoController.toggleComplete);

export default todosRouter;
