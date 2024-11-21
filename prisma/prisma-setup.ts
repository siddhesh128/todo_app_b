import { execSync } from 'child_process';
//import { DATABASE_CONNECTION_URL } from '../prisma.config';


//process.env.DATABASE_CONNECTION_URL = DATABASE_CONNECTION_URL;

// Function to run Prisma commands
export  const runPrismaCommands = () => {
  try {
    execSync('npx prisma generate', { stdio: 'inherit' });
  } catch (error) {
    console.error("Failed to run Prisma commands", error);
    process.exit(1);
  }
};
