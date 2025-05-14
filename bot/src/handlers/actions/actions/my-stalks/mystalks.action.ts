import { inject, injectable } from "inversify";

import { IBot } from "#bot/bot.js";
import { ILogger } from "#config/index.js";
import { TYPES } from "#di/types.js";
import { Action } from "#handlers/actions/action.abstract.js";
import { Buttons } from "#ui/index.js";
import { ApiService } from "#lib/api/api.service.js";
import { ResponseMyStalks, Subscription } from "#lib/api/response.js";
import { MyContext } from '#context/context.interface.js';
import { safeNanoId } from "#lib/helpers/helpers.js";



@injectable()
export class MyStalksAction extends Action {
	public static readonly handler = Buttons.myStalksCommand.callback_data;

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
				const userId = ctx.from?.id;
				const response = await this._apiService.get<ResponseMyStalks>(
					`${ApiService.SUBSCRIPTIONS_URL}?userId=${userId}`,
					ctx.session
				);

				const { subscriptions } = response;

				this.cacheSubscriptionIds(ctx, subscriptions);

				if (subscriptions.length === 0) {
					const { text, options } = this.buildEmptyMessage();
					await ctx.reply(text, options);
					return;
				}

				const message = subscriptions
					.map((sub) => this.formatSubscriptionMessage(ctx, sub))
					.join('\n\n');

				await ctx.reply(message, {
					parse_mode: "HTML",
					reply_markup: {
						inline_keyboard: [[
							{ text: Buttons.menuBtn.text, callback_data: Buttons.menuBtn.callback_data }
						]]
					}
				});
			} catch (error) {
				this._logger.error((error as Error).message);
			}
		});
	}

	private cacheSubscriptionIds(ctx: MyContext, subscriptions: Subscription[]): void {
		ctx.session.subsIdsHashTable = {};

		for (const sub of subscriptions) {
			const shortId = safeNanoId();
			ctx.session.subsIdsHashTable[shortId] = sub.id;
		}
	}

	private formatSubscriptionMessage(ctx: MyContext, sub: Subscription): string {
		const shortId = this.findShortId(ctx, sub.id);
		if (!shortId) return `❌ Unable to locate subscription ID`;

		const { target, strategy, isActive } = sub;
		const status = isActive ? '🟢' : '🔴';
		const unit = strategy.type === 'percentage' ? '%' : '$';
		const thresholdText = `<b>${strategy.threshold}${unit}</b>\n<i>${strategy.type}</i> threshold.`;

		switch (target.type) {
			case 'nft':
				return `${status} 🖼️ <b>${target.name}</b> is being stalked at <b>${target.lastNotifiedPrice} ${target.symbol}</b> with ${thresholdText} /edit_${shortId}`;

			case 'token':
				return `${status} 🪙 <b>${target.symbol}</b> is being stalked at <b>${target.lastNotifiedPrice} ${target.symbol}</b> with ${thresholdText} /edit_${shortId}`;

			default:
				this._logger.warn(`Unknown subscription target type: ${target["type"]}`);
				return `❌ Unknown subscription type`;
		}
	}

	private findShortId(ctx: MyContext, fullId: string): string | undefined {
		for (const [key, value] of Object.entries(ctx.session.subsIdsHashTable)) {
			if (value === fullId) return key;
		}
		return undefined;
	}

	private buildEmptyMessage(): { text: string; options: { reply_markup: { inline_keyboard: any[][] } } } {
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
