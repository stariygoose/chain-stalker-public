import Redis from "ioredis";
import { inject, injectable } from "inversify";

import { ILogger } from "#config/index.js";
import { TYPES } from "#di/types.js";
import { RedisConfig } from "#lib/redis/redis.config.js";
import { container } from "#di/containers.js";
import { IBot } from "#bot/bot.js";
import { ChainStalkerMessage } from "#ui/index.js";


export interface IRedisPubSub {
	connect(): Promise<void>;
	disconnect(): Promise<void>;
}

export interface TokenAlert {
	id: string;
	userId: number;
	target: {
		type: 'token';
		symbol: string;
		lastNotifiedPrice: number;
	};
	strategy: {
		type: 'percentage' | 'absolute';
		threshold: number;
	};
	isActive: boolean;
	difference: number;
}

export interface NftAlert {
	id: string;
	userId: number;
	target: {
		type: 'nft';
		name: string;
		slug: string;
		chain: string;
		lastNotifiedPrice: number;
		symbol: string;
	};
	strategy: {
		type: 'percentage' | 'absolute';
		threshold: number;
	};
	isActive: boolean;
	difference: number;
}

type Alert = NftAlert | TokenAlert;

@injectable()
export class RedisPubSub implements IRedisPubSub {
	public static readonly channel: string = 'price_update';
	private readonly _client: Redis.Redis;
	private readonly _redisConfig: RedisConfig

	constructor(
		@inject(TYPES.Logger)
		private readonly _logger: ILogger,
		@inject(TYPES.Bot)
		private readonly _bot: IBot
	) {
		this._redisConfig = container.get<RedisConfig>(TYPES.RedisConfig);

		this._client = this._redisConfig.client;
	}

	public async connect(): Promise<void> {
		try {
			this._logger.debug(`[Redis Pub Sub] Subscribing to Redis channel: ${RedisPubSub.channel}`);
	
			await this._client.subscribe(RedisPubSub.channel);

			this._client.on("message", async (channel, message) => {
				this._logger.debug(`[Redis PubSub] Received on <${channel}>: ${message}`);

				try {
					const msg = JSON.parse(message);
					await this.processAlert(msg);
				} catch (error: unknown) {
					this._logger.error(`Unexpected error while processing message from PubSub: ${(error as Error).message}`)
				}
				
			});
	
			this._logger.info(`Subscribed to Redis channel: ${RedisPubSub.channel}`);
		} catch (error) {
			this._logger.error(`[Redis PubSub] Error: ${error}`);
		}
	}

	public async disconnect(): Promise<void> {
    await this._client.unsubscribe(RedisPubSub.channel);
    await this._client.quit();
  }

	private async processAlert(message: Alert): Promise<void> {
		const { type } = message.target;

		switch (type) {
			case "nft":
				await this.processNftAlert(message as NftAlert);
				break;
			case "token":
				await this.processTokenAlert(message as TokenAlert);
				break;
			default:
				this._logger.error(`[Redis PubSub] Unknown type of Alert Message: ${type}`);
				break;
		}
	}

	private async processTokenAlert(msg: TokenAlert): Promise<void> {
		const { userId, target, strategy, difference } = msg;

		const message = ChainStalkerMessage.SMS.TOKEN_ALERT(
			target,
			strategy,
			difference
		);

		await this._bot.sendMessageTo(
			userId,
			message,
			{
				parse_mode: "HTML"
			}
		);
	}

	private async processNftAlert(msg: NftAlert): Promise<void> {
		const { userId, target, strategy, difference } = msg;

		const message = ChainStalkerMessage.SMS.NFT_ALERT(
			target,
			strategy,
			difference
		);

		await this._bot.sendMessageTo(
			userId,
			message,
			{
				parse_mode: "HTML"
			}
		);
	}
}