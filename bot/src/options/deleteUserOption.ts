import { MenuState } from "../types/menuState.js";

export function deleteUserOption() {
	const text = `Are you sure to delete all your data?`;
	return {
		text,
		options: {
			parse_mode: "HTML",
			disable_web_page_preview: true,
			reply_markup: {
				inline_keyboard: [
					[{ text: "✅ Yes", callback_data: MenuState.YES }],
					[{ text: "❌ No", callback_data: MenuState.CANCEL }]
				]
			}
		}
	};
}
