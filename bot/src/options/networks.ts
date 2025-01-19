import { NetworkState } from "../types/networkState.js";

const networksOption = {
	reply_markup: {
		inline_keyboard: [
			[{ text: "Ethereum", callback_data: NetworkState.ETHEREUM }],
			[{ text: "Solana", callback_data: NetworkState.SOLANA }],
			[{ text: "Arbitrum", callback_data: NetworkState.ARBITRUM }]
		]
	}
}

export {networksOption};