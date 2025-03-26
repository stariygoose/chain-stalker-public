import { Container } from "inversify";

import { SubscriptionRepository } from "#infrastructure/database/mongodb/repositories/subscription.repository.js";
import { TYPES } from "#di/types.js";
import { SubscriptionController } from "#representation/controllers/subscription.controller.js";
import { ISubscriptionService, SubscriptionService } from "#application/services/subscription.service.js";
import { ConfigService } from "#config/config.service.js";
import { IServerConfig, ServerConfig } from "#representation/config/server.config.js";
import { ILogger, Logger } from "#utils/logger.js";
import { IMongoDbConfig, MongoDbConfig } from "#infrastructure/database/mongodb/config/mongo.config.js";


export let container = new Container();

container.bind<ILogger>(TYPES.Logger).to(Logger);
container.bind<ConfigService>(TYPES.ConfigService).to(ConfigService);

container.bind<SubscriptionRepository>(TYPES.SubscriptionRepository).to(SubscriptionRepository);
container.bind<ISubscriptionService>(TYPES.SubscriptionService).to(SubscriptionService);
container.bind<SubscriptionController>(TYPES.SubscriptionController).to(SubscriptionController);

container.bind<IServerConfig>(TYPES.ServerConfig).to(ServerConfig);
container.bind<IMongoDbConfig>(TYPES.MongoDbConfig).to(MongoDbConfig);