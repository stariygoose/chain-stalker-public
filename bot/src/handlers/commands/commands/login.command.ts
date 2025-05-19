import { menuOption } from '#ui/menu/menu.js';
import { inject, injectable } from "inversify";

import { COMMAND_TYPES, TYPES } from "#di/types.js";
import { IBot } from "#bot/bot.js";
import { ILogger } from "#config/index.js";
import { Command } from "#handlers/commands/command.abstract.js";
import { ApiService } from '#lib/api/api.service.js';
import { ApiError } from '#errors/errors/api.error.js';
import { MenuCommand } from '#handlers/commands/commands/menu.command.js';
import { ChainStalkerMessage } from '#ui/index.js';


@injectable()
export class LoginCommand extends Command {
	public static readonly handler: string = 'login';

	constructor (
		@inject(TYPES.Bot)
		public readonly bot: IBot,
		@inject(TYPES.Logger)
		private readonly _logger: ILogger,
		@inject(TYPES.ApiService)
		private readonly _apiService: ApiService,
		@inject(COMMAND_TYPES.MenuCommand)
		private readonly _menuCommand: MenuCommand
	) {
		super();
	}

	public handle(): void {
		this.bot.command(LoginCommand.handler, async (ctx) => {
			const id = ctx.from?.id;

			try {
				await this._apiService.login(ctx);

				await this._menuCommand.showMenu(
					ctx,
					ChainStalkerMessage.SMS.LOGIN_SUCCESS(ctx)
				);

			} catch (error: unknown) {
				if (error instanceof ApiError) {
					await this._menuCommand.showMenu(
						ctx,
						error.botMessage + '\n'
					);
				}

				this._logger.error(`Unexpected error when User ${id} was trying to log in. Error: ${(error as Error).message}`);
				await this._menuCommand.showMenu(
					ctx,
					ChainStalkerMessage.SMS.UNKNOWN_ERROR
				)
			}
		});
	}
}