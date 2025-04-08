import { inject, injectable } from "inversify";

import { TYPES } from "#di/types.js";
import { IPubSub, RedisClient } from "#infrastructure/lib/redis/index.js";


@injectable()
export class RedisPubSub implements IPubSub {
	public static UpdatePriceChannel: string = 'price_update';

	constructor (
		@inject(TYPES.RedisClient)
		private readonly _redis: RedisClient
	) {}

	public async publish(channel: string, payload: any): Promise<void> {
		await this._redis.client.publish(channel, JSON.stringify(payload));
	}
}