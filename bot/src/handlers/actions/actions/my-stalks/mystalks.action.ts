import { inject, injectable } from "inversify";

import { IBot } from "#bot/bot.js";
import { ILogger } from "#config/index.js";
import { COMMAND_TYPES, TYPES } from "#di/types.js";
import { Action } from "#handlers/actions/action.abstract.js";
import { Buttons, ChainStalkerMessage } from "#ui/index.js";
import { ApiService } from "#lib/api/api.service.js";
import { ApiError } from "#errors/errors/api.error.js";
import { MenuCommand } from "#handlers/commands/commands/menu.command.js";
import { MyContext } from "#context/context.interface.js";
import { Subscription } from "#lib/api/response.js";
import { safeNanoId } from "#lib/helpers/helpers.js";



@injectable()
export class MyStalksAction extends Action {
	public static readonly handler = Buttons.myStalksCommand.callback_data;

	constructor(
		@inject(TYPES.Bot)
		public readonly bot: IBot,
		@inject(TYPES.Logger)
		private readonly _logger: ILogger,
		@inject(TYPES.ApiService)
		private readonly _apiService: ApiService,
		@inject(COMMAND_TYPES.MenuCommand)
		private readonly _menuCommand: MenuCommand
	) {
		super();
	}

	public handle(): void {
		this.bot.action(MyStalksAction.handler, async (ctx) => {
			try {
				const response = await this._apiService.getStalks(ctx);

				const { subscriptions } = response;

				this.cacheSubscriptionIds(ctx, subscriptions);

				const message = subscriptions
					.map((sub) => this.formatSubscriptionMessage(ctx, sub))
					.join('\n\n');

				await ctx.reply(
					message, 
					{
						parse_mode: "HTML",
						reply_markup: {
							inline_keyboard: [[
								{ text: Buttons.menuBtn.text, callback_data: Buttons.menuBtn.callback_data }
							]]
						}
					}
				);
			} catch (error) {
				if (error instanceof ApiError) {
					await this._menuCommand.showMenu(
						ctx,
						error.botMessage
					);
					return ;
				}

				this._logger.error(`Unexpected error when user ${ctx.from?.id} was trying to see them stalks: ${(error as Error).message}`);
				await this._menuCommand.showMenu(
					ctx,
					ChainStalkerMessage.SMS.UNKNOWN_ERROR
				);
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
		const unit = strategy.type === 'percentage' ? '%' : target.type === 'nft' ? target.symbol : '$';
		const thresholdText = `<b>${strategy.threshold} ${unit}</b>\n<i>${strategy.type}</i> threshold.`;

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
}
