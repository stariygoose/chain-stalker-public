import { BotMenuService } from "../../services/BotMenuService.js";
import { BotMessageService } from "../../services/BotMessageService.js";
import { ErrorService } from "../../services/ErrorService.js";
import { UserStateManager } from "../../state/UserStateManager.js";
import { MenuState } from "../../types/menuState.js";
import { UserState } from "../../types/userState.js";

class NftCommand {
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

	public async execute(chatId: number): Promise<void> {
		const state = this.userState.getState(chatId);
		
		try {
			this.botMessageService.deleteMessage(chatId, state.prevMsgId);

			const msg = await this.botMenuService.sendNetworkMessage(chatId);
			this.userState.setState(chatId, {
				state: UserState.AWAITING_NFT_NETWORK,
				btnType: MenuState.NFTS,
				prevMsgId: msg.message_id
			}); 
		} catch (e) {
			this.botMessageService.deleteMessage(chatId, state.prevMsgId);
			
			const msg = await this.errorService.sendErrorMessage(chatId);
			this.userState.setState(chatId, { prevMsgId: msg.message_id });
		}
	}
}

export {NftCommand};