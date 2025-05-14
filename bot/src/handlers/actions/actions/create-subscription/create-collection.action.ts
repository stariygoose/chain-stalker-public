import { inject, injectable } from "inversify";

import { IBot } from "#bot/bot.js";
import { ILogger } from "#config/index.js";
import { TYPES } from "#di/types.js";
import { Action } from "#handlers/actions/action.abstract.js";
import { Buttons } from "#ui/index.js";
import { SceneTitle } from "#scenes/scenes/scene.types.js";


@injectable()
export class CreateCollectionAction extends Action {
	public static readonly handler: string = Buttons.collectionCommand.callback_data;
	
	constructor (
		@inject(TYPES.Bot)
		public readonly bot: IBot,
		@inject(TYPES.Logger)
		private readonly _logger: ILogger,
	) {
		super();
	}

	public handle(): void {
		this.bot.action(CreateCollectionAction.handler, async (ctx) => {
			try {
				await ctx.scene.enter(SceneTitle.CREATE_COLLECTION);
			} catch (error) {
				if (error instanceof Error) this._logger.error(error.message); 
				await ctx.scene.leave();
			}
		});
	}
}