import { inject, injectable } from "inversify";
import Redis from "ioredis";
import { AsyncSessionStore } from "telegraf/session";

import { RedisConfig } from "#lib/redis/redis.config.js";
import { TYPES } from "#di/types.js";
import { MySession } from "#context/context.interface.js";


export interface IRedisStore extends AsyncSessionStore<MySession>{
	store: Omit<IRedisStore, 'store'>;

	get(key: string): Promise<MySession | undefined>;
	set(key: string, value: MySession): Promise<void>;
	delete(key: string): Promise<void>;
}

@injectable()
export class RedisStore implements IRedisStore {
	private readonly _store: IRedisStore;
	private readonly _client: Redis.Redis;

	constructor (
		@inject(TYPES.RedisConfig)
		private readonly _redisConfig: RedisConfig
	) {
		this._store = this;
		
		this._client = this._redisConfig.client;
	}

	get store(): IRedisStore {
		return this._store;
	}

	async get(key: string): Promise<MySession | undefined> {
    const data = await this._client.get(key);
    return data ? JSON.parse(data) : undefined;
  }

  async set(key: string, value: MySession): Promise<void> {
    await this._client.set(key, JSON.stringify(value));
  }

  async delete(key: string): Promise<void> {
    await this._client.del(key);
  }
}