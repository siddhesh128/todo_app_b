import { TodoDbManager } from '../db/db-managers/todo.db-manager';
import { UserAuthManager } from '../db/db-managers/user-auth.db-manager'; 
import { TodoAttributes } from '../types/db-types';
import EmailService from './email.service';

class NotificationService {
  private emailService: EmailService;

  constructor() {
    this.emailService = new EmailService();
  }

  async notifyPendingTasks(): Promise<void> {
    try {
      const users = await UserAuthManager.getAllUsers();
      console.log("Users:", users);
      const now = new Date();

      for (const user of users) {
        console.log("Checking tasks for user:", user.username); 
        const todos: TodoAttributes[] = await TodoDbManager.getTodosByUserId(user.id); 
        console.log("All tasks for user:", user.username, todos); 

        const pendingTasks = todos.filter(todo => !todo.completed && todo.expectedTime && new Date(todo.expectedTime) < now);

        if (pendingTasks.length > 0) {
          console.log("Pending tasks for user:", user.username, pendingTasks); 
          const subject = `Task Reminder`;
          const text = `You have pending tasks:\n\n${pendingTasks.map(task => `- ${task.task} (due on ${task.expectedTime})`).join('\n')}\n\nPlease complete them as soon as possible.`;
          console.log("Sending email to:", user.username); 
          await this.emailService.sendEmail(user.username, subject, text); 
        }
      }
    } catch (error) {
      console.error("Error notifying pending tasks:", error);
    }
  }
}

export default NotificationService;