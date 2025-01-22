import { BotMenuService } from "../../services/BotMenuService.js";
import { BotMessageService } from "../../services/BotMessageService.js";
import { ErrorService } from "../../services/ErrorService.js";
import { UserStateManager } from "../../state/UserStateManager.js";
import { UserState } from "../../types/userState.js";


export class DeleteUserCommand {
	private userState: UserStateManager;
	private menuService: BotMenuService;
	private messageService: BotMessageService;
	private errorService: ErrorService;

	constructor(botMessageService: BotMessageService, botMenuService: BotMenuService,
		userStateManager: UserStateManager, errorService: ErrorService) {
		this.messageService = botMessageService;
		this.menuService = botMenuService;
		this.userState = userStateManager;
		this.errorService = errorService;
	}

	public async execute(chatId: number): Promise<void> {
		const userState = this.userState.getState(chatId);

		try {
			this.messageService.deleteMessage(chatId, userState.prevMsgId);
			const msg = await this.menuService.onDeleteUserBtn(chatId);
			this.userState.setState(chatId, {
				prevMsgId: msg.message_id,
				state: UserState.AWAITING_DELETE_CONFIRMATION
			})
		} catch (error: any) {
			this.messageService.deleteMessage(chatId, userState.prevMsgId);
			const msg = await this.errorService.sendErrorMessage(chatId, error.message);
			this.userState.setState(chatId, {
				prevMsgId: msg.message_id
			})
		}
	}
}
