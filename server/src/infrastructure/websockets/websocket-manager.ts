import { inject, injectable } from "inversify";

import { TYPES } from "#di/types.js";
import { OpenseaEventStream } from "#infrastructure/websockets/marketplaces/opensea/opensea-event-stream.class.js";
import { BinanceEventStream } from "#infrastructure/websockets/marketplaces/binance/binance-event-stream.class.js";
import { container } from "#di/inversify.config.js";
import { Logger } from "#utils/logger.js";


@injectable()
export class WebsocketManager {
	private readonly _binanceMap: Map<string, BinanceEventStream> = new Map();
	private readonly _osMap: Map<string, OpenseaEventStream> = new Map();

	constructor (
		@inject(TYPES.Logger)
		private readonly _logger: Logger
	) {}

	public deleteUserFromBinanceStalking(userId: number, symbol: string): void {
		const socket = this._binanceMap.get(symbol);
		socket?.removeUser(userId);

		if (socket && socket.users.size === 0) {
			this._binanceMap.delete(symbol);
		}
	}

	public deleteUserFromOpenseaStalking(userId: number, slug: string): void {
    const socket = this._osMap.get(slug);
    socket?.removeUser(userId);

    if (socket && socket.users.size === 0) {
      this._osMap.delete(slug);
    }
  }

	public stalkFromOpensea(userId: number, slug: string): void {
		let socket = this._osMap.get(slug);
		if (!socket) {
			try {
				socket = container.get<OpenseaEventStream>(TYPES.OpenseaEventStream);
				socket.setSlug(slug);
			} catch (error) {
				throw error;
			}

			this._osMap.set(slug, socket);
		}

		socket.addUser(userId);
		this._logger.debug(`User <${userId}> added to OpenseaEventStream for collection <${slug}>.`);
	}

	public stalkFromBinance(userId: number, symbol: string): void {
		let socket = this._binanceMap.get(symbol);
		if (!socket) {
			try {
				socket = container.get<BinanceEventStream>(TYPES.BinanceEventStream);
			} catch (error) {
				throw error;
			}

			this._binanceMap.set(symbol, socket);
		}

		socket.addUser(userId);
		this._logger.debug(`User <${userId}> added to BinanceEventStream for token <${symbol}>.`);
		
		try {
			socket.stalk(symbol);
		} catch (error: unknown) {
			throw error;
		}
	}
} 