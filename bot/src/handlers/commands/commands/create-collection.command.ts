import { inject, injectable } from "inversify";

import { IBot } from "#bot/bot.js";
import { Command } from "#handlers/commands/command.abstract.js";
import { TYPES } from "#di/types.js";
import { ILogger } from "#config/index.js";
import { SceneTitle } from "#scenes/scenes/scene.types.js";


@injectable()
export class CreateCollectionCommand extends Command {
	public static readonly handler: string = 'collection';

	constructor (
		@inject(TYPES.Bot)
		public readonly bot: IBot,
		@inject(TYPES.Logger)
		private readonly _logger: ILogger 
	) {
		super();
	}

	public handle(): void {
		this.bot.command(CreateCollectionCommand.handler, async (ctx) => {
			try {
				await ctx.scene.enter(SceneTitle.CREATE_COLLECTION);
			} catch (error) {
				if (error instanceof Error) this._logger.warn(error.message); 
				await ctx.scene.leave();
			}
		});
	} 
}