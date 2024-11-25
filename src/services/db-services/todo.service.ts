import { TodoDbManager } from "../../db/db-managers/todo.db-manager";
import { TodoAttributes } from "../../types/db-types";

class TodoServices {
//ADDING TODO
  public static async addTodo(userId: number, task: string, expectedTime?: string, taskImage?: string): Promise<TodoAttributes> {
    const newTodo = await TodoDbManager.createTodo(userId, task, expectedTime, taskImage);
    return newTodo; 
  }
//delete todo
  public static async deleteTodo(id: number, userId: number): Promise<boolean> {
    const result = await TodoDbManager.deleteTodoById(id, userId);
    return result; 
  }
//get all todos
  public static async getTodos(userId: number): Promise<TodoAttributes[]> {
    return await TodoDbManager.getTodosByUserId(userId);
  }
//!Toggle complete
  public static async toggleTodoCompletion(todoId: number, userId: number): Promise<TodoAttributes | null> {
    const todo = await TodoDbManager.findTodoByIdAndUserId(todoId, userId);

    if (!todo) return null;

    const updatedStatus = !todo.completed;
    const updateSuccess = await TodoDbManager.updateTodoCompletionStatus(todoId, userId, updatedStatus);

    if (!updateSuccess) return null;

    const updatedTodo = await TodoDbManager.findTodoByIdAndUserId(todoId, userId);
    return updatedTodo || null;
  }
//update Todo
  public static async updateTodoTask(todoId: number, userId: number, task: string, taskImage?: string, expectedTime?: string): Promise<TodoAttributes | null> {
    const todo = await TodoDbManager.findTodoByIdAndUserId(todoId, userId);
  
    if (!todo) return null;
  
    const updateSuccess = await TodoDbManager.updateTodoTask(todoId, userId, task, taskImage, expectedTime);
    if (!updateSuccess) return null;
  
    const updatedTodo = await TodoDbManager.findTodoByIdAndUserId(todoId, userId);
    return updatedTodo || null;
  }
}

export { TodoServices };
