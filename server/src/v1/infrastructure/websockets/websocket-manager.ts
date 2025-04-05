import { inject, injectable } from "inversify";

import { TYPES } from "#di/types.js";
import { OpenseaEventStream } from "#infrastructure/websockets/marketplaces/opensea/opensea-event-stream.class.js";
import { BinanceEventStream } from "#infrastructure/websockets/marketplaces/binance/binance-event-stream.class.js";
import { container } from "#di/inversify.config.js";
import { Logger } from "#utils/logger.js";


@injectable()
export class WebsocketManager {
	private readonly _binanceMap: Map<string, BinanceEventStream> = new Map();

	constructor (
		@inject(TYPES.OpenseaEventStream)
		private readonly _os: OpenseaEventStream,
		@inject(TYPES.Logger)
		private readonly _logger: Logger
	) {}

	public stalkFromOpensea(userId: number, slug: string): void {
		try {
			this._os.stalk(userId, slug);
		} catch (error: unknown) {
			throw error;
		}
	}

	public stalkFromBinance(userId: number, symbol: string): void {
		let socket = this._binanceMap.get(symbol);
		if (!socket) {
			socket = container.get<BinanceEventStream>(TYPES.BinanceEventStream);
			this._binanceMap.set(symbol, socket);
		}

		socket.addUser(userId);
		this._logger.debug(`User <${userId}> added to BinanceEventStream for symbol <${symbol}>.`);
		
		try {
			socket.stalk(symbol);
		} catch (error: unknown) {
			throw error;
		}
	}
} 