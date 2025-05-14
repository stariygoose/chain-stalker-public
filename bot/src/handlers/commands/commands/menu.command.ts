import { inject, injectable } from "inversify";

import { IBot } from "#bot/bot.js";
import { Command } from "#handlers/commands/command.abstract.js";
import { TYPES } from "#di/types.js";
import { menuOption } from '#ui/menu/menu.js';


@injectable()
export class MenuCommand extends Command {
	constructor (
		@inject(TYPES.Bot)
		public readonly bot: IBot
	) {
		super();
	}

	public handle(): void {
		this.bot.command('menu', async (ctx) => {
			const message = [
				menuOption().text
			]

			await ctx.reply(
				message.join('\n'),
				menuOption().options
			);
		});
	} 
}