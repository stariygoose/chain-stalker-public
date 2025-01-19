import TelegramBot from "node-telegram-bot-api";
import { isAddress } from "web3-validator";

abstract class AbstractBot {
	constructor(protected bot: TelegramBot) {
		this.bot = bot;
	}

	public checkAddressValidity(address: string) {
		return isAddress(address, true);
	}
}

export { AbstractBot };
