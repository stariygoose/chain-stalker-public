import { inject, injectable } from "inversify";

import { IBot } from "#bot/bot.js";
import { Command } from "#handlers/commands/command.abstract.js";
import { TYPES } from "#di/types.js";
import { ILogger } from "#config/index.js";
import { ApiService } from "#lib/api/api.service.js";
import { NftSubscription, Subscription, TokenSubscription } from '#lib/api/response.js';
import { ParseMode } from 'telegraf/types';


@injectable()
export class EditSubscriptionCommand extends Command {
	public static readonly handler: RegExp = /^edit_.+/;

	constructor (
		@inject(TYPES.Bot)
		public readonly bot: IBot,
		@inject(TYPES.Logger)
		private readonly _logger: ILogger,
		@inject(TYPES.ApiService)
		private readonly _apiService: ApiService
	) {
		super();
	}

	public handle(): void {
		this.bot.command(EditSubscriptionCommand.handler, async (ctx) => {
			try {
				const targetHash = ctx.text?.split('_')[1];
				const targetId = ctx.session.subsIdsHashTable[targetHash!];

				const subscription = await this._apiService.get<Subscription>(
					ApiService.SUBSCRIPTIONS_URL + `/${targetId}`,
					ctx.session
				);

				const message = this.getMessageBasedTarget(subscription, targetHash!);

				await ctx.reply(
					message.text,
					message.options
				);
			} catch (error) {
				if (error instanceof Error) this._logger.error(error.message); 
			}
		});
	}

	private getMessageBasedTarget(subscription: Subscription, hashId: string)
	: {
		text: string;
		options: {
			parse_mode: ParseMode;
			reply_markup: {
					inline_keyboard: {
							text: string;
							callback_data: string;
					}[][];
			};
		};
	} {
		const { target } = subscription;

		switch (target.type) {
			case 'nft':
				return this.getNftMessage(subscription as NftSubscription, hashId);
			case 'token':
				return this.getTokenMessage(subscription as TokenSubscription, hashId);
			default:
				this._logger.debug(`Invalid target type: ${subscription.target.type}`);
				throw new Error("Invalid target type");
		}
	}

	private getNftMessage(
		subscription: NftSubscription,
		hashId: string
	) {
		const activityIndificator = subscription.isActive ? '🟢' : '🔴';
		const endingForThreshold = subscription.strategy.type === "percentage" ? "%" : "$";
		
		const message = [
			`<b>🖼️ NFT Subscription</b>`,
			`<b>${activityIndificator} ${subscription.target.name}</b> on <i>${subscription.target.chain}</i>`,
			`<b>🏷️ Last Notified Price:</b> ${subscription.target.lastNotifiedPrice} ${subscription.target.symbol}`,
			`<b>⚖️ Threshold:</b> ${subscription.strategy.threshold}${endingForThreshold}`,
			`<b>🎯 Strategy:</b> ${subscription.strategy.type}`
		];

		const options = {
			parse_mode: 'HTML' as ParseMode,
			reply_markup: {
				inline_keyboard: [
					[
						{ text: '🎯 Change strategy', callback_data: `edit:${hashId}:edit` },
						{ text: '⚖️ Change threshold', callback_data: `edit:${hashId}:threshold` }
					], 
					[ 
						{ text: subscription.isActive ? '🔴 Deactivate' : '🟢 Activate', callback_data: `edit:${hashId}:isActive:${subscription.isActive ? false : true}` },
						{ text: '🗑️ Delete', callback_data: `edit:${hashId}:delete` }
					]
				]
			}
		}

		return {
			text: message.join('\n'),
			options: options
		}
	}

	private getTokenMessage(
		subscription: TokenSubscription,
		hashId: string
	) {
		const activityIndificator = subscription.isActive ? '🟢' : '🔴';
		const endingForThreshold = subscription.strategy.type === "percentage" ? "%" : "$";
		
		const message = [
			`<b>🪙 Token Subscription</b>`,
			`<b>${activityIndificator} ${subscription.target.symbol}</b> `,
			`<b>🏷️ Last Notified Price:</b> ${subscription.target.lastNotifiedPrice}$`,
			`<b>⚖️ Threshold:</b> ${subscription.strategy.threshold}${endingForThreshold}`,
			`<b>🎯 Strategy:</b> ${subscription.strategy.type}`
		];

		const options = {
			parse_mode: 'HTML' as ParseMode,
			reply_markup: {
				inline_keyboard: [
					[
						{ text: '🎯 Change strategy', callback_data: `edit:${hashId}:strategy` },
						{ text: '⚖️ Change threshold', callback_data: `edit:${hashId}:threshold` }
					], 
					[ 
						{ text: subscription.isActive ? '🔴 Deactivate' : '🟢 Activate', callback_data: `edit:${hashId}:isActive:${subscription.isActive ? false : true}` },
						{ text: '🗑️ Delete', callback_data: `edit:${hashId}:delete` }
					]
				]
			}
		}

		return {
			text: message.join('\n'),
			options: options
		}
	}
}