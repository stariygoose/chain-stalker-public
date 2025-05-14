import { inject, injectable } from "inversify";
import { nanoid } from "nanoid";

import { IBot } from "#bot/bot.js";
import { ILogger } from "#config/index.js";
import { TYPES } from "#di/types.js";
import { Action } from "#handlers/actions/action.abstract.js";
import { Buttons } from "#ui/index.js";
import { ApiService } from "#lib/api/api.service.js";
import { ResponseMyStalks, Subscription } from "#lib/api/response.js";
import { MyContext } from '#context/context.interface.js';



@injectable()
export class MyStalksAction extends Action {
	public static readonly handler: string = Buttons.myStalksCommand.callback_data;

	constructor(
		@inject(TYPES.Bot) public readonly bot: IBot,
		@inject(TYPES.Logger) private readonly _logger: ILogger,
		@inject(TYPES.ApiService) private readonly _apiService: ApiService,
	) {
		super();
	}

	public handle(): void {
		this.bot.action(MyStalksAction.handler, async (ctx) => {
			try {
				await ctx.answerCbQuery();

				const userId = ctx.from?.id;
				const response = await this._apiService.get<ResponseMyStalks>(
					`${ApiService.SUBSCRIPTIONS_URL}?userId=${userId}`,
					ctx.session,
				);

				const { subscriptions } = response;
				this.cacheSubscriptionIds(ctx, subscriptions);

				if (subscriptions.length === 0) {
					const message = this.buildEmptyMessage();
					await ctx.reply(message.text, message.options);
					return;
				}

				const message = subscriptions
					.map((sub) => this.formatSubscriptionMessage(ctx, sub))
					.join('\n\n');

				await ctx.reply(
					message,
					{
						parse_mode: "HTML",
						reply_markup: {
							inline_keyboard: [
								[
									{ text: Buttons.menuBtn.text, callback_data: Buttons.menuBtn.callback_data }
								]
							]
						}
					}
				);

			} catch (error) {
				this._logger.error((error as Error).message);
			}
		});
	}

	private cacheSubscriptionIds(
		ctx: MyContext,
		subscriptions: Subscription[]
	): void {
		if (!ctx.session.subsIdsHashTable) ctx.session.subsIdsHashTable = {};

		for (const sub of subscriptions) {
			const shortId = nanoid(6);
			ctx.session.subsIdsHashTable[shortId] = sub.id;
		}
	}

	private formatSubscriptionMessage(
		ctx: MyContext,
		subscription: Subscription
	): string {
		const key = this.findShortId(ctx, subscription.id);
		if (!key) return `❌ Unable to locate subscription ID`;

		const { target, strategy, isActive } = subscription;

		const statusEmoji = isActive ? '🟢' : '🔴';
		const unit = strategy.type === 'percentage' ? '%' : '$';
		const threshold = `<b>${strategy.threshold}${unit}</b>\n<i>${strategy.type}</i> threshold.`;

		if (target.type === 'nft') {
			return `${statusEmoji} 🖼️ <b>${target.name}</b> is being stalked at <b>${target.lastNotifiedPrice} ${target.symbol}</b> with ${threshold} /edit_${key}`;
		}

		if (target.type === 'token') {
			return `${statusEmoji} 🪙 <b>${target.symbol}</b> is being stalked at <b>${target.lastNotifiedPrice} ${target.symbol}</b> with ${threshold} /edit_${key}`;
		}

		return `❌ Unknown subscription type`;
	}

	private findShortId(
		ctx: MyContext,
		fullId: string
	): string | undefined {
		return Object.entries(ctx.session.subsIdsHashTable || {}).find(
			([, value]) => value === fullId
		)?.[0];
	}

	private buildEmptyMessage() {
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
