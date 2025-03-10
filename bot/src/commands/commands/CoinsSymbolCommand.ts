import { Message } from "node-telegram-bot-api";

import { BotMenuService } from "../../services/BotMenuService";
import { BotMessageService } from "../../services/BotMessageService.js";
import { ErrorService } from "../../services/ErrorService.js";
import { UserStateManager } from "../../state/UserStateManager.js";
import { UserState } from "../../types/userState.js";


export class CoinsSymbolCommand {
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

	public async execute(msg: Message) {
		const chatId = msg.chat.id;
		const symbol = msg.text ?? "";
		const { prevMsgId } = this.userState.getState(chatId);

		this.botMessageService.deleteMessage(chatId, prevMsgId).catch(() => {});
		try {
			const msg = await this.botMenuService.sendPercentageMessage(chatId);
			this.userState.setState(chatId, {
				state: UserState.AWAITING_PERCENTAGE,
				contract: symbol,
				prevMsgId: msg.message_id
			});
		} catch (error: any) {
			const errorMsg = await this.errorService.sendErrorMessage(chatId);
			this.userState.setState(chatId, { prevMsgId: errorMsg.message_id })
		}
	}
}
