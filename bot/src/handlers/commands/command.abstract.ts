import { IBot } from "#bot/bot.js";


export abstract class Command {
	public static readonly handler: string | RegExp; 
	abstract readonly bot: IBot;

	abstract handle(): void; 
}