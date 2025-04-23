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
import { IStrategyService, StrategyService } from "#application/services/strategy.service.js";
import { StrategyController } from "#presentation/controllers/strategy.controller.js";
import { CollectionController } from "#presentation/controllers/collection.controller.js";
import { CollectionService, ICollectionService } from "#application/services/collection.service.js";
import { TokenController } from "#presentation/controllers/token.controller.js";
import { ITokenService, TokenService } from "#application/services/token.service.js";
import { IJwtTokenRepository } from "#application/repository/jwt.repository.js";
import { JwtTokenRepository } from "#infrastructure/database/mongodb/repositories/jwt-token.repository.js";
import { IJwtService, JwtService } from "#application/services/jwt.service.js";
import { IUserRepository } from "#application/repository/user.repository.js";
import { UserRepository } from "#infrastructure/database/mongodb/repositories/user.repository.js";
import { AuthService, IAuthService } from "#application/services/auth.service.js";
import { AuthController } from "#presentation/controllers/user.controller.js";


export let container = new Container();

container.bind<ILogger>(TYPES.Logger).to(Logger).inSingletonScope();
container.bind<ConfigService>(TYPES.ConfigService).to(ConfigService).inSingletonScope();

container.bind<ISubscriptionService>(TYPES.SubscriptionService).to(SubscriptionService).inSingletonScope();
container.bind<SubscriptionController>(TYPES.SubscriptionController).to(SubscriptionController).inSingletonScope();
container.bind<SubscriptionRepository>(TYPES.SubscriptionRepository).to(SubscriptionRepository).inSingletonScope();

container.bind<StrategyController>(TYPES.StrategyController).to(StrategyController).inSingletonScope();
container.bind<IStrategyService>(TYPES.StrategyService).to(StrategyService).inSingletonScope();

container.bind<CollectionController>(TYPES.CollectionController).to(CollectionController).inSingletonScope();
container.bind<ICollectionService>(TYPES.CollectionService).to(CollectionService).inSingletonScope();

container.bind<TokenController>(TYPES.TokenController).to(TokenController).inSingletonScope();
container.bind<ITokenService>(TYPES.TokenService).to(TokenService).inSingletonScope();

container.bind<IJwtService>(TYPES.JwtService).to(JwtService).inSingletonScope();
container.bind<IJwtTokenRepository>(TYPES.JwtTokenRepository).to(JwtTokenRepository).inSingletonScope();

container.bind<IUserRepository>(TYPES.UserRepository).to(UserRepository).inSingletonScope();

container.bind<AuthController>(TYPES.AuthController).to(AuthController).inSingletonScope();
container.bind<IAuthService>(TYPES.AuthService).to(AuthService).inSingletonScope();

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

