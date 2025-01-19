import TelegramBot from "node-telegram-bot-api";
import axios from "axios";
import dotenv from "dotenv";
dotenv.config();

import { startBotServer } from "./server/server.js";
import { CommandRegistry } from "./commands/CommandRegistry.js";

const token = process.env.TG_TOKEN ? process.env.TG_TOKEN : "";
const server_url = process.env.SERVERBOT_URL ? process.env.SERVERBOT_URL : "";
const bot = new TelegramBot(token);

bot.setWebHook(`${server_url}/bot${token}`).then(() => {
	console.log("[INFO]: Setting up a webhook...");
})
.catch((error) => {
	console.error("[CRITICAL ERROR]: Error setting up a webhook: ", {
		error: error.message
	});
	process.exit(1);
});

async function setTelegramWebhook() {
	try {
		await axios.post(`https://api.telegram.org/bot${token}/\
			setWebhook?url=${server_url}/bot`);
		console.log("[INFO]: Webhook has been successfully set up");
	} catch (error: any) {
		console.error("[CRITICAL ERROR]: Error setting up a webhook.", {
			error: error.message
		});
		process.exit(1);
	}
  }
  
startBotServer().then(() => {
	setTimeout(setTelegramWebhook, 3000);
});

new CommandRegistry(bot);

export { bot };
