import { BotMenuService } from "../../services/BotMenuService";
import { BotMessageService } from "../../services/BotMessageService.js";
import { ErrorService } from "../../services/ErrorService.js";
import { UserStateManager } from "../../state/UserStateManager.js";

class MyStalksCommand {
	private botMessageService: BotMessageService;
	private botMenuService: BotMenuService;
	private userState: UserStateManager;
	private errorService: ErrorService;

	constructor(botMessageService: BotMessageService, botMenuService: BotMenuService,
		userState: UserStateManager, errorService: ErrorService) {
		this.botMessageService = botMessageService;
		this.botMenuService = botMenuService;
		this.userState = userState;
		this.errorService = errorService;
	}

	public async execute(chatId: number): Promise<void> {
		const currState = this.userState.getState(chatId);

		try {
			this.botMessageService.deleteMessage(chatId, currState.prevMsgId);

			const msg = await this.botMenuService.onMyStalksBtn(chatId);
			this.userState.setState(chatId, {
				prevMsgId: msg.message_id
			})
		} catch (error: any) {
			this.botMessageService.deleteMessage(chatId, currState.prevMsgId);

			const msg = await this.errorService.sendErrorMessage(chatId, error.message);
			this.userState.setState(chatId, { prevMsgId: msg.message_id });
		}
	}
}

export { MyStalksCommand };