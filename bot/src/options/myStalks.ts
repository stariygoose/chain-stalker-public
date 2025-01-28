import { IUserSubscriptions, ICoin, ICollection, ISubscription, SubscriptionType } from "../types/interfaces.js";

function myStalks(data: IUserSubscriptions) {
	const coinsSubscriptions =
		data.subscriptions
			.filter((sub): sub is ISubscription<ICoin> => sub.type === SubscriptionType.coin);
	const nftsSubscriptions =
		data.subscriptions
			.filter((sub): sub is ISubscription<ICollection> => sub.type === SubscriptionType.nft);

	const coinsText = coinsSubscriptions.length > 0 
		? coinsSubscriptions
				.map((sub: ISubscription<ICoin>, index: number) => {
					const formattedPrice = parseFloat(sub.target.price.toString());
					return `${index + 1}. #${sub.target.symbol} - Stalked price: <b>${formattedPrice} USDT</b>\n` +
						`Percentage change: <b>${sub.percentage}%</b>`;
				})
				.join("\n")
		: "<b>🤷‍♂️No coin subscriptions.</b>";

	const nftsText = nftsSubscriptions.length > 0 
		? nftsSubscriptions
				.map((sub: ISubscription<ICollection>, index: number) => {
					const url = `https://opensea.io/collection/${sub.target.collection}`;
					const formattedPrice = parseFloat(sub.target.floorPrice.toString());
					return `${index + 1}. <a href="${url}">${sub.target.name}</a> - Stalked floor price: <b>${formattedPrice} ${sub.target.floorPriceSymbol}</b>\n` +
						`<b>Percentage change: ${sub.percentage}%</b>`;
				})
				.join("\n")
		: "<b>🤷‍♂️ No NFT subscriptions.</b>";

	const totalCoins = coinsSubscriptions.length;
	const totalNfts = nftsSubscriptions.length;

	return `💰 <b>Coins Stalks: ${totalCoins}</b>\n${coinsText}\n\n🖼️ <b>NFTs Stalks: ${totalNfts}</b>\n${nftsText}`;
}

export { myStalks };