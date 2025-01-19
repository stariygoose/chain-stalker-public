import { MenuState } from "../types/menuState.js";

const cancelMsg = {
	reply_markup: {
		inline_keyboard: [
			[{ text: "Cancel", callback_data: MenuState.CANCEL }],
		],
		resize_keyboard: true,
	}
}

export {cancelMsg};