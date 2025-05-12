import { menuOption } from '#ui/menu/menu.js';
import { inject, injectable } from "inversify";

import { TYPES } from "#di/types.js";
import { IBot } from "#bot/bot.js";
import { ILogger } from "#config/index.js";
import { Command } from "#handlers/commands/command.abstract.js";
import { ApiService } from "#lib/api/api.service.js";
import { ApiError } from "#errors/errors/api.error.js";
import { ResponseJwt } from '#lib/api/response.js';


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
	) {
		super();
	}

	public handle(): void {
		this.bot.command(LoginCommand.handler, async (ctx) => {
			try {
				const user = ctx.from?.id;
				const request = await this._apiService.post<ResponseJwt>(
					ApiService.LOGIN_URL,
					{
						userId: user
					},
					ctx.session
				);

				ctx.session.jwt = request;

				await ctx.reply(
					`You have been successfully logged in.\n${menuOption.text}`, 
					menuOption.options
				);
			} catch (error: unknown) {
				if (error instanceof ApiError) {
					await ctx.reply(error.botMessage, menuOption.options);
					return ;
				}
				throw error;
			}
		});
	}
}