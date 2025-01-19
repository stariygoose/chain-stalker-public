import { IUserSubscriptions, ICoin, ICollection, ISubscription, SubscriptionType } from "../types/interfaces.js";

function myStalks(data: IUserSubscriptions) {
	const coinsSubscriptions =
		data.subscriptions
			.filter((sub): sub is ISubscription<ICoin> => sub.type === SubscriptionType.coin);
	const nftsSubscriptions =
		data.subscriptions
			.filter((sub): sub is ISubscription<ICollection> => sub.type === SubscriptionType.nft);

	// Format coin stalks text
	const coinsText = coinsSubscriptions.length > 0 
		? coinsSubscriptions
				.map((sub: ISubscription<ICoin>, index: number) => {
					const formattedPrice = parseFloat(sub.target.price.toString()).toFixed(2);
					return `${index + 1}. ${sub.target.symbol} - Stalked price: ${formattedPrice} USDT\n` +
						`Percentage change: ${sub.percentage}%`;
				})
				.join("\n")
		: "No coin subscriptions.";

	// Format NFT stalks text
	const nftsText = nftsSubscriptions.length > 0 
		? nftsSubscriptions
				.map((sub: ISubscription<ICollection>, index: number) => {
					const url = `https://opensea.io/collection/${sub.target.collection}`;
					const formattedPrice = parseFloat(sub.target.floorPrice.toString()).toFixed(2);
					return `${index + 1}. <a href="${url}">${sub.target.name}</a> - Stalked floor price: ${formattedPrice} ${sub.target.floorPriceSymbol}\n` +
						`Percentage change: ${sub.percentage}%`;
				})
				.join("\n")
		: "No NFT subscriptions.";

	// Return formatted text with summary
	const totalCoins = coinsSubscriptions.length;
	const totalNfts = nftsSubscriptions.length;

	return `💰 Coins Stalks (${totalCoins}):\n${coinsText}\n\n🖼️ NFTs Stalks (${totalNfts}):\n${nftsText}`;
}

export { myStalks };