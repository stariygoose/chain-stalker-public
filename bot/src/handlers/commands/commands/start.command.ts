import { inject, injectable } from "inversify";

import { IBot } from "#bot/bot.js";
import { Command } from "#handlers/commands/command.abstract.js";
import { TYPES } from "#di/types.js";
import { menuOption } from '#ui/menu/menu.js';


@injectable()
export class StartCommand extends Command {
	constructor (
		@inject(TYPES.Bot)
		public readonly bot: IBot
	) {
		super();
	}

	public handle(): void {
		this.bot.command('start', async (ctx) => {
			if (!ctx.session.jwt) {
				await ctx.reply(
					'You are not logged in.\nPlease, use the command /login to log in.',
				);
				return ;
			}

			const user = ctx.from?.username ?? 'hunter';

			const message = [
				`🕵🏻 Welcome, <b>${user}</b>.`,
				menuOption().text
			]

			await ctx.reply(
				message.join('\n'),
				menuOption().options
			);
		});
	} 
}