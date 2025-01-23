import { BotMenuService } from "../../services/BotMenuService";
import { BotMessageService } from "../../services/BotMessageService.js";
import { ErrorService } from "../../services/ErrorService.js";
import { UserStateManager } from "../../state/UserStateManager.js";
import { MenuState } from "../../types/menuState.js";
import { UserState } from "../../types/userState.js";

export class CoinsCommand {
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

		this.botMessageService.deleteMessage(chatId, currState.prevMsgId).catch(() => {});
		try {
			const msg = await this.botMenuService.sendTokenSymbolMessage(chatId);
			this.userState.setState(chatId, {
				state: UserState.AWAITING_COIN_SYMBOL,
				btnType: MenuState.COINS,
				prevMsgId: msg.message_id
			})
		} catch (error: any) {
			const msg = await this.errorService.sendErrorMessage(chatId, error.message);
			this.userState.setState(chatId, { prevMsgId: msg.message_id })
		}
	}
}
