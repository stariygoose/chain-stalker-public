import { Bot } from "#bot/bot.js";
import { container, TYPES } from "#di/index.js";

const bot = container.get<Bot>(TYPES.Bot);

await bot.init();