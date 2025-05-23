import { Container } from "inversify";

import { ConfigService, IConfigService } from "#config/index.js";
import { ACTION_TYPES, COMMAND_TYPES, TYPES } from "#di/types.js";
import { ILogger, Logger } from "#config/index.js";
import { RedisConfig } from "#lib/redis/redis.config.js";
import { IRedisStore, RedisStore } from "#lib/index.js";
import { Bot, IBot } from "#bot/bot.js";
import { CreateTokenCommand, StartCommand } from "#handlers/index.js";
import { CreateTokenAction } from "#handlers/actions/actions/create-subscription/create-token.action.js";
import { CancelAction } from "#handlers/actions/actions/cancel/cancel.action.js";
import { MenuCommand } from "#handlers/commands/commands/menu.command.js";
import { CreateCollectionCommand } from "#handlers/commands/commands/create-collection.command.js";
import { CreateCollectionAction } from "#handlers/actions/actions/create-subscription/create-collection.action.js";
import { LoginCommand } from "#handlers/commands/commands/login.command.js";
import { MyStalksAction } from "#handlers/actions/actions/my-stalks/mystalks.action.js";
import { EditSubscriptionCommand } from "#handlers/commands/commands/edit-subscription.command.js";
import { MenuAction } from "#handlers/actions/actions/menu/menu.action.js";
import { DeactivateSubscriptionAction } from "#handlers/actions/actions/edit-subscription/change-status.action.js";
import { ChangeStrategyAction } from "#handlers/actions/actions/edit-subscription/change-strategy.action.js";
import { DeleteAction } from "#handlers/actions/actions/edit-subscription/delete.action.js";
import { ApiService } from "#lib/api/api.service.js";
import { HttpService } from "#lib/api/http.service.js";
import { IRedisPubSub, RedisPubSub } from "#lib/redis/pubsub/redis.pubsub.js";


export let container = new Container();
container.bind<IConfigService>(TYPES.ConfigService).to(ConfigService).inSingletonScope();
container.bind<ILogger>(TYPES.Logger).to(Logger).inSingletonScope();
container.bind<HttpService>(TYPES.HttpService).to(HttpService);
container.bind<ApiService>(TYPES.ApiService).to(ApiService).inSingletonScope();

container.bind<RedisConfig>(TYPES.RedisConfig).to(RedisConfig).inTransientScope();
container.bind<IRedisStore>(TYPES.RedisStore).to(RedisStore).inTransientScope();
container.bind<IRedisPubSub>(TYPES.RedisPubSub).to(RedisPubSub).inTransientScope();

container.bind<IBot>(TYPES.Bot).to(Bot).inSingletonScope();

// COMANDS
container.bind<LoginCommand>(COMMAND_TYPES.LoginCommand).to(LoginCommand);
container.bind<StartCommand>(COMMAND_TYPES.StartCommand).to(StartCommand);
container.bind<MenuCommand>(COMMAND_TYPES.MenuCommand).to(MenuCommand);

container.bind<CreateTokenCommand>(COMMAND_TYPES.CreateToken).to(CreateTokenCommand);
container.bind<CreateCollectionCommand>(COMMAND_TYPES.CreateColection).to(CreateCollectionCommand);

container.bind<EditSubscriptionCommand>(COMMAND_TYPES.EditSubscription).to(EditSubscriptionCommand);

// ACTIONS
container.bind<CreateTokenAction>(ACTION_TYPES.CreateTokenAction).to(CreateTokenAction);
container.bind<CreateCollectionAction>(ACTION_TYPES.CreateCollectionAction).to(CreateCollectionAction);
container.bind<MyStalksAction>(ACTION_TYPES.MyStalksAction).to(MyStalksAction);
container.bind<MenuAction>(ACTION_TYPES.MenuAction).to(MenuAction);
container.bind<CancelAction>(ACTION_TYPES.CancelAction).to(CancelAction);

container.bind<DeactivateSubscriptionAction>(ACTION_TYPES.DeactivateSubscription).to(DeactivateSubscriptionAction);
container.bind<ChangeStrategyAction>(ACTION_TYPES.ChangeStrategyAction).to(ChangeStrategyAction);
container.bind<DeleteAction>(ACTION_TYPES.DeleteSubscription).to(DeleteAction);
