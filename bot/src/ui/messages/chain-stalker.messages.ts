import { MyContext } from "#context/context.interface.js";
import { NftAlert, TokenAlert } from "#lib/redis/pubsub/redis.pubsub.js";
import { ICreateCollectionSceneWizard } from "#scenes/scenes/create-collection/create-collection.scene.js";
import { ICreateTokenSceneWizard } from "#scenes/scenes/create-token/create-token.scene.js";

export const ChainStalkerMessage = {
	API: {
		LOGIN_CONFLICT: "⚠️ Echo rejected. You are already within the system.",
		LOGIN_BAD_REQUEST: "⚠️ The invocation failed. Your signal was malformed. Contact @stariy_goose for trace diagnostics.",
		LOGIN_GENERIC: "⚠️ Link failed. ChainStalker couldn't establish your presence. Contact @stariy_goose for guidance.",
		GET_STALKS_BAD_REQUEST: "⚠️ Corrupted signal detected. The server rejected your trace pattern. Reach @stariy_goose for calibration.",
		GET_STALKS_NOT_FOUND: "🤫 You have no active stalks.\nThe grid is silent — no subscriptions found.",
		GET_STALKS_GENERIC: "⚠️ An unexpected silence disrupted the feed. Your stalks remain obscured. Consult @stariy_goose.",
		GET_SUB_BAD_REQUEST: "⚠️ Interference in transmission. The stalk query was malformed. Seek @stariy_goose for analysis.",
		GET_SUB_NOT_FOUND: "⚠️ No such stalk detected. The subscription has vanished into the static.",
		GET_SUB_GENERIC: "⚠️ Retrieval failure. The system failed to resolve the stalk. Call @stariy_goose for insight.",
		CHANGE_STATUS_BAD_REQUEST: "⚠️ Pulse disrupted. The input couldn’t sync with the stalk’s frequency.",
		CHANGE_STATUS_NOT_FOUND: "⚠️ Stalk not found. You can't modify a presence that has faded.",
		CHANGE_STATUS_GENERIC: "⚠️ System rejected status alteration. Unknown anomaly. Connect with @stariy_goose.",
		DELETE_SUB_BAD_REQUEST: "⚠️ Disposal protocol failed. Invalid deletion parameters detected.",
		DELETE_SUB_NOT_FOUND: "⚠️ The stalk you seek to purge has already dissolved. Nothing remains.",
		DELETE_SUB_GENERIC: "⚠️ Purge attempt failed. Unknown force resisted deletion. Trace with @stariy_goose.",
		GET_COLLECTION_BAD_REQUEST: "⚠️ The signal was malformed.\nNo valid structure was detected. Recalibrate your request.",
		GET_COLLECTION_NOT_FOUND: "⚠️ Trace failed.\nThis collection does not exist—or has vanished beyond reach.",
		GET_COLLECTION_GENERIC: "⚠️ The grid trembled.\nAn internal disruption prevented data retrieval. Try again later or contact @stariy_goose.",
		GET_TOKEN_BAD_REQUEST: "⚠️ The signal is malformed.\nThe system cannot interpret this token symbol.",
		GET_TOKEN_NOT_FOUND: "⚠️ The token you seek does not echo back.\nNo such asset found on the grid.",
		GET_TOKEN_GENERIC: "⚠️ The system faltered.\nA rupture in the data stream prevented token lookup. Try again later.",
		CREATE_NFT_SUBSCRIPTION_BAD_REQUEST:"⚠️ The ritual was incomplete.\nYour data was malformed and could not be interpreted.",
		CREATE_NFT_SUBSCRIPTION_GENERIC: "⚠️ The core fractured.\nThe system failed to process your subscription. Try again later or contact @stariy_goose.",
		CREATE_TOKEN_SUBSCRIPTION_BAD_REQUEST: "⚠️ The parameters were distorted.\nThe system rejected your token subscription request as malformed.",
		CREATE_TOKEN_SUBSCRIPTION_GENERIC: "⚠️ The core trembled.\nAn internal failure prevented the token from being linked. Try again later or contact @stariy_goose.",
		CHANGE_STRATEGY_BAD_REQUEST: "⚠️ The protocol alteration failed.\nYour input was malformed and couldn’t sync with the stalk’s logic.",
		CHANGE_STRATEGY_NOT_FOUND: "⚠️ No stalk matches this signature.\nYou can’t modify what no longer exists.",
		CHANGE_STRATEGY_GENERIC: "⚠️ Strategy override failed.\nAn unknown anomaly disrupted the process. Consult @stariy_goose.",
	},
	SMS: {
		START: "⛔ The system does not yet recognize you.\nIssue /login to awaken your trace.",
		LOGIN_SUCCESS: (ctx: MyContext) => `Link established. Eyes open, ${ctx.from?.username ?? ctx.from?.id}.`,
		NO_SUBSCRIPTIONS: "🤫 Silence surrounds you.\nEstablish your first connection to pierce the void.",

		GET_SYMBOL: "🪙 Identify the asset. What is the token symbol you wish to track?\n❗ My reach extends only to Binance — for now.",

		GET_SLUG: "🖼️ Identify the target. Enter the collection slug to proceed.\n❗ My gaze is bound solely to OpenSea — for now.",
		INVALID_SLUG: "⚠️ The signal failed to resolve. Invalid slug detected.\n💡 Valid trace examples: gemesis, pirate-apes",

		GET_STRATEGY: "🎯 Choose your alert protocol.\nHow shall the system react to changes?",
		INVALID_STRATEGY: "⚠️ Strategy not recognized.\nPlease select a valid one from the keyboard menu.",

		GET_THRESHOLD: "⚖️ Define your threshold.\n<i>The system will alert you when the price breaches this value.</i>",
		INVALID_THRESHOLD: "⚠️ Input rejected. Provide a valid positive number to calibrate the protocol.",

		UNKNOWN_ERROR: "⚠️ Something moved through the void — and broke the silence the wrong way. This wasn't supposed to happen.",

		COLLECTION_CREATED: "✅ Link established.\nYour collection is now under surveillance.",
		COLLECTION_CREATION_FAILED: "⚠️ The ritual was disrupted.\nThe system failed to bind your subscription. Try again later.",

		TOKEN_CREATED: "✅ Link forged.\nThe Watcher now tracks this token across the chain.",
		TOKEN_CREATION_FAILED: "⚠️ The protocol failed.\nThe system couldn’t establish a trace for this token. Try again later.",

		INVALID_TARGET: "⚠️ Trace anchor missing.\nThe system cannot proceed without a defined target.",
		COLLECTION_INFO:<T extends ICreateCollectionSceneWizard> (url: string, ctx: MyContext<T>) => {
			const endingForThreshold = ctx.wizard.state.strategy === "percentage" ? "%" : ctx.wizard.state.symbol;

			const message = [
				`💡 Shall we lock this in... or retrace our steps?`,
				`<i>Collection:</i> <a href="${url}">${ctx.wizard.state.name}</a>`,
				`<i>Slug</i>: <b>${ctx.wizard.state.slug}</b>`,
				`<i>Chain</i>: <b>${ctx.wizard.state.chain}</b>`,
				`<i>Floor Price</i>: <b>${ctx.wizard.state.floorPrice} ${ctx.wizard.state.symbol}</b>`,
				`<i>Strategy</i>: <b>${ctx.wizard.state.strategy}</b>`,
				`<i>Threshold</i>: <b>${ctx.wizard.state.threshold} ${endingForThreshold}</b>`
			];

			return message.join("\n");
		},
		TOKEN_INFO:<T extends ICreateTokenSceneWizard> (ctx: MyContext<T>) => {
			const endingForThreshold = ctx.wizard.state.strategy === "percentage" ? "%" : "$";
			
			const message = [
				`💡 Shall we lock this in... or retrace our steps?`,
				`<i>Symbol</i>: <b>${ctx.wizard.state.symbol}</b>`,
				`<i>Price</i>: <b>${ctx.wizard.state.price}$</b>`,
				`<i>Strategy</i>: <b>${ctx.wizard.state.strategy}</b>`,
				`<i>Threshold</i>: <b>${ctx.wizard.state.threshold}${endingForThreshold}</b>`
			];

			return message.join("\n");
		},
		TOKEN_ALERT: (target: TokenAlert['target'], strategy: TokenAlert['strategy'], diff: number) => {
			const { symbol, lastNotifiedPrice } = target;

			const message = [
				`🔍 <b>#${symbol}</b> anomaly detected.`, 
				`<b>${diff}% shift</b> — current price: <b>${lastNotifiedPrice}$</b>`,
				`<i>ChainStalker trace updated.</i>`
			];

			return message.join('\n');
		},
		NFT_ALERT: (target: NftAlert['target'], strategy: NftAlert['strategy'], diff: number) => {
			const { name, slug, symbol, lastNotifiedPrice } = target;

			const message = [
				`📡 NFT Update — <b>${name}</b> #${slug}`,
				`Floor now at <b>${lastNotifiedPrice} ${symbol} (${diff}%)</b>`,
				`<i>Tracking continues...</i>`
			];

			return message.join('\n');
		}
	}
} as const;
