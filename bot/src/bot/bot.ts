import { inject, injectable } from "inversify";
import { session, Telegraf } from "telegraf";

import { EnvVariables, IConfigService, ILogger } from "#config/index.js";
import { TYPES } from "#di/types.js";
import { IRedisStore } from "#lib/index.js";
import { IContext } from "#context/context.interface.js";
import { Command } from "#commands/command.abstract.js";
import { BotCommands } from "#commands/index.js";


@injectable()
export class Bot {
	public bot: Telegraf<IContext>;

	private readonly _token: string;

	private readonly _commands: Command[];

	constructor(
		@inject(TYPES.Logger)
		private readonly _logger: ILogger, 
		@inject(TYPES.ConfigService)
		private readonly _config: IConfigService,
		@inject(TYPES.RedisStore)
		private readonly _store: IRedisStore
	) {
		this._token = this._config.get(EnvVariables.TG_TOKEN);

		this.bot = new Telegraf<IContext>(this._token);
		
		this.bot.use(
			session({
				store: this._store.store
			})
		);

		this._commands = this.registerCommands();
	}

	public async init() {
		this._commands.forEach(command => command.handle());

		try {
			await this.bot.launch(
				() => this._logger.info(`Telegram Bot launched successfully.`)
			);

		} catch (error: unknown) {
			if (error instanceof Error)
				this._logger.error(`Error launching a bot. Message: ${error.message}`);
		}
	}

	private registerCommands() {
		return [
			new BotCommands.StartCommand(this)
		];
	}
}