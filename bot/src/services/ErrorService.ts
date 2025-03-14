import { Message } from "node-telegram-bot-api";
import { BotMessageService } from "./BotMessageService.js";
import { UserStateManager } from "../state/UserStateManager.js";
import { menuOption } from "../options/menu.js";
import { NetworkState } from "../types/networkState.js";
import { cancelMsg } from "../options/cancel.js";

export class ErrorService {
	private botMessageService: BotMessageService;
	private userState: UserStateManager;
	
	constructor(botMessageService: BotMessageService, userState: UserStateManager) {
		this.botMessageService = botMessageService;
		this.userState = userState;
	}

	public async sendErrorMessage(chatId: number, message?: string): Promise<Message> {
		this.userState.resetState(chatId);
		try {
			const msg = message || "Unexpected error. Please try again later.";
			return await this.botMessageService.sendMessage(chatId, "🚨 " + msg, menuOption);
		} catch (error: any) {
			console.error(`[ERROR] Unexpected error while sending error message.`, {
				chatId: chatId,
				error: error.message
			});
			throw new Error("Failed to send error message.");
		}
	}

	public async unknownNetwork(chatId: number): Promise<Message> {
		try {
			const text = "❗ Wrong network. Please ensure the network is spelled correctly.\n"+
			`🟢 Available options: ${Object.values(NetworkState).join(", ")}`;
			return await this.botMessageService.sendMessage(chatId, text, cancelMsg);
		} catch (error: any) {
			console.error(`[ERROR] Unexpected error while sending error message.`, {
				chatId: chatId,
				error: error.message
			});
			throw new Error();
		}
	}

	public async invalidAddress(chatId: number): Promise<Message> {
		try {
			const text = `❗ Invalid contract address. Please use a valid EVM address.`;
			return await this.botMessageService.sendMessage(chatId, text, cancelMsg);
		} catch (error: any) {
			console.error(`[ERROR] Unexpected error while sending error message.`, {
				chatId: chatId,
				error: error.message
			});
			throw new Error();
		}
	}

	public async invalidPercentage(chatId: number): Promise<Message> {
		try {
			const text = `❗ Invalid percentage. The percentage must be strictly greater than zero.`;
			return await this.botMessageService.sendMessage(chatId, text, cancelMsg);
		} catch (error: any) {
			console.error(`[ERROR] Unexpected error while sending error message.`, {
				chatId: chatId,
				error: error.message
			});
			throw new Error();
		}
	}
}

export class ApiError extends Error {
	constructor(message?: string) {
		super(message);
		this.name = this.constructor.name;
	}
}

export class StatusError extends ApiError {
	constructor(readonly status: number, resource: string) {
		super(`Server error while trying to ${resource}.`);
		this.status = status;
		this.name = this.constructor.name;
	}
}

export class NotFoundError extends ApiError {
	readonly status: number = 404;

	constructor(message: string) {
		super(message);
	}
}