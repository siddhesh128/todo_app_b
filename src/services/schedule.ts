import cron from 'node-cron';
import NotificationService from './notification.service';

const notificationService = new NotificationService();

// Schedule the task to run every 12 hours
cron.schedule('0 */12 * * *', () => {
  console.log('Running scheduled task to notify pending tasks');
  notificationService.notifyPendingTasks();
});

// Keep the process running
console.log('Scheduler started. The task will run every 12 hours.');