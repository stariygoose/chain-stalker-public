import { BotMessageService } from "../../services/BotMessageService.js";
import { ErrorService } from "../../services/ErrorService.js";
import { UserStateManager } from "../../state/UserStateManager.js";

class StartCommand {
	private botMessageService: BotMessageService;
	private errorService: ErrorService;
	private userState: UserStateManager;

	constructor(botMessageService: BotMessageService, userState: UserStateManager,
				errorService: ErrorService
	) {
		this.botMessageService = botMessageService;
		this.errorService = errorService;
		this.userState = userState;
	}

	public async execute(chatId: number): Promise<void> {
		const currState = this.userState.getState(chatId);
		
		try {
			this.botMessageService.deleteMessage(chatId, currState.prevMsgId);

			const msg = await this.botMessageService.sendStartMsg(chatId);
			this.userState.resetState(chatId);
			this.userState.setState(chatId, { prevMsgId: msg.message_id });
		} catch (error: any) {
			this.botMessageService.deleteMessage(chatId, currState.prevMsgId);

			const errorMsg = await this.errorService.sendErrorMessage(chatId);
			this.userState.setState(chatId, { prevMsgId: errorMsg.message_id });
		}
	}
}

export {StartCommand};