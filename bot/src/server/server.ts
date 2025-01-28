import express, {Express, Request, Response} from "express";

import { bot } from "../bot.js"
import { BotMessageService } from "../services/BotMessageService.js";
import { IPing, ICoin, ICollection } from "../types/interfaces.js";

const app: Express = express();
const port = process.env.TG_BOT_PORT ?? 30000;

app.use(express.json());

export async function startBotServer() {
	app.listen(port, () => {
		console.log(`[INFO]: Server bot is running on port ${port}`);
	})
}

app.post("/webhook", (req: Request, res: Response) => {
	const body = req.body;
	bot.processUpdate(body);
	res.sendStatus(200);
})

app.post("/coin_price_changed", (req: Request, res: Response) => {
	const data = req.body as IPing<ICoin>;
	BotMessageService.processCoinPriceChanged(data, bot);
	res.sendStatus(200);
})

app.post("/nft_price_changed", (req: Request, res: Response) => {
	const data = req.body as IPing<ICollection>;
	BotMessageService.processNftPriceChanged(data, bot);
	res.sendStatus(200);
})