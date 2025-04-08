import { CollectionMetadata } from '#infrastructure/lib/apis/opensea/requests.interfaces.js';
import { CollectionFloorPrice } from '#infrastructure/lib/apis/opensea/responses.interfaces.js';


export class GetCollectionDto {
	public readonly slug: string;
	public readonly name: string;
	public readonly chain: string;

	public readonly imageUrl: string;
	public readonly openseaUrl: string;

	public readonly symbol: string;
	public readonly floorPrice: number;

	constructor (
		md: CollectionMetadata,
		fp: CollectionFloorPrice
	) {
		this.slug = md.collection;
		this.name = md.name;
		this.chain = md.contracts.length > 0
			? md.contracts[0].chain
			: "ethereum"

		this.imageUrl = md.image_url;
		this.openseaUrl = md.opensea_url;

		this.symbol = fp.symbol;
		this.floorPrice = fp.floorPrice
	}
}