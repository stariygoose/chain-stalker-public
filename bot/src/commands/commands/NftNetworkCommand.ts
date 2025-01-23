import { Message } from "node-telegram-bot-api";

import { UserStateManager } from "../../state/UserStateManager.js";
import { BotMenuService } from "../../services/BotMenuService.js";
import { ErrorService } from "../../services/ErrorService.js";
import { UserState } from "../../types/userState.js";
import { BotMessageService } from "../../services/BotMessageService.js";
import { isValidNetwork } from "../../functions/functions.js";

export class NftNetworkCommand {
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
		this.errorService = errorService
	}

	public async execute(msg: Message): Promise<void> {
		const chatId = msg.chat.id;
		const network = msg.text?.toLowerCase();
		const { prevMsgId } = this.userState.getState(chatId);

		this.botMessageService.deleteMessage(chatId, prevMsgId).catch(() => {});
		try {
			if (isValidNetwork(network)) {
				const message = await this.botMenuService.sendContractMessage(chatId);
				this.userState.setState(chatId, {
					state: UserState.AWAITING_NFT_CONTRACT, 
					network: network, 
					prevMsgId: message.message_id
				});
			} else {
				const message = await this.errorService.unknownNetwork(chatId);
				this.userState.setState(chatId, {
					prevMsgId: message.message_id
				});
			}
		} catch (error: any) {
			const errorMsg = await this.errorService.sendErrorMessage(chatId);
			this.userState.setState(chatId, {
				prevMsgId: errorMsg.message_id
			});
		}
	}
}
