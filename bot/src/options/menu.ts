import { ParseMode } from "node-telegram-bot-api";
import { MenuState } from "../types/menuState.js";

const menuOption = {
	reply_markup: {
		inline_keyboard: [
			[{ text: "Coins", callback_data: MenuState.COINS }],
			[{ text: "NFTs", callback_data: MenuState.NFTS }],
			[{ text: "My Stalks", callback_data: MenuState.SUBS_LIST }]
		]
	},
	parse_mode: "HTML" as ParseMode,
	disable_web_page_preview: true
};

export {menuOption};