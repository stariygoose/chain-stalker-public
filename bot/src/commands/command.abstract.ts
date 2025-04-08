import { Telegraf } from "telegraf";

import { Bot } from "#bot/bot.js";
import { IContext } from "#context/context.interface.js";


export abstract class Command {
	protected readonly _bot: Telegraf<IContext>;

	constructor (
		bot: Bot
	) {
		this._bot = bot.bot;
	}

	abstract handle(): void; 
}