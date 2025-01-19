import TelegramBot, { CallbackQuery, Message } from "node-telegram-bot-api";

import { UserStateManager } from "../state/UserStateManager.js";
import { BotMessageService } from "../services/BotMessageService.js";
import { BotMenuService } from "../services/BotMenuService.js";
import { MenuState } from "../types/menuState.js";
import { UserState } from "../types/userState.js";
import { NftCommand } from "./commands/NftCommand.js";
import { ErrorService } from "../services/ErrorService.js";
import { CancelCommand } from "./commands/CancelCommand.js";
import { NftNetworkCommand } from "./commands/NftNetworkCommand.js";
import { NftContractCommand } from "./commands/NftContractCommand.js";
import { StartCommand } from "./commands/StartCommand.js";
import { YesCommand } from "./commands/YesCommand.js";
import { NftPercentageCommand } from "./commands/NftPercentageCommand.js";
import { MyStalksCommand } from "./commands/MyStalksCommand.js";
import { CoinsCommand } from "./commands/CoinsCommand.js";
import { CoinsSymbolCommand } from "./commands/CoinsSymbolCommand.js";
import { CoinsPercentageCommand } from "./commands/CoinsPercentageCommand.js";
import { ICoin, ICollection, IUserContext } from "../types/interfaces.js";


export class CommandRegistry {
	private bot: TelegramBot;
	private userStateManager: UserStateManager;
	private botMessageService: BotMessageService;
	private botMenuService: BotMenuService;
	private errorService: ErrorService;

	constructor(bot: TelegramBot) {
		this.bot = bot;
		this.userStateManager = new UserStateManager();
		this.botMessageService = new BotMessageService(bot);
		this.botMenuService = new BotMenuService(bot, this.botMessageService, this.userStateManager);
		this.errorService = new ErrorService(this.botMessageService, this.userStateManager);

		this.registerHandles();
	}

	private registerHandles() {
		this.processSlashCommands();

		this.bot.on("callback_query", (callback_query: CallbackQuery) => {
			const chatId = callback_query.from.id;
			const typeOfButtonClicked = callback_query.data;

			this.bot.answerCallbackQuery(callback_query.id);
			this.processCallbackQuery(chatId, typeOfButtonClicked);
		})

		this.bot.onText(/^[^/].*$/, (msg: Message) => {
			const chatId = msg.chat.id;
      		const userState = this.userStateManager.getState(chatId);
			
			this.processText(chatId, userState, msg);
		})
	}

	private processSlashCommands(): void {
		this.bot.onText(/\/(start|menu)/, async (msg) => {
			const chatId = msg.chat.id;
			new StartCommand(this.botMessageService, this.userStateManager, this.errorService)
				.execute(chatId);
		});
	}

	private processCallbackQuery(chatId: number, typeOfButtonClicked: string | undefined): void {
		switch (typeOfButtonClicked) {
			case MenuState.COINS:
				new CoinsCommand(this.botMessageService, this.botMenuService, this.userStateManager, this.errorService)
					.execute(chatId);
				break;
			case MenuState.NFTS:
				new NftCommand(this.botMessageService, this.botMenuService, this.userStateManager, this.errorService)
					.execute(chatId);
				break;
			case MenuState.SUBS_LIST:
				new MyStalksCommand(this.botMessageService, this.botMenuService, this.userStateManager, this.errorService)
					.execute(chatId);
				break;
			case MenuState.CANCEL:
				new CancelCommand(this.botMessageService, this.userStateManager)
					.execute(chatId);
				break;
			case MenuState.YES:
				new YesCommand(this.botMessageService, this.botMenuService, this.userStateManager, this.errorService)
					.execute(chatId);
				break;
			default:
				console.error(`[UNEXPECTED ERROR]: Type of callback query is unknown. Default case error.`, {
					typeOfButtonClicked: typeOfButtonClicked
				})
				this.errorService.unknownError(chatId, `Unexpected error.`);
				break;
		}
	}

	private processText(chatId: number, userState: IUserContext<ICollection | ICoin>, msg: Message): void {
		switch (userState.state) {
			case UserState.AWAITING_COIN_SYMBOL:
				new CoinsSymbolCommand(this.botMessageService, this.botMenuService, this.userStateManager, this.errorService)
					.execute(msg);
				break;
			case UserState.AWAITING_COIN_PERCENTAGE:
				new CoinsPercentageCommand(this.botMessageService, this.botMenuService, this.userStateManager, this.errorService)
					.execute(msg);
				break;
			case UserState.AWAITING_NFT_NETWORK:
				new NftNetworkCommand(this.botMessageService, this.botMenuService, this.userStateManager, this.errorService)
					.execute(msg);
				break;
			case UserState.AWAITING_NFT_CONTRACT:
				new NftContractCommand(this.botMessageService, this.botMenuService, this.userStateManager, this.errorService)
					.execute(msg);
				break;
			case UserState.AWAITING_NFT_PERCENTAGE:
				new NftPercentageCommand(this.botMessageService, this.botMenuService, this.userStateManager, this.errorService)
					.execute(msg);
				break;
			default:
				new StartCommand(this.botMessageService, this.userStateManager, this.errorService)
					.execute(chatId);
				break;
		}
	}
}
