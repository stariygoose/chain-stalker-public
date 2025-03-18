import { INftTarget } from "#core/entities/targets/index.js";

export class NftTarget implements INftTarget {
	public readonly type = "nft";
	constructor(
		public readonly slug: string,
		public readonly name: string,
		public readonly chain: string,
		public readonly floorPrice: number,
		public readonly symbol: string
	) {
		this.validateTarget();
	}

	private validateTarget(): void {
		
	}
}