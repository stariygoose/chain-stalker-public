import { Router } from "express";
import { UserController } from "../controllers/UserController.js";
export const authRouter = Router();
const userController = new UserController();
authRouter.post('/logout', userController.logout);
authRouter.get('/login', userController.login);
authRouter.get('/refresh', userController.refresh);
authRouter.get('/check', userController.checkAuth);
