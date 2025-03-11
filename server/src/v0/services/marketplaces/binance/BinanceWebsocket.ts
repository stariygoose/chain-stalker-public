import { Data, WebSocket } from "ws";
import axios, { AxiosError } from "axios";

import { Channel, ICoin, IUserContext } from "../../../interfaces/interfaces.js";
import { DBManager } from "../../../db/DBManager.js";
import { calculatePercentage } from "../../../functions/functions.js";
import { BotService } from "../../BotService.js";
import { ApiError, DataBaseError, NotFoundError } from "../../../errors/Errors.js";


export class BinanceWebsocket {
	static url_http: string = `https://data-api.binance.vision`;
	static url_ws: string = 'wss://stream.binance.com:9443/ws';

	readonly users: Set<number>;
	readonly symbol: string;

	private ws: WebSocket;
	private db: DBManager

	constructor(userId: number, symbol: string) {
		this.users = new Set<number>();
		this.symbol = symbol;
		
		this.ws = new WebSocket(BinanceWebsocket.url_ws);
		this.db = new DBManager();

		this.processEvents(userId);
	}

	static async getCoin(symbol: string): Promise<ICoin> {
		const headers = {
			"accept": "application/json"
		};

		try {
			const res = await axios.get<ICoin>(`${BinanceWebsocket.url_http}/api/v3/ticker/price` +
				`?symbol=${symbol.toUpperCase()}USDT`, {
				headers: headers
			});
			return res.data;
		} catch (error: any) {
			console.error(`[ERROR]: Failed to fetch coin data from Binance API.`, {
				symbol: symbol.toUpperCase(),
				error: error.message,
			});

			if (error.status === 400)
				throw new NotFoundError(`Invalid token symbol. Can not find token on Binance.`);
			else
				throw new ApiError("Failed to fetch coin data from Binance API.", error.status);
		}
	}

	public addUser(userId: number): void {
		this.users.add(userId);
	}

	public removeUser(userId: number): void {
		this.users.delete(userId);
	}

	private processEvents(userId: number): void {
		this.ws.on('open', () => {
			console.log(`[INFO]: The Binance WebSocket connection was opened for the <${this.symbol}> coin.`);
			try {
				this.sendToBinanceChannel();
				this.addUser(userId);
			} catch (error) {
				throw new Error();
			}
		});

		this.ws.on('message', async (res: Data) => {
			const message = JSON.parse(res.toString());
			const coin: ICoin = {
				symbol: message.s,
				price: +message.c
			}

			this.processCoinMessage(coin);
		});

		this.ws.on('close', (status: number, reason: Buffer) => {
			console.log(`[WEBSOCKET CLOSE]: The Binance WebSocket for the <${this.symbol}> `+
				`coin was closed, reason: ${reason.toString('utf-8')}`);
		});

		this.ws.on('error', (error: Error) => {
			console.error(`[CRITICAL ERROR]: Binance WebSocket error for the <${this.symbol}> coin.`, {
				error: error.message
			});
		});
	}

	private sendToBinanceChannel() {
		const subscribeParams = {
			method: "SUBSCRIBE",
			params: [`${this.symbol.toLowerCase()}@ticker`],
			id: 1,
		};

		this.ws.send(JSON.stringify(subscribeParams), (error: any) => {
			if (error) {
				console.error(`[ERROR] Error while trying to follow to coin stream data.`, {
					symbol: this.symbol.toLowerCase(),
					error: error.messsage
				});
				throw new Error(`Error while trying to follow to coin <${this.symbol.toLowerCase()}> stream data.`);
			}
		});
	}

	private async processCoinMessage(coin: ICoin): Promise<void> {
		try {
			const promises = Array.from(this.users).map(async (userId: number) => {
				const subscriptions = await this.db.getCoinSubscriptions(userId);
				const subscription = subscriptions.find((sub) => sub.target.symbol === coin.symbol && sub.isStalked);
				if (!subscription)
					return ;

				const changedPercentage = calculatePercentage(subscription.target.price, coin.price);
				if (subscription.percentage <= Math.abs(changedPercentage)) {
					const dataToSend: IUserContext<ICoin> = {
						userId: userId,
						target: coin,
						percentage: changedPercentage
					}
					await BotService.sendToTGBot(dataToSend, Channel.COIN_PRICE_CHANGED);

					await this.db.addOrUpdateCoinSubscription({
						userId: userId,
						target: coin,
						percentage: subscription.percentage
					});
				}
			});

			await Promise.all(promises);
		} catch (error: any) {
			if (error instanceof DataBaseError)
				throw error;

			console.error(`[ERROR]: An unexpected error occurred while processing the message from Binance.`, {
				coin: coin,
				error: error.message
			});
			throw new Error("An unexpected error occurred while processing the message.");
		}
	}
}