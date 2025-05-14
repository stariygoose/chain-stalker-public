import { inject, injectable } from "inversify";
import { ParseMode } from "telegraf/types";

import { Command } from "#handlers/commands/command.abstract.js";
import { IBot } from "#bot/bot.js";
import { ILogger } from "#config/index.js";
import { TYPES } from "#di/index.js";
import { ApiService } from "#lib/api/api.service.js";
import { NftSubscription, Subscription, TokenSubscription } from "#lib/api/response.js";
import { Buttons } from "#ui/index.js";
import { MyContext } from "#context/context.interface.js";


@injectable()
export class EditSubscriptionCommand extends Command {
	public static readonly handler: RegExp = /^edit_.+/;

	constructor (
		@inject(TYPES.Bot) public readonly bot: IBot,
		@inject(TYPES.Logger) private readonly _logger: ILogger,
		@inject(TYPES.ApiService) private readonly _apiService: ApiService
	) {
		super();
	}

	public handle(): void {
		this.bot.command(EditSubscriptionCommand.handler, async (ctx) => {
			try {
				const hashId = ctx.text?.split('_')[1];
				if (!hashId) return;
	
				await this.showSubscriptionInfo(ctx, hashId);
			} catch (error) {
				this._logger.error(`Error handling /edit_ command: ${(error as Error).message}`);
			}
		});
	}

	public async showSubscriptionInfo(
		ctx: MyContext, 
		hashId: string
	): Promise<void> {
		const targetId = ctx.session.subsIdsHashTable?.[hashId];
	
		if (!targetId) {
			await ctx.reply("⚠️ Subscription not found or expired.");
			return;
		}
	
		const subscription = await this._apiService.get<Subscription>(
			`${ApiService.SUBSCRIPTIONS_URL}/${targetId}`,
			ctx.session
		);
	
		const { text, options } = this.buildSubscriptionMessage(subscription, hashId);
		await ctx.reply(text, options);
	}
	
	private buildSubscriptionMessage(
		subscription: Subscription,
		hashId: string
	): {
		text: string;
		options: {
			parse_mode: ParseMode;
			reply_markup: {
				inline_keyboard: { text: string; callback_data: string }[][];
			};
		};
	} {
		const { target, strategy, isActive } = subscription;
		const status = isActive ? '🟢' : '🔴';
		const thresholdUnit = strategy.type === 'percentage' ? '%' : '$';

		let label: string;
		let lines: string[] = [];

		switch(target.type) {
			case 'nft':
				const nft = target as NftSubscription['target'];
				label = '🖼️ NFT Subscription';
				lines = [
					`<b>${status} ${nft.name}</b> on <i>${nft.chain}</i>`,
					`<b>🏷️ Last Notified Price:</b> ${nft.lastNotifiedPrice} ${nft.symbol}`,
				];
				break;
			case 'token':
				const token = target as TokenSubscription['target'];
				label = '🪙 Token Subscription';
				lines = [
					`<b>${status} ${token.symbol}</b>`,
					`<b>🏷️ Last Notified Price:</b> ${token.lastNotifiedPrice}$`,
				];
				break;
			default:
				throw new Error(`Unknown target type: ${subscription.target.type}`);
		}

		lines.push(
			`<b>⚖️ Threshold:</b> ${strategy.threshold}${thresholdUnit}`,
			`<b>🎯 Strategy:</b> ${strategy.type}`
		);

		const text = [`<b>${label}</b>`, ...lines].join('\n');
		const options = this.buildInlineKeyboard(hashId, isActive);

		return { text, options };
	}

	private buildInlineKeyboard(hashId: string, isActive: boolean) {
		const strategyBtn = Buttons.changeStrategyBtn(hashId);
		const thresholdBtn = Buttons.changeThesholdBtn(hashId);
		const statusBtn = Buttons.subStatusBtn(hashId, isActive);
		const deleteBtn = Buttons.deleteBtn(hashId);

		return {
			parse_mode: 'HTML' as ParseMode,
			reply_markup: {
				inline_keyboard: [
					[
						{ text: strategyBtn.text, callback_data: strategyBtn.callback_data },
						{ text: thresholdBtn.text, callback_data: thresholdBtn.callback_data }
					],
					[
						{
							text: statusBtn.text,
							callback_data: statusBtn.callback_data
						},
						{ text: deleteBtn.text, callback_data: deleteBtn.callback_data }
					],
					[
						{ text: Buttons.menuBtn.text, callback_data: Buttons.menuBtn.callback_data }
					]
				]
			}
		};
	}
}
