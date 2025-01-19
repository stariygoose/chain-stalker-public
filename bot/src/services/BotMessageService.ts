import TelegramBot, { Message } from "node-telegram-bot-api";

import { AbstractBot } from "../abstract/abstractBot.js";
import { menuOption } from "../options/menu.js";
import { IPing, ICollection, ICoin } from "../types/interfaces.js";
import { nftMessagePingOption } from "../options/nftMessagePingOption.js";
import { coinMessagePingOption } from "../options/coinMessagePingOption.js";


class BotMessageService extends AbstractBot {
	constructor(bot: TelegramBot) {
		super(bot);
	}

	public static async processCoinPriceChanged(priceChangedData: IPing<ICoin>, bot: TelegramBot) {
		const chatId = priceChangedData.userId;
		const { text, options } = coinMessagePingOption(priceChangedData);

		try {
			await bot.sendMessage(chatId, text, options);
		} catch (error: any) {
			console.error(`[ERROR]: Failed to send coin price change notification.`, {
				chatId: chatId,
				priceChangedData: priceChangedData,
				error: error.message
			});
			throw new Error();
		}
	}

	public static async processNftPriceChanged(priceChangedData: IPing<ICollection>, bot: TelegramBot) {
		const chatId = priceChangedData.userId;
		const { text, options } = nftMessagePingOption(priceChangedData);
		try {
			await bot.sendMessage(chatId, text, options);
		} catch (error: any) {
			console.error(`[ERROR]: Failed to send NFT price change notification.`, {
				chatId: chatId,
				priceChangedData: priceChangedData,
				error: error.message
			});
			throw new Error();
		}
	}

	public async sendStartMsg(chatId: number): Promise<Message> {
		try {
			return this.bot.sendMessage(chatId, "Choose your option:", menuOption);
		} catch (error: any) {
			console.error(`[ERROR]: Failed to send start message.`, {
				chatId: chatId,
				error: error.message 
			});
			throw new Error("Failed to send start message.");
		}
	}
	
	public async sendMessage(chatId: number, text: string, options?: {}): Promise<Message> {
		try {
			return this.bot.sendMessage(chatId, text, options);
		} catch (error: any) {
			console.error(`[ERROR]: Failed to send message.`, {
				chatId: chatId,
				text: text,
				options: options,
				error: error.message
			});
			throw new Error("Failed to send message.");
		}
	}

	public async deleteMessage(chatId: number, msgId: number | null) {
		if (msgId != null) {
			try {
				await this.bot.deleteMessage(chatId, msgId);
			} catch (error) {
				console.error("[WARNING]: Message to delete not found in chat: ", chatId);
			}
		}
	}
}

export { BotMessageService };
