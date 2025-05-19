import { inject, injectable } from "inversify";
import { ParseMode } from "telegraf/types";

import { Command } from "#handlers/commands/command.abstract.js";
import { IBot } from "#bot/bot.js";
import { ILogger } from "#config/index.js";
import { COMMAND_TYPES, TYPES } from "#di/index.js";
import { ApiService } from "#lib/api/api.service.js";
import { NftSubscription, Subscription, TokenSubscription } from "#lib/api/response.js";
import { Buttons } from "#ui/index.js";
import { MyContext } from "#context/context.interface.js";
import { ApiError } from "#errors/errors/api.error.js";
import { MenuCommand } from '#handlers/commands/commands/menu.command.js';



@injectable()
export class EditSubscriptionCommand extends Command {
	public static readonly handler: RegExp = /^edit_.+/;

	constructor (
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
		this.bot.command(EditSubscriptionCommand.handler, async (ctx) => {
			try {
				const hashId = ctx.text?.split('_')[1];
				if (!hashId) return;

				const targetId = ctx.session.subsIdsHashTable?.[hashId];
	
				await this.showSubscriptionInfo(ctx, targetId);
			} catch (error) {
				if (error instanceof ApiError) {
					await this._menuCommand.showMenu(
						ctx,
						error.botMessage
					);
					return ;
				}
					
				this._logger.error(`Error while User ${ctx.from?.id} was trying to call a COMMAND EDIT. Error ${(error as Error).message}`);
				await this._menuCommand.showMenu(
					ctx,
					`⚠️ Unexpected error. Please, try again later.`
				);
			}
		});
	}

	public async showSubscriptionInfo(
		ctx: MyContext, 
		id: string
	): Promise<void> {
		try {
			const subscription = await this._apiService.getSubscription(
				ctx,
				id
			);

			ctx.session.targetToEdit = subscription;
		
			const { text, options } = this.buildSubscriptionMessage(subscription);
			await ctx.reply(text, options);
		} catch (error: unknown) {
			throw error;
		}
	}
	
	private buildSubscriptionMessage(
		subscription: Subscription
	): {
		text: string;
		options: {
			parse_mode: ParseMode;
			reply_markup: {
				inline_keyboard: { text: string; callback_data: string }[][];
			};
		};
	} {
		try {
			const { target, strategy, isActive } = subscription;
			const status = isActive ? '🟢' : '🔴';
			let thresholdUnit = strategy.type === 'percentage' ? '%' : '$';

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

					if (strategy.type === 'absolute')
						thresholdUnit = nft.symbol;

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
				`<b>⚖️ Threshold:</b> ${strategy.threshold} ${thresholdUnit}`,
				`<b>🎯 Strategy:</b> ${strategy.type}`
			);

			const text = [`<b>${label}</b>`, ...lines].join('\n');
			const options = this.buildInlineKeyboard(isActive);

			return { text, options };
		} catch (error: unknown) {
			throw error;
		}
	}

	private buildInlineKeyboard(isActive: boolean) {
		const strategyBtn = Buttons.changeStrategyBtn;
		const statusBtn = Buttons.subStatusBtn(isActive);
		const deleteBtn = Buttons.deleteBtn;

		return {
			parse_mode: 'HTML' as ParseMode,
			reply_markup: {
				inline_keyboard: [
					[
						{ text: strategyBtn.text, callback_data: strategyBtn.callback_data },
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
