import { inject, injectable } from "inversify";

import { Action } from "#handlers/actions/action.abstract.js";
import { TYPES } from "#di/index.js";
import { IBot } from "#bot/bot.js";
import { ILogger } from "#config/index.js";
import { SceneTitle } from "#scenes/scenes/scene.types.js";
import { Buttons } from "#ui/index.js";


@injectable()
export class ChangeStrategyAction extends Action {
	public static readonly handler: string | RegExp = Buttons.changeStrategyBtn.callback_data;

	constructor (
		@inject(TYPES.Bot)
		public readonly bot: IBot,
		@inject(TYPES.Logger)
		private readonly _logger: ILogger,
	) {
		super();
	}

	public handle(): void {
		this.bot.action(ChangeStrategyAction.handler, async (ctx) => {
			try {
				await ctx.scene.enter(SceneTitle.CHANGE_STRATEGY);
			} catch (error) {
				if (error instanceof Error) this._logger.warn(error.message); 
				await ctx.scene.leave();
			}
		});
	}
}