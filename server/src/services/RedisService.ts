import Redis from "ioredis";
import { ICoin, ISubscription } from "../interfaces/interfaces.js";


export class RedisService {
	private redis: Redis;
	
	constructor() {
		this.redis = new Redis({
			host: process.env.REDIS_HOST ?? `redis`,
			port: process.env.REDIS_PORT ? +process.env.REDIS_PORT : 6379,
			password: process.env.REDIS_PASSWORD,
			db: 0
		});

		this.redis.on("connect", () => {
			console.log(`[INFO]: Successfully connected to Redis on port ${process.env.REDIS_PORT ?? 6379}.`);
		});
	}

	public async getSubscriptionsByCoinSymbol(
		coin: ICoin,
		getSubscriptionsByCoinSymbol: (symbol: string) => Promise<Array<ISubscription<ICoin>>>
	): Promise<Array<ISubscription<ICoin>>> {
		try {
			const key = `users:${coin.symbol}`;
			const cachedData = await this.redis.get(key);

			if (cachedData) {
				console.log(`[REDIS INFO]: Cache hit for key "${key}".`);
				return JSON.parse(cachedData) as Array<ISubscription<ICoin>>;
			}

			console.log(`[REDIS INFO]: Cache miss for key "${key}". Fetching fresh data.`);
			const refreshedCache = await getSubscriptionsByCoinSymbol(coin.symbol);
			await this.redis.set(key, JSON.stringify(refreshedCache), "EX", 30);

			return refreshedCache;
		} catch (error: any) {
			console.error(`[REDIS ERROR]: Failed to retrieve data from Redis.`, {
				coin: coin,
				error: error.message
			});
			throw new Error(`An error occurred while retrieving data for coin "${coin.symbol}" from Redis.`);
		}
	}
}