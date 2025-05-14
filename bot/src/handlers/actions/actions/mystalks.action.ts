import { inject, injectable } from "inversify";
import { nanoid } from "nanoid";

import { IBot } from "#bot/bot.js";
import { ILogger } from "#config/index.js";
import { TYPES } from "#di/types.js";
import { Action } from "#handlers/actions/action.abstract.js";
import { Buttons } from "#ui/index.js";
import { ApiService } from "#lib/api/api.service.js";
import { NftSubscription, ResponseMyStalks, Subscription, TokenSubscription } from "#lib/api/response.js";
import { MyContext } from '#context/context.interface.js';



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
				this.createHashTableForSubscriptionsIds(ctx, subscriptions);

				if (subscriptions.length <= 0) {
					const message = this.messageWhenNoSubscriptions();
					await ctx.reply(
						message.text,
						message.options
					);
				} else {
					const message = subscriptions.map((subscription) => {
						return this.getMessageBasedTarget(ctx, subscription);
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
			}
		});
	}

	private createHashTableForSubscriptionsIds(
		ctx: MyContext, 
		subscriptions: Subscription[]
	): void {
		if (!ctx.session.subsIdsHashTable) {
			ctx.session.subsIdsHashTable = {};
		}

		subscriptions.forEach((subscription) => {
			const id = nanoid(6);

			ctx.session.subsIdsHashTable[id] = subscription.id;
		});
	} 

	private getMessageBasedTarget(
		ctx: MyContext,
		subscription: Subscription
	): string {
		const { target } = subscription;

		switch (target.type) {
			case 'nft':
				return this.formatNftSubscription(ctx, subscription as NftSubscription);
			case 'token':
				return this.formatTokenSubscription(ctx, subscription as TokenSubscription);
			default:
				return this.formatDefaultSubscription(subscription);
		}
	}

	private formatNftSubscription(
		ctx: MyContext,
		subscription: NftSubscription
	): string {
		const { target, strategy } = subscription;

		const activityIndificator = subscription.isActive ? '🟢' : '🔴';
		const endingForThreshold = strategy.type === "percentage" ? "%" : "$";
		const key = Object.keys(ctx.session.subsIdsHashTable).find(
			(key) => ctx.session.subsIdsHashTable[key] === subscription.id
		);
		
		return `${activityIndificator} 🖼️ <b>${target.name}</b> is being stalked at <b>${target.lastNotifiedPrice} ${target.symbol}</b> with a <b>${strategy.threshold}${endingForThreshold}</b>\n<i>${strategy.type}</i> threshold. /edit_${key}`;
	}

	private formatTokenSubscription(
		ctx: MyContext, 
		subscription: TokenSubscription
	): string {
		const { target, strategy } = subscription;

		const activityIndificator = subscription.isActive ? '🟢' : '🔴';
		const endingForThreshold = strategy.type === "percentage" ? "%" : "$";
		const key = Object.keys(ctx.session.subsIdsHashTable).find(
			(key) => ctx.session.subsIdsHashTable[key] === subscription.id
		);

		return `${activityIndificator} 🪙 <b>${target.symbol}</b> is being stalked at <b>${target.lastNotifiedPrice} ${target.symbol}</b> with a <b>${strategy.threshold}${endingForThreshold}</b>\n<i>${strategy.type}</i> threshold. /edit_${key}`;
	}

	private formatDefaultSubscription(subscription: NftSubscription | TokenSubscription): string {
		return `❌ Unknown subscription type`;
	}

	private messageWhenNoSubscriptions() {
		return {
			text: "You don't have any subscriptions yet.\nChoose one of the options below to create a new subscription.",
			options: {
				reply_markup: {
					inline_keyboard: [
						[{ text: Buttons.tokenCommand.text, callback_data: Buttons.tokenCommand.callback_data }],
						[{ text: Buttons.collectionCommand.text, callback_data: Buttons.collectionCommand.callback_data }],
					]
				}
			}
		};
	}
}