import { Message } from "node-telegram-bot-api";

import { BotMenuService } from "../../services/BotMenuService";
import { BotMessageService } from "../../services/BotMessageService.js";
import { ErrorService } from "../../services/ErrorService.js";
import { UserStateManager } from "../../state/UserStateManager.js";
import { cancelMsg } from "../../options/cancel.js";
import { MenuState } from "../../types/menuState.js";


export class PercentageCommand {
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

	public async execute(msg: Message): Promise<void> {
		const chatId = msg.chat.id;
		const percentage = +(msg.text ?? 5);
		const { prevMsgId, contract, btnType, network } = this.userState.getState(chatId);

		this.botMessageService.deleteMessage(chatId, prevMsgId).catch(() => {});
		try {
			let message;
			
			if (!this.isValidPercentage(percentage))
				message = await this.errorService.invalidPercentage(chatId);
			else {
				switch (btnType) {
					case MenuState.COINS:
						message = await this.botMenuService.sendCoinForStalking(chatId, contract);
						break;
					case MenuState.NFTS:
						message = await this.botMenuService.sendCollectionForStalking(
							chatId, 
							network, 
							contract
						);
						break;
					default:
						message = await this.errorService.sendErrorMessage(chatId, `Unknown option.`);
						break;
				}
			}
			this.userState.setState(chatId, {
				percentage: percentage,
				prevMsgId: message.message_id
			});
		} catch (error: any) {
			const msg = await this.errorService.sendErrorMessage(chatId, error.message);
			this.userState.setState(chatId, {
				prevMsgId: msg.message_id
			})
		}
	}

	private isValidPercentage(percentage: number): boolean {
		return !isNaN(percentage) && percentage > 0;
	}
}
