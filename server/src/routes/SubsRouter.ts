import { Router } from "express";

import { SubsController } from "../controllers/SubsController.js";

const subsRouter = Router();
const subsController = new SubsController();

subsRouter.get("/subscriptions/:userId", subsController.getSubscriptionsByUser as any);


export { subsRouter }