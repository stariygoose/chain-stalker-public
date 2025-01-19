import { Router } from 'express';
import { BotController } from '../controllers/BotController.js';
import { OpenSea } from '../services/marketplaces/OpenSea.js';
import { BinanceWebsocketManager } from '../services/marketplaces/binance/BinanceWebsocketManager.js';

export function initStalkRouter(os: OpenSea, wsm: BinanceWebsocketManager)
    : Router {
    const stalkRouter = Router();

    const botController = new BotController(os, wsm);

    stalkRouter.get("/collections/:chain/:address", botController.findCollection as any);
    stalkRouter.get("/coins/:symbol", botController.findCoin as any);

    stalkRouter.post("/stalk/:target", botController.stalk as any);

    return stalkRouter;
}
