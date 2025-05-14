import { inject, injectable } from "inversify";

import { IBot } from "#bot/bot.js";
import { ILogger } from "#config/index.js";
import { TYPES } from "#di/types.js";
import { Action } from "#handlers/actions/action.abstract.js";
import { Buttons } from "#ui/index.js";
import { menuOption } from "#ui/menu/menu.js";


@injectable()
export class CancelAction extends Action {
	public static readonly handler: string = Buttons.cancelBtn.callback_data;
	
	constructor (
		@inject(TYPES.Bot)
		public readonly bot: IBot,
		@inject(TYPES.Logger)
		private readonly _logger: ILogger,
	) {
		super();
	}

	public handle(): void {
		this.bot.action(CancelAction.handler, async (ctx) => {
			try {
				await ctx.scene.leave();

				await ctx.reply(
					menuOption().text,
					menuOption().options
				);
			} catch (error) {
				if (error instanceof Error) this._logger.error(error.message); 
				await ctx.scene.leave();
			}
		});
	}
}