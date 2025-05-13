import { format } from 'winston';
import { inject, injectable } from "inversify";

import { IBot } from "#bot/bot.js";
import { ILogger } from "#config/index.js";
import { TYPES } from "#di/types.js";
import { Action } from "#handlers/actions/action.abstract.js";
import { Buttons } from "#ui/index.js";
import { ApiService } from "#lib/api/api.service.js";
import { NftSubscription, ResponseMyStalks, TokenSubscription } from "#lib/api/response.js";
import { Markup } from 'telegraf';



@injectable()
export class MyStalktsAction extends Action {
	public static readonly handler: string = Buttons.myStalksCommand.callback_data;
	
	constructor (
		@inject(TYPES.Bot)
		public readonly bot: IBot,
		@inject(TYPES.Logger)
		private readonly _logger: ILogger,
		@inject(TYPES.ApiService)
		private readonly _apiService: ApiService,
	) {
		super();
	}

	public handle(): void {
		this.bot.action(MyStalktsAction.handler, async (ctx) => {
			try {
				await ctx.answerCbQuery();

				const userId = ctx.from?.id;

				const response = await this._apiService.get<ResponseMyStalks>(
					ApiService.SUBSCRIPTIONS_URL + `?userId=${userId}`,
					ctx.session,
				);

				const { subscriptions } = response;

				if (subscriptions.length <= 0) {
					await ctx.reply(
						"You don't have any subscriptions yet.\nChoose one of the options below to create a new subscription.",
						{
							reply_markup: {
								inline_keyboard: [
									[{ text: Buttons.tokenCommand.text, callback_data: Buttons.tokenCommand.callback_data }],
									[{ text: Buttons.collectionCommand.text, callback_data: Buttons.collectionCommand.callback_data }],
								]
							}
						}
					)
				} else {
					const message = subscriptions.map((subscription) => {
						const { target, strategy } = subscription;
						switch (target.type) {
							case 'nft':
								return this.formatNftSubscription(subscription as NftSubscription);
							case 'token':
								return this.formatTokenSubscription(subscription as TokenSubscription);
							default:
								return this.formatDefaultSubscription(subscription);
						}
					}).join('\n\n');

					await ctx.reply(
						message,
						{
							parse_mode: "HTML",
						}
					)
				}
			} catch (error) {
				if (error instanceof Error) this._logger.error(error.message); 
				await ctx.scene.leave();
			}
		});
	}

	public formatNftSubscription(subscription: NftSubscription): string {
		const { target, strategy } = subscription;

		const endingForThreshold = strategy.type === "percentage" ? "%" : "$";
		
		return `🖼️ <b>${target.name}</b> is being stalked at <b>${target.lastNotifiedPrice} ${target.symbol}</b> with a <b>${strategy.threshold} ${endingForThreshold}</b> <i>${strategy.type}</i> threshold`;
	}

	public formatTokenSubscription(subscription: TokenSubscription): string {
		const { target, strategy } = subscription;

		const endingForThreshold = strategy.type === "percentage" ? "%" : "$";

		return `🪙 <b>${target.symbol}</b> is being stalked at <b>${target.lastNotifiedPrice} ${target.symbol}</b> with a <b>${strategy.threshold} ${endingForThreshold}</b> <i>${strategy.type}</i> threshold`;
	}

	public formatDefaultSubscription(subscription: NftSubscription | TokenSubscription): string {
		return `❌ Unknown subscription type`;
	}
}