import axios from "axios";

import { DBManager } from "../db/DBManager.js";
import {
	ICoin,
	ICollection,
	IUserContext
} from "../interfaces/interfaces.js";
import { OpenSea } from "./marketplaces/OpenSea.js";
import { ApiError, DataBaseError, NotFoundError } from "../errors/Errors.js";
import { BinanceWebsocketManager } from "./marketplaces/binance/BinanceWebsocketManager.js";
import { BinanceWebsocket } from "./marketplaces/binance/BinanceWebsocket.js";

class BotService {
	private openSea: OpenSea;
	private wsManager: BinanceWebsocketManager;
	private db: DBManager;

	constructor(os: OpenSea, wsManager: BinanceWebsocketManager) {
		this.openSea = os;
		this.wsManager = wsManager;
		this.db = new DBManager();
	}

	public static async sendToTGBot(state: IUserContext<ICoin | ICollection>, channel: string)
		: Promise<void> {
		try {
			await axios.post(`${process.env.SERVERBOT_URL}/${channel}`, state);
			console.log(`[INFO]: Successfully sent data to bot on channel ${channel}.`);
		} catch (error: any) {
			console.error(`[ERROR]: Failed to send data to bot.`, {
				state: state,
				channel: channel,
				error: error.message
			});
			throw new Error("Failed to send message to bot.");
		}
	}

	/* 
	 * By address
	*/
	public async findColleciton(network: string, address: string)
		: Promise<ICollection> {
		try {
			const collection = await this.openSea.getCollection(network, address);
			const slug = collection.collection;

			const floorPrice = await this.openSea.getFloorPrice(slug);

			const res: ICollection = {
				...collection, ...floorPrice
			}
			return res;
		} catch (error: any) {
			console.error(`[ERROR]: Error while fetching collection ${address} on network ${network}.`, {
				error: error.message
			});
			throw new Error(`Error fetching collection ${address} on network ${network}: ${error.message}`);
		}
	}

	/*
	 * By Symbol
	*/
	public async findCoin(symbol: string): Promise<ICoin> {
		try {
			return await BinanceWebsocket.getCoin(symbol);
		} catch (error: any) {
			if (error instanceof ApiError)
				throw error;
			throw new Error("Unexpected error.");
		}
	}

	public async stalkCoin(data: IUserContext<ICoin>): Promise<void> {
		try {
			await this.db.addOrUpdateCoinSubscription(data);
			await this.wsManager.connect(data.userId, data.target.symbol);
		} catch (error: any) {
			if (error instanceof DataBaseError)
				throw error;
			console.error(`[ERROR]: Error while stalking coin ${data.target.symbol} for user ${data.userId}.`, {
				data: data,
				error: error.message
			});
			throw new Error(`Error stalking coin ${data.target.symbol}: ${error.message}`);
		}
	}

	public async stalkNft(data: IUserContext<ICollection>): Promise<void> {
		try {
			const subscription = await this.db.addSubAndCollection(data);
			const { userId, percentage, target } = subscription;

			this.openSea.stalkCollection(userId, target.collection, percentage);
		} catch (error: any) {
			if ((error instanceof DataBaseError) || (error instanceof NotFoundError))
				throw error;

			console.error(`[ERROR]: Unknown error occurred while stalking NFT collection.`, {
				data: data,
				error: error.message
			});
			throw new Error("An unknown error occurred while stalking the NFT collection.");
		}
	}
}

export { BotService };
