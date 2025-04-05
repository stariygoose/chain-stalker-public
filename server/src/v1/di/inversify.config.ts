import { Container } from "inversify";

import { SubscriptionRepository } from "#infrastructure/database/mongodb/repositories/subscription.repository.js";
import { TYPES } from "#di/types.js";
import { SubscriptionController } from "#presentation/controllers/subscription.controller.js";
import { ISubscriptionService, SubscriptionService } from "#application/services/subscription.service.js";
import { ConfigService } from "#config/config.service.js";
import { IServerConfig, ServerConfig } from "#presentation/config/server.config.js";
import { ILogger, Logger } from "#utils/logger.js";
import { IMongoDbConfig, MongoDbConfig } from "#infrastructure/database/mongodb/config/mongo.config.js";
import { OpenseaEventStream } from "#infrastructure/websockets/marketplaces/opensea/opensea-event-stream.class.js";
import { WebsocketManager } from "#infrastructure/websockets/websocket-manager.js";
import { INftEventStream } from "#infrastructure/websockets/interfaces/nft-event-stream.interface.js";
import { ICache, IPubSub, RedisCache, RedisClient, RedisPubSub } from "#infrastructure/lib/redis/index.js";
import { OpenSeaAPI, BinanceAPI } from "#infrastructure/lib/apis/index.js";
import { ITokenEventStream } from "#infrastructure/websockets/interfaces/token-event-stream.interface.js";
import { BinanceEventStream } from "#infrastructure/websockets/marketplaces/binance/binance-event-stream.class.js";


export let container = new Container();

container.bind<ILogger>(TYPES.Logger).to(Logger).inSingletonScope();
container.bind<ConfigService>(TYPES.ConfigService).to(ConfigService).inSingletonScope();

container.bind<ISubscriptionService>(TYPES.SubscriptionService).to(SubscriptionService).inSingletonScope();
container.bind<SubscriptionController>(TYPES.SubscriptionController).to(SubscriptionController).inSingletonScope();
container.bind<SubscriptionRepository>(TYPES.SubscriptionRepository).to(SubscriptionRepository).inSingletonScope();


container.bind<IServerConfig>(TYPES.ServerConfig).to(ServerConfig).inSingletonScope();
container.bind<IMongoDbConfig>(TYPES.MongoDbConfig).to(MongoDbConfig).inSingletonScope();

container.bind<ITokenEventStream>(TYPES.BinanceEventStream).to(BinanceEventStream).inTransientScope();
container.bind<INftEventStream>(TYPES.OpenseaEventStream).to(OpenseaEventStream).inSingletonScope();
container.bind<WebsocketManager>(TYPES.WebsocketManager).to(WebsocketManager).inSingletonScope();

container.bind<RedisClient>(TYPES.RedisClient).to(RedisClient).inTransientScope();
container.bind<IPubSub>(TYPES.RedisPubSub).to(RedisPubSub).inSingletonScope();
container.bind<ICache>(TYPES.RedisCache).to(RedisCache).inSingletonScope();

container.bind<OpenSeaAPI>(TYPES.OpenSeaAPI).to(OpenSeaAPI).inSingletonScope();
container.bind<BinanceAPI>(TYPES.BinanceAPI).to(BinanceAPI).inSingletonScope();

