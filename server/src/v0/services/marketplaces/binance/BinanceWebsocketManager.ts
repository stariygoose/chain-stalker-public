import { DBManager } from "../../../db/DBManager.js";
import { DataBaseError } from "../../../errors/Errors.js";
import { BinanceWebsocket } from "./BinanceWebsocket.js";


export class BinanceWebsocketManager {
	private sockets: Map<string, BinanceWebsocket>;
	
	constructor() {
		this.sockets = new Map<string, BinanceWebsocket>();	
	}

	public async connect(userId: number, symbol: string): Promise<void> {
		try {
			if (this.sockets.has(symbol)) {
				const ws = this.sockets.get(symbol) as BinanceWebsocket;
				ws.addUser(userId);
			} else {
				const ws = new BinanceWebsocket(userId, symbol);
				this.sockets.set(symbol, ws);
			}
		} catch (error: any) {
			if (error instanceof DataBaseError)
				throw error;

			console.error(`[UNEXPECTED ERROR]: An unexpected error occurred while trying to connect to Binance WebSocket.`,{
				userId: userId,
				symbol: symbol,
				error: error.message
			});
			throw new Error(`An unexpected error occurred while trying to connect to Binance WebSocket.`);
		}
	}

	public async initWebsocketsAfterReboot(): Promise<void> {
		try {
			const coinSubscriptions = await new DBManager().getCoinSubscriptions();

			const promises = coinSubscriptions.map(async (sub) => {
				await this.connect(sub.userId, sub.target.symbol);
			});
			
			await Promise.all(promises);
		} catch (error: any) {
			if (error instanceof DataBaseError)
				throw error;

			console.error(`[UNEXPECTED ERROR]: An unexpected error occurred while trying to`+
				` initialize Binance WebSockets after reboot.`, {
					error: error.message
				});
			throw new Error(`An unexpected error occurred while initializing sockets after reboot.`);
		}
	}
}