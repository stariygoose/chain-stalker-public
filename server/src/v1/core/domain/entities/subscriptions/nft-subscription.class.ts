import { BasedSubscription, Nft } from "#v1/core/interfaces/index.js";

export class NftSubscription implements BasedSubscription<Nft> {
	constructor (
		public readonly percentage: number,
		public readonly target: Nft
	) {}
}