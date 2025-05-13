import { inject, injectable } from "inversify";
import { session, Telegraf } from "telegraf";

import { EnvVariables, IConfigService, ILogger } from "#config/index.js";
import { ACTION_TYPES, COMMAND_TYPES, TYPES } from "#di/types.js";
import { IRedisStore } from "#lib/index.js";
import { Command } from "#handlers/commands/command.abstract.js";
import { createSceneStage } from "#scenes/index.js";
import { CreateTokenCommand, StartCommand } from "#handlers/index.js";
import { container } from "#di/containers.js";
import { CreateTokenAction } from "#handlers/actions/actions/create-token.action.js";
import { Action } from "#handlers/actions/action.abstract.js";
import { MyContext, MySession } from "#context/context.interface.js";
import { CancelAction } from "#handlers/actions/actions/cancel.action.js";
import { MenuCommand } from "#handlers/commands/commands/menu.command.js";
import { CreateCollectionCommand } from "#handlers/commands/commands/create-collection.command.js";
import { CreateCollectionAction } from "#handlers/actions/actions/create-collection.action.js";
import { LoginCommand } from "#handlers/commands/commands/login.command.js";
import { MyStalktsAction } from "#handlers/actions/actions/mystalks.action.js";


export interface IBot {
	init(): void;
	command(trigger: string, handler: (ctx: MyContext) => Promise<void>): void;
	action(route: string, handler: (ctx: MyContext) => Promise<void>): void;
}

@injectable()
export class Bot implements IBot {
	private bot: Telegraf<MyContext>;

	private readonly _token: string;

	private _commands?: Command[];
	private _actions?: Action[];

	constructor(
		@inject(TYPES.Logger)
		private readonly _logger: ILogger, 
		@inject(TYPES.ConfigService)
		private readonly _config: IConfigService,
		@inject(TYPES.RedisStore)
		private readonly _store: IRedisStore
	) {
		this._token = this._config.get(EnvVariables.TG_TOKEN);
		this.bot = new Telegraf<MyContext>(this._token);
		
		this.bot.use(
			session({
				store: this._store.store,
				defaultSession: (): MySession => ({
					jwt: {},
					tokenRequest: {}
				})
			})
		);
		this.bot.use(createSceneStage().middleware());

		this.bot.catch((err: any, ctx) => {
			this._logger.error(`Unexpected error: ${err.message}`);
		})

	}

	public async init() {
		this._commands = this.registerCommands();
		this._actions = this.registerActions();

		this._commands.forEach(command => command.handle());
		this._actions.forEach(action => action.handle());
		
		try {
			await this.bot.launch(
				() => this._logger.info(`Telegram Bot launched successfully.`)
			);

		} catch (error: unknown) {
			if (error instanceof Error)
				this._logger.error(`Error launching a bot. Message: ${error.message}`);
		}
	}

	public command(trigger: string, handler: (ctx: MyContext) => Promise<void>): void {
		this.bot.command(trigger, async (ctx) => {
			try {
				await handler(ctx);	
			} catch (error: any) {
				this._logger.debug(`Error for the user: ${ctx.from?.id} while processing a command: ${ctx.command}. Error: ${error.message}`);
				throw error;
			}
		});
	}

	public action(route: string, handler: (ctx: MyContext) => Promise<void>): void {
		this.bot.action(route, async (ctx) => {
			try {
				await handler(ctx);
			} catch (error: any) {
				this._logger.debug(`Error for the user: ${ctx.from?.id} while processing an action. Error: ${error.message}`);
			}
		});
	}

	private registerCommands() {
		return [
			container.get<LoginCommand>(COMMAND_TYPES.LoginCommand),
			container.get<StartCommand>(COMMAND_TYPES.StartCommand),
			container.get<MenuCommand>(COMMAND_TYPES.MenuCommand),

			container.get<CreateTokenCommand>(COMMAND_TYPES.CreateToken),
			container.get<CreateCollectionCommand>(COMMAND_TYPES.CreateColection)
		];
	}

	private registerActions() {
		return [
			container.get<CreateTokenAction>(ACTION_TYPES.CreateTokenAction),
			container.get<CreateCollectionAction>(ACTION_TYPES.CreateCollectionAction),
			container.get<MyStalktsAction>(ACTION_TYPES.MyStalksAction),

			container.get<CancelAction>(ACTION_TYPES.CancelAction)
		]
	}
}