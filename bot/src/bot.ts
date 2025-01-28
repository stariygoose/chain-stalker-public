import TelegramBot from "node-telegram-bot-api";
import axios from "axios";
import dotenv from "dotenv";
dotenv.config();

import { startBotServer } from "./server/server.js";
import { CommandRegistry } from "./commands/CommandRegistry.js";

const TG_BOT_TOKEN = process.env.TG_TOKEN ?? "ERROR";
const DOMAIN_URL = process.env.DOMAIN_URL ?? "ERROR";
const TELEGRAM_API_URL = `https://api.telegram.org/bot${TG_BOT_TOKEN}`;
const WEBHOOK_URL = `https://${DOMAIN_URL}/webhook`;

const bot = new TelegramBot(TG_BOT_TOKEN);

function setTelegramWebhook() {
	axios.post(`${TELEGRAM_API_URL}/setWebhook`, {
		url: WEBHOOK_URL
	})
	.then(() => {
		console.log('[INFO]: Webhook for telegram bot set successfully.');
	})
	.catch(error => {
		console.error('[CRITICAL ERROR]: Error setting a webhook for telegram bot.', {
			error: error.message,
			token: TG_BOT_TOKEN,
			domain: DOMAIN_URL
		});
		process.exit(1);
	});
}
  
startBotServer().then(() => {
	setTimeout(setTelegramWebhook, 3000);
});

new CommandRegistry(bot);

export { bot };
