import { menuOption } from "../../options/menu.js";
import { BotMessageService } from "../../services/BotMessageService.js";
import { UserStateManager } from "../../state/UserStateManager.js";

class CancelCommand {
	private botMessageService: BotMessageService;
	private userState: UserStateManager;

	constructor(botMessageService: BotMessageService, userState: UserStateManager) {
		this.botMessageService = botMessageService;
		this.userState = userState;
	}

	public async execute(chatId: number): Promise<void> {
		const state = this.userState.getState(chatId);

		try {
			this.botMessageService.deleteMessage(chatId, state.prevMsgId);

			const msg = await this.botMessageService.sendMessage(chatId, "Choose your option:", menuOption);
			this.userState.resetState(chatId);
			this.userState.setState(chatId, { prevMsgId: msg.message_id });
		} catch (e) {
			this.botMessageService.deleteMessage(chatId, state.prevMsgId);
			console.log(`[ERROR] Unexpected error after calling CANCEL button.`);
		}
	}
}

export {CancelCommand};