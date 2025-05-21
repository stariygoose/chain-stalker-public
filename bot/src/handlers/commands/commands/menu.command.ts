import { inject, injectable } from "inversify";

import { IBot } from "#bot/bot.js";
import { Command } from "#handlers/commands/command.abstract.js";
import { TYPES } from "#di/types.js";
import { menuOption } from '#ui/menu/menu.js';
import { MyContext } from "#context/context.interface.js";
import { ILogger } from "#config/index.js";


@injectable()
export class MenuCommand extends Command {
	constructor (
		@inject(TYPES.Bot)
		public readonly bot: IBot,
		@inject(TYPES.Logger)
		private readonly _logger: ILogger
	) {
		super();
	}

	public handle(): void {
		this.bot.command('menu', async (ctx) => {
			try {
				await this.showMenu(ctx);
			} catch (error: unknown) {
				this._logger.error(`Error while User ${ctx.from?.id} was trying to call a COMMAND MENU. Error ${(error as Error).message}`);
			}
		});
	}

	public async showMenu(ctx: MyContext, msg?: string) {
		const { text, options } = menuOption();

		const msgToShow = msg ?? text;

		await ctx.reply(
			msgToShow,
			options
		);
	}
}