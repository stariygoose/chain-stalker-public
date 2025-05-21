import { inject, injectable } from "inversify";

import { IBot } from "#bot/bot.js";
import { ILogger } from "#config/index.js";
import { COMMAND_TYPES, TYPES } from "#di/types.js";
import { Action } from "#handlers/actions/action.abstract.js";
import { Buttons } from "#ui/index.js";
import { menuOption } from "#ui/menu/menu.js";
import { MenuCommand } from "#handlers/commands/commands/menu.command.js";


@injectable()
export class MenuAction extends Action {
	public static readonly handler: string = Buttons.menuBtn.callback_data;
	
	constructor (
		@inject(TYPES.Bot)
		public readonly bot: IBot,
		@inject(TYPES.Logger)
		private readonly _logger: ILogger,
		@inject(COMMAND_TYPES.MenuCommand)
		private readonly _menuCommand: MenuCommand
	) {
		super();
	}

	public handle(): void {
		this.bot.action(MenuAction.handler, async (ctx) => {
			try {
				await ctx.scene.leave();
				
				await this._menuCommand.showMenu(ctx);
			} catch (error) {
				if (error instanceof Error) this._logger.error(error.message); 
				await ctx.scene.leave();
			}
		});
	}
}