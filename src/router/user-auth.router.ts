import { Router } from "express";
import UserAuthController from "../controller/user-auth.controller";
const userRouter = Router();

// Route for user registration
userRouter.post("/register",UserAuthController.registerUser);

// Route for user login
userRouter.post("/login", UserAuthController.loginUser);
userRouter.get('/verify/:token', UserAuthController.verifyEmail);  // Removed extra 'auth' prefix

export default userRouter;
