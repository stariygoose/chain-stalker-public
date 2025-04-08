import { EnvVariables, IConfigService } from "#config/index.js";
import { container } from "#di/container.js";
import { TYPES } from "#di/types.js";
import { IOption } from "#options/option.interface.js";

export function menu(): IOption {
	const config = container.get<IConfigService>(TYPES.ConfigService);
	const url = config.get(EnvVariables.DOMAIN_URL);

	return {
		message: `Choose what to stalk:`,
		option: {
			reply_markup: {
				inline_keyboard: [
					[ { text: "🪙 Token", callback_data: "token" }, { text: "🖼️ Collection", callback_data: "nft" } ],
		
					[ { text: "📋 My Stalks", callback_data: "stalks" } ],
					
					[ { text: "🌐 Open in browser", url: url } ]
				]
			}
		}
	};
}