import { Bot } from "#bot/bot.js";
import { Command } from "#commands/command.abstract.js";
import { MessageOptions } from "#options/index.js";


export class StartCommand extends Command {
	constructor (
		bot: Bot
	) {
		super(bot);
	}

	public handle(): void {
		this._bot.start(async (ctx) => {
			const user = ctx.from.username ?? 'hunter';

			const { message, option } = MessageOptions.menu();

			await ctx.reply(
				`🕵🏻 Welcome, <b>${user}</b>.\nI'm waiting for your commands.\n\n${message}`,
				{
					parse_mode: "HTML",
					reply_markup: option.reply_markup
				}
				,
			)
		});
	} 
}