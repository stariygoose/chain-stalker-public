import { Container } from "inversify";

import { ConfigService, IConfigService } from "#config/index.js";
import { TYPES } from "#di/types.js";
import { ILogger, Logger } from "#config/index.js";
import { RedisConfig } from "#lib/redis/redis.config.js";
import { IRedisStore, RedisStore } from "#lib/index.js";
import { Bot } from "#bot/bot.js";


export let container = new Container();

container.bind<IConfigService>(TYPES.ConfigService).to(ConfigService).inSingletonScope();
container.bind<ILogger>(TYPES.Logger).to(Logger).inSingletonScope();

container.bind<RedisConfig>(TYPES.RedisConfig).to(RedisConfig).inTransientScope();
container.bind<IRedisStore>(TYPES.RedisStore).to(RedisStore).inSingletonScope();

container.bind<Bot>(TYPES.Bot).to(Bot).inSingletonScope();
