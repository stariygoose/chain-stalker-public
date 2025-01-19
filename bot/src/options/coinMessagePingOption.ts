import { ParseMode } from "node-telegram-bot-api";
import { IPing, ICoin } from "../types/interfaces.js";

export function coinMessagePingOption(data: IPing<ICoin>) {
	const { percentage } = data;
	if (percentage < 0)
		return coinNegativeMessagePing(data);
	else
		return coinPositiveMessagePing(data);
}

function coinNegativeMessagePing(data: IPing<ICoin>) {
	const text = `🪙 ${data.target.symbol}\n` +
	`🔻 The price changed by -${data.percentage.toFixed(2)}%\n`+
	`💲 Current price: ${data.target.price} USDT`;
	return {
		text,
		options: {
			parse_mode: "HTML" as ParseMode,
			disable_web_page_preview: true
		}
	}
}

function coinPositiveMessagePing(data: IPing<ICoin>) {
	const text = `🪙 ${data.target.symbol}\n`+
	`🚀 The price changed by +${data.percentage.toFixed(2)}%\n`+
	`💲 Current price: ${data.target.price} USDT`;
	return {
		text,
		options: {
			parse_mode: "HTML" as ParseMode,
			disable_web_page_preview: true
		}
	}
}