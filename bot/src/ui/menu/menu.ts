import { ParseMode } from "telegraf/types";
import { Markup } from "telegraf";

import { Buttons } from "#ui/index.js";



export const menuOption = {
	text: `Choose what to stalk:`,
	options: {
		parse_mode: "HTML" as ParseMode,
		...Markup.inlineKeyboard([
			[
				Markup.button.callback(Buttons.tokenCommand.text, Buttons.tokenCommand.callback_data), 
				Markup.button.callback(Buttons.collectionCommand.text, Buttons.collectionCommand.callback_data) 
			],
			[
				Markup.button.callback(Buttons.myStalksCommand.text, Buttons.myStalksCommand.callback_data) 
			]
		])
	}
}