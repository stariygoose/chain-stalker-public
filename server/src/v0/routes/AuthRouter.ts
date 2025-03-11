import { Router } from "express";

import { UserController } from "../controllers/UserController.js";

export const authRouter = Router();

const userController = new UserController();

authRouter.post('/logout', userController.logout as any);

authRouter.get('/login', userController.login as any);
authRouter.get('/refresh', userController.refresh as any);
authRouter.get('/check', userController.checkAuth as any);
