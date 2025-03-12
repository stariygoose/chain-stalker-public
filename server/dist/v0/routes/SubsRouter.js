import { Router } from "express";
import { SubsController } from "../controllers/SubsController.js";
const subsRouter = Router();
const subsController = new SubsController();
subsRouter.get("/:userId", subsController.getSubscriptionsByUser);
subsRouter.delete("/delete/:userId", subsController.deleteUser);
export { subsRouter };
