import { Container } from "inversify";

import { ConfigService, IConfigService } from "#config/index.js";
import { ACTION_TYPES, COMMAND_TYPES, TYPES } from "#di/types.js";
import { ILogger, Logger } from "#config/index.js";
import { RedisConfig } from "#lib/redis/redis.config.js";
import { IRedisStore, RedisStore } from "#lib/index.js";
import { Bot, IBot } from "#bot/bot.js";
import { CreateTokenCommand, StartCommand } from "#handlers/index.js";
import { CreateTokenAction } from "#handlers/actions/actions/create-token.action.js";
import { CancelAction } from "#handlers/actions/actions/cancel.action.js";
import { MenuCommand } from "#handlers/commands/commands/menu.command.js";
import { CreateCollectionCommand } from "#handlers/commands/commands/create-collection.command.js";
import { CreateCollectionAction } from "#handlers/actions/actions/create-collection.action.js";
import { LoginCommand } from "#handlers/commands/commands/login.command.js";
import { ApiService } from "#lib/api/api.service.js";
import { MyStalktsAction } from "#handlers/actions/actions/mystalks.action.js";


export let container = new Container();
container.bind<IConfigService>(TYPES.ConfigService).to(ConfigService).inSingletonScope();
container.bind<ILogger>(TYPES.Logger).to(Logger).inSingletonScope();
container.bind<ApiService>(TYPES.ApiService).to(ApiService).inSingletonScope();

container.bind<RedisConfig>(TYPES.RedisConfig).to(RedisConfig).inTransientScope();
container.bind<IRedisStore>(TYPES.RedisStore).to(RedisStore).inSingletonScope();

container.bind<IBot>(TYPES.Bot).to(Bot).inSingletonScope();

// COMANDS
container.bind<LoginCommand>(COMMAND_TYPES.LoginCommand).to(LoginCommand);
container.bind<StartCommand>(COMMAND_TYPES.StartCommand).to(StartCommand);
container.bind<MenuCommand>(COMMAND_TYPES.MenuCommand).to(MenuCommand);

container.bind<CreateTokenCommand>(COMMAND_TYPES.CreateToken).to(CreateTokenCommand);
container.bind<CreateCollectionCommand>(COMMAND_TYPES.CreateColection).to(CreateCollectionCommand);

// ACTIONS
container.bind<CreateTokenAction>(ACTION_TYPES.CreateTokenAction).to(CreateTokenAction);
container.bind<CreateCollectionAction>(ACTION_TYPES.CreateCollectionAction).to(CreateCollectionAction);
container.bind<MyStalktsAction>(ACTION_TYPES.MyStalksAction).to(MyStalktsAction);
container.bind<CancelAction>(ACTION_TYPES.CancelAction).to(CancelAction);

