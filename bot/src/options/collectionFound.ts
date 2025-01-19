import { MenuState } from "../types/menuState.js";
import { ICollection } from "../types/interfaces.js";

function collectionFoundMsg(collection: ICollection) {
	const { name, floorPrice, floorPriceSymbol, chain } = collection;
	const slug = collection.collection;
	const url = `https://pro.opensea.io/collection/${slug}`
	const formattedPrice = parseFloat(floorPrice.toString()).toString();

	
	const text = `<a href="${url}">🖼️ ${name}</a> on ${chain}\n` + 
	`💲 Floor price is ${formattedPrice} ${floorPriceSymbol}\n` +
	`❓ Would you like to stalk this NFT collection?`;
	return {
		text,
		options: {
			parse_mode: "HTML",
			disable_web_page_preview: true,
			reply_markup: {
				inline_keyboard: [
					[{ text: "✅ Yes", callback_data: MenuState.YES}],
					[{ text: "❌ No", callback_data: MenuState.CANCEL }]
				]
			}
		}
	};
}

export { collectionFoundMsg };