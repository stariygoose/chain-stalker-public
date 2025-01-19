import { SendMessageOptions } from "node-telegram-bot-api";
import { MenuState } from "../types/menuState.js";
import { ICoin } from "../types/interfaces.js";

export function coinFoundMsg(coin: ICoin): { text: string, options: SendMessageOptions } {
	const { symbol, price } = coin;
	const formattedPrice = parseFloat(price.toString()).toString();
	
	const text = `🪙 The price of ${symbol.toUpperCase()} is ${formattedPrice} USDT on Binance.\n` +
	`❓ Would you like to stalk this coin?`;
	return {
		text,
		options: {
			parse_mode: "HTML",
			disable_web_page_preview: true,
			reply_markup: {
				inline_keyboard: [
					[{ text: "✅ Yes", callback_data: MenuState.YES}],
					[{ text: "❌ No", callback_data: MenuState.CANCEL }]
				]
			}
		}
	};
}