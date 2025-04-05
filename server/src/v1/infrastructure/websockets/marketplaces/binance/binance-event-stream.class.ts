import { WebSocket } from "ws";
import { inject, injectable } from "inversify";

import { ITokenEventStream } from "#infrastructure/websockets/interfaces/token-event-stream.interface.js";
import { TYPES } from "#di/types.js";
import { Logger } from "#utils/logger.js";
import { LayerError } from "#infrastructure/errors/index.js";
import { ITokenRepository } from "#core/repositories/token-repository.interface.js";
import { RedisPubSub } from "#infrastructure/lib/redis/index.js";


interface TokenEventMessage {
	symbol: string,
	price: number
}

@injectable()
export class BinanceEventStream implements ITokenEventStream {
	private readonly _wsUrl: string = 'wss://stream.binance.com:9443/ws';
	public readonly client: WebSocket;
	private ticks: number = 0;

	private _symbol: string = "";

	public readonly users: Set<number> = new Set<number>();

	constructor (
		@inject(TYPES.Logger)
		private readonly _logger: Logger,
		@inject(TYPES.TokenRepository)
		private readonly _db: ITokenRepository,
		@inject(TYPES.RedisPubSub)
		private readonly _redisPubSub: RedisPubSub
	) {
		this.client = this.createClient();
		this.processEvents();
	}

	set symbol(symbol: string) {
		this._symbol = symbol;
	}

	public addUser(userId: number): void {
		this.users.add(userId);
	}

	public removeUser(userId: number): void {
		this.users.delete(userId);
	}

	public stalk(symbol: string): void {
		if (!this._symbol) {
			throw new LayerError.SymbolLackError();
		}

		this._symbol = symbol

		const subscribeParams = JSON.stringify({
			method: "SUBSCRIBE",
			params: [`${this._symbol.toLowerCase()}@ticker`],
			id: 1,
		});

		this.client.send(subscribeParams, (err) => {
			if (err) {
				throw new LayerError.SubscribeEventError(err.message);
			}
		});
	}

	private createClient(): WebSocket {
		return new WebSocket(this._wsUrl);
	}

	private processEvents(): void {
		this.client.on('open', () => {
			this._logger.debug(`New websocket connection to Binance.`);
		});

		this.client.on('close', () => {
			this._logger.debug('Websocket connection to Binance was closed.')
		});

		this.client.on("error", (err: Error) => {
			this._logger.error(`BinanceEventStream Error: ${err.message}`);
		})

		this.client.on("message", (msg) => {
			this.ticks++;
			if (this.ticks >= 4) {
				this.ticks = 0;
				return;
			}

			const message = JSON.parse(msg.toString());
			const token: TokenEventMessage = {
				symbol: message.s,
				price: Number(message.c)
			};

			this.handleTokenPriceUpdate(token).catch((err) => {
				this._logger.error(`Unhandled error in handleTokenPriceUpdate: ${err}`);
			});
		})
	}

	private async handleTokenPriceUpdate(token: TokenEventMessage): Promise<void> {
		const { price, symbol } = token;

		const tasks = Array.from(this.users).map(async (userId: number) => {
			try {
				const userTokenSubscription = await this._db.getOneByUserAndToken(userId, symbol);

				if (!userTokenSubscription) {
					this._logger.debug(`No token subscription found for user ${userId}, token ${symbol}`);
					return;
				}

				if (!userTokenSubscription.shouldNotify(price)) {
					return;
				}

				const difference = userTokenSubscription.calculateDifference(price);
				const updated = userTokenSubscription.withUpdatedState(price);

				await Promise.all([
					this._db.updateLastNotifiedPrice(updated.id!, updated.target.lastNotifiedPrice),
					this._redisPubSub.publish(RedisPubSub.UpdatePriceChannel, {
						...updated,
						difference,
					}),
				]);
				
				this._logger.debug(`Updated price of [${this._symbol}] was successfuly saved and published for user <${userId}>`);
				
			} catch (error: unknown) {
				if (error instanceof Error) {
					this._logger.error(
						`Error while processing user ${userId} for token ${symbol}. Reason: ${error.message}`
					);
				}
			}
		});

		await Promise.allSettled(tasks);
	}
}