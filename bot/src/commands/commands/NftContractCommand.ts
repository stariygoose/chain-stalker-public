import { Message } from "node-telegram-bot-api";

import { BotMenuService } from "../../services/BotMenuService.js";
import { ErrorService } from "../../services/ErrorService.js";
import { UserStateManager } from "../../state/UserStateManager.js";
import { BotMessageService } from "../../services/BotMessageService.js";
import { UserState } from "../../types/userState.js";

export class NftContractCommand {
	private botMessageService: BotMessageService;
	private botMenuService: BotMenuService;
	private userState: UserStateManager;
	private errorService: ErrorService;

	constructor (botMessageService: BotMessageService, botMenuService: BotMenuService,
				userState: UserStateManager, errorService: ErrorService)
	{
		this.botMessageService = botMessageService;
		this.botMenuService = botMenuService;
		this.userState = userState;
		this.errorService = errorService;
	}

	public async execute(msg: Message): Promise<void> {
		const chatId = msg.chat.id;
		const contract = msg.text;
		const { prevMsgId } = this.userState.getState(chatId);
	
		try {
			this.botMessageService.deleteMessage(chatId, prevMsgId);

			const msg = await this.botMenuService.sendPercentageMessage(chatId);
			this.userState.setState(chatId, {
				state: UserState.AWAITING_PERCENTAGE,
				contract: contract,
				prevMsgId: msg.message_id
			});
		} catch (error: any) {
			this.botMessageService.deleteMessage(chatId, prevMsgId);

			const errorMsg = await this.errorService.sendErrorMessage(chatId);
			this.userState.setState(chatId, { prevMsgId: errorMsg.chat.id })
		}
	}
}
