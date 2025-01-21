import TelegramBot, { Message } from "node-telegram-bot-api";

import { AbstractBot } from "../abstract/abstractBot.js";
import { BotMessageService } from "./BotMessageService.js";
import { cancelMsg } from "../options/cancel.js";
import { ApiService } from "./ApiService.js";
import { NetworkStateKeys } from "../types/networkState.js";
import { collectionFoundMsg } from "../options/collectionFound.js";
import { ICoin, ICollection, IUserContext } from "../types/interfaces.js";
import { UserStateManager } from "../state/UserStateManager.js";
import { menuOption } from "../options/menu.js";
import { myStalks } from "../options/myStalks.js";
import { coinFoundMsg } from "../options/coinFound.js";
import { isTargetCoin, isTargetNftCollection } from "../functions/functions.js";
import { ApiError, StatusError } from "./ErrorService.js";
import { UserState } from "../types/userState.js";
import { deleteUserOption } from "../options/deleteUserOption.js";

class BotMenuService extends AbstractBot {
	private ApiService: ApiService;
	private botMessageService: BotMessageService;
	private userState: UserStateManager;

	constructor(bot: TelegramBot, botMessageService: BotMessageService, userState: UserStateManager) {
		super(bot);
		this.botMessageService = botMessageService;
		this.userState = userState;
		this.ApiService = new ApiService();
	}


	public async sendTokenSymbolMessage(chatId: number): Promise<Message> {
		try {
			const text = "🪙 Please provide the token's symbol."
			return this.botMessageService.sendMessage(chatId, text, cancelMsg);
		} catch (error: any) {
			console.error(`[ERROR]: Unexpected error while sending token symbol request.`, {
				chatId: chatId,
				error: error.messsage
			});
			throw new Error("Failed to send token symbol request.");
		}
	}

	public async sendCoinForStalking(chatId: number, symbol: string | null): Promise<Message> {
		if (!symbol)
			throw new Error("Coin symbol is missing. Please try again.");

		try {
			const coin = await this.ApiService.findCoin(symbol.toLowerCase());
			if (!coin) {
				const text = "❌ Coin not found or unavailable on Binance."
				return this.botMessageService.sendMessage(chatId, text, menuOption);
			}

			const { text, options } = coinFoundMsg(coin);
			this.userState.setState(chatId, {
				target: coin
			})

			return this.bot.sendMessage(chatId, text, options);
		} catch (error: any) {
			if (error instanceof ApiError || error instanceof StatusError)
				throw error;

			console.error(`[ERROR]: Unexpected error while processing coin stalking request.`, {
				chatId: chatId,
				symbol: symbol,
				error: error.message
			});
			throw new Error(error.message);
		}
	}

	public async sendNetworkMessage(chatId: number): Promise<Message> {
		try {
			const text = "🌐 Please select a network.\nAvailable options: ethereum";
			return this.botMessageService.sendMessage(chatId, text, cancelMsg);
		} catch (error: any) {
			console.error(`[ERROR]: Unexpected error while sending network selection message.`, {
				chatId: chatId,
				error: error.message
			});
			throw new Error();
		}
	}

	public async sendContractMessage(chatId: number): Promise<Message> {
		try {
			const text = "📜 Please provide the contract address:";
			return this.botMessageService.sendMessage(chatId, text, cancelMsg);
		} catch (error: any) {
			console.error(`[ERROR]: Unexpected error while sending contract address request.`, {
				chatId: chatId,
				error: error.message
			});
			throw new Error();
		}
	}

	public async sendPercentageMessage(chatId: number): Promise<Message> {
		try {
			const text = "🏷️ Please provide your percentage (recommended: 5%)."
			return this.botMessageService.sendMessage(chatId, text, cancelMsg);
		} catch (error: any) {
			console.error(`[ERROR]: Unexpected error while sending percentage request.`, {
				chatId: chatId,
				error: error.message
			});
			throw new Error();
		}
	}

	public async sendCollectionForStalking(chatId: number, network: NetworkStateKeys | null, address: string | null)
		: Promise<Message> {
		try {
			if (!address || !network)
				throw new Error("Invalid parameters. Please try again.");

			const collection = await this.ApiService.findCollection(network, address);
			if (!collection) {
				const text = "❌ Collection not found or unavailable on OpenSea."
				return this.botMessageService.sendMessage(chatId, text, menuOption);
			}

			const { text, options } = collectionFoundMsg(collection);
			this.userState.setState(chatId, {
				target: collection
			})
			return this.botMessageService.sendMessage(chatId, text, options);
		} catch (error: any) {
			if (error instanceof ApiError || error instanceof StatusError)
				throw error;

			console.error(`[ERROR]: Unexpected error while processing collection stalking request.`, {
				chatId: chatId,
				network: network,
				address: address,
				error: error.message
			})
			throw new Error(error.message);
		}
	}

	public async onYesBtn(chatId: number, state: IUserContext<ICollection | ICoin>): Promise<Message> {
		try {
			if (isTargetNftCollection(state)) {
				const res = await this.ApiService.stalkNftContract(chatId, state);
				return this.botMessageService.sendMessage(chatId, `🕵🏻‍♂️ ${res.message}`, menuOption);
			}
			else if (isTargetCoin(state)) {
				const res = await this.ApiService.stalkCoin(chatId, state);
				return this.botMessageService.sendMessage(chatId, `🕵🏻‍♂️ ${res.message}`, menuOption);
			} else if (state.state == UserState.AWAITING_DELETE_CONFIRMATION) {
				await this.deleteUser(chatId);
				return this.botMessageService.sendMessage(chatId, "Your data was successfuly deleted.", menuOption);
			} else {
				return this.botMessageService.sendMessage(chatId, "🤬 There was an issue." +
					"Please try again.", menuOption);
			}
		} catch (error: any) {
			if (error instanceof StatusError || error instanceof ApiError)
				throw error;

			console.error(`[UNEXPECTED ERROR]: Unexpected error in onYesBtn.`, {
				chatId: chatId,
				state: state,
				error: error.message
			})
			throw new Error();
		}
	}

	public async onMyStalksBtn(chatId: number): Promise<Message> {
		try {
			const subs = await this.ApiService.getSubscriptionsByUser(chatId);
			if (!subs.subscriptions) {
				const text = "👁️‍🗨️ You don't have any active stalks.";
				return this.botMessageService.sendMessage(chatId, text, menuOption);
			}

			const text = myStalks(subs);

			return this.botMessageService.sendMessage(chatId, text, menuOption);
		} catch (error: any) {
			if (error instanceof ApiError || error instanceof StatusError)
				throw error;

			console.error(`[UNEXPECTED ERROR]: Unexpected error in onMyStalksBtn.`, {
				chatId: chatId,
				error: error.message
			});
			throw new Error("Failed to retrieve your stalks.");
		}
	}

	public async onDeleteUserBtn(chatId: number): Promise<Message> {
		try {
			const { text, options } = deleteUserOption();
			return this.botMessageService.sendMessage(chatId, text, options);
		} catch (error: any) {
			console.log(`[UNEXPECTED ERROR]: Unexpected error in onDeleteUserBtn.`, {
				chatId: chatId,
				error: error.message
			})
			throw new Error("Failed to send confirmation message. Try later.");
		}
	}

	private async deleteUser(chatId: number): Promise<void> {
		try {
			return await this.ApiService.deleteUser(chatId);
		} catch (error: any) {
			if (error instanceof ApiError || error instanceof StatusError)
				throw error;

			console.log(`[UNEXPECTED ERROR]: Unexpected error in deleteUser.`, {
				chatId: chatId,
				error: error.message
			})
			throw new Error("Failed to delete your data.");

		}
	}
}

export { BotMenuService };
