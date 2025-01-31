import { Message } from "node-telegram-bot-api";
import { BotMessageService } from "./BotMessageService.js";
import { UserStateManager } from "../state/UserStateManager.js";
import { menuOption } from "../options/menu.js";

export class ErrorService {
	private botMessageService: BotMessageService;
	private userState: UserStateManager;
	
	constructor(botMessageService: BotMessageService, userState: UserStateManager) {
		this.botMessageService = botMessageService;
		this.userState = userState;
	}

	public async unknownError(chatId: number, message?: string): Promise<Message> {
		this.userState.resetState(chatId);
		try {
			const msg = message || "Unexpected error. Please try again later.";
			return this.botMessageService.sendMessage(chatId, "🚨 " + msg, menuOption);
		} catch (error: any) {
			console.error(`[ERROR] Unexpected error while sending error message.`, {
				error: error.message
			});
			throw new Error("Failed to send error message.");
		}
	}

	public async unknownNetwork(chatId: number): Promise<Message> {
		this.userState.resetState(chatId);
		const text = "❗Wrong network. Please ensure the network is spelled correctly.\n" +
		"❓If you're sure the network name is correct, it might not yet be supported by the bot."
		return this.botMessageService.sendMessage(chatId, text, menuOption);
	}
}

export class ApiError extends Error {
	constructor(message?: string) {
		super(message);
		this.name = this.constructor.name;
	}
}

export class StatusError extends Error {
	constructor(readonly status: number, resource: string) {
		super(`Server error while trying to ${resource}.`);
		this.status = status;
		this.name = this.constructor.name;
	}
}