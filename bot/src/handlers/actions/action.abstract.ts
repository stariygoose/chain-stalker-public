import { IBot } from "#bot/bot.js";

export abstract class Action {
	public static readonly handler: string; 
	protected abstract readonly bot: IBot;
	
	abstract handle(): void; 
}