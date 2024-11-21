import { PrismaAdapter } from "../mssql/prisma.adapter";
import { TodoAttributes } from "../../types/db-types";

class TodoDbManager {
  private static adapter = PrismaAdapter.getInstance();

  public static async createTodo(userId: number, task: string, expectedTime?: string, taskImage?: string): Promise<TodoAttributes> {
    try {
      const newTodo: Partial<TodoAttributes> = { userId, task, completed: false };
      if (expectedTime !== undefined) {
        newTodo.expectedTime = new Date(expectedTime); 
      }
      if (taskImage !== undefined) {
        newTodo.taskImage = taskImage; 
      }
      const createdTodo = await this.adapter.create('todo', newTodo);
      return createdTodo;
    } catch (error) {
      console.error("Error creating todo:", error);
      throw new Error("Error creating todo");
    }
  }
  
  // Get Todos by User ID
  public static async getTodosByUserId(userId: number): Promise<TodoAttributes[]> {
    try {
      const todosList = await this.adapter.findAll('todo', { userId: userId });
      return todosList as TodoAttributes[];
    } catch (error) {
      console.error("Error fetching todos:", error);
      throw error;
    }
  }

  // Find Todo by ID and User ID (for Toggle and Update)
  public static async findTodoByIdAndUserId(todoId: number, userId: number): Promise<TodoAttributes | null> {
    try {
      const todo = await this.adapter.findOne('todo', { id: todoId, userId: userId });
      return todo as TodoAttributes | null;
    } catch (error) {
      console.error("Error finding todo:", error);
      throw error;
    }
  }

  // Toggle Todo Completion Status
  public static async updateTodoCompletionStatus(todoId: number, userId: number, completed: boolean): Promise<boolean> {
    try {
      await this.adapter.update('todo', { completed }, { id: todoId, userId: userId });
      return true;
    } catch (error) {
      console.error("Error updating todo completion status:", error);
      return false;
    }
  }

  // Update Todo Task with optional taskImage
  public static async updateTodoTask(todoId: number, userId: number, task: string, taskImage?: string, expectedTime?: string): Promise<boolean> {
    try {
      const updateData: Partial<TodoAttributes> = { task };
      if (taskImage !== undefined) {
        updateData.taskImage = taskImage;
      }
      if (expectedTime !== undefined) {
        updateData.expectedTime = new Date(expectedTime); 
      }
  
      await this.adapter.update('todo', updateData, { id: todoId, userId: userId });
      return true;
    } catch (error) {
      console.error("Error updating todo task:", error);
      return false;
    }
  }

  // Delete Todo
  public static async deleteTodoById(id: number, userId: number): Promise<boolean> {
    try {
      await this.adapter.destroy('todo', { id, userId });
      return true;
    } catch (error) {
      console.error("Error deleting todo:", error);
      return false;
    }
  }
  public static async getAllTodos(): Promise<TodoAttributes[]> {
    try {
      const todos = await this.adapter.findAll('todo', {});
      return todos;
    } catch (error) {
      console.error("Error fetching all todos:", error);
      throw new Error("Error fetching all todos");
    }
  }
}

export { TodoDbManager };
