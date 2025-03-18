import { NftSubscription } from "#core/entities/subscription/nft-subscription.class.js";
import { INftTarget } from "#core/entities/targets/index.js";
import { PercentageChangeStrategy } from "#core/strategies/notification/index.js";
import dotenv from "dotenv";
dotenv.config();


const id = '1';
const userId = 2032;

const slug = "nft_slug";
const name = "Nft Name";
const chain = "ethereum";
const floorPrice = 14; // ETH
const symbol = 'ETH';
const target: INftTarget = {
	type: 'nft',
	slug,
	name,
	chain,
	floorPrice,
	symbol
};
const strategy = new PercentageChangeStrategy(5);


const sub = new NftSubscription(
	id,
	userId,
	target,
	strategy
);

console.log(sub.shouldNotify(Infinity));