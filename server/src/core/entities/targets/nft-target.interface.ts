import { ISubscriptionTarget } from "#core/entities/targets/index.js";

export interface INftTarget extends ISubscriptionTarget {
	/**
	 * Type of subscription's target.
	 */
	readonly type: 'nft';
	/**
	 * Slug of nft collection (Ex: my_nft_collection)
	 */
	readonly slug: string;
	/**
	 * Name of nft collection (Ex: My NFT Collection)
	 */
	readonly name: string;
	/**
	 * The blockchain on which the NFT collection is deployed.
	 */
	readonly chain: string;
	/**
	 * The most recent floor price of the NFT collection that was sent to the user.
	 * This value is used as a reference for further price change calculations.
	 */
	readonly lastNotifiedPrice: number;
	/**
	 * The cryptocurrency in which the NFT collection is traded.
	 */
	readonly symbol: string;
}