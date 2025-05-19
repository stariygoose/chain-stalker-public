import { Bot } from "#bot/bot.js";
import { container, TYPES } from "#di/index.js";
import { RedisPubSub } from "#lib/redis/pubsub/redis.pubsub.js";

const bot = container.get<Bot>(TYPES.Bot);
const redis = container.get<RedisPubSub>(TYPES.RedisPubSub)

await redis.connect();
await bot.init();
