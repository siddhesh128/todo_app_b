import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import db from "./db/connect-db";
import todosRouter from "./router/todo.router";
import userRouter from "./router/user-auth.router";
import {runPrismaCommands} from '../prisma/prisma-setup';
import './services/schedule';
dotenv.config();

runPrismaCommands();

const app = express();

app.use(cors());
app.use(express.json());
app.use(userRouter);  // Add /auth prefix here
app.use(todosRouter);

db.then(() => {
  const PORT = process.env.PORT || 5000;
  app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
  });
}).catch((err) => {
  console.error("Failed to start the server due to database connection issues", err);
  process.exit(1); 
});