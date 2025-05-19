import { inject, injectable } from "inversify";

import { IBot } from "#bot/bot.js";
import { ILogger } from "#config/index.js";
import { COMMAND_TYPES, TYPES } from "#di/types.js";
import { Action } from "#handlers/actions/action.abstract.js";
import { ApiService } from "#lib/api/api.service.js";
import { EditSubscriptionCommand } from "#handlers/commands/commands/edit-subscription.command.js";
import { ApiError } from "#errors/errors/api.error.js";
import { Buttons } from "#ui/index.js";


@injectable()
export class DeactivateSubscriptionAction extends Action {
	public static readonly handler: string = Buttons.subStatusBtn(true).callback_data;
	
	constructor (
		@inject(TYPES.Bot)
		public readonly bot: IBot,
		@inject(TYPES.Logger)
		private readonly _logger: ILogger,
		@inject(TYPES.ApiService)
		private readonly _apiService: ApiService,
		@inject(COMMAND_TYPES.EditSubscription)
		private readonly _editSubscriptionCommand: EditSubscriptionCommand
	) {
		super();
	}

	public handle(): void {
		this.bot.action(DeactivateSubscriptionAction.handler, async (ctx) => {
			try {			
				if (!ctx.session.targetToEdit)
					throw new Error(`Target to edit is blank.`);

				const { id } = ctx.session.targetToEdit;

				await this._apiService.changeStatus(ctx);

				await this._editSubscriptionCommand.showSubscriptionInfo(ctx, id);

			} catch (error) {
				if (error instanceof ApiError) {
					await ctx.reply(error.botMessage);
					return ;
				}
				
				if (error instanceof Error) {
					this._logger.error(error.message);
					await ctx.reply("⚠️ An error occurred while deactivating the subscription.");
				}
			}
		});
	}
}