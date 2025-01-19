import { Message } from "node-telegram-bot-api";

import { BotMenuService } from "../../services/BotMenuService.js";
import { BotMessageService } from "../../services/BotMessageService.js";
import { ErrorService } from "../../services/ErrorService.js";
import { UserStateManager } from "../../state/UserStateManager.js";

export class NftPercentageCommand {
	private botMessageService: BotMessageService;
	private botMenuService: BotMenuService;
	private userState: UserStateManager;
	private errorService: ErrorService;

	constructor(botMessageService: BotMessageService, botMenuService: BotMenuService,
		userState: UserStateManager, errorService: ErrorService)
	{
		this.botMessageService = botMessageService;
		this.botMenuService = botMenuService;
		this.userState = userState;
		this.errorService = errorService;
	}

	public async execute(msg: Message): Promise<void> {
		const chatId = msg.chat.id;
		const percentage = +(msg.text ?? 5);
		const { network, contract, prevMsgId } = this.userState.getState(chatId);

		try {
			this.botMessageService.deleteMessage(chatId, prevMsgId);

			if (percentage <= 0)
				throw new Error("You have to put percentage > 0. Try one more time.");

			const msg = await this.botMenuService.sendCollectionForStalking(
				chatId,
				network,
				contract
			);
			this.userState.setState(chatId, {
				percentage: percentage,
				prevMsgId: msg.message_id
			});
		} catch (error: any) {
			this.botMessageService.deleteMessage(chatId, prevMsgId);

			const errorMsg = await this.errorService.unknownError(chatId);
			this.userState.setState(chatId, {
				prevMsgId: errorMsg.message_id
			});
		}
		
	}
}
