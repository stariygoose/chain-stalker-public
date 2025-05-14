import { inject, injectable } from "inversify";

import { IBot } from "#bot/bot.js";
import { ILogger } from "#config/index.js";
import { COMMAND_TYPES, TYPES } from "#di/types.js";
import { Action } from "#handlers/actions/action.abstract.js";
import { ApiService } from "#lib/api/api.service.js";
import { EditSubscriptionCommand } from "#handlers/commands/commands/edit-subscription.command.js";
import { CallbackQuery } from "telegraf/types";
import { ApiError } from "#errors/errors/api.error.js";


@injectable()
export class DeactivateSubscriptionAction extends Action {
	public static readonly handler: RegExp = /^edit:[^:]+:isActive:(true|false)/;
	
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
				const { data } = ctx.callbackQuery as CallbackQuery.DataQuery;
				if (!data) return;

				const [_, hashId, , newState] = data.split(":")
				const subId = ctx.session.subsIdsHashTable[hashId];

				const res = await this._apiService.put(
					`${ApiService.SUBSCRIPTIONS_CHANGE_STATUS_URL}/${subId}`,
					{},
					ctx.session
				)

				await this._editSubscriptionCommand.showSubscriptionInfo(ctx, hashId);

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