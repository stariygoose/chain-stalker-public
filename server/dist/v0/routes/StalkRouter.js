import { Router } from 'express';
import { BotController } from '../controllers/BotController.js';
export function initStalkRouter(os, wsm) {
    const stalkRouter = Router();
    const botController = new BotController(os, wsm);
    stalkRouter.get("/collections/:chain/:address", botController.findCollection);
    stalkRouter.get("/coins/:symbol", botController.findCoin);
    stalkRouter.post("/stalk/:target", botController.stalk);
    return stalkRouter;
}
