import { NextFunction, Request, Response } from "express";

import { BotService } from "../services/BotService.js";
import { OpenSea } from "../services/marketplaces/OpenSea.js";
import { BadRequestError } from "../errors/Errors.js";
import { isTargetCoin, isTargetNftCollection } from "../functions/functions.js";
import { BinanceWebsocketManager } from "../services/marketplaces/binance/BinanceWebsocketManager.js";

class BotController {
	private botService: BotService;

	constructor(os: OpenSea, wsm: BinanceWebsocketManager) {
		this.botService = new BotService(os, wsm);
	}

	public findCoin = async (req: Request, res: Response, next: NextFunction): Promise<Response | void> => {
		try {
			const { symbol } = req.params;
			if (!symbol)
				throw new BadRequestError();

			const coin = await this.botService.findCoin(symbol);
			return res.status(200).json(coin);
		} catch (error) {
			next(error);
		}
	}

	public findCollection = async (req: Request, res: Response, next: NextFunction): Promise<Response | void> => {
		try {
			const { chain, address } = req.params;
			if (!chain || !address)
				throw new BadRequestError();

			const collection = await this.botService.findColleciton(chain, address);
			return res.status(200).json(collection);
		} catch (error) {
			next(error)
		}
	}

	public stalk = async (req: Request, res: Response, next: NextFunction): Promise<Response | void> => {
		const { target } = req.params;
		const userState = req.body;
		if (!target)
			throw new BadRequestError();

		try {
			switch (target) {
				case "coin":
					if (isTargetCoin(userState)) {
						await this.botService.stalkCoin(userState);
						return res.status(201).json({ message: `The coin is under stalking.` });
					}
					break;
				case "collection":
					if (isTargetNftCollection(userState)) {
						await this.botService.stalkNft(userState);
						return res.status(201).json({ message: `The collection is under stalking.` });
					}
					break;
				default:
					throw new BadRequestError();
			}
		} catch (error) {
			next(error);
		}
	}
}

export { BotController }
