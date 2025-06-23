import { TYPES } from "#di/types.js";
import { ICache, RedisClient } from "#infrastructure/lib/redis/index.js";
import { inject, injectable } from "inversify";

@injectable()
export class RedisCache implements ICache {
  constructor(
    @inject(TYPES.RedisClient)
    private readonly _redis: RedisClient,
  ) {}

  async get<T = string>(key: string): Promise<T | null> {
    const value = await this._redis.client.get(key);
    return value ? (JSON.parse(value) as T) : null;
  }

  async set<T = string>(key: string, value: T, ttl = 120): Promise<void> {
    await this._redis.client.set(key, JSON.stringify(value), "EX", ttl);
  }

  async setIfNotExists(
    key: string,
    value: string,
    ttl: number,
  ): Promise<boolean> {
    const result = await this._redis.client.set(key, value, "EX", ttl, "NX");
    return result === "OK";
  }
}
