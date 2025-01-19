import { ParseMode } from "node-telegram-bot-api";
import { IPing, ICollection } from "../types/interfaces.js";

export function nftMessagePingOption(data: IPing<ICollection>) {
	const { percentage } = data;
	if (percentage < 0)
		return nfgNegativeMessagePing(data);
	else
		return nftPositiveMessagePing(data);
}

function nfgNegativeMessagePing(data: IPing<ICollection>) {
	const url = `https://opensea.io/collection/${data.target.collection}`;
	const text = `<a href="${url}"> 🖼️ ${data.target.collection}</a>\n
	🔻 The price changed by -${data.percentage.toFixed(2)}%\n
	💲 Current FP: ${data.target.floorPrice} ETH`;
	return {
		text,
		options: {
			parse_mode: "HTML" as ParseMode,
			disable_web_page_preview: true
		}
	}
}

function nftPositiveMessagePing(data: IPing<ICollection>) {
	const url = `https://opensea.io/collection/${data.target.collection}`;
	const text = `<a href="${url}"> 🖼️ ${data.target.collection}</a>\n
	🚀 The price changed by +${data.percentage.toFixed(2)}%\n
	💲 Current FP: ${data.target.floorPrice} ETH`;
	return {
		text,
		options: {
			parse_mode: "HTML" as ParseMode,
			disable_web_page_preview: true
		}
	}
}